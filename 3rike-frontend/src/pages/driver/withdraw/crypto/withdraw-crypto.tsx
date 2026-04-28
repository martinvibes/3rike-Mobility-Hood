import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ArrowUpDown, Pencil, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// --- Types ---
// Added 'confirm' step to the flow
type Step = 'address' | 'amount' | 'confirm' | 'success';
type ChainType = 'solana' | 'evm';

export default function WithdrawCryptoAsset() {
    const navigate = useNavigate();
    const location = useLocation();

    // --- State ---
    const [step, setStep] = useState<Step>('address');
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("0");
    const [isProcessing, setIsProcessing] = useState(false);

    // Default to 'solana' if no state is found
    const chainType: ChainType = location.state?.chain || 'solana';

    // --- Asset Configuration ---
    const assetConfig = {
        solana: {
            name: "Solana",
            ticker: "SOL",
            icon: "/solana.svg",
            bgColor: "bg-[#909090]",
            networkName: "Solana"
        },
        evm: {
            name: "EVM",
            ticker: "ETH",
            icon: "/eth.svg",
            bgColor: "bg-[#909090]",
            networkName: "Ethereum"
        }
    };
    const currentAsset = assetConfig[chainType];

    const AssetIcon = () => (
        <div className={`w-4 h-4 rounded-full ${currentAsset.bgColor} flex items-center justify-center overflow-hidden`}>
            <img
                src={currentAsset.icon}
                alt={currentAsset.ticker}
                className="w-4 h-4 object-cover"
                onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <span className="text-[8px] text-white font-bold absolute" style={{ zIndex: -1 }}>{currentAsset.ticker[0]}</span>
        </div>
    );

    // --- Keypad / Amount Logic ---
    const handleKeypadPress = (val: string) => {
        if (val === "x") {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
        } else {
            // Increased limit to 20 characters
            if (amount.replace('.', '').length >= 20) return;
            setAmount(prev => prev === "0" ? val : prev + val);
        }
    };

    // --- Processing Logic ---
    const handleTransfer = () => {
        setIsProcessing(true);
        // Simulate network request
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 2000); // 2 seconds processing time
    };

    // --- Render: Step 1 (Address Input) ---
    const renderAddressStep = () => (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <h1 className="text-xl font-bold text-black mb-6">
                Withdraw Asset
            </h1>

            {/* Read-Only Asset Selector */}
            <div className="w-full bg-[#F3F4F6] p-4 rounded-xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <AssetIcon />
                    <span className="font-medium text-sm text-black">{currentAsset.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#6B7280]">$ 0.0000</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Address Input */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-black mb-3">Wallet Address</label>
                <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste wallet address here"
                    className="h-14 bg-[#F9FAFB] border-none shadow-none rounded-xl text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-200"
                />
            </div>

            <div className="mt-auto mb-4">
                <Button
                    disabled={!address.trim()}
                    onClick={() => setStep('amount')}
                    className="w-full h-14 bg-[#01C259] hover:bg-[#01b050] disabled:bg-gray-300 text-white text-lg font-medium rounded-xl shadow-none transition-colors"
                >
                    Continue
                </Button>
            </div>
        </div>
    );

    // --- Render: Step 2 (Amount Input) ---
    const renderAmountStep = () => (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative">
                <button
                    onClick={() => setStep('address')}
                    className="p-1 -ml-2 rounded-full hover:bg-gray-100 transition-colors absolute left-0"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-500" />
                </button>
                <h1 className="text-base font-medium text-gray-400 w-full text-center">Send</h1>
            </div>

            <div className="flex flex-col items-center flex-1">
                {/* Recipient Info */}
                <p className="text-xs text-gray-400 mb-6">
                    You're sending to: <span className="text-black font-medium">{address.slice(0, 4)}...{address.slice(-4)}</span>
                </p>

                {/* Asset Pill */}
                <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 mb-8">
                    <AssetIcon />
                    <span className="text-xs font-semibold text-gray-700">{currentAsset.name}</span>
                </div>

                {/* Amount Display */}
                <div className="flex items-center justify-between gap-4 mb-20 w-full px-8">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <AssetIcon />
                    </div>
                    {/* Dynamic font size based on length to keep it fitting */}
                    <div className={`font-semibold text-black tracking-tight text-center truncate px-2 ${amount.length > 8 ? 'text-2xl' : 'text-4xl'}`}>
                        {amount}
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                        <ArrowUpDown className="w-4 h-4" />
                    </div>
                </div>

                <div className="bg-gray-50 px-4 py-1 flex flex-row rounded-lg mb-8 items-center gap-2">
                    <span className="text-[10px] text-gray-400">Current Balance 0.00000</span>
                    <AssetIcon />
                </div>

                {/* Continue Button -> Goes to Confirm Screen */}
                <div className="w-full px-4 mb-6">
                    <Button
                        disabled={amount === "0"}
                        onClick={() => setStep('confirm')}
                        className="w-full h-14 bg-[#01C259] hover:bg-[#01b050] disabled:bg-gray-300 text-white text-lg font-medium rounded-xl shadow-none transition-colors"
                    >
                        Continue
                    </Button>
                </div>

                {/* Keypad */}
                <div className="bg-[#F9FAFB] w-full rounded-t-[32px] animate-in slide-in-from-bottom duration-300 mt-auto">
                    <div className="flex justify-between px-6 py-3 mb-1 text-[11px] font-semibold tracking-wide">
                        <span className="text-gray-500">3rike Secure Numeric Keypad</span>
                        <button className="text-[#01C259] hover:text-green-700">Done</button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 px-2 pb-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleKeypadPress(num.toString())}
                                className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xl font-semibold text-black active:bg-gray-100 transition-colors"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="h-12"></div>
                        <button
                            onClick={() => handleKeypadPress("0")}
                            className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xl font-semibold text-black active:bg-gray-100 transition-colors"
                        >
                            0
                        </button>
                        <button
                            onClick={() => handleKeypadPress("x")}
                            className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center active:bg-gray-100 transition-colors"
                        >
                            <span className="text-lg font-medium text-black">x</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Render: Step 3 (Confirmation - "Hold" Screen Design but Normal Button) ---
    const renderConfirmStep = () => (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative">
                <button
                    onClick={() => !isProcessing && setStep('amount')}
                    disabled={isProcessing}
                    className="p-1 -ml-2 rounded-full hover:bg-gray-100 transition-colors absolute left-0 disabled:opacity-50"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-500" />
                </button>
                <h1 className="text-base font-medium text-gray-400 w-full text-center">Send</h1>
            </div>

            <div className="flex flex-col items-center flex-1 px-6">

                {/* Asset Pill */}
                <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 mb-8">
                    <AssetIcon />
                    <span className="text-xs font-semibold text-gray-700">{currentAsset.name}</span>
                </div>

                {/* Amount Display */}
                <div className="flex items-center justify-between gap-4 mb-20 w-full">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <AssetIcon />
                    </div>
                    <div className="flex flex-row">
                        <span className="text-4xl font-semibold text-black">{amount}</span>
                        <Pencil className="w-4 h-4 mt-3 ml-2 text-gray-400" />
                    </div>

                    <ArrowUpDown className="w-4 h-4 text-gray-400 ml-4" />
                </div>

                <div className="mb-6">
                    <ChevronDown className="w-6 h-6 text-gray-300" />
                </div>

                {/* Recipient Pill */}
                <div className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2 mb-8">
                    <Wallet className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">{address.slice(0, 6)}...{address.slice(-4)}</span>
                </div>

                {/* Details Card */}
                <div className="w-full bg-[#F5F5F5] rounded-xl p-6 mb-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 italic">Sending to</span>
                        <span className="text-sm font-light text-black underline decoration-1 underline-offset-2">
                            {address.slice(0, 6)}..{address.slice(-4)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 italic">Network</span>
                        <span className="text-sm font-light text-black">{currentAsset.networkName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 italic">Date</span>
                        <span className="text-sm font-light text-black">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                {/* Button that LOOKS like Hold to Send, but acts like Normal Click */}
                <div className="w-full mt-6 mb-4">
                    <Button
                        disabled={isProcessing}
                        onClick={handleTransfer}
                        className="w-full h-14 bg-[#01C259] hover:bg-[#01b050] disabled:bg-gray-300 text-white text-lg font-medium rounded-xl shadow-none transition-colors"
                    >
                        {isProcessing ? "Processing..." : "Send"}
                    </Button>
                </div>

            </div>
        </div>
    );

    // --- Render: Step 4 (Success) ---
    const renderSuccessStep = () => (
        <div className="flex flex-col h-full items-center justify-center animate-in zoom-in-95 duration-300 pt-10">
            {/* Visual Header */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mb-8 absolute top-3" />

            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center animate-bounce">
                    <img src="/success.svg" className="w-20 h-20 text-white stroke-4" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-black mb-2">Successfully Sent!</h2>
            <p className="text-xs text-gray-400 mb-10 text-center px-8">
                You have successfully made a transfer.
            </p>

            <div className="w-full bg-[#F5F5F5] rounded-xl p-6 mb-auto space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 italic">Amount</span>
                    <span className="text-sm font-semibold text-black">{amount}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 italic">Sent to</span>
                    <span className="text-sm font-semibold text-black underline decoration-1 underline-offset-2">
                        {address.slice(0, 6)}..{address.slice(-4)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 italic">Network</span>
                    <span className="text-sm font-semibold text-black">{currentAsset.networkName}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 italic">Date</span>
                    <span className="text-sm font-semibold text-black">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div className="w-full mt-6">
                <Button
                    onClick={() => navigate('/driver')}
                    className="w-full h-14 bg-[#01C259] hover:bg-[#01b050] text-white text-lg font-medium rounded-xl shadow-none"
                >
                    Done
                </Button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 select-none">
            <div className="w-full h-[95vh] sm:h-auto sm:min-h-175 sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 flex flex-col shadow-2xl overflow-hidden relative">

                {/* Drag Handle */}
                {step !== 'success' && (
                    <div className="w-full flex justify-center mb-2 absolute top-6 left-0 right-0 z-10 pointer-events-none">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>
                )}

                <div className="mt-8 h-full flex flex-col">
                    {step === 'address' && renderAddressStep()}
                    {step === 'amount' && renderAmountStep()}
                    {step === 'confirm' && renderConfirmStep()}
                    {step === 'success' && renderSuccessStep()}
                </div>

            </div>
        </div>
    );
}