import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { useNavigate } from "react-router-dom";
import pin from "@/assets/pin.svg";
// import back from "@/assets/back.svg";
// import warning from "@/assets/warning.svg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
// import Swal from "sweetalert2";
// import axios from "axios";
import { Link } from "react-router-dom";

const formSchema = z.object({
    phone: z.string().min(11, { message: "Please enter a valid phone number" }),
});

export default function ForgotPasswordPhoneForm() {
    // const navigate = useNavigate();
    const [loading,] = useState(false);
    // const [showPin, setShowPin] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            phone: "",
        },
    });
    const { errors } = form.formState;

    // Check if Tab 1 fields are valid
    const isTab0Valid = () => {
        const values = form.getValues();
        return (
            values.phone.length >= 11 &&
            !errors.phone
        );
    };

    const handleDone = async () => {
        const isValid = await form.trigger(["phone"]);
        if (isValid) {
            form.handleSubmit(onSubmit)();
        }
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Submitted Data:", data);
    };


    return (
        <div className="fixed inset-0 overflow-y-auto bg-opacity-50 flex md:items-center justify-center">
            <div className="bg-white sm:h-screen md:h-auto md:rounded-xl md:shadow-xl w-full max-w-xl p-6 mt-15">
                {/* Back Button */}


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        {/* Phone Tab */}
                        <div className="space-y-6">
                            <div className="flex flex-col space-y-4 pt-10">
                                <div className="flex flex-row space-x-3">
                                    <img src={pin} alt="pin" className="w-10 h-10" />
                                    <h1 className="font-extrabold flex flex-col justify-center">Forgot Password</h1>
                                </div>

                            </div>
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Phone Number"
                                                {...field}
                                                className="border border-gray-300 w-full h-12"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                )}
                            />
                            <div className="text-end text-sm -mt-4">
                                <Link to="/forgot-password-email" className="text-gray-400 font-light">
                                    Email Address
                                </Link>
                            </div>


                            <Button
                                className={`
                                        w-full py-6 rounded-md transition mt-10
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