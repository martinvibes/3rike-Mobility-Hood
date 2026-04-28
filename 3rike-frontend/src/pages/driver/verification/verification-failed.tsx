import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
    Form,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import React from "react";

// --- VALIDATION SCHEMAS ---
const formSchema = z.object({
    selfieImage: z.instanceof(File, { message: "Selfie is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerificationFailedForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // for page 3 of the verificiation
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleSelfieFileCamera = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("File selected:", file.name);

            // A. Set Form Value
            form.setValue("selfieImage", file, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });

            // B. Generate Preview immediately using FileReader (More reliable on mobile)
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelfiePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
        },
    });


    const handlePrevStep = () => {
        navigate(-1);
    };

    const handleContactSupport = () => {
        navigate('/driver/contact-support')
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        console.log("Retaken Selfie Data:", data);

        // Simulate API Call
        setTimeout(() => {
            setLoading(false);
            // Navigate based on success/failure logic (simulated here)
            const isSuccess = true;
            if (isSuccess) {
                navigate("/driver/verification/success");
            } else {
                navigate("/driver/verification/failed");
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white flex justify-center py-10 px-4">
            <div className="w-full max-w-md bg-white p-3 min-h-200 flex flex-col">

                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevStep}
                        className="bg-gray-100 rounded-full hover:bg-gray-200 w-10 h-10"
                        type="button"
                    >
                        <img src="/rounded-back.svg" alt="Arrow" className="w-10 h-10" />
                    </Button>

                    <h1 className="font-light text-lg text-gray-800">
                        Face Verification
                    </h1>

                    <span className="text-gray-400 font-medium text-sm"></span>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-5">
                        {/* ---RETAKE VERIFICATION SELFIE--- */}

                        <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-300 flex-1 flex flex-col">
                            <div className="space-y-2">
                                <h2 className="text-xl font-light text-gray-900">Verification failed</h2>
                                <p className="text-sm text-gray-500">
                                    We couldn’t match your face please ensure your photos meets the following criteria.
                                </p>
                            </div>

                            {/* Selfie Frame Placeholder */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                <div
                                    className={`
                                    w-54 h-60 rounded-[30px] relative overflow-hidden
                                    ${selfiePreview ? 'w-64 h-80 border-3 border-dashed border-gray-200' : 'border-none'}
                                `}
                                >
                                    <img
                                        src={selfiePreview ?? '/selfie-placeholder.png'}
                                        alt="Selfie"
                                        className="w-full h-full object-cover"
                                    />
                                </div>


                                {/* Requirements Icons */}
                                <div className="flex justify-between w-full px-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <img src="/light-red.svg" alt="light" className="w-5 h-5" />
                                        <span className="text-[10px] text-gray-400">Good lighting</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <img src="/face-red.svg" alt="face" className="w-5 h-5" />
                                        <span className="text-[10px] text-gray-400">Natural face</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <img src="/accessories-red.svg" alt="accessories" className="w-5 h-5" />
                                        <span className="text-[10px] text-gray-400">No accessories</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">

                                {/* --- CAMERA BUTTON --- */}
                                <Button
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="w-full h-12 bg-[#01C259] hover:bg-[#00a049] active:bg-[#00a049] text-white py-4 rounded-xl font-light text-center cursor-pointer transition-colors select-none"
                                >
                                    Retake Selfie
                                </Button>

                                {/* Hidden Camera Input - Linked via Ref */}
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    capture="user" // Forces front camera
                                    className="hidden"
                                    onChange={handleSelfieFileCamera}
                                />


                                {/* --- GALLERY BUTTON --- */}
                                <Button
                                    onClick={handleContactSupport}
                                    variant="link"
                                    className="w-full h-12 border-none text-gray-500 bg-white hover:bg-green-50 active:bg-green-100 py-4 rounded-xl font-light text-center cursor-pointer transition-colors select-none"
                                >
                                    Contact Support
                                </Button>

                                <FormMessage className="text-center">
                                    {form.formState.errors.selfieImage?.message?.toString()}
                                </FormMessage>
                            </div>
                        </div>
                        {/* --- FOOTER BUTTON --- */}
                        <div className="mt-auto pt-6">

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-34 h-14 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl text-lg font-light shadow-none disabled:bg-[#74ce95] disabled:cursor-not-allowed"
                                >
                                    {loading ? "Verifying..." : "Done"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}