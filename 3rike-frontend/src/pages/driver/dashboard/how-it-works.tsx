// First-run "Here's how 3rike works" overlay shown on the dashboard. Two
// screens, dismissible. Only appears once per browser (tracked in
// localStorage); the user can also re-trigger it via the Settings page in
// the future if we add that link.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Wallet, X } from "lucide-react";

const STORAGE_KEY = "3rike.howItWorksSeen";

type Slide = {
  badge: { icon: typeof Wallet; bg: string; iconColor: string };
  title: string;
  body: string;
  highlights: string[];
};

const SLIDES: Slide[] = [
  {
    badge: { icon: Wallet, bg: "bg-[#01C259]/10", iconColor: "text-[#01C259]" },
    title: "Drive, earn, own",
    body: "3rike turns your daily rides into ownership. Make small weekly payments and you'll own your tricycle outright in 70 weeks — no balloon payment, no surprise fees.",
    highlights: [
      "Weekly payments of about $65 — set a schedule that fits you",
      "Your repayment history builds a credit score on the platform",
      "Unlock low-interest loans once your score is strong",
    ],
  },
  {
    badge: { icon: TrendingUp, bg: "bg-[#FFF7EC]", iconColor: "text-[#EE9C2E]" },
    title: "Save and grow with us",
    body: "Save in USDC, earn weekly yield by buying fractions of other tricycles, and hold real on-chain value in your in-app wallet.",
    highlights: [
      "Open a savings account and earn from a shared interest pool",
      "Buy a fraction of a tricycle and receive weekly yield payouts",
      "Link your wallet to see your real CC balance, live on-chain",
    ],
  },
];

/**
 * Returns true if the overlay should appear on this device. We treat the
 * absence of the localStorage flag as "first run", which means a user who
 * clears their cache will see it again — that's fine for an opt-out tour.
 */
export function shouldShowHowItWorks(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return false;
  }
}

export function markHowItWorksSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

type Props = {
  onClose: () => void;
};

export default function HowItWorks({ onClose }: Props) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index]!;
  const isLast = index === SLIDES.length - 1;
  const Icon = slide.badge.icon;

  const handleNext = () => {
    if (isLast) {
      markHowItWorksSeen();
      onClose();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    markHowItWorksSeen();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[60] bg-black/50 flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full bg-white rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300 flex flex-col">
        {/* top row: dots + skip */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-[#01C259]" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="p-1 -m-1 text-gray-400 hover:text-gray-600 cursor-pointer rounded-full"
            aria-label="Skip introduction"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* badge */}
        <div className={`w-16 h-16 rounded-3xl ${slide.badge.bg} flex items-center justify-center mb-5`}>
          <Icon className={`w-8 h-8 ${slide.badge.iconColor}`} strokeWidth={1.6} />
        </div>

        {/* title + body */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{slide.title}</h2>
        <p className="text-sm text-[#909090] leading-relaxed mb-5">{slide.body}</p>

        {/* highlights */}
        <ul className="space-y-2.5 mb-8">
          {slide.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#01C259] shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          onClick={handleNext}
          className="w-full h-13 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl font-medium cursor-pointer flex items-center justify-center gap-1"
        >
          {isLast ? "Got it, let's go" : "Next"}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
