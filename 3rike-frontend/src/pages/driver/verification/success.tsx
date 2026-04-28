import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Optional, in case you want to add a button later

// type VerificationStatus = "not_started" | "in_progress" | "approved";

export default function VerificationSuccess() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    localStorage.setItem("verificationStatus", "in_progress");
    navigate("/driver");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        
        {/* --- SUCCESS BADGE ICON --- */}
        <div className="relative mb-8">
          {/* Green Starburst Shape */}
          <img src="/success.svg" alt="success" className="w-18 h-18" />
        </div>

        {/* --- TEXT CONTENT --- */}
        <h1 className="text-2xl font-extrabold text-black mb-3">
          Application Successful
        </h1>

        <p className="text-gray-500 leading-relaxed max-w-xs">
          We have received your application, we will get back to you in next 48 hours.
        </p>

        {/* Optional: Navigation Button (Hidden in design but good for UX) */}
        <div className="mt-12 w-full">
            <Button 
                onClick={goToDashboard} 
                className=" bg-[#01C259] hover:bg-[#00a049] h-14 rounded-xl text-lg font-light"
            >
                Go to Dashboard
            </Button>
        </div> 
       

      </div>
    </div>
  );
}