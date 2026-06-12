import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { claim, pay, status, RiderError } from "../services/rider.service.js";

const router = Router();

function fail(res: import("express").Response, err: unknown) {
  if (err instanceof RiderError) return res.status(err.status).json({ error: err.code });
  console.error("rider route failed", err);
  return res.status(502).json({ error: "chain_error" });
}

// The rider's "future 3rike" — assigned tricycle, progress, and payment history.
router.get("/status", requireAuth, async (req: AuthedRequest, res) => {
  try {
    res.json(await status(req.userId!));
  } catch (err) {
    fail(res, err);
  }
});

const claimSchema = z.object({ tricycleId: z.number().int().positive() });

router.post("/claim", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = claimSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  try {
    res.json(await claim(req.userId!, parsed.data.tricycleId));
  } catch (err) {
    fail(res, err);
  }
});

const paySchema = z.object({
  amountUsdc: z.string().regex(/^\d+(\.\d{1,6})?$/),
  pin: z.string().regex(/^\d{4}$/),
});

router.post("/pay", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = paySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  try {
    res.json(await pay(req.userId!, parsed.data.amountUsdc, parsed.data.pin));
  } catch (err) {
    fail(res, err);
  }
});

export default router;
