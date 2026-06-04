import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Lock, Eye, Check } from "lucide-react";
import { useState } from "react";
import MobileFrame from "@/components/ui/mobile-frame";
import { ApiError, changePin, verifyPin } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Step = "old" | "new" | "confirm" | "done";

export default function ChangePaymentPin() {
    const navigate = useNavigate();
    const { user, refresh } = useAuth();
    const hasPin = !!user?.hasPin;

    const [step, setStep] = useState<Step>(hasPin ? "old" : "new");
    const [oldPin, setOldPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [pin, setPin] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const heading =
        step === "old" ? "Enter current PIN" :
        step === "new" ? "Create a new PIN" :
        step === "confirm" ? "Confirm new PIN" : "PIN updated";

    const submit = async (oldP: string, newP: string) => {
        setSubmitting(true);
        setError(null);
        try {
            await changePin(hasPin ? { old_pin: oldP, new_pin: newP } : { new_pin: newP });
            await refresh();
            setStep("done");
        } catch (err) {
            if (err instanceof ApiError && err.code === "wrong_pin") {
                // Keep the new PIN they already chose — just send them back to
                // re-enter the current PIN.
                setError("Your current PIN is incorrect. Re-enter it to continue.");
                setOldPin("");
                setStep("old");
            } else {
                setError("Couldn't update your PIN. Please try again.");
                setOldPin("");
                setNewPin("");
                setStep(hasPin ? "old" : "new");
            }
        } finally {
            setSubmitting(false);
            setPin("");
        }
    };

    // Advance through steps as each 4-digit PIN completes.
    const commit = async (value: string) => {
        setError(null);
        if (step === "old") {
            // Verify the current PIN immediately — don't advance if it's wrong.
            setSubmitting(true);
            try {
                await verifyPin(value);
                setOldPin(value);
                setStep("new");
            } catch (err) {
                setError(
                    err instanceof ApiError && err.code === "wrong_pin"
                        ? "Your current PIN is incorrect. Try again."
                        : "Couldn't verify your PIN. Try again.",
                );
            } finally {
                setSubmitting(false);
                setPin("");
            }
        } else if (step === "new") {
            setNewPin(value);
            setStep("confirm");
            setPin("");
        } else if (step === "confirm") {
            if (value !== newPin) {
                setError("PINs don't match. Try again.");
                setNewPin("");
                setStep("new");
                setPin("");
                return;
            }
            void submit(oldPin, newPin);
        }
    };

    const handlePinPress = (num: string) => {
        if (submitting) return;
        if (num === "x") {
            setPin((prev) => prev.slice(0, -1));
            return;
        }
        if (pin.length < 4) {
            const next = pin + num;
            setPin(next);
            if (next.length === 4) {
                // brief pause so the 4th dot renders before advancing
                setTimeout(() => void commit(next), 120);
            }
        }
    };

    if (step === "done") {
        return (
            <MobileFrame innerClassName="flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#01C259] flex items-center justify-center mb-6">
                        <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">PIN updated</h1>
                    <p className="text-gray-400 text-sm mb-8">Your payment PIN has been saved securely.</p>
                    <Button
                        onClick={() => navigate(-1)}
                        className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white text-base font-medium rounded-xl cursor-pointer"
                    >
                        Done
                    </Button>
                </div>
            </MobileFrame>
        );
    }

    return (
        <MobileFrame innerClassName="flex flex-col">
            <div className="px-6 pt-12 pb-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-6 h-6 text-black" />
                </button>
            </div>

            <div className="flex-1 flex flex-col px-6">
                <div className="mb-10 mt-2">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-[#E6F6E9] rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-[#01C259]" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-black tracking-tight">{heading}</h1>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-gray-400 text-sm mb-4">Enter your 4-digit pin</p>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-3">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#EBEBEB]">
                                    {pin.length > i && (isVisible ? (
                                        <span className="text-xl font-bold">{pin[i]}</span>
                                    ) : (
                                        <div className="w-3 h-3 bg-black rounded-full" />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setIsVisible(!isVisible)} className="ml-2 text-gray-400 hover:text-gray-600">
                            <Eye className="w-6 h-6" />
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                    {submitting && <p className="text-sm text-gray-400 mt-4">Saving…</p>}
                </div>
            </div>

            {/* --- Custom Keypad --- */}
            <div className="bg-[#F9FAFB] p-2 pb-8 rounded-t-[32px]">
                <div className="flex justify-between px-6 py-3 mb-1 text-[11px] font-semibold tracking-wide">
                    <span className="text-gray-500">3rike Secure Numeric Keypad</span>
                </div>
                <div className="grid grid-cols-3 gap-2 px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePinPress(num.toString())}
                            className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xl font-semibold text-black active:bg-gray-100 transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="h-12" />
                    <button onClick={() => handlePinPress("0")} className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xl font-semibold text-black active:bg-gray-100 transition-colors">
                        0
                    </button>
                    <button onClick={() => handlePinPress("x")} className="h-12 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center active:bg-gray-100 transition-colors">
                        <span className="text-lg font-medium text-black">x</span>
                    </button>
                </div>
            </div>
        </MobileFrame>
    );
}
