import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Changed to react-router-dom to match your dashboard

interface WithdrawOptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawOptions({ isOpen, onClose }: WithdrawOptionsProps) {
    const navigate = useNavigate();

    const handleBankClick = () => {
        navigate('/driver/withdraw');
    };
     const handleCryptoClick = () => {
        navigate('/driver/withdraw/crypto');
    };

    return (
        // FIXED: Added pointer-events logic here so it doesn't block the screen when closed
        <div 
            className={`fixed inset-0 z-999 flex items-end justify-center p-5 pb-8 transition-all duration-300 ${
                isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible delay-300"
            }`}
        >
            
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
                    relative w-full bg-white rounded-3xl p-6 pb-10 shadow-2xl 
                    transform transition-transform duration-300 ease-out z-10
                    ${isOpen ? "translate-y-0" : "translate-y-full"}
                `}
            >
                {/* Handle Bar */}
                <div className="mx-auto w-10 h-1.5 bg-gray-200 rounded-full mb-8" />

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    
                    {/* Icon Circle */}
                    <div className="w-20 h-20 rounded-full bg-[#F3F0FF] flex items-center justify-center mb-4">
                        <ArrowUpRight className="w-8 h-8 text-[#7C3AED]" strokeWidth={2.5} />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdraw</h2>
                    
                    {/* Subtitle */}
                    <p className="text-gray-400 text-sm font-normal max-w-xs leading-snug mb-8">
                        Choose a method below to send funds to your account.
                    </p>

                    {/* Options Buttons */}
                    <div className="w-full space-y-3">
                        
                        {/* To Bank */}
                        <Button
                            onClick={handleBankClick}
                            className="w-full h-14 bg-[#F3F4F6] active:bg-gray-200 transition-colors py-4 px-5 flex items-center justify-between rounded-xl"
                        >
                            <span className="text-base font-light text-gray-900">To bank</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Button>

                        {/* Crypto Wallet */}
                        <Button
                            onClick={handleCryptoClick}
                            className="w-full h-14 bg-[#F3F4F6] active:bg-gray-200 transition-colors py-4 px-5 flex items-center justify-between rounded-xl"
                        >
                            <span className="text-base font-light text-gray-900">Crypto wallet</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    );
}