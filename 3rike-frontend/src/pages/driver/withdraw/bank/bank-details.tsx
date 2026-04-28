import { useState } from "react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import {
    Landmark,
    Lock,
    AlertCircle,
    XCircle,
} from "lucide-react";

// --- Zod Schema ---
const formSchema = z.object({
    bankName: z.string().min(1, "Please select a bank"),
    accountName: z.string().min(2, "Name must be at least 2 characters"),
    accountNumber: z
        .string()
        .regex(/^\d+$/, "Account number must be digits only")
        .min(10, "Account number must be at least 10 digits"),
});

export default function WithdrawBankDetails() {
    const navigate = useNavigate();

    // Status State
    const [formError, setFormError] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountName: "",
            accountNumber: "",
        },
    });

    // Mock Submission
    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        setFormError(false);

        // Simulate API delay
        setTimeout(() => {
            console.log("Submitting:", data);
            setLoading(false);

            // Navigate directly to send money screen after linking
            navigate('/driver/withdraw/send-money');
        }, 1500);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => navigate(-1)}
            />

            {/* Modal Sheet */}
            <div className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">

                {/* Handle Bar */}
                <div className="pt-4 flex justify-center">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                <div className="p-6 pb-12">

                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">

                        {/* Error Banner */}
                        {formError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-red-800 text-sm">Linking Failed</h3>
                                    <p className="text-xs text-red-600">Please check details and try again.</p>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-20 h-20 bg-[#F3E8FF] rounded-full flex items-center justify-center mb-4">
                                <Landmark className="w-10 h-10 text-[#A855F7]" />
                            </div>
                            <h1 className="text-2xl font-bold text-black mb-2">Bank details</h1>
                            <p className="text-gray-400 text-sm max-w-70 leading-tight">
                                Link bank account. Your financial data is encrypted and never shared.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                {/* Bank Name */}
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-500 font-normal">Bank Name</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <div className="relative">
                                                    <SelectTrigger className="w-full h-14 rounded-xl border-gray-400 text-gray-900 text-base px-4">
                                                        <SelectValue placeholder="Select your bank" />
                                                    </SelectTrigger>
                                                </div>
                                                <SelectContent>
                                                    <SelectItem value="access">Access Bank</SelectItem>
                                                    <SelectItem value="gtb">GTBank</SelectItem>
                                                    <SelectItem value="zenith">Zenith Bank</SelectItem>
                                                    <SelectItem value="opay">OPay</SelectItem>
                                                    <SelectItem value="momo">MoMo PSB</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account Name */}
                                <FormField
                                    control={form.control}
                                    name="accountName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Account holder name"
                                                    className="h-14 rounded-xl border-gray-400 text-base px-4 placeholder:text-gray-400"
                                                    {...field}
                                                />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account Number */}
                                <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Account number"
                                                    type="tel"
                                                    maxLength={10}
                                                    className="h-14 rounded-xl border-gray-400 text-base px-4 placeholder:text-gray-400"
                                                    {...field}
                                                />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Disclaimer */}
                                <div className="bg-[#FFF7ED] border border-dashed border-[#FDBA74] rounded-xl p-4 flex items-start gap-3 mt-4">
                                    <AlertCircle className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                                    <p className="text-xs text-[#EA580C] leading-snug">
                                        By linking your bank account you agree to 3rike terms of service.
                                    </p>
                                </div>

                                {/* Submit */}
                                <Button variant="link"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#01C259] hover:bg-[#019f4a] text-white text-lg font-medium rounded-xl mt-4"
                                >
                                    {loading ? "Linking..." : "Link Account"}
                                </Button>

                                {/* Footer Security */}
                                <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <Lock className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-xs">Secured by 3rike financial service</span>
                                </div>
                            </form>
                        </Form>
                    </div>

                </div>
            </div>
        </div>
    );
}