import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/ui/mobile-frame";

export default function NoMatch() {
  const navigate = useNavigate();

  return (
    <MobileFrame innerBg="bg-[#F3F4F6]" innerClassName="flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-5xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Page Not Found</h2>
        <p className="text-black mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-black text-yellow-400 rounded-md hover:bg-[#b5b5b5] transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    </MobileFrame>
  );
};
