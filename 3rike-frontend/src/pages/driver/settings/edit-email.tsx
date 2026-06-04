import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function EditEmail() {
  const navigate = useNavigate();
  const { user, updateEmail } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim() !== user?.email;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateEmail(email.trim().toLowerCase());
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(messageFor(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileFrame innerClassName="px-5 py-6 flex flex-col">
      <header className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#E9F8EE] hover:bg-[#d8f1e0] cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-[#01C259]" />
        </Button>
        <h1 className="font-semibold text-lg text-gray-900">Edit Email</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div>
          <label className="text-xs text-[#909090] block mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-[#01C259] focus:bg-white transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center" role="alert">
            {error}
          </p>
        )}

        <div className="mt-auto">
          <Button
            type="submit"
            disabled={!valid || submitting}
            className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl font-medium cursor-pointer disabled:bg-[#9fe0bb] disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>

      {success && (
        <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
          <div className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#01C259] flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <p className="font-bold text-gray-900">Email updated</p>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}

function messageFor(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 422) return "That email is already in use.";
    if (err.code === "timeout") return "The server is waking up — please try again.";
    if (err.code === "network_error") return "Couldn't reach the server.";
  }
  return "Couldn't update your email. Please try again.";
}
