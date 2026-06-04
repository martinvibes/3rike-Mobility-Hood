import { useEffect, useMemo, useState } from "react";
import { Minus, PieChart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import {
  ApiError,
  buyFraction,
  listTricycles,
  type Tricycle,
} from "@/lib/api";

type Mode = "fleet" | "share";

// Local labels for the toggle. "Fleet" = 1 whole tricycle (i.e. all
// fractions in one purchase). "Share" = a single fraction.
const MODE_LABELS: Record<Mode, { addLabel: string; defaultQty: number; pluralLabel: string }> = {
  fleet: { addLabel: "Add fleets", defaultQty: 1, pluralLabel: "fleets" },
  share: { addLabel: "Add Shares", defaultQty: 10, pluralLabel: "shares" },
};

export default function InvestmentApp() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("fleet");
  const [qty, setQty] = useState(MODE_LABELS.fleet.defaultQty);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Marketplace data
  const [tricycles, setTricycles] = useState<Tricycle[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Purchase
  const [submitting, setSubmitting] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Selected tricycle = the one whose thumbnail is active.
  const selected = useMemo<Tricycle | null>(() => {
    if (!tricycles || tricycles.length === 0) return null;
    return tricycles[Math.min(activeThumb, tricycles.length - 1)] ?? null;
  }, [tricycles, activeThumb]);

  // Pricing derived from the selected tricycle (price_usd / total_fractions
  // for share-level pricing; full price_usd for a fleet purchase).
  const sharePrice = selected && selected.total_fractions > 0
    ? selected.price_usd / selected.total_fractions
    : 0;
  const fleetPrice = selected?.price_usd ?? 0;
  const unitPrice = mode === "fleet" ? fleetPrice : sharePrice;
  const totalPrice = qty * unitPrice;

  const { addLabel, pluralLabel } = MODE_LABELS[mode];

  // Load tricycles on mount.
  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    listTricycles()
      .then((data) => {
        if (cancelled) return;
        // Show only fractionalized tricycles (those open for purchase).
        const buyable = data.filter((t) => t.status === "fractionalized" && t.total_fractions > 0);
        setTricycles(buyable);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof ApiError ? messageForLoad(err) : "Couldn't load marketplace.");
        setTricycles([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setModeAndDefault = (next: Mode) => {
    setMode(next);
    setQty(MODE_LABELS[next].defaultQty);
  };

  const onTabClick = (next: Mode) => () => setModeAndDefault(next);
  const onToggle = (checked: boolean) => setModeAndDefault(checked ? "fleet" : "share");

  const handlePurchase = async () => {
    if (!selected) return;
    setPurchaseError(null);
    setSubmitting(true);
    try {
      // For "fleet" we purchase all remaining fractions; for "share" we buy
      // qty fractions of the selected tricycle.
      const units = mode === "fleet" ? selected.total_fractions * qty : qty;
      await buyFraction({ tricycle_id: selected.id, units });
      setShowSuccess(true);
    } catch (err) {
      setPurchaseError(messageForBuy(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-dismiss success after 2.5s and return to dashboard.
  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => {
      setShowSuccess(false);
      navigate("/driver");
    }, 2500);
    return () => clearTimeout(t);
  }, [showSuccess, navigate]);

  // --- Success Screen ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-100 bg-[#F2FBF5] shadow-2xl overflow-hidden min-h-200 relative flex flex-col items-center justify-center p-8">
          <img
            src="/tricycle-success.svg"
            alt="Success"
            className="w-32 h-32 object-contain mb-6"
          />
          <h2 className="text-2xl font-extrabold text-black mb-2">Successfully Sent!</h2>
          <p className="text-sm text-[#909090]">
            {qty} {pluralLabel} successfully purchased
          </p>
        </div>
      </div>
    );
  }

  // --- Main View ---
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-100 bg-white shadow-2xl overflow-hidden min-h-200 relative pb-8 flex flex-col">

        {/* Header */}
        <header className="pt-6 px-5 pb-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#E9F8EE] hover:bg-[#d8f1e0] shrink-0"
            type="button"
          >
            <img src="/rounded-back.svg" alt="back" className="w-10 h-10" />
          </Button>

          <nav className="flex items-center gap-5 text-sm flex-1">
            <span className="font-bold text-black">Investment</span>
            <button
              type="button"
              onClick={onTabClick("fleet")}
              className={`transition-colors cursor-pointer ${
                mode === "fleet" ? "text-black font-bold" : "text-[#B5B5B5]"
              }`}
            >
              Fleets
            </button>
            <button
              type="button"
              onClick={onTabClick("share")}
              className={`transition-colors cursor-pointer ${
                mode === "share" ? "text-black font-bold" : "text-[#B5B5B5]"
              }`}
            >
              Shares
            </button>
          </nav>

          <button
            type="button"
            onClick={() => navigate("/driver/investment/portfolio")}
            className="text-xs font-medium text-[#01C259] hover:underline cursor-pointer shrink-0"
          >
            My
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 flex flex-col px-5 pt-2">

          {/* Loading / empty / error states */}
          {tricycles === null && (
            <div className="relative w-full bg-[#F2FBF5] rounded-3xl overflow-hidden aspect-square flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-3 border-[#01C259] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {tricycles !== null && tricycles.length === 0 && (
            <div className="relative w-full bg-[#F2FBF5] rounded-3xl overflow-hidden aspect-square flex items-center justify-center mb-4 px-8 text-center">
              <div>
                <p className="text-base font-semibold text-gray-700 mb-1">
                  No 3rikes available yet
                </p>
                <p className="text-xs text-[#909090]">
                  {loadError ?? "New investment opportunities open up regularly. Check back soon."}
                </p>
              </div>
            </div>
          )}

          {tricycles !== null && tricycles.length > 0 && selected && (
            <>
              {/* Hero card */}
              <div className="relative w-full bg-[#F2FBF5] rounded-3xl overflow-hidden aspect-square flex items-center justify-center mb-4">
                <img
                  src={selected.is_ev ? "/small-tricycle2.svg" : "/yellow-tricycle.svg"}
                  alt={`${selected.make} ${selected.model}`}
                  className="w-[85%] h-[85%] object-contain"
                />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 text-[10px] font-medium text-gray-700">
                  {selected.make} {selected.model} {selected.is_ev && "• EV"}
                </div>
              </div>

              {/* Thumbnails — one per tricycle */}
              {tricycles.length > 1 && (
                <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
                  {tricycles.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveThumb(i)}
                      className={`w-16 h-16 shrink-0 rounded-2xl bg-white p-1 flex items-center justify-center transition-all cursor-pointer ${
                        activeThumb === i ? "ring-2 ring-[#01C259] shadow-sm" : "border border-gray-100"
                      }`}
                    >
                      <img
                        src={t.is_ev ? "/small-tricycle2.svg" : "/small-tricycle.svg"}
                        alt={`${t.make}-${t.id}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quantity stepper */}
          <div className="flex items-center justify-between px-2 mb-6">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
              aria-label="Decrease"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-black leading-none">{qty}</span>
              <span className="text-xs text-[#909090] mt-1">{addLabel}</span>
            </div>

            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
              aria-label="Increase"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="flex items-center gap-3">
              <PieChart
                className={`w-6 h-6 transition-colors ${
                  mode === "share" ? "text-[#01C259]" : "text-[#B5B5B5]"
                }`}
              />
              <Switch
                checked={mode === "fleet"}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-[#01C259] data-[state=unchecked]:bg-[#01C259] h-6 w-11"
              />
              <img
                src={mode === "fleet" ? "/full_moon_fill.svg" : "/full_moon_fill_disabled.svg"}
                alt="shares"
                className="w-6 h-6 transition-opacity"
              />
            </div>
            <p className="text-[11px] text-[#909090] text-center px-6">
              Toggle button to buy either ful share or a full fleet
            </p>
          </div>

          {purchaseError && (
            <p className="text-sm text-red-500 text-center mb-2" role="alert">
              {purchaseError}
            </p>
          )}

          {/* Purchase button */}
          <div className="mt-auto pt-2">
            <Button
              onClick={handlePurchase}
              disabled={!selected || submitting || qty <= 0}
              className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white text-base font-medium rounded-2xl shadow-md shadow-green-100 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting
                ? "Processing…"
                : !selected
                  ? "No tricycles available"
                  : `Purchase for $${totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function messageForLoad(err: ApiError): string {
  if (err.code === "timeout") return "The server is waking up — please reload.";
  if (err.code === "network_error") return "Couldn't reach the server.";
  return "Couldn't load marketplace.";
}

function messageForBuy(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "tricycle_not_available":
        return "This tricycle isn't available for purchase right now.";
      case "insufficient_units":
        return "Not enough fractions remaining. Try a smaller amount.";
      case "invalid_units":
        return "Please pick a valid amount.";
      case "timeout":
        return "The server is waking up — please try again.";
      case "network_error":
        return "Couldn't reach the server. Check your connection.";
      default:
        return "Couldn't complete the purchase. Please try again.";
    }
  }
  return "Couldn't complete the purchase. Please try again.";
}
