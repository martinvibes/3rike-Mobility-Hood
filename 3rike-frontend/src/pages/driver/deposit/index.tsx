
import { useEffect, useState } from "react";
import { ArrowDown, ChevronRight, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    // State to track which screen to show: 'menu', 'bank', or 'crypto'
    const [currentView, setCurrentView] = useState<'menu' | 'bank' | 'crypto'>('menu');
    const [isSolana, setIsSolana] = useState(false); // Toggle state for network

    // Handle animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setCurrentView('menu'); // Reset to menu every time it opens
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

    // --- SUB-COMPONENTS FOR VIEWS ---

    // 1. The Main Menu (Existing Design)
    const renderMenu = () => (
        <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-300">
            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-full bg-[#FFF8ED] flex items-center justify-center mb-4">
                <ArrowDown className="w-10 h-10 text-[#EE9C2E]" strokeWidth={2.5} />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit</h2>
            <p className="text-gray-400 text-sm font-normal max-w-55 leading-tight mb-8">
                Choose a method below to add funds to your account.
            </p>

            {/* Options List */}
            <div className="w-full space-y-4">
                {/* Bank Transfer Option */}
                <Button
                    variant="ghost"
                    onClick={() => setCurrentView('bank')}
                    className="w-full h-auto py-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl p-0"
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

                {/* Crypto Option */}
                <Button
                    variant="ghost"
                    onClick={() => setCurrentView('crypto')}
                    className="w-full h-auto py-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl p-0"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                            <img src="/crypto.svg" alt="crypto" className="w-6 h-6 object-cover" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-light text-gray-900">Crypto</h3>
                            <p className="text-xs text-gray-400 mt-0.5 font-normal">Deposit directly from your bank account</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </Button>
            </div>
        </div>
    );

    // 2. The Crypto View (New Design)
    const renderCrypto = () => (
        <div className="flex flex-col items-center w-full animate-in slide-in-from-right-10 duration-300">
            {/* Header with Back Button */}
            <div className="w-full relative flex items-center justify-center mb-2">
                {/* <button
                    onClick={() => setCurrentView('menu')}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button> */}
                <h2 className="text-xl font-bold text-gray-900">Deposit</h2>
            </div>

            <p className="text-gray-400 text-xs text-center ">
                Only send supported chain to the address below
            </p>

            {/* QR Code Card */}
            <div className="bg-white rounded-[32px] w-full max-w-xs flex flex-col items-center -space-y-6 pb-10">
                {/* QR Placeholder */}
                <div className="bg-white rounded-xl">
                    {/* Replace src with your actual QR code image or component */}
                    <img
                        src="/qrcode.svg"
                        alt="QR Code"
                        className="w-70 h-70 opacity-90"
                    />


                </div>

                <div className="text-center  w-full">
                    <p className="text-[10px] text-gray-400 break-all px-4 leading-relaxed font-mono">
                        0x295cCa3BD7C8C854b7c52Bd7a0dCB10CfFffc44e
                    </p>
                    <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
                        Copy
                    </button>
                </div>
            </div>

            {/* Network Toggle */}
            <div className="w-full flex items-center justify-between px-2 mb-8">
                <div className="flex items-center gap-2">
                    {/* Small Icon placeholder */}
                    <img
                        src="/solana.svg"
                        alt="solana"
                        className="w-6 h-6 object-cover"
                    />
                    <span className="text-xs text-gray-500 font-medium">Switch to Solana Network</span>
                </div>
                {/* Custom Toggle Switch */}
                <button
                    onClick={() => setIsSolana(!isSolana)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${isSolana ? 'bg-[#9747FF]' : 'bg-gray-200'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isSolana ? 'translate-x-5' : ''}`} />
                </button>
            </div>

            {/* Confirm Button */}
            <Button
                className="w-full h-14 bg-[#EAEAEA] hover:bg-[#d4d4d4] text-black font-light text-base rounded-xl shadow-none"
                onClick={onClose} // Or handle crypto confirmation logic
            >
                Confirm
            </Button>
        </div>
    );

    // 3. The Bank View (Placeholder matching the style)
    const renderBank = () => (
        <div className="flex flex-col items-center w-full animate-in slide-in-from-right-10 duration-300">
            <div className="w-full relative flex items-center justify-center mb-6">
                <button
                    onClick={() => setCurrentView('menu')}
                    className="absolute left-0 p-2 text-gray-400 hover:text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Bank Transfer</h2>
            </div>

            <div className="w-full bg-gray-50 rounded-2xl p-6 mb-6 text-center space-y-4">
                <p className="text-sm text-gray-500">Transfer to the account below:</p>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-wider">1234 5678 90</h1>
                    <p className="text-xs text-gray-400 mt-1">GTBank • Effiong Musa</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 h-8 text-xs border-gray-200">
                    <Copy size={12} /> Copy Number
                </Button>
            </div>

            <Button
                className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white font-semibold text-base rounded-xl shadow-none mt-auto"
                onClick={onClose}
            >
                I have sent the money
            </Button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-999 p-5 pb-8 flex items-end justify-center">

            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`
                absolute inset-0 bg-[#F5F5F5E5] backdrop-blur-sm transition-opacity duration-300
                ${isOpen ? "opacity-100" : "opacity-0"}
             `}
            />

            {/* Modal Sheet */}
            <div
                className={`
            relative w-full bg-white rounded-4xl p-4 pb-8 shadow-2xl 
            transform transition-transform duration-300 ease-out
            ${isOpen ? "translate-y-0" : "translate-y-full"}
            `}
            >
                {/* Handle Bar */}
                <div className="mx-auto w-12 h-2 bg-gray-300 rounded-full mb-6" />

                {/* Dynamic Content */}
                {currentView === 'menu' && renderMenu()}
                {currentView === 'crypto' && renderCrypto()}
                {currentView === 'bank' && renderBank()}
            </div>
        </div>
    );
}