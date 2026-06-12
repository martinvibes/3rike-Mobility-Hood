import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, TrendingUp, CheckCircle2 } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import Skeleton from "@/components/ui/skeleton";
import {
  ApiError,
  claimTricycle,
  listTricycles,
  payWeekly,
  riderStatus,
  type RiderStatus,
  type Tricycle,
} from "@/lib/api";

export default function ThreeDetails() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<RiderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setStatus(await riderStatus());
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't load your 3rike." : "Something went wrong.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
        <h1 className="font-semibold text-lg text-gray-900">My future 3rike</h1>
      </header>

      {!status && !error && <Skeleton className="h-56 w-full rounded-2xl" />}
      {error && <p className="text-sm text-red-500 text-center mt-6">{error}</p>}

      {status && !status.assigned && <ClaimView onClaimed={(s) => setStatus(s)} />}
      {status && status.assigned && <OwnView status={status} onPaid={load} />}
    </MobileFrame>
  );
}

// --- No tricycle yet → pick one to start paying off ---
function ClaimView({ onClaimed }: { onClaimed: (s: RiderStatus) => void }) {
  const [tricycles, setTricycles] = useState<Tricycle[] | null>(null);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTricycles()
      .then((t) => setTricycles(t))
      .catch(() => setTricycles([]));
  }, []);

  const claim = async (id: number) => {
    setClaiming(id);
    setError(null);
    try {
      onClaimed(await claimTricycle(id));
    } catch {
      setError("Couldn't claim that 3rike. Please try again.");
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div>
      <p className="text-sm text-[#909090] mb-4">
        Choose a 3rike to start owning. You'll pay it off weekly — and the investors backing it earn from each payment.
      </p>
      {!tricycles && <Skeleton className="h-32 w-full rounded-2xl" />}
      <div className="space-y-3">
        {tricycles?.map((t) => (
          <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#F2FBF5] flex items-center justify-center shrink-0">
              <img src={t.isEV ? "/small-tricycle2.svg" : "/yellow-tricycle.svg"} alt={t.make} className="w-11 h-11 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{t.make} {t.model}</p>
              <p className="text-xs text-[#909090]">${t.priceUsd.toLocaleString()} · {t.location}</p>
            </div>
            <Button
              onClick={() => claim(t.id)}
              disabled={claiming !== null}
              className="h-9 px-4 bg-[#01C259] hover:bg-[#00a049] text-white rounded-lg text-xs font-medium cursor-pointer"
            >
              {claiming === t.id ? "…" : "Choose"}
            </Button>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}

// --- Has a tricycle → progress + make payment ---
function OwnView({ status, onPaid }: { status: Extract<RiderStatus, { assigned: true }>; onPaid: () => Promise<void> }) {
  const [amount, setAmount] = useState(String(status.weeklyAmount));
  const [pin, setPin] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const t = status.tricycle;

  const pay = async () => {
    if (!/^\d{4}$/.test(pin)) return setError("Enter your 4-digit PIN.");
    const amt = Number(amount);
    if (!(amt > 0)) return setError("Enter an amount.");
    setPaying(true);
    setError(null);
    try {
      const res = await payWeekly({ amountUsdc: amt.toFixed(2), pin });
      setToast(
        res.yieldDistributed
          ? `Paid $${res.amountUsdc} · $${res.yieldUsdc} shared with investors`
          : `Paid $${res.amountUsdc}`,
      );
      setPin("");
      await onPaid();
    } catch (err) {
      setError(messageForPay(err));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      {/* Asset + progress */}
      <div className="relative w-full bg-[#0E1A13] rounded-2xl p-5 mb-4 text-white overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <img src={t.isEV ? "/small-tricycle2.svg" : "/yellow-tricycle.svg"} alt={t.make} className="w-12 h-12 object-contain" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">{t.make} {t.model}</p>
            <p className="text-xs text-white/60">${t.priceUsd.toLocaleString()} · {t.location}</p>
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-white/60 mb-1">
          <span>{status.pricePaidPct}% owned</span>
          <span>${Number(status.totalPaidUsdc).toLocaleString()} of ${t.priceUsd.toLocaleString()}</span>
        </div>
        <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
          <div className="h-full bg-[#01C259] rounded-full transition-all" style={{ width: `${status.pricePaidPct}%` }} />
        </div>
        {status.pricePaidPct >= 100 && (
          <div className="flex items-center gap-1.5 mt-3 text-[#01C259] text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Fully owned 🎉
          </div>
        )}
      </div>

      {/* Investor note */}
      <div className="flex items-start gap-2 bg-[#F2FBF5] rounded-xl p-3 mb-4">
        <TrendingUp className="w-4 h-4 text-[#01C259] mt-0.5 shrink-0" />
        <p className="text-[11px] text-[#5f6b64]">
          A slice of every payment goes to the investors who backed this 3rike, automatically. The rest builds your ownership.
        </p>
      </div>

      {toast && (
        <div className="mb-4 text-center text-sm text-[#01C259] bg-[#E9F8EE] rounded-xl py-2 px-3">{toast}</div>
      )}

      {/* Pay */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3">Make a payment</p>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          className="w-full h-12 rounded-xl border border-gray-200 px-4 mb-3 outline-none focus:border-[#01C259]"
          placeholder={`Weekly: $${status.weeklyAmount}`}
        />
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="4-digit PIN"
          className="w-full h-12 rounded-xl border border-gray-200 px-4 mb-3 outline-none focus:border-[#01C259] tracking-widest"
        />
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <Button
          onClick={pay}
          disabled={paying}
          className="w-full h-12 bg-[#01C259] hover:bg-[#00a049] text-white rounded-2xl disabled:opacity-60 cursor-pointer"
        >
          {paying ? "Processing…" : "Pay"}
        </Button>
      </div>

      {/* History */}
      {status.payments.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-[#909090] mb-2">Payment history</p>
          <div className="space-y-2">
            {status.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white border border-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm text-gray-700">${Number(p.amountUsdc).toFixed(2)}</p>
                  {Number(p.yieldUsdc) > 0 && (
                    <p className="text-[10px] text-[#01C259]">${Number(p.yieldUsdc).toFixed(2)} to investors</p>
                  )}
                </div>
                <span className="text-[11px] text-[#909090]">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function messageForPay(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "wrong_pin":
        return "Incorrect PIN.";
      case "insufficient_funds":
        return "Not enough USDC in your wallet. Add funds first.";
      case "not_verified":
        return "Please complete verification first.";
      case "no_tricycle":
        return "Choose a 3rike to pay off first.";
      default:
        return "Couldn't process the payment. Please try again.";
    }
  }
  return "Couldn't process the payment. Please try again.";
}
