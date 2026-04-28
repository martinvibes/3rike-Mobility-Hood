import { useState } from "react";
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react"; 
import { PinInput } from "@/components/ui/pinInput";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    pin: z
        .string()
        .regex(/^\d{4}$/, { message: "PIN must be 4 digits" }),
});

export default function SetPinWithdraw() {
    const navigate = useNavigate();
    
    // State to track if we are setting or confirming
    const [step, setStep] = useState<1 | 2>(1);
    // State to store the first PIN entry to compare later
    const [firstPin, setFirstPin] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            pin: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (step === 1) {
            // STEP 1: Save the first PIN and move to confirmation
            setFirstPin(data.pin);
            setStep(2);
            form.reset({ pin: "" }); // Clear input so they can type it again
        } else {
            // STEP 2: Check if it matches the first PIN
            if (data.pin !== firstPin) {
                form.setError("pin", { type: "manual", message: "PINs do not match. Try again." });
                return;
            }
            
            // Success Logic
            console.log("PIN Set Successfully:", data.pin);
            navigate("/driver/withdraw/bank-details"); // Navigate to the next page
        }
    };

    // Handle back logic (If on step 2, go back to step 1. If step 1, close modal)
    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setFirstPin("");
            form.reset({ pin: "" });
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">

            {/* Backdrop - Lighter and Blurry to see screen behind */}
            <div
             className="absolute inset-0 bg-[#FF5F9]/95 backdrop-blur-xs  p-2 opacity-0 animate-in fade-in duration-200"
                onClick={() => navigate(-1)} 
            />

            {/* Modal Sheet */}
            <div
                className={`
                    relative w-full bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl 
                    transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom
                `}
            >
                {/* Grey Handle Bar */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        {/* Header: Navigation Icons + Title */}
                        <div className="relative flex items-center justify-center mb-10">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="absolute left-0 p-1 text-gray-500 hover:text-gray-700"
                            >
                                {/* Show Back Arrow on Step 2, X on Step 1 */}
                                {step === 2 ? <ArrowLeft className="w-6 h-6" /> : <X className="w-6 h-6" />}
                            </button>
                            
                            <h1 className="text-xl font-extrabold text-black">
                                {step === 1 ? "Set Withdrawal Pin" : "Confirm Withdrawal Pin"}
                            </h1>
                        </div>

                        {/* Pin Input Area */}
                        <div className="flex flex-col items-center justify-center space-y-8 pb-10">
                            
                            {/* Helper text to guide user */}
                            <p className="text-sm text-gray-500 text-center">
                                {step === 1 
                                    ? "Create a 4-digit PIN for withdrawals" 
                                    : "Re-enter your PIN to confirm"
                                }
                            </p>

                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-center items-center">
                                            <PinInput
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </div>
                                        <FormMessage className="text-center mt-4 text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                className={`
                                    w-full py-6 rounded-md transition text-lg font-semibold
                                    bg-[#01C259] hover:bg-[#019f4a]
                                `}
                                type="submit"
                            >
                                {step === 1 ? "Continue" : "Set Pin"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    );
}