import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError, withdrawCrypto } from "@/lib/api";
import { useWalletBalance } from "@/lib/use-wallet-balance";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWithdrawn?: () => void;
}

type View = "menu" | "crypto" | "bank" | "success";

export default function WithdrawModal({ isOpen, onClose, onWithdrawn }: WithdrawModalProps) {
    const { balance, refresh } = useWalletBalance();
    const spendable = Number(balance?.walletUsdc ?? 0);

    const [isVisible, setIsVisible] = useState(false);
    const [view, setView] = useState<View>("menu");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastTx, setLastTx] = useState<{ hash: string; explorer: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setView("menu");
            setTo("");
            setAmount("");
            setError(null);
            setLastTx(null);
        } else {
            const t = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const addressValid = /^0x[a-fA-F0-9]{40}$/.test(to.trim());
    const amountNum = Number(amount);
    const amountValid = !Number.isNaN(amountNum) && amountNum > 0 && amountNum <= spendable;
    const canSubmit = addressValid && amountValid && !submitting;

    const handleWithdraw = async () => {
        if (!addressValid) return setError("Enter a valid wallet address (0x…).");
        if (!amountValid) return setError("Enter an amount within your spendable balance.");
        setSubmitting(true);
        setError(null);
        try {
            const res = await withdrawCrypto({ to: to.trim(), amountUsdc: amount.trim() });
            setLastTx({ hash: res.txHash, explorer: res.explorer });
            onWithdrawn?.();
            void refresh();
            setView("success");
        } catch (err) {
            setError(messageFor(err));
        } finally {
            setSubmitting(false);
        }
    };

    const renderMenu = () => (
        <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-300">
            <div className="w-20 h-20 rounded-full bg-[#F3F0FF] flex items-center justify-center mb-4">
                <ArrowUpRight className="w-8 h-8 text-[#7C3AED]" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdraw</h2>
            <p className="text-gray-400 text-sm max-w-xs leading-snug mb-8">
                Choose where to send your funds.
            </p>

            <div className="w-full space-y-3">
                <button
                    onClick={() => setView("crypto")}
                    className="w-full h-auto py-4 px-1 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                            <img src="/crypto.svg" alt="crypto" className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">Crypto wallet</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Send USDC to an external address</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>

                <button
                    onClick={() => setView("bank")}
                    className="w-full h-auto py-4 px-1 flex items-center justify-between hover:bg-gray-50 rounded-2xl cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                            <img src="/bank.svg" alt="bank" className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">To bank (Naira)</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Cash out to your bank account</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
            </div>
        </div>
    );

    const renderCrypto = () => (
        <div className="flex flex-col w-full animate-in slide-in-from-right-10 duration-300">
            <div className="w-full relative flex items-center justify-center mb-6">
                <button onClick={() => setView("menu")} className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Withdraw USDC</h2>
            </div>

            <div className="flex items-center justify-between mb-4 text-xs">
                <span className="text-gray-400">Spendable</span>
                <button
                    type="button"
                    onClick={() => setAmount(String(spendable))}
                    className="font-medium text-[#01C259] cursor-pointer"
                >
                    ${spendable.toFixed(2)} · Max
                </button>
            </div>

            <label className="text-xs text-gray-400 block mb-1.5">Destination address</label>
            <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x…"
                spellCheck={false}
                className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-[#01C259] focus:bg-white text-sm font-mono"
            />

            <label className="text-xs text-gray-400 block mb-1.5">Amount (USDC)</label>
            <div className="w-full bg-gray-50 rounded-xl px-4 py-3 mb-6 flex items-baseline gap-2">
                <span className="text-2xl font-light text-gray-400">$</span>
                <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-2xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                />
            </div>

            {error && <p className="text-sm text-red-500 mb-4 text-center" role="alert">{error}</p>}

            <Button
                disabled={!canSubmit}
                onClick={handleWithdraw}
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-medium text-base rounded-xl cursor-pointer disabled:bg-[#9fe0bb] disabled:cursor-not-allowed"
            >
                {submitting ? "Sending on-chain…" : "Withdraw"}
            </Button>
        </div>
    );

    const renderBank = () => (
        <div className="flex flex-col items-center w-full text-center animate-in slide-in-from-right-10 duration-300 py-4">
            <div className="w-full relative flex items-center justify-center mb-6">
                <button onClick={() => setView("menu")} className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">To bank</h2>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#F5F3FF] flex items-center justify-center mb-4">
                <img src="/bank.svg" alt="bank" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming soon</h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
                Cash out to your Nigerian bank account at the live rate. Landing next —
                for now, withdraw to a crypto wallet.
            </p>
            <Button onClick={() => setView("menu")} className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-medium text-base rounded-xl cursor-pointer">
                Back
            </Button>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300 py-6">
            <div className="w-20 h-20 rounded-full bg-[#01C259] flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal sent</h2>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-4">
                ${Number(amount || 0).toFixed(2)} USDC is on its way to your address.
            </p>
            {lastTx && (
                <a href={lastTx.explorer} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#01C259] hover:underline mb-8 font-mono">
                    {lastTx.hash.slice(0, 10)}… view on explorer <ExternalLink className="w-3 h-3" />
                </a>
            )}
            <Button onClick={onClose} className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-medium text-base rounded-xl cursor-pointer">
                Done
            </Button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-999 p-5 pb-8 flex items-end justify-center">
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-[#F5F5F5E5] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            />
            <div className={`relative w-full max-w-100 bg-white rounded-4xl p-4 pb-8 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}>
                <div className="mx-auto w-12 h-2 bg-gray-300 rounded-full mb-6" />
                {view === "menu" && renderMenu()}
                {view === "crypto" && renderCrypto()}
                {view === "bank" && renderBank()}
                {view === "success" && renderSuccess()}
            </div>
        </div>
    );
}

function messageFor(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.code === "insufficient_funds") return "Not enough spendable balance.";
        if (err.code === "invalid_input") return "Check the address and amount.";
        if (err.code === "chain_error") return "The withdrawal couldn't be sent on-chain. Try again.";
        if (err.code === "timeout") return "The server is waking up — please try again.";
    }
    return "Something went wrong. Please try again.";
}
