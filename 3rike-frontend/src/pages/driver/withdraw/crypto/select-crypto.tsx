import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SelectCryptoAsset() {
    const navigate = useNavigate();

    const handleSelect = (chain: 'solana' | 'evm') => {
        // Navigate to the withdraw screen, passing the selected chain in state
        navigate('/driver/withdraw/crypto-withdraw', { state: { chain } });
    };

    // Reusable component for the chain options
    const ChainOption = ({ label, onClick }: { label: string, onClick: () => void }) => (
        <div 
            onClick={onClick}
            className="w-full bg-[#F3F4F6] p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors mb-3"
        >
            <span className="text-black font-light text-sm">{label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-end sm:items-center justify-center  z-50">
            
            {/* Main Card Container */}
            <div className="w-full h-[85vh] sm:h-auto sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                
                {/* Drag Handle */}
                <div className="w-full flex justify-center mb-8">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                {/* Header Content */}
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-black mb-2">
                        Select Asset
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Choose which asset you want to send
                    </p>
                </div>

                {/* Options List */}
                <div className="flex-1">
                    <ChainOption 
                        label="Solana chain" 
                        onClick={() => handleSelect('solana')} 
                    />
                    <ChainOption 
                        label="EVM Chain" 
                        onClick={() => handleSelect('evm')} 
                    />
                </div>
                
                {/* Cancel Button */}
                <div className="mt-auto pt-10 flex justify-center">
                    <Button 
                        variant="ghost" 
                        className="text-gray-400 font-normal hover:bg-transparent hover:text-gray-600"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </div>

            </div>
        </div>
    );
}