import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Info,
} from "lucide-react";

export default function SavingsNotification() {
    const navigate = useNavigate();

    // --- TOGGLE STATE FOR DEVELOPMENT ---
    // Change this to false to see your original "Empty" state
    const [hasNotifications, _setHasNotifications] = useState(true);

    // --- MOCK DATA BASED ON YOUR IMAGE ---
    const notificationGroups = [
        {
            month: "Dec",
            items: [
                {
                    id: 1,
                    type: "success",
                    title: "Transaction successful",
                    desc: "You have successfully contributed $20 to your target balance.",
                    time: "3 minutes ago",
                },
                {
                    id: 2,
                    type: "success",
                    title: "Transaction successful",
                    desc: "You have successfully contributed $20 to your target balance.",
                    time: "2hrs ago",
                },
                {
                    id: 3,
                    type: "success",
                    title: "Transaction successful",
                    desc: "You have successfully contributed $20 to your target balance.",
                    time: "6hrs ago",
                }
            ]
        },
        {
            month: "Nov",
            items: [
                {
                    id: 4,
                    type: "neutral", // Using neutral style but with custom icon logic
                    iconType: "promo",
                    title: "Hurray! you're eligible",
                    desc: "You're eligible to borrow up to $1,500. View full details.",
                    time: "1 month ago",
                }
            ]
        }
    ];

    // Helper to get styles based on notification type
    const getCardStyle = (type: string) => {
        switch (type) {
            case "success":
                return "bg-white border-none ";
            case "error":
                return "bg-[#FFE9E9]";
            default:
                return "bg-white border-none";
        }
    };

    // Helper to render the specific icon based on type/content
    const renderIcon = (item: {
        id: number;
        type: string;
        title: string;
        desc: string;
        time: string;
        iconType?: string; // ✅ Make it optional on all items
    }) => {
        if (item.type === "success") {
            return (
                <img src="/green-check.svg" alt="Back" className="w-10 h-10" />
            );
        }
        if (item.type === "error") {
            return (
                <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-600">
                    <Info size={20} strokeWidth={2.5} />
                </div>
            );
        }
        if (item.iconType === "promo") {
            return (
                <img src="/innocent.svg" alt="Back" className="w-10 h-10" />
            );
        }
        // Default Neutral
        return (
            <img src="/sparkles.svg" alt="Back" className="w-10 h-10" />
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">

            {/* --- HEADER SECTION --- */}
            <div className="relative flex items-center justify-center px-6 py-6 w-full pt-10 bg-white">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="absolute left-6 p-0 w-10 h-10 rounded-full hover:bg-transparent"
                >
                    {/* Using a placeholder SVG or Icon here if image missing */}
                    <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                </Button>

                <h1 className="text-lg font-semibold text-black">
                    Target Savings
                </h1>
            </div>

            {/* --- MAIN CONTENT SECTION --- */}
            <div className={`flex-1 flex flex-col ${hasNotifications ? 'items-start justify-start' : 'items-center justify-center'} px-4 pb-10 w-full max-w-md mx-auto`}>

                {!hasNotifications ? (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center -mt-20">
                        <div className="relative mb-6">
                            <img src="/empty.svg" alt="empty" className="w-18 h-18" />
                        </div>
                        <h2 className="text-xl font-bold text-black mb-3 text-center">
                            Nothing to See Here
                        </h2>
                        <p className="text-gray-400 text-sm font-normal text-center leading-relaxed max-w-xs">
                            We'll let you know when something comes up.
                        </p>
                    </div>
                ) : (
                    /* LIST STATE (New Design) */
                    <div className="w-full mt-4 space-y-6">
                        {notificationGroups.map((group) => (
                            <div key={group.month}>
                                {/* Month Header */}
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-black font-bold text-lg">{group.month}</h3>
                                    <ChevronDown size={18} className="text-black" />
                                </div>

                                {/* Cards Stack */}
                                <div className="space-y-3">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-4 rounded-2xl border ${getCardStyle(item.type)} flex items-start gap-3`}
                                        >
                                            {/* Icon */}
                                            <div className="shrink-0">
                                                {renderIcon(item)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`font-semibold text-sm mb-1 ${item.type === 'error' ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                        {item.time}
                                                    </span>
                                                </div>
                                                <p className={`text-xs leading-relaxed ${item.type === 'error' ? 'text-red-400' : 'text-gray-500'}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}