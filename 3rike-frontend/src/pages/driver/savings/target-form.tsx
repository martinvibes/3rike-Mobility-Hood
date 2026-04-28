import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import React from "react";

// --- VALIDATION SCHEMAS ---
const formSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
    targetAmount: z.string().min(1, "Target Amount is required"),
    startDate: z.date(),
    endDate: z.date(),
    duration: z.string().min(1, "Frequency is required"),
    durationDay: z.string().min(1, "Preferred day is required"),
    saveAmount: z.string().min(1, "Daily save amount is required"),
    savingsMode: z.enum(["automatic", "manual"], {
        message: "Please select a savings mode",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SavingsTargetForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            reason: "",
            targetAmount: "",
            duration: "",
            durationDay: "",
            saveAmount: "",
            savingsMode: undefined,
        },
    });

    const watchedAmount = form.watch("saveAmount");
    const watchedFrequency = form.watch("duration");
    const watchedDay = form.watch("durationDay");

    // --- HELPER FOR CURRENCY FORMATTING ---
    // Adds commas to number strings (e.g., "1000" -> "1,000")
    const formatCurrencyInput = (value: string) => {
        if (!value) return "";
        // Remove existing commas to get raw number
        const raw = value.replace(/,/g, "");
        if (isNaN(Number(raw))) return value;
        // Add commas back
        return Number(raw).toLocaleString("en-US");
    };

    // Handles the input change: strips commas for state, formats for display
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const rawValue = e.target.value.replace(/,/g, "");
        // Only allow numbers and one decimal point
        if (!isNaN(Number(rawValue))) {
            onChange(rawValue);
        }
    };

    // --- HANDLERS ---
    const handleNextStep = async () => {
        let fieldsToValidate: (keyof FormValues)[] = [];
        if (currentStep === 1) {
            fieldsToValidate = ['reason', 'targetAmount', 'startDate', 'endDate', 'duration', 'durationDay', 'saveAmount'];
        }
        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo(0, 0);
        } else {
            navigate(-1);
        }
    };

    const handleSuccess = () => {
        navigate('/driver/savings/success');
    };

    const handleTargetSavings = () => {
        navigate('/driver/savings/target')
    };


    const delay = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        console.log("Final Goal Data:", data);

        // 1. Show success
        handleSuccess();

        // 2. Wait 2 seconds
        await delay(2000);

        // 3. Then show target savings
        handleTargetSavings();

        // 4. Stop loading
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white flex justify-center py-10 px-4">
            <div className="w-full max-w-md bg-white p-3 min-h-[80vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="icon" onClick={handlePrevStep} className="bg-gray-100 rounded-full hover:bg-gray-200 w-10 h-10" type="button">
                        <img src="/rounded-back.svg" alt="Arrow" className="w-10 h-10" />
                    </Button>
                    <h1 className="font-medium text-lg text-gray-900">Target Savings</h1>
                    <span className="text-gray-900 font-medium text-sm">{currentStep}/2</span>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-5">

                        {/* --- STEP 1 --- */}
                        {currentStep === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="space-y-1">
                                    <h1 className="font-medium text-xl text-gray-800">Create a target</h1>
                                    <p className="text-[#959595] font-normal text-sm">Save towards your next emergency funds.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Reason Input */}
                                    <div className="space-y-1">
                                        <FormLabel className="text-gray-500 font-normal ml-1 text-xs">What are you saving for</FormLabel>
                                        <FormField
                                            control={form.control}
                                            name="reason"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input {...field} placeholder="eg car, 3rike part, rent" className="h-12 rounded-xl border-gray-200 bg-gray-50/50" />
                                                            <img src="/pencil.svg" className="w-4 h-4 absolute right-4 top-4 opacity-40" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Target Amount Input (Formatted) */}
                                    <div className="space-y-1">
                                        <FormLabel className="text-gray-500 font-normal ml-1 text-xs">Target Amount</FormLabel>
                                        <FormField
                                            control={form.control}
                                            name="targetAmount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            {/* Currency Symbol Prefix */}
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>

                                                            <Input
                                                                {...field}
                                                                value={formatCurrencyInput(field.value)}
                                                                onChange={(e) => handleAmountChange(e, field.onChange)}
                                                                placeholder="0.00"
                                                                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-8"
                                                            />
                                                            <img src="/pencil.svg" className="w-4 h-4 absolute right-4 top-4 opacity-40" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Dates */}
                                    <div className="flex gap-4">
                                        <div className="space-y-1 w-1/2">
                                            <FormLabel className="text-gray-500 font-normal ml-1 text-xs">Start Date</FormLabel>
                                            <FormField
                                                control={form.control}
                                                name="startDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Popover open={openStart} onOpenChange={setOpenStart}>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 bg-gray-50/50 justify-between font-light text-gray-900">
                                                                        {field.value ? new Date(field.value).toLocaleDateString() : "mm/dd/yyyy"}
                                                                        <CalendarIcon className="w-4 h-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar mode="single" selected={field.value} onSelect={(d) => { field.onChange(d); setOpenStart(false); }} disabled={(date) => date < new Date("1900-01-01")} initialFocus />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-1 w-1/2">
                                            <FormLabel className="text-gray-500 font-normal ml-1 text-xs">End Date</FormLabel>
                                            <FormField
                                                control={form.control}
                                                name="endDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Popover open={openEnd} onOpenChange={setOpenEnd}>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 bg-gray-50/50 justify-between font-light text-gray-900">
                                                                        {field.value ? new Date(field.value).toLocaleDateString() : "mm/dd/yyyy"}
                                                                        <CalendarIcon className="w-4 h-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar mode="single" selected={field.value} onSelect={(d) => { field.onChange(d); setOpenEnd(false); }} disabled={(date) => date < new Date("1900-01-01")} initialFocus />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Selects */}
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <FormLabel className="text-gray-500 font-normal ml-1 text-xs">How do you want to save</FormLabel>
                                            <FormField
                                                control={form.control}
                                                name="duration"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-900">
                                                                    <SelectValue placeholder="Saving Frequency" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                                <SelectItem value="Daily">Daily</SelectItem>
                                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="durationDay"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-gray-50/50 text-gray-900">
                                                                <SelectValue placeholder="Preferred Day" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Monday">Monday</SelectItem>
                                                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                                                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                                                            <SelectItem value="Thursday">Thursday</SelectItem>
                                                            <SelectItem value="Friday">Friday</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Save Amount Input (Formatted) */}
                                        <div className="space-y-1">
                                            <FormLabel className="text-gray-500 font-normal ml-1 text-xs">Amount to save</FormLabel>
                                            <FormField
                                                control={form.control}
                                                name="saveAmount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative">
                                                                {/* Currency Symbol Prefix */}
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>

                                                                <Input
                                                                    {...field}
                                                                    value={formatCurrencyInput(field.value)}
                                                                    onChange={(e) => handleAmountChange(e, field.onChange)}
                                                                    placeholder="0.00"
                                                                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-8"
                                                                />
                                                                <img src="/pencil.svg" className="w-4 h-4 absolute right-4 top-4 opacity-40" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 2 --- */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-medium text-gray-900">Mode of savings</h2>
                                    <p className="text-sm text-gray-300 font-light">how do you plan to save</p>
                                </div>

                                <div className="space-y-4 ">
                                    <p className="text-gray-400 text-xs font-normal ml-1">How do you want to contribute ?</p>
                                    <FormField
                                        control={form.control}
                                        name="savingsMode"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                {/* Automatically */}
                                                <div>
                                                    <div onClick={() => field.onChange("automatic")} className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer h-14 transition-colors ${field.value === "automatic" ? "bg-[#E8ECE9] border border-gray-300" : "bg-[#E8ECE9] border border-transparent"}`}>
                                                        <span className="text-sm text-gray-900 font-normal">Automatically</span>
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center bg-white ${field.value === "automatic" ? "border-green-500" : "border-gray-500"}`}>
                                                            {field.value === "automatic" && <div className="w-3 h-3 bg-[#01C259] rounded-full" />}
                                                        </div>
                                                    </div>
                                                    {field.value === "automatic" && (
                                                        <div className="mt-3 bg-[#F0F5FF] border border-dashed border-[#4485FD] rounded-xl p-4 flex items-start gap-3">
                                                            {/* Icon */}
                                                            <div className="shrink-0">
                                                                <img src="/warning-blue.svg" alt="warning-blue" className="w-5 h-5 object-cover" />
                                                            </div>
                                                            <p className="text-xs text-[#1969FE] leading-relaxed">
                                                                You will be debited <span className="font-semibold">${formatCurrencyInput(watchedAmount) || "0.00"}</span> {watchedFrequency?.toLowerCase() || "daily"} every {watchedDay || "Monday"} of the week
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Manually */}
                                                <div>
                                                    <div onClick={() => field.onChange("manual")} className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer h-14 transition-colors ${field.value === "manual" ? "bg-[#E8ECE9] border border-gray-300" : "bg-[#E8ECE9] border border-transparent"}`}>
                                                        <span className="text-sm text-gray-900 font-normal">Manually</span>
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center bg-white ${field.value === "manual" ? "border-green-500" : "border-gray-500"}`}>
                                                            {field.value === "manual" && <div className="w-3 h-3 bg-[#01C259] rounded-full" />}
                                                        </div>
                                                    </div>
                                                    {field.value === "manual" && (
                                                        <div className="mt-3 bg-[#F0F5FF] border border-dashed border-[#1969FE] rounded-xl p-4 flex items-start gap-3">
                                                            {/* Icon */}
                                                            <div className="shrink-0">
                                                                <img src="/warning-blue.svg" alt="warning-blue" className="w-5 h-5 object-cover" />
                                                            </div>
                                                            <p className="text-xs text-[#1969FE] leading-relaxed">
                                                                A reminder will be sent to you to contribute to your savings plan every {watchedDay || "Monday"} of the week
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Footer Button */}
                        <div className="mt-auto pt-6 pb-6">
                            {currentStep === 1 ? (
                                <Button type="button" onClick={handleNextStep} className="w-full h-14 bg-[#01C259] hover:bg-[#65b983] text-white rounded-xl text-lg font-normal shadow-none">Next</Button>
                            ) : (
                                <div className="flex justify-end w-full">
                                    <Button type="submit" disabled={loading} className="w-full h-14 bg-[#01C259] hover:bg-[#65b983] text-white rounded-xl text-lg font-normal shadow-none disabled:opacity-70 disabled:bg-[#74ce95]">
                                        {loading ? "Creating..." : "Create Goal"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}