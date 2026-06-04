import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import MobileFrame from "@/components/ui/mobile-frame";
import Avatar from "@/components/ui/avatar";

export default function SettingsProfile() {
    const navigate = useNavigate();
    const { user, driver } = useAuth();
    const [copied, setCopied] = useState(false);

    const fullName = driver?.full_name || user?.email?.split("@")[0] || "—";
    const firstName = fullName.split(" ")[0];
    const phone = driver?.phone || "—";
    const country = driver?.country || "—";
    const walletPartyId = user?.canton_party_id ?? "";
    const walletShort = walletPartyId
        ? `${walletPartyId.slice(0, 8)}…${walletPartyId.slice(-6)}`
        : "Not yet linked";

    const handleCopy = async () => {
        if (!walletPartyId) return;
        try {
            await navigator.clipboard.writeText(walletPartyId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    return (
        <MobileFrame innerBg="bg-[#F8FAFC]" innerClassName="flex flex-col">

            {/* --- Header --- */}
            <div className="relative flex items-center justify-center pt-12 pb-6 px-6 bg-[#F8FAFC]">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="absolute left-6 w-10 h-10 rounded-full bg-[#F3F8F5] hover:bg-green-50 text-[#01C259] transition-colors cursor-pointer"
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
                    <Avatar name={fullName} size={72} />
                    <h2 className="text-gray-500 font-medium text-base">{firstName}</h2>
                </div>

                {/* Wallet Address Card — clickable when not linked, takes user to wallet page */}
                <div
                    onClick={() => !walletPartyId && navigate("/driver/wallet")}
                    className={`w-full bg-white rounded-xl p-4 flex items-center justify-between ${
                        !walletPartyId ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
                    }`}
                >
                    <span className="text-gray-900 font-medium text-sm">Canton Wallet</span>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm truncate max-w-40 font-mono text-[11px]">
                            {walletShort}
                        </span>
                        {walletPartyId ? (
                            <button
                                onClick={handleCopy}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                aria-label="Copy party ID"
                            >
                                {copied ? <Check className="w-5 h-5 text-[#01C259]" /> : <Copy className="w-5 h-5" />}
                            </button>
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>

                {/* Personal Details Card */}
                <div className="w-full bg-white rounded-xl overflow-hidden">

                    {/* Full Name */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                        <span className="text-gray-900 font-medium text-sm">Full Name</span>
                        <span className="text-gray-400 text-sm">{fullName}</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                        <span className="text-gray-900 font-medium text-sm">Email</span>
                        <span className="text-gray-400 text-sm truncate max-w-40">{user?.email ?? "—"}</span>
                    </div>

                    {/* Mobile Number */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                        <span className="text-gray-900 font-medium text-sm">Mobile Number</span>
                        <span className="text-gray-400 text-sm">{phone}</span>
                    </div>

                    {/* Country */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                        <span className="text-gray-900 font-medium text-sm">Country</span>
                        <span className="text-gray-400 text-sm">{country}</span>
                    </div>

                    {/* Address (Clickable, future) */}
                    <div
                        onClick={() => {/* Handle address edit/view */ }}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-gray-900 font-medium text-sm">Address</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                </div>

            </div>
        </MobileFrame>
    );
}
