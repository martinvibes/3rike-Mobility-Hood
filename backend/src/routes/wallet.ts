import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  usdcBalance,
  vaultPositionUsdc,
  mintUsdc,
  explorerTx,
  explorerAddress,
} from "../lib/chain.js";

const router = Router();

async function loadWallet(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return user.walletAddress as `0x${string}`;
}

// Live balances: spendable USDC in the wallet + value held in the yield vault.
router.get("/balance", requireAuth, async (req: AuthedRequest, res) => {
  const address = await loadWallet(req.userId!);
  if (!address) return res.status(404).json({ error: "not_found" });

  const [wallet, vault] = await Promise.all([
    usdcBalance(address),
    vaultPositionUsdc(address),
  ]);

  res.json({
    address,
    explorer: explorerAddress(address),
    walletUsdc: wallet,
    vaultUsdc: vault,
    totalUsdc: (Number(wallet) + Number(vault)).toFixed(6),
  });
});

// Demo/crypto-deposit helper: mint test USDC to the user's wallet.
// (Robinhood testnet USDC is openly mintable; on mainnet this is replaced by a
// real on-ramp / inbound transfer detection.)
const fundSchema = z.object({ amountUsdc: z.string().regex(/^\d+(\.\d{1,6})?$/) });

router.post("/dev-fund", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = fundSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });

  const address = await loadWallet(req.userId!);
  if (!address) return res.status(404).json({ error: "not_found" });

  try {
    const hash = await mintUsdc(address, parsed.data.amountUsdc);
    await prisma.deposit.create({
      data: {
        userId: req.userId!,
        kind: "crypto",
        amountUsdc: parsed.data.amountUsdc,
        txHash: hash,
        status: "confirmed",
      },
    });
    res.json({ txHash: hash, explorer: explorerTx(hash) });
  } catch (err) {
    console.error("dev-fund failed", err);
    res.status(502).json({ error: "chain_error" });
  }
});

export default router;
