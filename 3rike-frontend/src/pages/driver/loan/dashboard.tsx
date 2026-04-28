import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Updated Schema to handle amount as a number string and duration
const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Please enter a valid amount",
    }),
    duration: z.enum(["7", "14", "30"], {
        message: "Please select a duration",
    }),
});

export default function LoanDashboard() {
    const navigate = useNavigate();
    const [changeCurrency, setChangeCurrency] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            amount: "",
            duration: "14", // Default to 30 as per image design
        },
    });

    const formatWithCommas = (value: string | number | undefined) => {
        if (!value) return "";
        return Number(value).toLocaleString();
    };


    // Watch the amount to dynamically update the summary
    const amountValue = form.watch("amount");
    const durationValue = form.watch("duration");

    // Dynamic Calculations
    const principal = Number(amountValue) || 0;
    const interestRate = 0.05; // 5% as per image
    const processingFeeRate = 0.0015; // Small fee ~0.15%

    const interest = principal * interestRate;
    const processingFee = principal > 0 ? Math.ceil(principal * processingFeeRate) + 20 : 0; // minimal base fee
    const totalPayback = principal + interest + processingFee;

    const currencySymbol = changeCurrency ? "$" : "₵";

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Submitted Data:", {
            ...data,
            interest,
            processingFee,
            totalPayback
        });

        // 1. Calculate the specific due date based on the duration selected
        const date = new Date();
        date.setDate(date.getDate() + Number(durationValue));
        const formattedDueDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // 2. Pass all calculated data in the state object
        navigate('/driver/loan/submitted', {
            state: {
                principal,
                interest,
                processingFee,
                totalPayback,
                currencySymbol,
                dueDate: formattedDueDate
            }
        });
    };

    // Duration Options Configuration
    const durations = [
        { label: "7 Days", sub: "Weekly", val: "7" },
        { label: "14 Days", sub: "Bi-Weekly", val: "14" },
        { label: "30 Days", sub: "Monthly", val: "30" },
    ];

    const goToNotification = () => {
        navigate("/driver/loan/notification");
    };


    return (
        <div className="min-h-screen bg-white flex justify-center">
            {/* Mobile Frame Container */}
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative pb-10">

                {/* Header */}
                <div className="pt-10 px-5 p-6">
                    <div className="flex items-center justify-between w-full">

                        {/* Back button (left) */}
                        <Button
                            variant="link"
                            onClick={() => navigate(-1)}
                            className="p-0"
                        >
                            <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                        </Button>

                        {/* Centered title */}
                        <p className="font-medium text-xl text-center">
                            Loan
                        </p>

                        {/* Right placeholder / action */}
                        <Button
                            variant="link"
                            onClick={goToNotification}
                            className="p-0"
                        >
                            <img src="/notification.svg" alt="Back" className="w-10 h-10" />
                        </Button>

                    </div>
                </div>


                {/* Main Content Scroll Area */}
                <div className="px-5 space-y-4">

                    {/* 1. GREEN BALANCE CARD */}
                    <div className="relative w-full h-40 rounded-3xl p-6 text-white overflow-hidden">
                        {/* Background Gradient & Blobs */}
                        <img
                            src="/earnings-banner.svg"
                            alt="Card Background"
                            className="absolute inset-0 w-full h-full bg-[#00C258] object-cover z-0"
                        />

                        {/* --- Main Content --- */}
                        <div className="relative z-10 flex h-full flex-col items-center justify-center">

                            {/* Label */}
                            <div className="mb-1 flex items-center">
                                <span className="text-sm font-light tracking-wide text-green-50">
                                    Maximum Eligible Limit
                                </span>
                            </div>

                            {/* Amount & Switch Container */}
                            <div className="relative flex w-full items-center justify-center">

                                {/* Amount Text */}
                                <h1 className="text-4xl font-bold ">
                                    {changeCurrency ? "$ 1,500.00" : "₵ 16,000.00"}
                                </h1>

                                {/* Custom Toggle Switch - Positioned Absolute Right */}
                                <div className="absolute -right-2 flex items-center">
                                    <Switch
                                        checked={changeCurrency}
                                        onCheckedChange={setChangeCurrency}
                                        // -rotate-90 makes it vertical. 
                                        // bg-green-900/20 matches the dark track in the image.
                                        className="h-6 w-11 -rotate-90 border-8 border-transparent data-[state=checked]:bg-green-900/20 data-[state=unchecked]:bg-green-900/20"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* FORM AREA */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Input Amount */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-1 focus-within:ring-green-500 transition-all">
                                                <label className="text-xs text-gray-400 font-medium ml-1">Enter amount</label>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        inputMode="numeric"   // mobile numeric keypad
                                                        pattern="[0-9,]*"
                                                        className="border-none shadow-none bg-transparent h-6 text-xl font-sm text-gray-800 placeholder:text-gray-300 focus-visible:ring-0 px-1"
                                                        value={formatWithCommas(field.value)}
                                                        onChange={(e) => {
                                                            const raw = e.target.value.replace(/,/g, "");
                                                            if (!isNaN(Number(raw))) {
                                                                field.onChange(raw);
                                                            }
                                                        }}
                                                    />

                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Duration Selector */}
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        {/* Added pt-3 to give space for the pill popping up */}
                                        <div className="grid grid-cols-3 gap-3 pt-3">
                                            {durations.map((item) => {
                                                const isSelected = field.value === item.val;
                                                // Check if this is the 14-day option
                                                const isPopular = item.val === "14";

                                                return (
                                                    <div
                                                        key={item.val}
                                                        onClick={() => field.onChange(item.val)}
                                                        className={`
                                relative cursor-pointer rounded-xl py-4 flex flex-col items-center justify-center transition-all border
                                ${isSelected
                                                                ? "bg-[#FDF5EA] border-[#EE9C2E] border-dashed border shadow-sm"
                                                                : "bg-gray-50 border-transparent text-gray-500"}
                            `}
                                                    >
                                                        {/* --- THE POPULAR PILL --- */}
                                                        {isPopular && (
                                                            <div className={`
                                    absolute -top-3 px-3 py-0.5 h-7 flex items-center rounded-full text-[10px] font-light shadow-sm transition-all
                                    ${isSelected
                                                                    ? "bg-[#EE9C2E] text-white"      // Color when 14 is selected
                                                                    : "bg-[#D5D5D5] text-white"    // Color when 14 is NOT selected
                                                                }
                                `}>
                                                                Popular
                                                            </div>
                                                        )}

                                                        <span className={`text-sm font-bold ${isSelected ? "text-[#EE9C2E]" : "text-gray-900"}`}>
                                                            {item.label}
                                                        </span>
                                                        <span className={`text-[10px] ${isSelected ? "text-gray-400" : "text-gray-400"}`}>
                                                            {item.sub}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Loan Summary Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="/loan_summary.svg" alt="Back" className="w-5 h-5" />
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
                                        Due date: 20th October 2025
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-[#01C259] hover:bg-[#019f4a] text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-green-100 transition-all mt-4"
                            >
                                Submit Request
                            </Button>

                        </form>
                    </Form>

                </div>
            </div>
        </div>
    );
}