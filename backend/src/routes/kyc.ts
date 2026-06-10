import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { creditScoreFor } from "../services/credit.service.js";

const router = Router();

// Current KYC status + live credit score (with factors).
router.get("/status", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "not_found" });
  const credit = await creditScoreFor(user.id);
  res.json({
    kycStatus: user.kycStatus,
    fullName: user.kycFullName ?? user.fullName ?? null,
    verifiedAt: user.kycVerifiedAt,
    credit,
  });
});

// Submit KYC. Demo: instant-approve (no external ID provider). Verification
// unlocks the credit score and loan eligibility.
const submitSchema = z.object({
  fullName: z.string().min(2),
  idNumber: z.string().min(5),
  phone: z.string().min(7).optional(),
});

router.post("/submit", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const { fullName, idNumber, phone } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "not_found" });
  if (user.kycStatus === "verified") {
    const credit = await creditScoreFor(user.id);
    return res.json({ kycStatus: "verified", credit, alreadyVerified: true });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      kycStatus: "verified",
      kycFullName: fullName,
      kycIdNumber: idNumber,
      kycVerifiedAt: new Date(),
      fullName: user.fullName ?? fullName,
      phone: user.phone ?? phone ?? null,
    },
  });

  const credit = await creditScoreFor(updated.id);
  res.json({ kycStatus: updated.kycStatus, verifiedAt: updated.kycVerifiedAt, credit });
});

export default router;
