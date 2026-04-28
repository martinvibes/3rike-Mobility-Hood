import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoanState {
    principal: number;
    interest: number;
    processingFee: number;
    totalPayback: number;
    currencySymbol: string;
    dueDate: string;
}

export default function LoanRequestSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve data from state, with fallbacks in case user navigates directly here
    const { 
        principal = 0, 
        interest = 0, 
        processingFee = 0, 
        totalPayback = 0, 
        currencySymbol = "$",
        dueDate = "N/A"
    } = (location.state as LoanState) || {};

    const goToDashboard = () => {
        navigate("/driver");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-500">

                {/* --- SUCCESS BADGE ICON --- */}
                <div className="relative mb-8">
                    <img src="/success.svg" alt="success" className="w-18 h-18" />
                </div>

                {/* --- TEXT CONTENT --- */}
                <h1 className="text-2xl font-extrabold text-black mb-3">
                    Successfully Sent!
                </h1>

                <p className="text-gray-500 leading-relaxed max-w-xs mb-8">
                    You have successfully applied for a 
                    <span className="font-bold text-gray-800"> {currencySymbol} {principal.toLocaleString()} </span> 
                    Loan. Please check your wallet balance!
                </p>

                {/* Loan Summary Card */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100/50 w-full shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <img src="/loan_summary.svg" alt="Icon" className="w-5 h-5" />
                        <h3 className="font-bold text-gray-900 text-sm">Loan Summary</h3>
                    </div>

                    {/* Breakdown Rows */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#909090] italic font-light">Principal Amount</span>
                            <span className="font-medium text-gray-700">
                                {currencySymbol} {principal.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#909090] italic font-light">Interest (5%)</span>
                            <span className="font-medium text-gray-700">
                                {currencySymbol} {interest.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#909090] italic font-light">Processing Fee</span>
                            <span className="font-medium text-gray-700">
                                {currencySymbol} {processingFee.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 my-2" />

                    {/* Total Row */}
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-sm">Total Pay-back</span>
                        <span className="font-bold text-[#00C258] text-lg">
                            {currencySymbol} {totalPayback.toLocaleString()}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-[10px] text-[#C8C8C8] flex justify-end items-center gap-1">
                            Due date: {dueDate}
                        </span>
                    </div>
                </div>

                {/* Dashboard Button */}
                <div className="mt-12 w-full">
                    <Button
                        onClick={goToDashboard}
                        className="w-full bg-[#01C259] hover:bg-[#00a049] h-14 rounded-xl text-lg font-light shadow-lg shadow-green-100"
                    >
                        Go to Dashboard
                    </Button>
                </div>

            </div>
        </div>
    );
}