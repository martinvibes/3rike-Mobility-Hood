import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Welcome3riker() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("verificationStatus", "3riker");
    if (!localStorage.getItem("eligibleScore")) {
      localStorage.setItem("eligibleScore", "200");
    }
  }, []);

  const goToDashboard = () => {
    navigate("/driver");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-100 bg-[#F3F5F9] shadow-2xl overflow-hidden min-h-200 relative flex items-center justify-center p-6">
        <div className="w-full bg-white rounded-3xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <img src="/success.svg" alt="success" className="w-20 h-20" />
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3 font-poppins">
            Welcome 3riker!
          </h1>

          <p className="text-[#909090] leading-[20px] max-w-xs text-[14px] font-poppins">
            Please visit our Kasoa office to pick up your 3rike and sign the
            required documents.
          </p>

          <Button
            onClick={goToDashboard}
            className="mt-10 w-full bg-[#01C259] hover:bg-[#00a049] h-14 rounded-xl text-lg font-light"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
