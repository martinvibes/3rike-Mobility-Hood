import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";


export default function VerificationFailed() {
  const navigate = useNavigate();

  const handleVerificationFailed = () => {
    navigate('/driver/verification/retry')
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-500">

        {/* --- FAILED BADGE ICON --- */}
        <div className="relative mb-6">
          <img src="/fail.svg" alt="fail" className="w-18 h-18" />
        </div>

        {/* --- TEXT CONTENT --- */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          Application Failed
        </h1>

        <p className="text-gray-500 leading-relaxed text-sm md:text-base max-w-70">
          Some documents don’t match. Please review and resubmit, or{" "}
          <Link
            to="/support"
            className="text-[#00C259] font-medium hover:underline focus:outline-none"
          >
            Contact customer
          </Link>{" "}
          support.
        </p>

        {/* Optional: Retry Button */}
        <div className="mt-8 w-full">
          <Button
            onClick={handleVerificationFailed}
            className=" bg-[#01C259] hover:bg-[#00a049] h-14 rounded-xl text-lg font-light"
          >
            Try Again
          </Button>
        </div>

      </div>
    </div>
  );
}