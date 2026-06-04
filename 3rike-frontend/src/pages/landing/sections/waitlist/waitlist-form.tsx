import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ApiError, joinWaitlist } from "@/lib/api";

type Props = {
  referredBy?: string;
  onSuccess: (data: { referralCode: string; position: number; totalCount: number }) => void;
};

const COUNTRY_CODES = [
  { code: "+233", flag: "🇬🇭", label: "Ghana" },
  { code: "+234", flag: "🇳🇬", label: "Nigeria" },
  { code: "+254", flag: "🇰🇪", label: "Kenya" },
  { code: "+27", flag: "🇿🇦", label: "South Africa" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
];

export default function WaitlistForm({ referredBy, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+233");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    const fullPhone = phone.trim() ? `${countryCode}${phone.replace(/\D/g, "")}` : "";

    setSubmitting(true);
    try {
      const res = await joinWaitlist({
        email: trimmedEmail,
        phone: fullPhone || undefined,
        referredBy,
      });
      onSuccess({
        referralCode: res.entry.referral_code,
        position: res.entry.position,
        totalCount: res.totalCount,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(messageForCode(err.code));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 h-12 px-4 rounded-full bg-white/5 border border-white/15 text-white placeholder-white/40 outline-none focus:border-[#01C259] focus:bg-white/10 transition-colors"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="h-12 px-3 rounded-full bg-white/5 border border-white/15 text-white outline-none focus:border-[#01C259] transition-colors text-sm"
          aria-label="Country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code} className="bg-black">
              {c.flag} {c.code}
            </option>
          ))}
        </select>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="flex-1 h-12 px-4 rounded-full bg-white/5 border border-white/15 text-white placeholder-white/40 outline-none focus:border-[#01C259] focus:bg-white/10 transition-colors"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 rounded-full bg-[#01C259] hover:bg-[#00a049] text-white text-base font-medium shadow-lg shadow-[#01C259]/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {submitting ? "Joining…" : "Join the waitlist"}
      </Button>

      {error && (
        <p className="text-sm text-red-400 text-center" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-white/40 text-center mt-1">
        We'll never spam you. Unsubscribe anytime.
      </p>
    </form>
  );
}

function messageForCode(code: string) {
  switch (code) {
    case "invalid_email":
      return "That email doesn't look right. Please check and try again.";
    case "invalid_phone":
      return "That phone number isn't valid.";
    case "invalid_referrer":
      return "Your referral link looks broken — but you can still join below.";
    default:
      return "Something went wrong. Please try again.";
  }
}
