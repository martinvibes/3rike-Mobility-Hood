import EmptyState from "@/components/emptyStateSavings";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SavingsTargetDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");

    // 1. New State to toggle between "List" and "Nothing to see"
    const [showData, _setShowData] = useState(true);

    // 1. UPDATED MOCK DATA (Added details for the Summary view)
    const completedTargets = [
        {
            id: 1,
            title: "Rent",
            saved: "700",
            total: "700",
            daysLeft: "0",
            // New fields for Summary:
            duration: "30 Day",
            withdrawalDate: "30th Jan 2025",
            interest: "8%",
            lockStatus: "Earn high interest"
        },
        {
            id: 2,
            title: "Car",
            saved: "2000",
            total: "2000",
            daysLeft: "0",
            // New fields for Summary:
            duration: "60 Day",
            withdrawalDate: "15th Mar 2025",
            interest: "12%",
            lockStatus: "Standard lock"
        }
    ];

    const handleCreateTarget = () => {
        navigate('/driver/savings/create-target');
    };

    const handleSummary = (targetData: any) => {
        // Pass the specific target object in the "state"
        navigate('/driver/savings/summary', { state: targetData });
    };


    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
                {/* --- Header --- */}
                <div className="relative flex items-center pt-10 p-6 bg-white z-10">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="absolute left-6 top-10 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 p-0 flex items-center justify-center"
                    >
                        <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                    </Button>
                    <p className="mx-auto font-medium text-lg pt-2">Target Savings</p>
                </div>

                {/* --- Scrollable Content --- */}
                <div className="px-6 space-y-6 flex-1 overflow-y-auto pb-32">

                    {/* Gray Placeholder Card */}
                    <div className={`relative w-full h-80 rounded-4xl bg-[#F3F5F9] mb-6`}>
                        <img
                            src="/graybackground.svg"
                            alt="image"
                            className="absolute pt-5 top-0 left-1/2 -translate-x-1/2"
                        />
                    </div>

                    {/* Info Box (Dashed Purple) */}
                    <div className="bg-[#F9F8FF] border border-dashed border-[#9747FF] rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="shrink-0">
                                <img src="/warning-purple.svg" alt="icon" className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-medium text-[#9747FF]">Save towards a goal</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="shrink-0">
                                <img src="/warning-purple.svg" alt="icon" className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-medium text-[#9747FF]">Auto Save or Manual save</h3>
                        </div>
                    </div>

                    {/* --- TABS --- */}
                    <div className="flex w-full border-b border-gray-100 mt-8">
                        <Button
                            variant="link"
                            onClick={() => setActiveTab("ongoing")}
                            className={`flex-1 pb-3 text-sm font-medium transition-all ${activeTab === "ongoing"
                                ? "border-b rounded-none border-[#22C55E] text-gray-900"
                                : "text-gray-400 border-transparent"
                                }`}
                        >
                            Ongoing target
                        </Button>
                        <Button
                            variant="link"
                            onClick={() => setActiveTab("completed")}
                            className={`flex-1 pb-3 text-sm font-medium transition-all ${activeTab === "completed"
                                ? "border-b rounded-none border-[#22C55E] text-gray-900"
                                : "text-gray-900 border-transparent"
                                }`}
                        >
                            Completed Target
                        </Button>
                    </div>

                    {/* --- TAB CONTENT --- */}
                    <div className="pt-2">

                        {/* 1. ONGOING TARGET */}
                        {activeTab === "ongoing" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {showData ? (
                                    // SHOW LIST
                                    completedTargets.map((target) => (
                                        <div key={target.id} className="relative bg-[#F9F8FF] border border-dashed border-[#9747FF] rounded-2xl p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white rounded-lg shadow-sm shrink-0"></div>
                                                <div className="flex-1 grid grid-cols-4 items-center text-center">
                                                    <div className="col-span-1 text-left">
                                                        <span className="text-[#9747FF] font-medium text-sm">{target.title}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#9747FF] font-medium text-sm">$ {target.saved}</span>
                                                        <span className="text-[#9747FF] text-[10px] opacity-70">Saved</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#9747FF] font-medium text-sm">$ {target.total}</span>
                                                        <span className="text-[#9747FF] text-[10px] opacity-70">Total Target</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#9747FF] font-medium text-sm">{target.daysLeft}</span>
                                                        <span className="text-[#9747FF] text-[10px] opacity-70">Days left</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon="/empty-purple.svg" // Use a neutral icon for empty states
                                        title="Nothing to See Here"
                                        description="We'll let you know when something comes up"
                                    />
                                )}
                            </div>
                        )}

                        {/* 2. COMPLETED TARGET */}
                        {activeTab === "completed" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {showData ? (
                                    // SHOW LIST
                                    completedTargets.map((target) => (
                                        <div key={target.id} onClick={() => handleSummary(target)} className="relative bg-[#F9F8FF] border border-dashed border-[#9747FF] rounded-2xl p-4">
                                            <div className="absolute -top-3 right-4 bg-[#E0F8E9] text-[#22C55E] text-[10px] px-3 py-1 rounded-full font-medium">
                                                Completed
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white rounded-lg shadow-sm shrink-0"></div>
                                                <div className="flex-1 grid grid-cols-4 items-center text-center">
                                                    <div className="col-span-1 text-left">
                                                        <span className="text-[#9747FF] font-medium text-sm">{target.title}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#9747FF] font-medium text-sm">$ {target.saved}</span>
                                                        <span className="text-[#9747FF] text-[10px] opacity-70">Saved</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#9747FF] font-medium text-sm">$ {target.total}</span>
                                                        <span className="text-[#9747FF] text-[10px] opacity-70">Total Target</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#9747FF] font-medium text-sm">{target.daysLeft}</span>
                                                        <span className="text-[#9747FF] text-[10px] opacity-70">Days left</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon="/empty-purple.svg" // Use a neutral icon for empty states
                                        title="Nothing to See Here"
                                        description="We'll let you know when something comes up"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Footer Button --- */}
                <div className="p-6 pb-10 bg-white absolute bottom-0 w-full">
                    <Button
                        onClick={handleCreateTarget}
                        className="w-full bg-[#22C55E] hover:bg-[#1da64d] text-white rounded-xl h-14 text-md font-normal shadow-none"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}