import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiveCounter from "./live-counter";

type Props = {
  referralCode: string;
  position: number;
  totalCount: number;
  referralCount?: number;
};

export default function WaitlistSuccess({
  referralCode,
  position,
  totalCount,
  referralCount = 0,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/?ref=${referralCode}`);
  }, [referralCode]);

  // Display position bumps user up 5 spots per referral, clamped to >= 1.
  const displayPosition = Math.max(1, position - 5 * referralCount);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `I just joined the 3rike waitlist — be first in line for affordable, ownable mobility. Join with my link: ${shareUrl}`,
  )}`;

  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Just joined the @3rike waitlist 🛺 Join me — early riders get priority access: ${shareUrl}`,
  )}`;

  return (
    <div className="w-full max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
      {/* Success badge */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full bg-[#01C259]/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-full bg-[#01C259] flex items-center justify-center">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>

      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        You're #{displayPosition.toLocaleString()} on the list
      </h3>
      <p className="text-white/60 text-sm sm:text-base mb-8">
        <LiveCounter value={totalCount} className="font-bold text-white" />{" "}
        people on the list — share your link to skip ahead
      </p>

      {/* Referral card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wider text-white/50 mb-3 font-medium">
          Your referral link
        </p>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-2 pl-4">
          <code className="flex-1 text-sm text-white/90 truncate font-mono text-left">
            {shareUrl}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#01C259] hover:bg-[#00a049] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            asChild
            className="flex-1 h-10 rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white text-sm border-0"
          >
            <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
              Share on WhatsApp
            </a>
          </Button>
          <Button
            asChild
            className="flex-1 h-10 rounded-lg bg-white text-black hover:bg-white/90 text-sm border-0"
          >
            <a href={twitterShare} target="_blank" rel="noopener noreferrer">
              Share on X
            </a>
          </Button>
        </div>
      </div>

      <p className="text-xs text-white/40">
        Each friend who joins moves you up <span className="text-[#01C259] font-medium">5 spots</span>.
        {referralCount > 0 && (
          <>
            {" "}
            You've referred <span className="text-white font-medium">{referralCount}</span> so far.
          </>
        )}
      </p>
    </div>
  );
}
