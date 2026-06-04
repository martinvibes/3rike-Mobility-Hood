import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  Copy,
  ExternalLink,
  Lock,
  RefreshCw,
  Wallet as WalletIcon,
} from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import Skeleton from "@/components/ui/skeleton";

export default function Wallet() {
  const navigate = useNavigate();
  const { user, linkWallet } = useAuth();
  const partyId = user?.canton_party_id ?? "";

  const {
    balance,
    loading: loadingBalance,
    error: balanceErrorObj,
    refresh: loadBalance,
  } = useWalletBalance();
  const balanceError = balanceErrorObj ? messageFor(balanceErrorObj) : null;

  const [linkOpen, setLinkOpen] = useState(false);
  const [partyInput, setPartyInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const cleaned = partyInput.trim();
    if (cleaned.length < 16) {
      setSubmitError("That doesn't look like a valid Canton party ID.");
      return;
    }
    setSubmitting(true);
    try {
      await linkWallet(cleaned);
      setLinkSuccess(true);
      setLinkOpen(false);
      setPartyInput("");
      // Balance will reload because partyId changed.
      setTimeout(() => setLinkSuccess(false), 2000);
    } catch (err) {
      setSubmitError(messageFor(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPartyId = async () => {
    if (!partyId) return;
    try {
      await navigator.clipboard.writeText(partyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const formattedUnlocked = balance ? formatCC(balance.effective_unlocked_qty) : "—";
  const formattedLocked = balance ? formatCC(balance.effective_locked_qty) : "—";
  const formattedFees = balance ? formatCC(balance.total_holding_fees) : "—";

  return (
    <MobileFrame innerClassName="flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#E9F8EE] hover:bg-[#d8f1e0] cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-[#01C259]" />
        </Button>
        <h1 className="font-semibold text-lg text-gray-900">Canton Wallet</h1>
        {partyId && (
          <button
            type="button"
            onClick={loadBalance}
            disabled={loadingBalance}
            className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loadingBalance ? "animate-spin" : ""}`} />
          </button>
        )}
      </header>

      <div className="flex-1 px-5 pb-8 pt-2 flex flex-col">
        {/* Empty state — no wallet linked */}
        {!partyId && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-10">
            <div className="w-20 h-20 rounded-3xl bg-[#01C259]/10 flex items-center justify-center mb-5">
              <WalletIcon className="w-10 h-10 text-[#01C259]" strokeWidth={1.6} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link your wallet</h2>
            <p className="text-sm text-[#909090] max-w-xs leading-relaxed mb-6">
              Connect your Canton wallet to view your live CC balance, receive
              yields, and pay weekly fees on-chain.
            </p>
            <Button
              onClick={() => setLinkOpen(true)}
              className="h-12 px-8 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl font-medium cursor-pointer"
            >
              Link wallet
            </Button>
            <a
              href="https://docs.canton.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs text-[#01C259] hover:underline"
            >
              How do I get a Canton party ID?
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Connected state */}
        {partyId && (
          <>
            {/* Hero balance card */}
            <div className="relative w-full rounded-3xl p-6 text-white overflow-hidden mb-4 bg-[#00C258]">
              <img
                src="/earnings-banner.svg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
                aria-hidden
              />
              <div className="relative z-10">
                <p className="text-xs text-white/80 mb-1">Available balance</p>
                {loadingBalance && !balance ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-48 bg-white/20" />
                    <Skeleton className="h-3 w-24 bg-white/15" />
                  </div>
                ) : balanceError ? (
                  <p className="text-sm font-medium">—</p>
                ) : (
                  <h1 className="text-4xl font-bold mb-1">
                    {formattedUnlocked}{" "}
                    <span className="text-sm font-light text-white/80 align-middle">CC</span>
                  </h1>
                )}
                <p className="text-[11px] text-white/70 mt-2">
                  {balance ? `Round #${balance.round.toLocaleString()}` : ""}
                </p>
              </div>
            </div>

            {balanceError && (
              <p className="text-xs text-red-500 text-center mb-3" role="alert">
                {balanceError}
              </p>
            )}

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-3.5 h-3.5 text-[#909090]" />
                  <p className="text-[10px] text-[#909090] uppercase tracking-wider">Locked</p>
                </div>
                <p className="text-base font-bold text-gray-900">{formattedLocked}</p>
                <p className="text-[10px] text-[#909090] mt-0.5">In contracts</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] text-[#909090] uppercase tracking-wider mb-1">
                  Holding fees
                </p>
                <p className="text-base font-bold text-gray-900">{formattedFees}</p>
                <p className="text-[10px] text-[#909090] mt-0.5">Lifetime</p>
              </div>
            </div>

            {/* Wallet address */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-4">
              <p className="text-[10px] text-[#909090] uppercase tracking-wider mb-2">
                Linked party ID
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[11px] text-gray-700 font-mono truncate">
                  {partyId}
                </code>
                <button
                  type="button"
                  onClick={handleCopyPartyId}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                  aria-label="Copy party ID"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#01C259]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Update button */}
            <button
              type="button"
              onClick={() => {
                setPartyInput(partyId);
                setLinkOpen(true);
              }}
              className="text-sm text-[#01C259] font-medium underline decoration-dotted underline-offset-4 mt-2 cursor-pointer self-start"
            >
              Update party ID
            </button>
          </>
        )}
      </div>

      {/* --- Link / Update wallet sheet --- */}
      {linkOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end justify-center animate-in fade-in duration-200">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300"
          >
            <div className="mx-auto w-12 h-2 bg-gray-300 rounded-full mb-6" />
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {partyId ? "Update wallet" : "Link your wallet"}
            </h3>
            <p className="text-sm text-[#909090] text-center mb-6 px-2">
              Paste your Canton party ID below. You can find it in your wallet
              client or the Canton dashboard.
            </p>

            <label className="text-xs text-[#909090] block mb-2">Party ID</label>
            <textarea
              value={partyInput}
              onChange={(e) => setPartyInput(e.target.value)}
              placeholder="abc::1220195a..."
              rows={3}
              spellCheck={false}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-[#01C259] focus:bg-white transition-colors text-xs font-mono break-all"
            />

            {submitError && (
              <p className="text-sm text-red-500 text-center mt-3" role="alert">
                {submitError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <Button
                type="button"
                variant="ghost"
                disabled={submitting}
                onClick={() => {
                  setLinkOpen(false);
                  setSubmitError(null);
                }}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || partyInput.trim().length === 0}
                className="flex-1 h-12 rounded-xl bg-[#01C259] hover:bg-[#00a049] text-white font-medium cursor-pointer disabled:opacity-60"
              >
                {submitting ? "Linking…" : partyId ? "Update" : "Link wallet"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Success toast */}
      {linkSuccess && (
        <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center animate-in fade-in duration-200 pointer-events-none">
          <div className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#01C259] flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <p className="font-bold text-gray-900">Wallet linked</p>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}

/**
 * Canton Coin amounts come back as decimal strings ("646.2453147215"). We trim
 * them to 4 decimals for display while preserving the precision in the data.
 */
function formatCC(raw: string): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function messageFor(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "timeout") return "The server is waking up — please try again.";
    if (err.code === "network_error") return "Couldn't reach the server.";
    if (err.status === 422) return "Couldn't link this wallet. Check your party ID and try again.";
  }
  return "Something went wrong. Please try again.";
}
