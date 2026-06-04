import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  Check,
  ChevronLeft,
  Copy,
  ExternalLink,
  Lock,
  RefreshCw,
} from "lucide-react";
import MobileFrame from "@/components/ui/mobile-frame";
import { ApiError, cryptoDeposit } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import Skeleton from "@/components/ui/skeleton";

export default function Wallet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const address = user?.walletAddress ?? "";

  const {
    balance,
    loading: loadingBalance,
    error: balanceErrorObj,
    refresh: loadBalance,
  } = useWalletBalance();
  const balanceError = balanceErrorObj ? messageFor(balanceErrorObj) : null;

  const [copied, setCopied] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<{ hash: string; explorer: string } | null>(null);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const clean = amount.trim();
    if (!/^\d+(\.\d{1,6})?$/.test(clean) || Number(clean) <= 0) {
      setSubmitError("Enter a valid USDC amount.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await cryptoDeposit(clean);
      setLastTx({ hash: res.txHash, explorer: res.explorer });
      setDepositOpen(false);
      setAmount("");
      // Give the node a beat, then refresh the on-chain balance.
      setTimeout(() => void loadBalance(), 1500);
    } catch (err) {
      setSubmitError(messageFor(err));
    } finally {
      setSubmitting(false);
    }
  };

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

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
        <h1 className="font-semibold text-lg text-gray-900">Wallet</h1>
        <button
          type="button"
          onClick={() => void loadBalance()}
          disabled={loadingBalance}
          className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Refresh balance"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loadingBalance ? "animate-spin" : ""}`} />
        </button>
      </header>

      <div className="flex-1 px-5 pb-8 pt-2 flex flex-col">
        {/* Hero balance card */}
        <div className="relative w-full rounded-3xl p-6 text-white overflow-hidden mb-4 bg-[#00C258]">
          <img
            src="/earnings-banner.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
            aria-hidden
          />
          <div className="relative z-10">
            <p className="text-xs text-white/80 mb-1">Total balance</p>
            {loadingBalance && !balance ? (
              <Skeleton className="h-10 w-48 bg-white/20" />
            ) : (
              <h1 className="text-4xl font-bold mb-1">
                $ {formatUSDC(balance?.totalUsdc)}{" "}
                <span className="text-sm font-light text-white/80 align-middle">USDC</span>
              </h1>
            )}
            <p className="text-[11px] text-white/70 mt-2">Robinhood Chain · live on-chain balance</p>
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
            <p className="text-[10px] text-[#909090] uppercase tracking-wider mb-1">Spendable</p>
            <p className="text-base font-bold text-gray-900">{formatUSDC(balance?.walletUsdc)}</p>
            <p className="text-[10px] text-[#909090] mt-0.5">In wallet</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-[#909090]" />
              <p className="text-[10px] text-[#909090] uppercase tracking-wider">Saved</p>
            </div>
            <p className="text-base font-bold text-gray-900">{formatUSDC(balance?.vaultUsdc)}</p>
            <p className="text-[10px] text-[#909090] mt-0.5">Earning yield</p>
          </div>
        </div>

        {/* Wallet address */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-[#909090] uppercase tracking-wider mb-2">
            Your wallet address
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[12px] text-gray-700 font-mono truncate">{short}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
              aria-label="Copy address"
            >
              {copied ? (
                <><Check className="w-3 h-3 text-[#01C259]" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Copy</>
              )}
            </button>
            {balance?.explorer && (
              <a
                href={balance.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" /> View
              </a>
            )}
          </div>
        </div>

        {/* Deposit CTA */}
        <Button
          onClick={() => {
            setSubmitError(null);
            setDepositOpen(true);
          }}
          className="h-12 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl font-medium cursor-pointer gap-2"
        >
          <ArrowDownToLine className="w-4 h-4" /> Deposit crypto (USDC)
        </Button>

        {/* Last deposit receipt */}
        {lastTx && (
          <a
            href={lastTx.explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-between bg-[#E9F8EE] rounded-xl px-4 py-3 text-sm text-[#067a3a] hover:bg-[#dcf2e4]"
          >
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" /> Deposit confirmed on-chain
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs">
              {lastTx.hash.slice(0, 8)}… <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        )}
      </div>

      {/* Deposit sheet */}
      {depositOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end justify-center animate-in fade-in duration-200">
          <form
            onSubmit={handleDeposit}
            className="w-full bg-white rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300"
          >
            <div className="mx-auto w-12 h-2 bg-gray-300 rounded-full mb-6" />
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Deposit USDC</h3>
            <p className="text-sm text-[#909090] text-center mb-6 px-2">
              Credit USDC to your wallet on Robinhood Chain. Enter an amount.
            </p>

            <label className="text-xs text-[#909090] block mb-2">Amount (USDC)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="100"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-[#01C259] focus:bg-white transition-colors text-lg"
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
                onClick={() => setDepositOpen(false)}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || amount.trim().length === 0}
                className="flex-1 h-12 rounded-xl bg-[#01C259] hover:bg-[#00a049] text-white font-medium cursor-pointer disabled:opacity-60"
              >
                {submitting ? "Depositing…" : "Deposit"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </MobileFrame>
  );
}

function formatUSDC(raw?: string): string {
  if (raw === undefined) return "0.00";
  const n = Number(raw);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function messageFor(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "timeout") return "The server is waking up — please try again.";
    if (err.code === "network_error") return "Couldn't reach the server.";
    if (err.code === "chain_error") return "The deposit couldn't be confirmed on-chain. Try again.";
  }
  return "Something went wrong. Please try again.";
}
