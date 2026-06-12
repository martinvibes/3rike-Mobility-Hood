// Rider weekly-payment service. A verified rider claims a tricycle to pay off
// (their "future 3rike"). Each payment debits their wallet, routes a yield
// slice to that tricycle's investors on-chain, counts toward ownership, and
// feeds their credit score.

import bcrypt from "bcryptjs";
import { parseUnits } from "viem";
import { prisma } from "../db.js";
import {
  withdrawUsdc,
  usdcBalanceRaw,
  relayer,
  explorerTx,
} from "../lib/chain.js";
import {
  getTricycleMeta,
  tricycleCount,
  distributeYieldFromOwner,
} from "../lib/investment.js";
import { catalogFor } from "../lib/catalog.js";

export class RiderError extends Error {
  constructor(public code: string, public status = 400) {
    super(code);
  }
}

async function loadUser(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new RiderError("not_found", 404);
  return user;
}

/** Yield fraction of each payment that goes to investors, from the catalog
 *  revenue model (investorWeekly / weeklyRepayment, ~0.13). */
function yieldRatio(vehicleId: string): number {
  const c = catalogFor(vehicleId);
  return c.weeklyRepayment > 0 ? c.investorWeekly / c.weeklyRepayment : 0;
}

// Claim a tricycle to start paying off. Verified riders only, one at a time.
export async function claim(userId: number, tricycleId: number) {
  const user = await loadUser(userId);
  if (user.kycStatus !== "verified") throw new RiderError("not_verified", 403);
  if (user.tricycleId) throw new RiderError("already_assigned");

  const count = await tricycleCount();
  if (tricycleId < 1 || tricycleId > count) throw new RiderError("not_found", 404);

  await prisma.user.update({ where: { id: userId }, data: { tricycleId } });
  return status(userId);
}

export async function pay(userId: number, amountUsdc: string, pin: string) {
  const user = await loadUser(userId);
  if (user.kycStatus !== "verified") throw new RiderError("not_verified", 403);
  if (!user.tricycleId) throw new RiderError("no_tricycle");

  // PIN gate (verify if set, else enroll).
  if (user.pinHash) {
    if (!(await bcrypt.compare(pin, user.pinHash))) throw new RiderError("wrong_pin", 403);
  } else {
    await prisma.user.update({ where: { id: userId }, data: { pinHash: await bcrypt.hash(pin, 10) } });
  }

  const amt = Number(amountUsdc);
  if (!(amt > 0)) throw new RiderError("invalid_amount");
  const amtStr = amt.toFixed(6);

  const bal = await usdcBalanceRaw(user.walletAddress as `0x${string}`);
  if (bal < parseUnits(amtStr, 6)) throw new RiderError("insufficient_funds");

  // Debit the rider's wallet to the platform (owner = relayer).
  const txHash = await withdrawUsdc(user.encryptedKey, relayer.address, amtStr);

  // Route the yield slice to the tricycle's investors (best-effort — if the
  // pool has no investors yet the payment still records, just no yield).
  const meta = await getTricycleMeta(user.tricycleId);
  const yieldAmt = amt * yieldRatio(meta.vehicleId);
  let yieldTxHash: string | null = null;
  try {
    yieldTxHash = await distributeYieldFromOwner(user.tricycleId, yieldAmt.toFixed(6));
  } catch (err) {
    console.error("rider yield distribution failed (payment still recorded):", (err as Error).message);
  }

  await prisma.riderPayment.create({
    data: {
      userId,
      tricycleId: user.tricycleId,
      amountUsdc: amtStr,
      yieldUsdc: (yieldTxHash ? yieldAmt : 0).toFixed(6),
      txHash,
      yieldTxHash,
    },
  });

  return {
    txHash,
    explorer: explorerTx(txHash),
    amountUsdc: amtStr,
    yieldUsdc: (yieldTxHash ? yieldAmt : 0).toFixed(6),
    yieldDistributed: !!yieldTxHash,
  };
}

export async function status(userId: number) {
  const user = await loadUser(userId);
  if (!user.tricycleId) {
    return { assigned: false as const, kycStatus: user.kycStatus };
  }

  const meta = await getTricycleMeta(user.tricycleId);
  const cat = catalogFor(meta.vehicleId);
  const payments = await prisma.riderPayment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalPaid = payments.reduce((s, p) => s + Number(p.amountUsdc), 0);
  const pricePaidPct = meta.priceUsd > 0 ? Math.min(100, (totalPaid / meta.priceUsd) * 100) : 0;

  return {
    assigned: true as const,
    kycStatus: user.kycStatus,
    tricycle: {
      id: meta.id,
      vehicleId: meta.vehicleId,
      make: meta.make,
      model: meta.model,
      isEV: meta.isEV,
      priceUsd: meta.priceUsd,
      image: cat.image,
      location: cat.location,
    },
    weeklyAmount: cat.weeklyRepayment,
    totalPaidUsdc: totalPaid.toFixed(2),
    pricePaidPct: Math.round(pricePaidPct * 10) / 10,
    payments,
  };
}
