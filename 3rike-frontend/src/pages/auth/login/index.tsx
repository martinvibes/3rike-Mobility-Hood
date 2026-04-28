import {
    Form,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import pin from "@/assets/pin.svg";
// import back from "@/assets/back.svg";
// import warning from "@/assets/warning.svg";
import { useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import { PinInput } from "@/components/ui/pinInput";
import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import axios from "axios";

const formSchema = z.object({
    pin: z
        .string()
        .regex(/^\d{4}$/, { message: "PIN must be 4 digits" }),
});

export default function LoginForm() {
    const navigate = useNavigate();
    const [loading,] = useState(false);
    const [showPin, setShowPin] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            pin: "",
        },
    });
    const { errors } = form.formState;

    // Check if Tab 1 fields are valid
    const isTab0Valid = () => {
        const values = form.getValues();
        return (
            values.pin.length === 4 &&
            !errors.pin
        );
    };

    const handleDone = async () => {
        const isValid = await form.trigger(["pin"]);
        if (isValid) {
            form.handleSubmit(onSubmit)();
        }
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Submitted Data:", data);
         navigate("/driver");
    };


    return (
        <div className="fixed inset-0 overflow-y-auto bg-opacity-50 flex md:items-center justify-center">
            <div className="bg-white sm:h-screen md:h-auto md:rounded-xl md:shadow-xl w-full max-w-xl p-6 mt-15">
                {/* Back Button */}


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        {/* Pin Tab */}
                        <div className="space-y-6">
                            <div className="flex flex-col space-y-4 pt-10">
                                <div className="flex flex-row space-x-3">
                                    <img src={pin} alt="pin" className="w-10 h-10" />
                                    <h1 className="font-extrabold flex flex-col justify-center">Enter your pin</h1>
                                </div>

                            </div>
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="text-sm text-gray-500 mb-2 mt-2 block">
                                            Enter your 4-digit pin
                                        </label>

                                        <div className="flex items-center gap-3">
                                            <PinInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                show={showPin}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowPin(!showPin)}

                                            >
                                                {showPin ? (
                                                    <EyeIcon className="w-6 h-6" />

                                                ) : (
                                                    <EyeClosed className="w-6 h-6" />
                                                )}
                                            </Button>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="text-end text-sm pb-5 mr-14">
                                <Link to="/forgot-password-phone" className="text-gray-400 font-light">Forgot Password</Link>
                            </div>

                            <Button
                                className={`
                                        w-full py-6 rounded-md transition
                                        ${isTab0Valid()
                                        ? "bg-[#01C259] hover:bg-[#019f4a]"
                                        : "bg-[#7BCD8A] cursor-not-allowed"}
                                    `}
                                type="button"
                                disabled={!isTab0Valid() || loading}
                                onClick={handleDone}
                                loading={loading}
                            >
                                Confirm
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};