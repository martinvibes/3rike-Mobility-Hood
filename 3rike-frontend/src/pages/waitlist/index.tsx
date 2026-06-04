import { useEffect, useState } from "react";
import { ApiError, getWaitlistEntry, getWaitlistStats } from "@/lib/api";
import LiveCounter from "./live-counter";
import WaitlistForm from "./waitlist-form";
import WaitlistSuccess from "./waitlist-success";

const STORAGE_KEY = "waitlistEntry";
const REF_KEY = "waitlistReferredBy";

type StoredEntry = {
  referralCode: string;
  position: number;
};

export default function WaitlistSection() {
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [entry, setEntry] = useState<StoredEntry | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referredBy, setReferredBy] = useState<string | undefined>(undefined);

  // On mount: capture ?ref= from URL, restore stored entry, load stats.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(REF_KEY, ref);
      setReferredBy(ref);
    } else {
      const stored = localStorage.getItem(REF_KEY);
      if (stored) setReferredBy(stored);
    }

    const storedEntry = localStorage.getItem(STORAGE_KEY);
    if (storedEntry) {
      try {
        setEntry(JSON.parse(storedEntry));
      } catch {
        // corrupted; ignore
      }
    }

    getWaitlistStats()
      .then((s) => setTotalCount(s.totalCount))
      .catch(() => setTotalCount(0));
  }, []);

  // When we have a stored entry, refresh referral count + total from server.
  useEffect(() => {
    if (!entry?.referralCode) return;
    getWaitlistEntry(entry.referralCode)
      .then((d) => {
        setReferralCount(Number(d.referralCount));
        setTotalCount(d.totalCount);
      })
      .catch((err) => {
        // If the stored code is no longer valid (e.g. backend reset), clear it.
        if (err instanceof ApiError && err.status === 404) {
          localStorage.removeItem(STORAGE_KEY);
          setEntry(null);
        }
      });
  }, [entry?.referralCode]);

  const handleSuccess = (data: { referralCode: string; position: number; totalCount: number }) => {
    const stored: StoredEntry = {
      referralCode: data.referralCode,
      position: data.position,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setEntry(stored);
    setTotalCount(data.totalCount);
  };

  return (
    <section
      id="waitlist"
      className="relative bg-black text-white py-20 md:py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#01C259]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#01C259]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01C259]/10 border border-[#01C259]/30 text-[#01C259] text-xs font-medium uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#01C259] animate-pulse" />
          Coming soon
        </span>

        {/* Headline + sub */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-4">
          Be first in line for{" "}
          <span className="text-[#01C259]">3rike</span>
        </h2>
        <p className="text-white/60 text-base sm:text-lg max-w-xl mb-8">
          We're rolling out by region. Join the waitlist, and we'll text you the moment we're live near you.
        </p>

        {/* Live counter (only shown when there's no entry — otherwise the
            success view shows it inline). */}
        {!entry && totalCount !== null && (
          <div className="mb-10 flex items-center gap-2 text-sm text-white/50">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#01C259] opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#01C259]" />
            </span>
            <LiveCounter value={totalCount} className="font-bold text-white" />
            <span>people already on the list</span>
          </div>
        )}

        {/* Form / Success switch */}
        {entry ? (
          <WaitlistSuccess
            referralCode={entry.referralCode}
            position={entry.position}
            totalCount={totalCount ?? 0}
            referralCount={referralCount}
          />
        ) : (
          <WaitlistForm referredBy={referredBy} onSuccess={handleSuccess} />
        )}
      </div>
    </section>
  );
}
