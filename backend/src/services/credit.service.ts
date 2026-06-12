// Credit-score service. Computes a rider's score LIVE from real account
// signals (no stored/stale number, nothing mock). Verification unlocks a base
// score; real activity (deposits, investing, and — the big driver — on-time
// loan repayments) moves it. Returned with the factors behind it so the UI can
// explain "why".

import { prisma } from "../db.js";

export interface CreditFactor {
  label: string;
  points: number;
}

export interface CreditResult {
  score: number | null; // null = locked (not verified yet)
  band: string; // Locked | Building | Fair | Good | Excellent
  factors: CreditFactor[];
  maxLoanUsdc: number;
}

const BASE = 620; // a verified rider starts here (≥ loan threshold)
const MAX = 850;

/** Loan ceiling by score band (USDC). Small amounts for the testnet demo. */
export function loanLimitFor(score: number): number {
  if (score >= 750) return 300;
  if (score >= 700) return 200;
  if (score >= 650) return 100;
  if (score >= 600) return 50;
  return 0;
}

export function bandFor(score: number | null): string {
  if (score == null) return "Locked";
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 600) return "Building";
  return "Low";
}

export async function creditScoreFor(userId: number): Promise<CreditResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.kycStatus !== "verified") {
    return {
      score: null,
      band: "Locked",
      factors: [{ label: "Complete verification to unlock your score", points: 0 }],
      maxLoanUsdc: 0,
    };
  }

  const [deposits, invests, repaidLoans, repayments, riderPayments] = await Promise.all([
    prisma.deposit.count({ where: { userId, status: "confirmed" } }),
    prisma.investment.count({ where: { userId, action: "invest" } }),
    prisma.loan.count({ where: { userId, status: "repaid" } }),
    prisma.loanRepayment.count({ where: { loan: { userId } } }),
    prisma.riderPayment.count({ where: { userId } }),
  ]);

  const factors: CreditFactor[] = [{ label: "Identity verified", points: BASE }];
  let score = BASE;

  const depPts = Math.min(deposits * 8, 40);
  if (depPts) {
    score += depPts;
    factors.push({ label: `${deposits} deposit${deposits > 1 ? "s" : ""} on record`, points: depPts });
  }

  const invPts = Math.min(invests * 15, 60);
  if (invPts) {
    score += invPts;
    factors.push({ label: `Active investor`, points: invPts });
  }

  const repayPts = Math.min(repayments * 10, 80);
  if (repayPts) {
    score += repayPts;
    factors.push({ label: `${repayments} on-time repayment${repayments > 1 ? "s" : ""}`, points: repayPts });
  }

  // On-time weekly payments toward owning a tricycle — a strong signal.
  const riderPts = Math.min(riderPayments * 8, 80);
  if (riderPts) {
    score += riderPts;
    factors.push({ label: `${riderPayments} weekly payment${riderPayments > 1 ? "s" : ""} made`, points: riderPts });
  }

  const loanPts = repaidLoans * 30;
  if (loanPts) {
    score += loanPts;
    factors.push({ label: `${repaidLoans} loan${repaidLoans > 1 ? "s" : ""} fully repaid`, points: loanPts });
  }

  score = Math.min(score, MAX);
  return { score, band: bandFor(score), factors, maxLoanUsdc: loanLimitFor(score) };
}
