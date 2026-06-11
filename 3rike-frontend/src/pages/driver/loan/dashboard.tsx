import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck, Lock } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import Skeleton from "@/components/ui/skeleton";
import {
  ApiError,
  applyForLoan,
  listLoans,
  loanEligibility,
  type Loan,
  type LoanEligibility,
} from "@/lib/api";

const SCORE_MIN = 300;
const SCORE_MAX = 850;

export default function LoanDashboard() {
  const navigate = useNavigate();
  const [elig, setElig] = useState<LoanEligibility | null>(null);
  const [active, setActive] = useState<Loan | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [e, loans] = await Promise.all([loanEligibility(), listLoans()]);
      setElig(e);
      setActive(loans.find((l) => l.status === "active") ?? null);
      setAmount(Math.min(50, e.maxLoanUsdc));
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't load your loan info." : "Something went wrong.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApply = async () => {
    if (!elig) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await applyForLoan(amount.toFixed(2));
      navigate(`/driver/loan/active/${res.loan.id}`);
    } catch (err) {
      setError(messageForApply(err));
    } finally {
      setSubmitting(false);
    }
  };

  const score = elig?.creditScore ?? null;
  const scorePct =
    score == null ? 0 : Math.max(0, Math.min(100, ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100));

  return (
    <MobileFrame innerClassName="px-5 py-6 flex flex-col">
      <header className="flex items-center gap-4 mb-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/driver")}
          className="w-10 h-10 rounded-full bg-[#E9F8EE] hover:bg-[#d8f1e0] cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-[#01C259]" />
        </Button>
        <h1 className="font-semibold text-lg text-gray-900">Loans</h1>
      </header>

      {!elig && <Skeleton className="h-40 w-full rounded-2xl mb-4" />}

      {elig && (
        <>
          {/* Credit score card */}
          <div className="bg-[#0E1A13] rounded-2xl p-5 mb-5 text-white relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-white/60">Credit score</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10">{elig.band}</span>
            </div>
            {score == null ? (
              <div className="flex items-center gap-2 mt-2">
                <Lock className="w-5 h-5 text-white/70" />
                <p className="text-sm text-white/80">Verify your identity to unlock your score</p>
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold leading-tight">{score}</p>
                <div className="mt-3 h-2 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-[#01C259] rounded-full" style={{ width: `${scorePct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>{SCORE_MIN}</span>
                  <span>{SCORE_MAX}</span>
                </div>
              </>
            )}
          </div>

          {/* State-driven body */}
          {elig.reason === "not_verified" && (
            <GateCard
              icon={<ShieldCheck className="w-6 h-6 text-[#01C259]" />}
              title="Verify to unlock loans"
              body="Complete your KYC verification to get a credit score and become eligible for a loan."
              cta="Complete verification"
              onClick={() => navigate("/driver/verification")}
            />
          )}

          {elig.reason === "low_score" && (
            <GateCard
              icon={<Lock className="w-6 h-6 text-[#F1B058]" />}
              title="Keep building your score"
              body="Your credit score isn't high enough for a loan yet. Make deposits, invest, and repay on time to raise it."
            />
          )}

          {active && (
            <button
              type="button"
              onClick={() => navigate(`/driver/loan/active/${active.id}`)}
              className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 mb-4 hover:border-[#01C259]/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#909090]">Active loan · outstanding</p>
                  <p className="text-xl font-bold text-gray-900">${Number(active.outstandingUsdc).toFixed(2)}</p>
                </div>
                <span className="text-xs font-semibold text-[#01C259]">Manage →</span>
              </div>
            </button>
          )}

          {/* Apply (only when eligible) */}
          {elig.eligible && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Apply for a loan</p>
              <p className="text-xs text-[#909090] mb-4">
                You qualify for up to <span className="font-semibold text-gray-700">${elig.maxLoanUsdc}</span>.
                {" "}{elig.interestPct}% over {elig.termWeeks} weeks.
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#909090]">Amount</span>
                <span className="text-2xl font-bold text-gray-900">${amount.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={elig.maxLoanUsdc}
                step={5}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-[#01C259] mb-3"
              />
              <div className="flex justify-between text-[11px] text-[#909090] mb-4">
                <span>Weekly ≈ ${((amount * (1 + elig.interestPct / 100)) / elig.termWeeks).toFixed(2)}</span>
                <span>Total repay ${(amount * (1 + elig.interestPct / 100)).toFixed(2)}</span>
              </div>

              <Button
                onClick={handleApply}
                disabled={submitting || amount <= 0}
                className="w-full h-12 bg-[#01C259] hover:bg-[#00a049] text-white rounded-2xl disabled:opacity-60 cursor-pointer"
              >
                {submitting ? "Processing…" : `Get $${amount.toFixed(0)} loan`}
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
        </>
      )}
    </MobileFrame>
  );
}

function GateCard({
  icon,
  title,
  body,
  cta,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: string;
  onClick?: () => void;
}) {
  return (
    <div className="bg-[#F2FBF5] rounded-2xl p-5 text-center">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3">{icon}</div>
      <p className="text-base font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-[#909090] mb-4">{body}</p>
      {cta && onClick && (
        <Button
          onClick={onClick}
          className="h-11 px-6 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          {cta}
        </Button>
      )}
    </div>
  );
}

function messageForApply(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "not_verified":
        return "Please complete verification first.";
      case "low_score":
        return "Your credit score isn't high enough yet.";
      case "active_loan":
        return "You already have an active loan.";
      case "exceeds_limit":
        return "That's above your current limit.";
      default:
        return "Couldn't process the loan. Please try again.";
    }
  }
  return "Couldn't process the loan. Please try again.";
}
