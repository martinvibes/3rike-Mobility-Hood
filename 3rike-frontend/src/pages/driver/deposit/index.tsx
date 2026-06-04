import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import ReceiveCrypto from "@/components/receive-crypto";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called after a successful deposit so callers can refresh balance UI. */
    onDeposited?: () => void;
}

type View = "menu" | "crypto" | "bank" | "success";

export default function DepositModal({ isOpen, onClose, onDeposited }: DepositModalProps) {
    const { user } = useAuth();
    const address = (user?.walletAddress ?? "") as string;

    const [isVisible, setIsVisible] = useState(false);
    const [currentView, setCurrentView] = useState<View>("menu");
    const [received, setReceived] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setCurrentView("menu");
            setReceived(0);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const handleReceived = (amount: number) => {
        setReceived(amount);
        onDeposited?.();
        setCurrentView("success");
    };

    // --- Views ---

    const renderMenu = () => (
        <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-300">
            <div className="w-20 h-20 rounded-full bg-[#FFF8ED] flex items-center justify-center mb-4">
                <ArrowDown className="w-10 h-10 text-[#EE9C2E]" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit</h2>
            <p className="text-gray-400 text-sm font-normal max-w-55 leading-tight mb-8">
                Choose a method below to add funds to your wallet.
            </p>

            <div className="w-full space-y-4">
                <Button
                    variant="ghost"
                    onClick={() => setCurrentView("crypto")}
                    className="w-full h-auto py-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl p-0 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                            <img src="/crypto.svg" alt="crypto" className="w-6 h-6 object-cover" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">Crypto</h3>
                            <p className="text-xs text-gray-400 mt-0.5 font-normal">Receive USDC into your wallet</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Button>

                <Button
                    variant="ghost"
                    onClick={() => setCurrentView("bank")}
                    className="w-full h-auto py-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl p-0 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                            <img src="/bank.svg" alt="bank" className="w-6 h-6 object-cover" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">Bank Transfer</h3>
                            <p className="text-xs text-gray-400 mt-0.5 font-normal">Deposit from your bank (Naira)</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Button>
            </div>
        </div>
    );

    const renderCrypto = () => (
        <div className="flex flex-col items-center w-full animate-in slide-in-from-right-10 duration-300">
            <div className="w-full relative flex items-center justify-center mb-4">
                <button
                    onClick={() => setCurrentView("menu")}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Deposit Crypto</h2>
            </div>

            <ReceiveCrypto address={address} onReceived={handleReceived} />
        </div>
    );

    const renderBank = () => (
        <div className="flex flex-col items-center w-full text-center animate-in slide-in-from-right-10 duration-300 py-4">
            <div className="w-full relative flex items-center justify-center mb-6">
                <button
                    onClick={() => setCurrentView("menu")}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Bank Transfer</h2>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#F5F3FF] flex items-center justify-center mb-4">
                <img src="/bank.svg" alt="bank" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming soon</h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
                Deposit Naira from your bank and we'll convert it to USDC at the live
                rate. Bank deposits are landing next — for now, use Crypto.
            </p>
            <Button
                onClick={() => setCurrentView("menu")}
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-medium text-base rounded-xl cursor-pointer"
            >
                Back to methods
            </Button>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300 py-6">
            <div className="w-20 h-20 rounded-full bg-[#01C259] flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit received</h2>
            <p className="text-gray-400 text-sm font-normal max-w-xs leading-relaxed mb-8">
                ${formatAmount(received)} USDC landed in your wallet.
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
                className={`absolute inset-0 bg-[#F5F5F5E5] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            />

            <div
                className={`relative w-full max-w-100 bg-white rounded-4xl p-4 pb-8 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}
            >
                <div className="mx-auto w-12 h-2 bg-gray-300 rounded-full mb-6" />

                {currentView === "menu" && renderMenu()}
                {currentView === "crypto" && renderCrypto()}
                {currentView === "bank" && renderBank()}
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
