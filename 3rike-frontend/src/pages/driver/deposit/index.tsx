import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, Check, ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError, deposit as apiDeposit } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called after a successful deposit so callers can refresh balance UI. */
    onDeposited?: () => void;
}

type View = "menu" | "amount-bank" | "amount-crypto" | "bank" | "crypto" | "success";

export default function DepositModal({ isOpen, onClose, onDeposited }: DepositModalProps) {
    const { driver } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [currentView, setCurrentView] = useState<View>("menu");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSolana, setIsSolana] = useState(false);

    // Handle animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setCurrentView("menu");
            setAmount("");
            setServerError(null);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Prevent scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const numericAmount = Number(amount);
    const amountValid = !Number.isNaN(numericAmount) && numericAmount > 0;

    const handleConfirmDeposit = async () => {
        if (!driver) {
            setServerError("Complete your verification before depositing.");
            return;
        }
        if (!amountValid) {
            setServerError("Please enter a valid amount.");
            return;
        }
        setSubmitting(true);
        setServerError(null);
        try {
            await apiDeposit({
                driver_id: driver.id,
                amount_usdc: numericAmount,
            });
            onDeposited?.();
            setCurrentView("success");
        } catch (err) {
            setServerError(messageFor(err));
        } finally {
            setSubmitting(false);
        }
    };

    // --- Views ---

    const renderMenu = () => (
        <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-300">
            <div className="w-20 h-20 rounded-full bg-[#FFF8ED] flex items-center justify-center mb-4">
                <ArrowDown className="w-10 h-10 text-[#EE9C2E]" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit</h2>
            <p className="text-gray-400 text-sm font-normal max-w-55 leading-tight mb-8">
                Choose a method below to add funds to your savings.
            </p>

            <div className="w-full space-y-4">
                <Button
                    variant="ghost"
                    onClick={() => setCurrentView("amount-bank")}
                    className="w-full h-auto py-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl p-0 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                            <img src="/bank.svg" alt="bank" className="w-6 h-6 object-cover" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">Bank Transfer</h3>
                            <p className="text-xs text-gray-400 mt-0.5 font-normal">Deposit directly from your bank account</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Button>

                <Button
                    variant="ghost"
                    onClick={() => setCurrentView("amount-crypto")}
                    className="w-full h-auto py-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl p-0 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                            <img src="/crypto.svg" alt="crypto" className="w-6 h-6 object-cover" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">Crypto</h3>
                            <p className="text-xs text-gray-400 mt-0.5 font-normal">Deposit USDC from your wallet</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Button>
            </div>
        </div>
    );

    const renderAmount = (next: "bank" | "crypto") => (
        <div className="flex flex-col items-center w-full animate-in slide-in-from-right-10 duration-300">
            <div className="w-full relative flex items-center justify-center mb-6">
                <button
                    onClick={() => setCurrentView("menu")}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Enter Amount</h2>
            </div>

            <p className="text-gray-400 text-xs text-center mb-6">
                How much USDC are you depositing?
            </p>

            <div className="w-full bg-gray-50 rounded-2xl p-6 mb-6">
                <label className="text-xs text-gray-400 font-medium block mb-2">
                    Amount (USDC)
                </label>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-gray-400">$</span>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9.]/g, "");
                            setAmount(raw);
                        }}
                        placeholder="0.00"
                        className="flex-1 bg-transparent text-3xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                    />
                </div>
            </div>

            <Button
                disabled={!amountValid}
                onClick={() => setCurrentView(next)}
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl text-base font-medium shadow-md shadow-green-100 disabled:bg-[#9fe0bb] disabled:cursor-not-allowed cursor-pointer"
            >
                Continue
            </Button>
        </div>
    );

    const renderCrypto = () => (
        <div className="flex flex-col items-center w-full animate-in slide-in-from-right-10 duration-300">
            <div className="w-full relative flex items-center justify-center mb-2">
                <button
                    onClick={() => setCurrentView("amount-crypto")}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Deposit ${amount || "0.00"}</h2>
            </div>

            {/* Demo-mode safety warning. The address below is a hardcoded
                placeholder from the original UI mockup — it is NOT a wallet
                anyone monitors. Real deposits require integrating a custodial
                wallet provider (Circle, Privy, Magic) so each user gets a
                unique deposit address whose transactions are confirmed
                on-chain before crediting the savings balance. */}
            <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
                <p className="font-bold mb-0.5">⚠ Demo mode</p>
                <p>
                    The address below is a placeholder. Do <span className="font-bold">not</span> send real
                    crypto — funds will be lost. Confirming below records a
                    deposit in the database without any on-chain verification.
                </p>
            </div>

            <p className="text-gray-400 text-xs text-center">
                Only send supported chain to the address below
            </p>

            <div className="bg-white rounded-[32px] w-full max-w-xs flex flex-col items-center -space-y-6 pb-10">
                <div className="bg-white rounded-xl">
                    <img src="/qrcode.svg" alt="QR Code" className="w-70 h-70 opacity-90" />
                </div>

                <div className="text-center w-full">
                    <p className="text-[10px] text-gray-400 break-all px-4 leading-relaxed font-mono">
                        0x295cCa3BD7C8C854b7c52Bd7a0dCB10CfFffc44e
                    </p>
                    <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                        Copy
                    </button>
                </div>
            </div>

            <div className="w-full flex items-center justify-between px-2 mb-8">
                <div className="flex items-center gap-2">
                    <img src="/solana.svg" alt="solana" className="w-6 h-6 object-cover" />
                    <span className="text-xs text-gray-500 font-medium">Switch to Solana Network</span>
                </div>
                <button
                    onClick={() => setIsSolana(!isSolana)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${isSolana ? "bg-[#9747FF]" : "bg-gray-200"}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isSolana ? "translate-x-5" : ""}`} />
                </button>
            </div>

            {serverError && (
                <p className="text-sm text-red-500 mb-4 text-center" role="alert">
                    {serverError}
                </p>
            )}

            <Button
                disabled={submitting || !driver}
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-medium text-base rounded-xl shadow-none cursor-pointer disabled:opacity-60"
                onClick={handleConfirmDeposit}
            >
                {submitting ? "Recording…" : "I have sent the money"}
            </Button>
        </div>
    );

    const renderBank = () => (
        <div className="flex flex-col items-center w-full animate-in slide-in-from-right-10 duration-300">
            <div className="w-full relative flex items-center justify-center mb-6">
                <button
                    onClick={() => setCurrentView("amount-bank")}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Bank Transfer</h2>
            </div>

            {/* Demo-mode safety warning. The bank account number below is a
                placeholder. A real bank-deposit flow requires a payment
                processor (Paystack for Ghana, Flutterwave) that webhooks
                confirmation back to the backend before crediting the balance. */}
            <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
                <p className="font-bold mb-0.5">⚠ Demo mode</p>
                <p>
                    The account number below is a placeholder. Do <span className="font-bold">not</span> send
                    a real transfer. Confirming records a deposit without any
                    bank-side verification.
                </p>
            </div>

            <div className="w-full bg-gray-50 rounded-2xl p-6 mb-6 text-center space-y-4">
                <p className="text-sm text-gray-500">Transfer ${amount || "0.00"} USDC equivalent to the account below:</p>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-wider">1234 5678 90</h1>
                    <p className="text-xs text-gray-400 mt-1">GTBank • 3rike Mobility</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 h-8 text-xs border-gray-200 cursor-pointer">
                    <Copy size={12} /> Copy Number
                </Button>
            </div>

            {serverError && (
                <p className="text-sm text-red-500 mb-4 text-center" role="alert">
                    {serverError}
                </p>
            )}

            <Button
                disabled={submitting || !driver}
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-semibold text-base rounded-xl shadow-none mt-auto cursor-pointer disabled:opacity-60"
                onClick={handleConfirmDeposit}
            >
                {submitting ? "Recording…" : "I have sent the money"}
            </Button>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300 py-6">
            <div className="w-20 h-20 rounded-full bg-[#01C259] flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Recorded</h2>
            <p className="text-gray-400 text-sm font-normal max-w-xs leading-relaxed mb-8">
                ${formatAmount(numericAmount)} added to your savings balance.
            </p>
            <Button
                onClick={onClose}
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-medium text-base rounded-xl cursor-pointer"
            >
                Done
            </Button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-999 p-5 pb-8 flex items-end justify-center">
            <div
                onClick={onClose}
                className={`
                    absolute inset-0 bg-[#F5F5F5E5] backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? "opacity-100" : "opacity-0"}
                `}
            />

            <div
                className={`
                    relative w-full max-w-100 bg-white rounded-4xl p-4 pb-8 shadow-2xl
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? "translate-y-0" : "translate-y-full"}
                `}
            >
                <div className="mx-auto w-12 h-2 bg-gray-300 rounded-full mb-6" />

                {currentView === "menu" && renderMenu()}
                {currentView === "amount-bank" && renderAmount("bank")}
                {currentView === "amount-crypto" && renderAmount("crypto")}
                {currentView === "bank" && renderBank()}
                {currentView === "crypto" && renderCrypto()}
                {currentView === "success" && renderSuccess()}
            </div>
        </div>
    );
}

function formatAmount(amount: number): string {
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function messageFor(err: unknown): string {
    if (err instanceof ApiError) {
        switch (err.code) {
            case "timeout":
                return "The server is waking up — please try again.";
            case "network_error":
                return "Couldn't reach the server. Check your connection.";
            default:
                return "Something went wrong recording your deposit.";
        }
    }
    return "Something went wrong recording your deposit.";
}
