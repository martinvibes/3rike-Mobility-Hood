import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Lock, Eye } from "lucide-react";
import { useState } from "react";

export default function ChangePaymentPin() {
    const navigate = useNavigate();
    
    // PIN State
    const [pin, setPin] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const handlePinPress = (num: string) => {
        if (num === "x") {
            setPin(prev => prev.slice(0, -1));
        } else if (pin.length < 4) {
            setPin(prev => prev + num);
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex flex-col h-full">
            
            {/* --- Top Navigation (X Button) --- */}
            <div className="px-6 pt-12 pb-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-6 h-6 text-black" />
                </button>
            </div>

            {/* --- Main Content --- */}
            <div className="flex-1 flex flex-col px-6">
                
                {/* Header Section */}
                <div className="mb-10 mt-2">
                    <div className="flex items-center gap-4 mb-2">
                        {/* Lock Icon Circle */}
                        <div className="w-12 h-12 bg-[#E6F6E9] rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-[#01C259]" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-black tracking-tight">
                            Verify Payment Pin
                        </h1>
                    </div>
                </div>

                {/* Input Section */}
                <div className="mb-8">
                    <p className="text-gray-400 text-sm mb-4">Enter your 4-digit pin</p>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex gap-3">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all bg-[#EBEBEB]
                                        ${pin.length > i ? 'border-green-500' : 'border-transparent'}
                                    `}
                                >
                                    {pin.length > i && (
                                        isVisible ? (
                                            <span className="text-xl font-bold">{pin[i]}</span>
                                        ) : (
                                            <div className="w-3 h-3 bg-black rounded-full" />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Eye Toggle */}
                        <button 
                            onClick={() => setIsVisible(!isVisible)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            <Eye className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Confirm Button */}
                <Button 
                    className="w-full h-14 bg-[#01C259] hover:bg-[#65ad77] text-white text-lg font-medium rounded-xl shadow-none"
                    onClick={() => console.log("Confirmed PIN:", pin)}
                >
                    Confirm
                </Button>

            </div>

            {/* --- Custom Keypad --- */}
            <div className="bg-[#F9FAFB] p-2 pb-8 rounded-t-[32px] animate-in slide-in-from-bottom duration-300">
                {/* Keypad Header */}
                <div className="flex justify-between px-6 py-3 mb-1 text-[11px] font-semibold tracking-wide">
                    <span className="text-gray-500">3rike Secure Numeric Keypad</span>
                    <button className="text-[#01C259] hover:text-green-700">Done</button>
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-2 px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePinPress(num.toString())}
                            className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xl font-semibold text-black active:bg-gray-100 transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                    
                    {/* Empty Bottom Left */}
                    <div className="h-12"></div>
                    
                    {/* Zero Key */}
                    <button
                        onClick={() => handlePinPress("0")}
                        className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xl font-semibold text-black active:bg-gray-100 transition-colors"
                    >
                        0
                    </button>
                    
                    {/* Backspace / X Key */}
                    <button
                        onClick={() => handlePinPress("x")}
                        className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center active:bg-gray-100 transition-colors"
                    >
                        <span className="text-lg font-medium text-black">x</span>
                    </button>
                </div>
            </div>

        </div>
    );
}