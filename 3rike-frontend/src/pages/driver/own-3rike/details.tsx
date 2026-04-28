import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Own3rikeDetails() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const images = ["/own-a-strike-tri.svg", "/yellow-tricycle.svg", "/brown-tri.svg", "/yellow-tricycle.svg"];

  const handleStartRiding = () => {
    if (!agreed) return;
    navigate("/driver/own-3rike/welcome");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-100 bg-white shadow-2xl overflow-hidden min-h-200 relative pb-32 px-5 pt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-[#E9F8EE] rounded-full hover:bg-[#d8f1e0] w-10 h-10"
            type="button"
          >
            <img src="/rounded-back.svg" alt="back" className="w-10 h-10" />
          </Button>
        </div>

        {/* Hero image card */}
        <div className="relative w-full rounded-3xl bg-[#fdfffe] flex items-center justify-center overflow-hidden mb-4 aspect-square">
          <img
            src="/verification-banner.svg"
            alt="bg"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <img
            src={images[activeImage]}
            alt="3rike"
            className="relative z-10 w-[80%] h-auto object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 mb-6">
          {images.slice(0, 3).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                activeImage === i ? "ring-2 ring-[#01C259]" : ""
              }`}
            >
              <img src={src} alt={`thumb-${i}`} className="w-[80%] h-auto object-contain" />
            </button>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-medium text-[#1A1A1A] leading-tight mb-2">
          Own a 3rike. Earn Passive income
        </h1>
        <p className="text-sm text-[#959595] mb-6">
          Start earning passive income with flexible weekly payments for 70 weeks.
        </p>

        {/* Ownership card */}
        <div className="border-2 border-dashed border-[#FFD9A8] bg-[#FFF7EC] rounded-2xl p-3 mb-10">
          <p className="text-xs text-[#F1B058] mb-1">Full ownership</p>
          <div className="flex items-baseline gap-1 mb-2.5">
            <span className="text-2xl text-[#F1B058] font-light">$</span>
            <span className="text-xl font-bold text-[#EE9C2E]">4,800</span>
          </div>

          <ul className="space-y-2 text-xs text-[#A86A1F]">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-[#EE9C2E] flex items-center justify-center shrink-0">
                <ChevronRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
              Ownership after 70 weeks
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-[#EE9C2E] flex items-center justify-center shrink-0">
                <ChevronRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
              Eligible for Loan with good eligible score
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-[#EE9C2E] flex items-center justify-center shrink-0">
                <ChevronRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
              Eligible for Loan with good eligible score
            </li>
          </ul>
        </div>

        {/* Agreement */}
        <label className="flex items-center justify-center gap-2 mt-14 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded-lg accent-[#01C259]"
          />
          <span className="text-xs text-[#909090]">
            I agree to the{" "}
            <span className="text-[#01C259] font-medium">Asset Ownership Terms</span>
          </span>
        </label>

        {/* Start riding */}
        <Button
          onClick={handleStartRiding}
          disabled={!agreed}
          className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-[#F2F2F2] rounded-xl text-lg font-light shadow-none disabled:bg-[#9fe0bb] disabled:cursor-not-allowed"
        >
          Start Riding
        </Button>
      </div>
    </div>
  );
}
