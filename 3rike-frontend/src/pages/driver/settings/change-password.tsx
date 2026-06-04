import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, EyeClosed, EyeIcon } from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import { ApiError, changePassword } from "@/lib/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const valid =
    oldPassword.length >= 6 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword &&
    newPassword !== oldPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    if (newPassword === oldPassword) {
      setError("New password must be different from your current one.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword });
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
        <h1 className="font-semibold text-lg text-gray-900">Change Password</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <PasswordField
          label="Current password"
          value={oldPassword}
          onChange={setOldPassword}
          show={showOld}
          onToggle={() => setShowOld((v) => !v)}
          autoComplete="current-password"
        />
        <PasswordField
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          autoComplete="new-password"
          hint="At least 6 characters"
        />
        <PasswordField
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          autoComplete="new-password"
        />

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
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>

      {success && (
        <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
          <div className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#01C259] flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <p className="font-bold text-gray-900">Password updated</p>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-xs text-[#909090] block mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-[#01C259] focus:bg-white transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeIcon className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
        </button>
      </div>
      {hint && <p className="text-[11px] text-[#909090] mt-1">{hint}</p>}
    </div>
  );
}

function messageFor(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 422) return "Your current password is incorrect.";
    if (err.code === "timeout") return "The server is waking up — please try again.";
    if (err.code === "network_error") return "Couldn't reach the server.";
  }
  return "Couldn't update your password. Please try again.";
}
