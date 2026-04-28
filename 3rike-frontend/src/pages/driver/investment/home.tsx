import { useEffect, useState } from "react";
import { Minus, PieChart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

type Mode = "fleet" | "share";

const PRICING: Record<Mode, { unitPrice: number; addLabel: string; defaultQty: number; pluralLabel: string }> = {
  fleet: { unitPrice: 1400, addLabel: "Add fleets", defaultQty: 2, pluralLabel: "fleets" },
  share: { unitPrice: 56, addLabel: "Add Shares", defaultQty: 10, pluralLabel: "shares" },
};

export default function InvestmentApp() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("fleet");
  const [qty, setQty] = useState(PRICING.fleet.defaultQty);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { unitPrice, addLabel, pluralLabel } = PRICING[mode];
  const totalPrice = qty * unitPrice;

  const setModeAndDefault = (next: Mode) => {
    setMode(next);
    setQty(PRICING[next].defaultQty);
  };

  const onTabClick = (next: Mode) => () => setModeAndDefault(next);
  const onToggle = (checked: boolean) => setModeAndDefault(checked ? "fleet" : "share");

  const handlePurchase = () => setShowSuccess(true);

  // Auto-dismiss success after 2.5s and return to dashboard
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

          <nav className="flex items-center gap-5 text-sm">
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
        </header>

        {/* Body */}
        <div className="flex-1 flex flex-col px-5 pt-2">

          {/* Hero card */}
          <div className="relative w-full bg-[#F2FBF5] rounded-3xl overflow-hidden aspect-square flex items-center justify-center mb-4">
            <img
              src="/yellow-tricycle.svg"
              alt="3rike"
              className="w-[85%] h-[85%] object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mb-6">
            {[
              { src: "/small-tricycle.svg", alt: "thumb-yellow" },
              { src: "/small-tricycle2.svg", alt: "thumb-brown" },
            ].map((t, i) => (
              <button
                key={t.alt}
                type="button"
                onClick={() => setActiveThumb(i)}
                className={`w-16 h-16 rounded-2xl bg-white p-1 flex items-center justify-center transition-all cursor-pointer ${
                  activeThumb === i ? "ring-2 ring-[#01C259] shadow-sm" : "border border-gray-100"
                }`}
              >
                <img src={t.src} alt={t.alt} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

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

          {/* Purchase button */}
          <div className="mt-auto pt-2">
            <Button
              onClick={handlePurchase}
              className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white text-base font-medium rounded-2xl shadow-md shadow-green-100"
            >
              Purchase for ${totalPrice.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
