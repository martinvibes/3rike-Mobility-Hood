import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  eligibility,
  apply,
  repay,
  listLoans,
  LoanError,
} from "../services/loan.service.js";

const router = Router();

function fail(res: import("express").Response, err: unknown) {
  if (err instanceof LoanError) return res.status(err.status).json({ error: err.code });
  console.error("loan route failed", err);
  return res.status(502).json({ error: "chain_error" });
}

// Eligibility + credit snapshot for the loan dashboard.
router.get("/eligibility", requireAuth, async (req: AuthedRequest, res) => {
  try {
    res.json(await eligibility(req.userId!));
  } catch (err) {
    fail(res, err);
  }
});

// All of the user's loans (active + history), newest first.
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    res.json({ loans: await listLoans(req.userId!) });
  } catch (err) {
    fail(res, err);
  }
});

const applySchema = z.object({
  amountUsdc: z.string().regex(/^\d+(\.\d{1,6})?$/),
});

router.post("/apply", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  try {
    res.json(await apply(req.userId!, parsed.data.amountUsdc));
  } catch (err) {
    fail(res, err);
  }
});

const repaySchema = z.object({
  amountUsdc: z.string().regex(/^\d+(\.\d{1,6})?$/),
  pin: z.string().regex(/^\d{4}$/),
});

router.post("/:id/repay", requireAuth, async (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid_id" });
  const parsed = repaySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  try {
    res.json(await repay(req.userId!, id, parsed.data.amountUsdc, parsed.data.pin));
  } catch (err) {
    fail(res, err);
  }
});

export default router;
