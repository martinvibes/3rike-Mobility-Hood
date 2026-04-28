import { useRef, useState } from "react";
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
import { CalendarIcon, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import React from "react";

// --- VALIDATION SCHEMAS ---
const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z.date(),
    email: z.email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().min(11, "Phone number must be at least 11 digits"),
    address: z.string().min(1, "Address is required"),
    region: z.string().min(1, "Region is required"),
    country: z.string().min(1, "Country is required"),
    idType: z.string().min(1, "ID Type is required"),
    frontImage: z.instanceof(File, { message: "Front ID image is required" }),
    backImage: z.instanceof(File, { message: "Back ID image is required" }),
    selfieImage: z.instanceof(File, { message: "Selfie is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerifyAccountForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);

    // for page 3 of the verificiation
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

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

            // C. Reset input value so the same file can be selected again if needed
            // e.target.value = '';
        }
    };
    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "",
            email: "",
            phone: "",
            address: "",
            region: "",
            country: "",
            idType: "",
        },
    });

    // --- HANDLERS ---
    const handleNextStep = async () => {
        let fieldsToValidate: (keyof FormValues)[] = [];

        if (currentStep === 1) {
            fieldsToValidate = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'phone', 'address', 'region', 'country'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['idType', 'frontImage', 'backImage'];
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

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        console.log("Final KYC Data:", data);

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

    // Helper for file upload UI
    const FileUploadBox = ({
        label,
        fieldName
    }: {
        label: string;
        fieldName: "frontImage" | "backImage" | "selfieImage"
    }) => {
        const file = form.watch(fieldName) as File | undefined;
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [preview, setPreview] = React.useState<string | null>(null);

        const handleClick = () => {
            inputRef.current?.click();
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];

            console.log('File selected:', selectedFile); // Debug log

            if (selectedFile) {
                // Set form value
                form.setValue(fieldName, selectedFile, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            }
        };

        // Get current file from form or use preview
        const displayFile = file || (preview ? { name: 'Selected Image' } : null);

        return (
            <div className="space-y-2">
                <span className="text-xs font-light text-gray-500">
                    {label} <span className="text-red-500">*Required</span>
                </span>
                <div
                    className="border-2 border-dashed border-green-200 bg-green-50 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer active:bg-green-100 transition-colors"
                    onClick={handleClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {displayFile || preview ? (
                        <div className="flex flex-col items-center w-full">
                            <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg mb-2"
                                />
                            )}
                            <p className="text-sm font-semibold text-green-700">
                                {displayFile?.name || 'Image selected'}
                            </p>
                            <p className="text-xs text-gray-400">Tap to change</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center">
                                <UploadCloud className="w-10 h-10 text-[#01C259]" />
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-800">Take a photo or upload</p>
                                    <p className="text-xs text-gray-400">JPG, PNG, PDF</p>
                                </div>
                                <div className="bg-[#01C259] font-light text-white px-6 py-2 rounded-lg">
                                    Upload file
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <FormMessage>{form.formState.errors[fieldName]?.message?.toString()}</FormMessage>
            </div>
        );
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
                        {currentStep === 1 && "3rike Kyc Verification"}
                        {currentStep === 2 && "ID verification"}
                        {currentStep === 3 && "Face Verification"}
                    </h1>

                    <span className="text-gray-400 font-medium text-sm">{currentStep}/3</span>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-5">

                        {/* --- STEP 1: PERSONAL INFO --- */}
                        {currentStep === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-5 duration-300">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="First name"
                                                    {...field}
                                                    className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Last name"
                                                    {...field}
                                                    className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-1">
                                    <FormLabel className="text-gray-500 font-normal ml-1">Gender</FormLabel>
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 w-full rounded-xl border-gray-200 bg-gray-50/50">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <FormLabel className="text-gray-500 font-normal ml-1">
                                        Date of Birth
                                    </FormLabel>

                                    <FormField
                                        control={form.control}
                                        name="dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                type="button"
                                                                className="w-full h-14 rounded-xl border-gray-200 bg-gray-50/50 justify-between font-light"
                                                            >
                                                                {field.value
                                                                    ? new Date(field.value).toLocaleDateString()
                                                                    : "mm/dd/yyyy"}
                                                                <CalendarIcon className="w-5 h-5 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>

                                                    <PopoverContent
                                                        className="w-auto overflow-hidden p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            captionLayout="dropdown"
                                                            onSelect={(date) => {
                                                                field.onChange(date);
                                                                setOpen(false);
                                                            }}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Email address"
                                                        {...field}
                                                        className="h-14 rounded-xl border-gray-200 bg-gray-50/50 pr-20"
                                                    />
                                                    <span className="absolute right-4 top-4 text-gray-400 text-sm">
                                                        (Optional)
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Phone number"
                                                    {...field}
                                                    className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Residential address"
                                                    {...field}
                                                    className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Region"
                                                        {...field}
                                                        className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Country"
                                                        {...field}
                                                        className="h-14 rounded-xl border-gray-200 bg-gray-50/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* --- STEP 2: ID VERIFICATION --- */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-light text-gray-900">Verify your identity</h2>
                                    <p className="text-sm text-gray-500">
                                        Upload a valid government issued ID to activate your 3rike account
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <FormLabel className="text-gray-500 font-normal">ID type</FormLabel>
                                    <FormField
                                        control={form.control}
                                        name="idType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 w-full rounded-xl border-gray-200 bg-gray-50/50">
                                                            <SelectValue placeholder="Select ID Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="national_id">National ID</SelectItem>
                                                        <SelectItem value="passport">Passport</SelectItem>
                                                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Warning Box */}
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">

                                    <div className="space-y-2">
                                        <div className="flex flex-row space-x-2">
                                            <AlertCircle className="w-5 h-5 text-[#F1B058] shrink-0" />
                                            <h4 className="text-[#F1B058] font-light text-sm">Photo requirement</h4>
                                        </div>

                                        <ul className="text-[#F1B058] text-xs list-none space-y-2">
                                            <li>Make sure all corners are visible</li>
                                            <li>Avoid flash glare and shadows</li>
                                        </ul>
                                    </div>
                                </div>

                                <FileUploadBox label="Front of card" fieldName="frontImage" />
                                <FileUploadBox label="Back of card" fieldName="backImage" />

                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <div className="rounded-full"><img src="/lock.svg" alt="lock" className="w-5 h-5" /></div>
                                    <span className="text-xs text-gray-400">Your data is securely encrypted</span>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 3: FACE VERIFICATION --- */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-300 flex-1 flex flex-col">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-light text-gray-900">Verify your identity</h2>
                                    <p className="text-sm text-gray-500">
                                        We need to know is really you position your face in the box below.
                                    </p>
                                </div>

                                {/* Selfie Frame Placeholder */}
                                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                    <div className="w-64 h-80 border-3 border-dashed border-gray-200 rounded-[30px] relative overflow-hidden">
                                        {(selfiePreview) && (
                                            <img
                                                src={selfiePreview}
                                                className="w-full h-full object-cover"
                                                alt="Selfie Preview"
                                            />
                                        )}

                                    </div>

                                    {/* Requirements Icons */}
                                    <div className="flex justify-between w-full px-2">
                                        <div className="flex flex-col items-center gap-1">
                                            <img src="/light.svg" alt="light" className="w-5 h-5" />
                                            <span className="text-[10px] text-gray-400">Good lighting</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <img src="/face.svg" alt="face" className="w-5 h-5" />
                                            <span className="text-[10px] text-gray-400">Natural face</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <img src="/accessories.svg" alt="accessories" className="w-5 h-5" />
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
                                        Take Live selfie
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
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="w-full h-12 border border-[#01C259] text-[#01C259] bg-white hover:bg-green-50 active:bg-green-100 py-4 rounded-xl font-light text-center cursor-pointer transition-colors select-none"
                                    >
                                        Upload from existing Photo
                                    </Button>

                                    {/* Hidden Gallery Input - Linked via Ref */}
                                    <input
                                        ref={galleryInputRef}
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleSelfieFileCamera}
                                        className="hidden"
                                    />

                                    <FormMessage className="text-center">
                                        {form.formState.errors.selfieImage?.message?.toString()}
                                    </FormMessage>
                                </div>
                            </div>
                        )}

                        {/* --- FOOTER BUTTON --- */}
                        <div className="mt-auto pt-6">
                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full h-14 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl text-lg font-bold shadow-none"
                                >
                                    Next
                                </Button>
                            ) : (
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-34 h-14 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl text-lg font-light shadow-none disabled:bg-[#74ce95] disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Verifying..." : "Done"}
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