import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { config } from "../config.js";
import { createEmbeddedWallet } from "../services/wallet.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["driver", "investor"]).optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
});

type UserRecord = {
  id: number;
  email: string;
  role: string;
  walletAddress: string;
  fullName: string | null;
  phone: string | null;
  country: string | null;
  address: string | null;
};

function publicUser(u: UserRecord) {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    walletAddress: u.walletAddress,
    fullName: u.fullName ?? undefined,
    phone: u.phone ?? undefined,
    country: u.country ?? undefined,
    address: u.address ?? undefined,
  };
}

function tokenFor(userId: number): string {
  return jwt.sign({ uid: userId }, config.jwtSecret, { expiresIn: "7d" });
}

// Register: creates the user AND auto-provisions an embedded EVM wallet.
router.post("/register", async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const { email, password, role, fullName, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "email_taken" });

  const wallet = createEmbeddedWallet();
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: role ?? "driver",
      fullName: fullName ?? null,
      phone: phone ?? null,
      walletAddress: wallet.address,
      encryptedKey: wallet.encryptedKey,
    },
  });

  res.status(201).json({ token: tokenFor(user.id), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  res.json({ token: tokenFor(user.id), user: publicUser(user) });
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "not_found" });
  res.json(publicUser(user));
});

// Update editable profile fields.
const profileSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
});

router.put("/profile", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });

  // If email is changing, ensure it's not taken by someone else.
  if (parsed.data.email) {
    const clash = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (clash && clash.id !== req.userId) {
      return res.status(409).json({ error: "email_taken" });
    }
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: parsed.data,
  });
  res.json(publicUser(user));
});

export default router;
