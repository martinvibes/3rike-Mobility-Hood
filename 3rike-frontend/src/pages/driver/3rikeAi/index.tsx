import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";

const formSchema = z.object({
    prompt: z.string().min(1, { message: "A prompt is required" }),
});

export default function AiDashboard() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            prompt: "",
        },
    });

    // Watch the input to change the button state visually
    const promptValue = form.watch("prompt");
    const hasText = promptValue && promptValue.length > 0;

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Submitted Data:", data);
    }

    // Helper function to set the text when a card is clicked
    const handleCardClick = (text: string) => {
        form.setValue("prompt", text, { 
            shouldValidate: true, // Trigger validation so the button state updates immediately
            shouldDirty: true 
        });
    };

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="w-full max-w-100 bg-white shadow-2xl overflow-hidden min-h-200 relative pb-10 pt-4">

                <div className="relative flex items-center pt-10 p-6">
                    <button
                        onClick={() => { navigate(-1); }}
                        className="pt-10 pb-5 absolute left-10 top-1/2 -translate-y-1/2"
                    >
                        <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                    </button>

                    <p className="mx-auto font-medium text-md text-center">
                        Ask 3rike Ai
                    </p>
                </div>

                <div className="px-5 space-y-4">

                    {/* BOTTOM GRID MENU */}
                    <div className="grid grid-cols-2 gap-4 pt-8">
                        
                        {/* 1. Payment Card */}
                        <div 
                            onClick={() => handleCardClick("Send and recieve money")}
                            className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition-colors active:scale-95 duration-200"
                        >
                            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                                <img src="/piggy.svg" alt="piggy" className="absolute inset-0 w-full h-full object-cover z-0" />
                            </div>
                            <span className="text-gray-800 text-sm font-semibold">Payment</span>
                            <span className="text-gray-400 text-xs font-light">Send and recieve money</span>
                        </div>

                        {/* 2. Investment/Saving Card */}
                        <div 
                            onClick={() => handleCardClick("Split 10% Ama funds to saving")}
                            className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition-colors active:scale-95 duration-200"
                        >
                            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                                <img src="/invest.svg" alt="invest" className="absolute inset-0 w-full h-full object-cover z-0" />
                            </div>
                            <span className="text-gray-800 text-sm font-semibold">Saving</span>
                            <span className="text-gray-400 text-xs font-light">Split 10% Ama funds to saving</span>
                        </div>

                        {/* 3. Earn/Balance Card */}
                        <div 
                            onClick={() => handleCardClick("Give me run down of my balance")}
                            className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition-colors active:scale-95 duration-200"
                        >
                            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                                <img src="/chart.svg" alt="chart" className="absolute inset-0 w-full h-full object-cover z-0" />
                            </div>
                            <span className="text-gray-800 text-sm font-semibold">Balance</span>
                            <span className="text-gray-400 text-xs font-light">Give me run down of my balance</span>
                        </div>

                        {/* 4. Loan/Updates Card */}
                        <div 
                            onClick={() => handleCardClick("3rike riders update")}
                            className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition-colors active:scale-95 duration-200"
                        >
                            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                                <img src="/loan.svg" alt="loan" className="absolute inset-0 w-full h-full object-cover z-0" />
                            </div>
                            <span className="text-gray-800 text-sm font-semibold">Updates</span>
                            <span className="text-gray-400 text-xs font-light">3rike riders update</span>
                        </div>

                    </div>

                    <div className="absolute bottom-0 left-0 w-full bg-white px-5 pb-8 pt-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Hello 3riker! chat to me"
                                                        {...field}
                                                        className="w-full h-16 rounded-2xl border border-[#22C55E] bg-[#FAFAFA] pl-6 pr-16 text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        size="icon"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#00C259] hover:bg-[#00a049] transition-all duration-200"
                                                    >
                                                        {hasText ? (
                                                            <div className="w-4 h-4 bg-white rounded-[2px]" />
                                                        ) : (
                                                            <ArrowUpRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}