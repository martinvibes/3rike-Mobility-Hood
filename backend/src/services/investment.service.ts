// Investment domain service. Combines on-chain truth (TricycleNFT +
// FractionalInvestment) with off-chain catalog enrichment and a DB activity
// log. Routes stay thin: they validate input and call into here.

import { formatUnits } from "viem";
import { prisma } from "../db.js";
import { catalogFor, aprFor } from "../lib/catalog.js";
import { explorerTx } from "../lib/chain.js";
import { usdcBalanceRaw } from "../lib/chain.js";
import {
  tricycleCount,
  getTricycleMeta,
  getPool,
  sharesOf,
  pendingYieldRaw,
  invest as chainInvest,
  claimYield as chainClaim,
  type OnchainPool,
} from "../lib/investment.js";

const USDC_DP = 6;
const money = (raw: bigint) => formatUnits(raw, USDC_DP);

export class InvestmentError extends Error {
  constructor(public code: string, public status = 400) {
    super(code);
  }
}

// ---------------------------------------------------------------------------
// Shapes returned to the client
// ---------------------------------------------------------------------------

export interface TricycleView {
  id: number;
  vehicleId: string;
  make: string;
  model: string;
  isEV: boolean;
  priceUsd: number;
  rangeKm: number;
  image: string;
  location: string;
  description: string;
  projectedApr: number; // derived from the rider repayment model
  weeklyRepayment: number; // USD the rider pays per week
  pricePerShare: string; // USDC
  totalShares: number;
  sharesSold: number;
  sharesAvailable: number;
  fundedPct: number; // 0..100
  active: boolean;
}

export interface HoldingView {
  id: number;
  vehicleId: string;
  make: string;
  model: string;
  image: string;
  shares: number;
  ownershipPct: number; // of the whole tricycle
  valueUsdc: string;
  pendingYield: string;
  projectedApr: number; // indicative annual yield %, for earnings estimates
}

export interface PortfolioView {
  holdings: HoldingView[];
  totals: {
    investedValueUsdc: string;
    pendingYieldUsdc: string;
    tricycles: number;
  };
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

function toTricycleView(
  meta: Awaited<ReturnType<typeof getTricycleMeta>>,
  pool: OnchainPool,
): TricycleView {
  const cat = catalogFor(meta.vehicleId);
  const total = Number(pool.totalShares);
  const sold = Number(pool.sharesSold);
  return {
    ...meta,
    image: cat.image,
    location: cat.location,
    description: cat.description,
    projectedApr: aprFor(meta.vehicleId, meta.priceUsd),
    weeklyRepayment: cat.weeklyRepayment,
    pricePerShare: money(pool.pricePerShareRaw),
    totalShares: total,
    sharesSold: sold,
    sharesAvailable: total - sold,
    fundedPct: total === 0 ? 0 : Math.round((sold / total) * 100),
    active: pool.active,
  };
}

/** All tricycles open for investment (and their live pool state). */
export async function listTricycles(): Promise<TricycleView[]> {
  const count = await tricycleCount();
  const ids = Array.from({ length: Math.max(0, count) }, (_, i) => i + 1);
  const views = await Promise.all(
    ids.map(async (id) => {
      const [meta, pool] = await Promise.all([getTricycleMeta(id), getPool(id)]);
      return toTricycleView(meta, pool);
    }),
  );
  // Only surface tricycles that actually have an open pool.
  return views.filter((v) => v.active || v.sharesSold > 0);
}

export async function getTricycle(id: number): Promise<TricycleView> {
  if (id < 1) throw new InvestmentError("not_found", 404);
  const count = await tricycleCount();
  if (id > count) throw new InvestmentError("not_found", 404);
  const [meta, pool] = await Promise.all([getTricycleMeta(id), getPool(id)]);
  return toTricycleView(meta, pool);
}

/** An investor's full fractional-ownership portfolio, read live from chain. */
export async function getPortfolio(address: `0x${string}`): Promise<PortfolioView> {
  const count = await tricycleCount();
  const ids = Array.from({ length: Math.max(0, count) }, (_, i) => i + 1);

  const holdings: HoldingView[] = [];
  let investedRaw = 0n;
  let yieldRaw = 0n;

  await Promise.all(
    ids.map(async (id) => {
      const shares = await sharesOf(id, address);
      if (shares === 0n) return;
      const [meta, pool, pending] = await Promise.all([
        getTricycleMeta(id),
        getPool(id),
        pendingYieldRaw(id, address),
      ]);
      const cat = catalogFor(meta.vehicleId);
      const valueRaw = shares * pool.pricePerShareRaw;
      investedRaw += valueRaw;
      yieldRaw += pending;
      holdings.push({
        id,
        vehicleId: meta.vehicleId,
        make: meta.make,
        model: meta.model,
        image: cat.image,
        shares: Number(shares),
        ownershipPct:
          pool.totalShares === 0n
            ? 0
            : Math.round((Number(shares) / Number(pool.totalShares)) * 10000) / 100,
        valueUsdc: money(valueRaw),
        pendingYield: money(pending),
        projectedApr: aprFor(meta.vehicleId, meta.priceUsd),
      });
    }),
  );

  holdings.sort((a, b) => a.id - b.id);
  return {
    holdings,
    totals: {
      investedValueUsdc: money(investedRaw),
      pendingYieldUsdc: money(yieldRaw),
      tricycles: holdings.length,
    },
  };
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

async function loadUser(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new InvestmentError("not_found", 404);
  return user;
}

export async function buyShares(userId: number, tricycleId: number, shares: number) {
  if (!Number.isInteger(shares) || shares <= 0) {
    throw new InvestmentError("invalid_shares");
  }
  const user = await loadUser(userId);
  const [meta, pool] = await Promise.all([
    getTricycleMeta(tricycleId).catch(() => {
      throw new InvestmentError("not_found", 404);
    }),
    getPool(tricycleId),
  ]);

  if (!pool.active) throw new InvestmentError("pool_closed");
  const available = pool.totalShares - pool.sharesSold;
  if (BigInt(shares) > available) throw new InvestmentError("not_enough_shares");

  const costRaw = BigInt(shares) * pool.pricePerShareRaw;
  const balance = await usdcBalanceRaw(user.walletAddress as `0x${string}`);
  if (balance < costRaw) throw new InvestmentError("insufficient_funds");

  const { txHash } = await chainInvest(user.encryptedKey, tricycleId, BigInt(shares));

  await prisma.investment.create({
    data: {
      userId,
      tricycleId,
      vehicleId: meta.vehicleId,
      action: "invest",
      shares: String(shares),
      amountUsdc: money(costRaw),
      txHash,
    },
  });

  return { txHash, explorer: explorerTx(txHash), costUsdc: money(costRaw), shares };
}

export async function claim(userId: number, tricycleId: number) {
  const user = await loadUser(userId);
  const address = user.walletAddress as `0x${string}`;
  const pending = await pendingYieldRaw(tricycleId, address);
  if (pending === 0n) throw new InvestmentError("nothing_to_claim");

  const meta = await getTricycleMeta(tricycleId);
  const txHash = await chainClaim(user.encryptedKey, tricycleId);

  await prisma.investment.create({
    data: {
      userId,
      tricycleId,
      vehicleId: meta.vehicleId,
      action: "claim",
      amountUsdc: money(pending),
      txHash,
    },
  });

  return { txHash, explorer: explorerTx(txHash), amountUsdc: money(pending) };
}

/** Recent investment activity for the user (receipts / feed). */
export async function activity(userId: number) {
  return prisma.investment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
