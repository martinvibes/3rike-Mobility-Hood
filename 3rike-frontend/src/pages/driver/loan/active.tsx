import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import Skeleton from "@/components/ui/skeleton";
import { ApiError, listLoans, repayLoan, type Loan } from "@/lib/api";

export default function ActiveLoan() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const loanId = id ? Number(id) : NaN;

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const loans = await listLoans();
      const found = loans.find((l) => l.id === loanId) ?? null;
      if (!found) setLoadError("Loan not found.");
      setLoan(found);
    } catch {
      setLoadError("Couldn't load this loan.");
    }
  }, [loanId]);

  useEffect(() => {
    if (Number.isNaN(loanId)) {
      setLoadError("Invalid loan id.");
      return;
    }
    void load();
  }, [loanId, load]);

  const { paid, total, pct } = useMemo(() => {
    if (!loan) return { paid: 0, total: 0, pct: 0 };
    const t = Number(loan.totalDueUsdc);
    const out = Number(loan.outstandingUsdc);
    const p = t - out;
    return { paid: p, total: t, pct: t > 0 ? Math.min(100, (p / t) * 100) : 0 };
  }, [loan]);

  const handleRepay = async () => {
    if (!loan) return;
    if (!/^\d{4}$/.test(pin)) return setPayError("Enter your 4-digit PIN.");
    const amt = Number(amount);
    if (!(amt > 0)) return setPayError("Enter an amount.");
    setPaying(true);
    setPayError(null);
    try {
      const res = await repayLoan(loan.id, { amountUsdc: amt.toFixed(2), pin });
      setToast(res.repaid ? "Loan fully repaid! 🎉" : `Repaid $${amt.toFixed(2)}`);
      setAmount("");
      setPin("");
      await load();
    } catch (err) {
      setPayError(messageForRepay(err));
    } finally {
      setPaying(false);
    }
  };

  return (
    <MobileFrame innerClassName="px-5 py-6 flex flex-col">
      <header className="flex items-center gap-4 mb-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/driver/loan")}
          className="w-10 h-10 rounded-full bg-[#E9F8EE] hover:bg-[#d8f1e0] cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-[#01C259]" />
        </Button>
        <h1 className="font-semibold text-lg text-gray-900">Your loan</h1>
      </header>

      {!loan && !loadError && <Skeleton className="h-44 w-full rounded-2xl" />}
      {loadError && <p className="text-sm text-red-500 text-center mt-6">{loadError}</p>}

      {loan && (
        <>
          {/* Summary */}
          <div className="bg-[#0E1A13] rounded-2xl p-5 mb-5 text-white">
            <p className="text-xs text-white/60 mb-1">Outstanding</p>
            <p className="text-4xl font-bold">${Number(loan.outstandingUsdc).toFixed(2)}</p>
            <div className="mt-4 h-2 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-[#01C259] rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-white/50 mt-2">
              <span>${paid.toFixed(2)} repaid</span>
              <span>of ${total.toFixed(2)}</span>
            </div>
            {loan.status === "repaid" && (
              <div className="flex items-center gap-1.5 mt-3 text-[#01C259] text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Fully repaid
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Stat label="Borrowed" value={`$${Number(loan.principalUsdc).toFixed(0)}`} />
            <Stat label="Weekly" value={`$${Number(loan.weeklyRepayment).toFixed(2)}`} />
            <Stat label="Term" value={`${loan.termWeeks}w`} />
          </div>

          {toast && (
            <div className="mb-4 text-center text-sm text-[#01C259] bg-[#E9F8EE] rounded-xl py-2 px-3">{toast}</div>
          )}

          {/* Repay */}
          {loan.status === "active" && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-900 mb-3">Make a repayment</p>
              <input
                type="text"
                inputMode="decimal"
                placeholder={`Amount (e.g. ${Number(loan.weeklyRepayment).toFixed(2)})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                className="w-full h-12 rounded-xl border border-gray-200 px-4 mb-3 outline-none focus:border-[#01C259]"
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full h-12 rounded-xl border border-gray-200 px-4 mb-3 outline-none focus:border-[#01C259] tracking-widest"
              />
              {payError && <p className="text-sm text-red-500 mb-2">{payError}</p>}
              <Button
                onClick={handleRepay}
                disabled={paying}
                className="w-full h-12 bg-[#01C259] hover:bg-[#00a049] text-white rounded-2xl disabled:opacity-60 cursor-pointer"
              >
                {paying ? "Processing…" : "Repay"}
              </Button>
            </div>
          )}

          {/* History */}
          {loan.repayments.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-[#909090] mb-2">Repayment history</p>
              <div className="space-y-2">
                {loan.repayments.map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-white border border-gray-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-700">${Number(r.amountUsdc).toFixed(2)}</span>
                    <span className="text-[11px] text-[#909090]">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </MobileFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F2FBF5] rounded-xl p-3 text-center">
      <p className="text-[10px] text-[#909090] mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

function messageForRepay(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "wrong_pin":
        return "Incorrect PIN.";
      case "insufficient_funds":
        return "Not enough USDC in your wallet.";
      case "loan_not_found":
        return "This loan is no longer active.";
      default:
        return "Couldn't process the repayment. Please try again.";
    }
  }
  return "Couldn't process the repayment. Please try again.";
}
