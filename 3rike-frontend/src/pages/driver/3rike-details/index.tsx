import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/ui/bottom-nav";

type Tier = {
  label: string;
  color: string;
  bar: string;
  weeksToGo: number;
};

const MAX_SCORE = 700;

function tierFor(score: number): Tier {
  if (score >= 700) return { label: "Perfect Ride.", color: "#0066FF", bar: "#01C259", weeksToGo: 30 };
  if (score >= 400) return { label: "Good standing", color: "#0066FF", bar: "#01C259", weeksToGo: 30 };
  if (score >= 300) return { label: "Doing good", color: "#F1B058", bar: "#F1B058", weeksToGo: 40 };
  return { label: "keep going", color: "#EC1111", bar: "#EC1111", weeksToGo: 50 };
}

export default function ThreeDetails() {
  const navigate = useNavigate();
  const [score, setScore] = useState(200);

  useEffect(() => {
    const raw = localStorage.getItem("eligibleScore");
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!Number.isNaN(parsed)) setScore(parsed);
    }
  }, []);

  const tier = tierFor(score);
  const progressPct = Math.min(100, (score / MAX_SCORE) * 100);
  const totalPaid = score >= 700 ? 4800 : 2600;
  const eligibleForLoan = score >= 400;

  const bumpScore = () => {
    const next = score >= 700 ? 200 : score + 100;
    setScore(next);
    localStorage.setItem("eligibleScore", String(next));
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-100 bg-white shadow-2xl overflow-hidden min-h-200 relative pb-32 px-5 pt-6">

        {/* Header */}
        <div className="flex items-center justify-center relative mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute left-0 bg-[#E9F8EE] rounded-full hover:bg-[#d8f1e0] w-10 h-10"
            type="button"
          >
            <img src="/rounded-back.svg" alt="back" className="w-10 h-10" />
          </Button>
          <h1 className="font-light text-lg text-gray-800">3rike Details</h1>
        </div>

        {/* Vehicle card */}
        <div className="relative w-full rounded-3xl bg-[#1B8036] overflow-hidden p-5 text-white mb-6">
          <img
            src="/future-main-bg.svg"
            alt="bg"
            className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
          />

          {/* tricycle image */}
          <div className="relative z-10 flex items-center justify-center h-44">
            <img
              src="/future-3rike2.svg"
              alt="3rike"
              className="h-full object-contain"
            />
          </div>

          {/* weekly payment row */}
          <div className="relative mx-7 z-10 mt-2 flex items-end justify-between">
            <div>
              <p className="text-xs text-white/90">Weekly Payment</p>
              <div className="text-lg font-bold flex items-center">
                <img src="/future-dolls.png" alt="dollar" />
                <span>65</span>
              </div>
            </div>
          </div>

          <div className="relative mx-7 z-10 mt-3 flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/40 rounded-full h-10 gap-2 text-sm cursor-pointer"
            >
              <img src="/future-pay.svg" alt="pay" />
              Pay Now
            </Button>
            <Button
              variant="ghost"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/40 rounded-full h-10 gap-2 text-sm cursor-pointer"
            >
              <img src="/future-refresh.svg" alt="auto pay" />
              Auto-Pay
            </Button>
          </div>
        </div>

        {/* Ownership progress */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Ownership Progress</h2>

        <div className="bg-[#F2FBF5] rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-[#909090] mb-1">Eligible Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {score}
                <span className="text-base font-light text-gray-500"> /{MAX_SCORE}</span>
              </p>
            </div>
            <div className="text-right space-y-2.5">
              <p className="text-sm font-normal" style={{ color: tier.color }}>
                {tier.label}
              </p>
              <p className="text-xs text-[#909090]">{tier.weeksToGo} weeks to go</p>
            </div>
          </div>

          {/* progress bar */}
          <div className="w-full h-3 rounded-full bg-white overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: tier.bar }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#909090] mb-0.5">Total Paid</p>
              <p className="text-base font-bold text-[#01C259]">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#909090] mb-0.5">3rike Condition</p>
              <p className="text-base font-bold text-[#01C259]">Excellent</p>
            </div>
          </div>
        </div>

        {eligibleForLoan && (
          <div className="flex justify-end mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#01C259] text-[#01C259] text-xs font-medium bg-white">
              Eligible for Loan
            </span>
          </div>
        )}

        {/* dev helper */}
        <button
          type="button"
          onClick={bumpScore}
          className="mt-4 text-xs text-[#1B8036] underline bg-transparent border-none cursor-pointer"
        >
          (Simulate Progress: +100)
        </button>

        <BottomNav />
      </div>
    </div>
  );
}
