import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Check,
    Ban,
    Award
} from "lucide-react";

export default function DriverNotification() {
    const navigate = useNavigate();

    // --- STATE ---
    const [hasNotifications, _setHasNotifications] = useState(true);
    // 1. New State for the active filter tab
    const [activeFilter, setActiveFilter] = useState("All");

    // --- MOCK DATA ---
    const notificationGroups = [
        {
            month: "Dec",
            items: [
                {
                    id: 1,
                    type: "success",
                    title: "Transfer to Mustapha obinna",
                    time: "Dec 1st, 7:47:44",
                    amount: "Ghs 30",
                    status: "Successful"
                },
                {
                    id: 2,
                    type: "success",
                    title: "Transfer to Henry Grace M..",
                    time: "Dec 1st 09:47:44",
                    amount: "Ghs 30",
                    status: "Successful"
                },
                {
                    id: 3,
                    type: "reversed",
                    title: "Transfer to Nwakaego ndukwe",
                    time: "Dec 5th 09:47:44",
                    amount: "Ghs 30",
                    status: "Reversed"
                },
                {
                    id: 4,
                    type: "reversed",
                    title: "Transfer from Lomax okore",
                    time: "Dec 5th 09:47:44",
                    amount: "Ghs 30",
                    status: "Reversed"
                }
            ]
        },
        {
            month: "Nov",
            items: [
                {
                    id: 5,
                    type: "reversed",
                    title: "Sorry 3riker",
                    time: "Dec 5th 09:47:44",
                    amount: "Ghs 30",
                    status: "Reversed"
                },
                {
                    id: 6,
                    type: "award",
                    title: "Congratulation 3riker",
                    time: "Dec 1st, 7:47:44",
                    amount: "3rike",
                    status: "Successful"
                }
            ]
        }
    ];

    // --- FILTER LOGIC ---
    // 2. Filter the groups based on activeFilter
    const filteredGroups = notificationGroups.map(group => {
        // If "All", return everything, otherwise match the item status
        const filteredItems = activeFilter === "All"
            ? group.items
            : group.items.filter(item => item.status === activeFilter);
        
        return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0); // Remove months that have no items left

    // --- RENDER HELPERS ---

    const renderIcon = (type: string) => {
        switch (type) {
            case "success":
                return (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                        <Check size={20} strokeWidth={3} />
                    </div>
                );
            case "reversed":
                return (
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <Ban size={20} strokeWidth={2.5} className="rotate-90" />
                    </div>
                );
            case "award":
                return (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Award size={20} strokeWidth={2.5} />
                    </div>
                );
            default:
                return <div className="w-10 h-10 rounded-full bg-gray-100" />;
        }
    };

    const getStatusColor = (status: string) => {
        if (status === "Successful") return "text-green-500";
        if (status === "Reversed") return "text-orange-400";
        return "text-gray-500";
    };

    // Helper to switch button styles based on selection
    const getTabStyle = (tabName: string) => {
        const isActive = activeFilter === tabName;
        return `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            isActive 
            ? "bg-green-100 text-green-600" 
            : "bg-white border border-gray-100 text-gray-400 shadow-xs hover:bg-gray-50"
        }`;
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
                    <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                </Button>

                <h1 className="font-semibold text-sm text-black">
                    Notification
                </h1>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className={`flex-1 flex flex-col ${hasNotifications ? 'items-start justify-start' : 'items-center justify-center'} px-4 pb-10 w-full max-w-md mx-auto`}>

                {!hasNotifications ? (
                    <div className="flex flex-col items-center justify-center -mt-20">
                        <div className="relative mb-6">
                            <img src="/empty.svg" alt="empty" className="w-18 h-18" />
                        </div>
                        <h2 className="text-xl font-medium text-black mb-3 text-center">
                            Nothing to See Here
                        </h2>
                        <p className="text-gray-400 text-sm font-normal text-center leading-relaxed max-w-xs">
                            We'll let you know when something comes up.
                        </p>
                    </div>
                ) : (
                    <div className="w-full">

                        {/* 3. Filter Tabs (Now Interactive) */}
                        <div className="flex items-center gap-2 mb-6 py-2 overflow-x-auto scrollbar-hide">
                            <button 
                                onClick={() => setActiveFilter("All")}
                                className={getTabStyle("All")}
                            >
                                All Status
                            </button>
                            <button 
                                onClick={() => setActiveFilter("Successful")}
                                className={getTabStyle("Successful")}
                            >
                                Successful
                            </button>
                            <button 
                                onClick={() => setActiveFilter("Pending")}
                                className={getTabStyle("Pending")}
                            >
                                Pending
                            </button>
                            <button 
                                onClick={() => setActiveFilter("Reversed")}
                                className={getTabStyle("Reversed")}
                            >
                                Reversed
                            </button>
                        </div>

                        {/* Grouped Lists (Using filteredGroups instead of notificationGroups) */}
                        <div className="space-y-6">
                            {filteredGroups.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    No notifications found for this filter.
                                </div>
                            ) : (
                                filteredGroups.map((group) => (
                                    <div key={group.month}>
                                        {/* Month Header */}
                                        <div className="flex items-center gap-2 mb-4 pl-1">
                                            <h3 className="text-black font-medium text-base">{group.month}</h3>
                                            <ChevronDown size={16} className="text-black" strokeWidth={3} />
                                        </div>

                                        {/* Cards Stack */}
                                        <div className="space-y-3">
                                            {group.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-white p-4 rounded-xl shadow-s border border-gray-50 flex items-start justify-between"
                                                >
                                                    {/* Left Side: Icon + Title/Date */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="shrink-0">
                                                            {renderIcon(item.type)}
                                                        </div>

                                                        <div className="flex flex-col gap-1">
                                                            <h4 className="font-medium text-sm text-gray-900 leading-tight">
                                                                {item.title}
                                                            </h4>
                                                            <span className="text-xs text-gray-400 font-medium">
                                                                {item.time}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right Side: Amount + Status */}
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-gray-500 font-medium text-xs">
                                                            {item.amount}
                                                        </span>
                                                        <span className={`text-[10px] font-medium ${getStatusColor(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}