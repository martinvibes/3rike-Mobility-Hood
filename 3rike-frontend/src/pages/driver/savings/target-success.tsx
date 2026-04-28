import { useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";


export default function SavingsTargetSuccess() {
    const navigate = useNavigate();
   
    const goToDashboard = () => {
        navigate("/driver");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-500">

                {/* --- SUCCESS BADGE ICON --- */}
                <div className="relative mb-8">
                    <img src="/success.svg" alt="success" className="w-18 h-18" />
                </div>

                {/* --- TEXT CONTENT --- */}
                <h1 className="text-2xl font-extrabold text-black mb-3">
                    Successfully Created
                </h1>

                <p className="text-gray-500 leading-relaxed max-w-xs mb-8">
                    You have successfully created your target savings
                </p>

                {/* Dashboard Button */}
                <div className="mt-12 w-full">
                    <Button
                        onClick={goToDashboard}
                        className="w-full bg-[#01C259] hover:bg-[#00a049] h-14 rounded-xl text-lg font-light shadow-lg shadow-green-100"
                    >
                        Go to Dashboard
                    </Button>
                </div>

            </div>
        </div>
    );
}