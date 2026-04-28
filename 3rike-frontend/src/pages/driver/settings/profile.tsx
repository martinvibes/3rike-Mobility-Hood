import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, ChevronRight } from "lucide-react";

export default function SettingsProfile() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

            {/* --- Header --- */}
            {/* Sticky header to ensure navigation is always accessible */}
            <div className="relative flex items-center justify-center pt-12 pb-6 px-6 bg-[#F8FAFC]">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="absolute left-6 w-10 h-10 rounded-full bg-[#F3F8F5] hover:bg-green-50 text-[#01C259] transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>

                <h1 className="font-semibold text-lg text-black">
                    My Profile
                </h1>
            </div>

            {/* --- Main Content --- */}
            <div className="flex-1 px-6 pb-10 flex flex-col items-center gap-8">

                {/* Profile Picture & Name */}
                <div className="flex flex-col items-center gap-3 mt-4">
                    <div className="w-15 h-15 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                        <img className="w-15 h-15" src="/profile.png" alt="User" />
                    </div>
                    <h2 className="text-gray-500 font-medium text-base">Effiong</h2>
                </div>

                {/* Wallet Address Card */}
                <div className="w-full bg-white rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gray-900 font-medium text-sm">3rike Wallet Address</span>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">0xbbcvvcvcvvc</span>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Personal Details Card */}
                <div className="w-full bg-white rounded-xl overflow-hidden">

                    {/* Full Name Row */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                        <span className="text-gray-900 font-medium text-sm">Full Name</span>
                        <span className="text-gray-400 text-sm">Effiong Musa</span>
                    </div>

                    {/* Mobile Number Row */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                        <span className="text-gray-900 font-medium text-sm">Mobile Number</span>
                        <span className="text-gray-400 text-sm">02028287</span>
                    </div>

                    {/* Address Row (Clickable) */}
                    <div
                        onClick={() => {/* Handle address edit/view */ }}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-gray-900 font-medium text-sm">Address</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                </div>

            </div>
        </div>
    );
}