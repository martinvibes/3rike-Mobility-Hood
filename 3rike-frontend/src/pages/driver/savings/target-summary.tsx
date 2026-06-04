import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom"; // 1. Import useLocation

export default function SavingsSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. Get the data from state (with a fallback in case user goes directly to link)
  const data = location.state || {
     title: "Unknown",
     saved: "0",
     total: "0",
     daysLeft: "0",
     duration: "--",
     withdrawalDate: "--",
     interest: "0%",
     lockStatus: "--"
  };
    const handleNotifications = () => {
        navigate('/driver/savings/notification');
    };


  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden min-h-screen relative flex flex-col">
        
        {/* --- Header --- */}
        <div className="relative flex items-center pt-10 p-6 bg-white z-10">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute left-6 top-10 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 p-0 flex items-center justify-center"
          >
            <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
          </Button>
          <p className="mx-auto font-medium text-lg pt-2 text-black">Summary</p>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="px-6 space-y-6 flex-1 overflow-y-auto pb-10">
          
          {/* 1. Summary Card (Dynamic Data) */}
          <div className="relative bg-[#F9F8FF] border border-dashed border-[#9747FF] rounded-2xl p-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg shadow-sm shrink-0"></div>

              <div className="flex-1 grid grid-cols-4 items-center text-center">
                <div className="col-span-1 text-left">
                  {/* Dynamic Title */}
                  <span className="text-[#9747FF] font-medium text-md">{data.title}</span>
                </div>
                <div className="flex flex-col">
                  {/* Dynamic Saved */}
                  <span className="text-[#9747FF] font-medium text-sm">$ {data.saved}</span>
                  <span className="text-[#9747FF] text-[10px] opacity-70">Saved</span>
                </div>
                <div className="flex flex-col">
                  {/* Dynamic Total */}
                  <span className="text-[#9747FF] font-medium text-sm">$ {data.total}</span>
                  <span className="text-[#9747FF] text-[10px] opacity-70">Total Target</span>
                </div>
                <div className="flex flex-col">
                  {/* Dynamic Days */}
                  <span className="text-[#9747FF] font-medium text-sm">{data.daysLeft}</span>
                  <span className="text-[#9747FF] text-[10px] opacity-70">Days left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button className="flex-1 bg-[#00C259] hover:bg-[#00a049] text-white h-14 rounded-xl text-base font-light shadow-none">
              Contribute
            </Button>
            <Button onClick={handleNotifications} variant="outline" className="flex-1 bg-white border border-gray-200 text-gray-900 h-14 rounded-xl text-base font-light shadow-none hover:bg-gray-50">
              Transactions
            </Button>
          </div>

          {/* 2. Info Grid (Dynamic Data) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#EBECEE] rounded-xl p-4 flex flex-col justify-center gap-1 h-20">
              <span className="text-gray-500 text-xs font-medium">Saving Duration</span>
              <span className="text-[#9747FF] text-sm font-medium">{data.duration}</span>
            </div>
            
            <div className="bg-[#EBECEE] rounded-xl p-4 flex flex-col justify-center gap-1 h-20">
              <span className="text-gray-500 text-xs font-medium">Withdrawal date</span>
              <span className="text-[#9747FF] text-sm font-medium">{data.withdrawalDate}</span>
            </div>

            <div className="bg-[#EBECEE] rounded-xl p-4 flex flex-col justify-center gap-1 h-20">
              <span className="text-gray-500 text-xs font-medium">Target Amount</span>
              <span className="text-[#9747FF] text-sm font-medium">$ {data.total}.00</span>
            </div>

            <div className="bg-[#EBECEE] rounded-xl p-4 flex flex-col justify-center gap-1 h-20">
              <span className="text-gray-500 text-xs font-medium">Lock</span>
              <span className="text-[#9747FF] text-sm font-medium">{data.lockStatus}</span>
            </div>
          </div>

          {/* 3. Interest Box (Dynamic Data) */}
          <div className="bg-[#EBECEE] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm italic">Interest Per annum</span>
              <span className="text-[#9747FF] text-sm font-medium">{data.interest}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm italic">Days Left</span>
              <span className="text-[#9747FF] text-sm font-medium">{data.daysLeft}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4">
             <Button variant="outline" className="flex-1 bg-white border border-[#00C259] text-[#00C259] h-14 rounded-xl text-base font-light shadow-none hover:bg-green-50">
              3rikky Lock
            </Button>
            <Button className="flex-1 bg-[#00C259] hover:bg-[#00a049] text-white h-14 rounded-xl text-base font-light shadow-none">
              Withdraw
            </Button>
          </div>

          <div className="flex justify-center pt-6 pb-6">
            <button className="flex items-center gap-2 text-[#9747FF] font-medium text-base hover:opacity-80 transition-opacity">
              Edit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}