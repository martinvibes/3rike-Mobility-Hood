import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Plus, Hourglass } from "lucide-react";
import DepositModal from "../deposit";
import WithdrawOptions from "../withdraw/options";
import BottomNav from "@/components/ui/bottom-nav";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [changeCurrency, setChangeCurrency] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "not_started" | "in_progress" | "approved" | "3riker"
  >("not_started");

  // State to control the modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("verificationStatus") as
      | "not_started"
      | "in_progress"
      | "approved"
      | "3riker";

    if (status) {
      setVerificationStatus(status);
    }
  }, []);

  // Auto-transition: in_progress -> approved after ~2s so the user sees the
  // "Verification in Progress" banner briefly before unlocking "Own a 3rike".
  useEffect(() => {
    if (verificationStatus !== "in_progress") return;
    const t = setTimeout(() => {
      setVerificationStatus("approved");
      localStorage.setItem("verificationStatus", "approved");
    }, 2000);
    return () => clearTimeout(t);
  }, [verificationStatus]);

  const handleLoan = () => {
    navigate("/driver/loan");
  };

  const handleSavings = () => {
    navigate("/driver/savings");
  };
  const handleInvestment = () => {
    navigate("/driver/investment");
  };
  const handleVerification = () => {
    if (verificationStatus === "approved") {
      navigate("/driver/own-3rike");
      return;
    }
    if (verificationStatus === "3riker") {
      navigate("/driver/3rike-details");
      return;
    }
    navigate("/driver/verification");
  };
  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-100 bg-white shadow-2xl overflow-hidden min-h-200 relative pb-10">
        {/* Header Profile */}
        <div className="px-6 flex items-center justify-between pt-6 mb-4">
          <div className="flex items-center gap-3 bg-white rounded-full">
            {/* Replace with actual user image */}
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
              <img src="/profile.png" alt="User" />
            </div>
            <span className="font-light text-sm -mr-5">
              Welcome, Effiong Musa
            </span>
            <Button variant="link">
              <img src="arrow.svg" alt="Arrow" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content Scroll Area */}
        <div className="px-5 space-y-4">
          {/* 1. GREEN BALANCE CARD */}
          <div className="relative w-full rounded-3xl p-6 text-white overflow-hidden">
            {/* Background Gradient & Blobs */}
            <img
              src="/earnings-banner.svg"
              alt="Card Background"
              className="absolute inset-0 w-full h-full bg-[#00C258] object-cover z-0"
            />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-green-100 text-sm font-light">
                  Total Lifetime Earnings
                </span>
              </div>

              <div className="flex flex-row justify-between mb-6">
                <h1 className="text-4xl font-bold ">
                  {changeCurrency ? "$ 0.00" : "₵ 0.00"}
                </h1>

                {/* Custom Toggle Switch */}
                <div className="flex items-center rounded-full ">
                  <Switch
                    checked={changeCurrency}
                    onCheckedChange={setChangeCurrency}
                    className="data-[state=checked]:bg-black/25 data-[state=unchecked]:bg-black/25 h-6 w-10 border-5 border-transparent -rotate-90"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setIsDepositOpen(true)}
                  className="flex-1 bg-transparent hover:bg-white/30 text-white border border-white rounded-full h-12 gap-2 text-sm font-medium backdrop-blur-sm"
                >
                  <div className="bg-white text-[#00C258] rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                    <Plus size={14} strokeWidth={4} />
                  </div>
                  Deposit
                </Button>

                <Button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="flex-1 bg-transparent hover:bg-white/30 text-white border border-white rounded-full h-12 gap-2 text-sm font-medium backdrop-blur-sm"
                >
                  <div className="bg-white text-[#00C258] rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                    <ArrowUpRight size={14} strokeWidth={4} />
                  </div>
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          {/* 2. STATS ROW */}
          <div className="grid grid-cols-2 gap-4">
            {/* Savings Balance */}
            <div className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <img src="wallet.svg" alt="Back" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Savings Balance</p>
                <h3 className="text-xl font-light text-gray-800">$ 0.00</h3>
              </div>
            </div>

            {/* Pending Payout */}
            <div className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-3 ">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Hourglass className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Pending Payout</p>
                <h3 className="text-xl font-light text-gray-800">$ 0.00</h3>
              </div>
            </div>
          </div>

          {/* to simulate approval */}
          <button
            type="button"
            onClick={() => {
              setVerificationStatus("approved");
              localStorage.setItem("verificationStatus", "approved");
            }}
            className="ml-2 text-xs text-[#1B8036] underline hover:[#1B8036] bg-transparent border-none cursor-pointer"
          >
            (Simulate Approval)
          </button>

          {/* 3. VERIFICATION BANNER */}
          {verificationStatus === "3riker" ? (
            // "My future 3rike" variant — shown after the user becomes a 3riker
            <div
              onClick={handleVerification}
              className="relative w-full rounded-2xl px-4 py-3 overflow-hidden text-white flex items-center justify-between cursor-pointer"
            >
              <img
                src="/future-3rike.svg"
                alt="Card Background"
                className="absolute inset-0 w-full h-full bg-[#1E8A32] object-cover z-0"
              />
              <div className="relative z-10 max-w-[66%]">
                <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                  <img
                    src="/verification-bike.svg"
                    alt="bike"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>

                <h3 className="font-bold text-[14px] leading-tight">
                  My future 3rike
                </h3>

                <p className="text-[12px] text-white/90 mt-0.5 leading-snug">
                  Contribute your weekly fees and check out specs.{" "}
                  <span className="inline-flex items-center gap-1 text-[#01C259] font-medium">
                    Click here
                    <img
                      src="/arrows_right_line.svg"
                      alt="arrow"
                      className="w-4 h-4"
                    />
                  </span>
                </p>
              </div>
              <img
                src="/future-33rike.svg"
                alt="3rike"
                className="relative z-10 min-w-[120px] h-full -mr-2"
              />
            </div>
          ) : (
            <div
              onClick={handleVerification}
              className="relative w-full bg-[#1B8036] rounded-2xl p-5 overflow-hidden text-white flex items-center justify-between cursor-pointer"
            >
              <img
                src={verificationStatus === "approved" ? "/own-a-3rike.svg" : "/verification-banner.svg"}
                alt="Card Background"
                className="absolute inset-0 w-full h-full bg-[#1E8A32] object-cover z-0"
              />

              <div className="relative z-10">
                <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                  <img
                    src="/verification-bike.svg"
                    alt="bike"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>

                <h3 className="font-bold text-lg leading-tight">
                  {verificationStatus === "not_started" && "Start Verification"}
                  {verificationStatus === "in_progress" &&
                    "Verification in Progress"}
                  {verificationStatus === "approved" && "Own a 3rike"}
                </h3>

                <p className="text-sm text-white mt-0.5">
                  {verificationStatus === "not_started" &&
                    "Complete Kyc and be eligible."}
                  {verificationStatus === "in_progress" &&
                    "Details received. We’ll be in touch soon."}
                  {verificationStatus === "approved" &&
                    "Continue to get your 3rike"}
                </p>
              </div>

              <div className="absolute bottom-4 right-4 z-10 w-8 h-8 bg-[#00C258] rounded-full flex items-center justify-center shadow-lg">
                <Button variant="link">
                  <img
                    src="/arrow-right.svg"
                    alt="arrow"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </Button>
              </div>
            </div>
          )}

          {/* 4. BOTTOM GRID MENU */}
          <div className="grid grid-cols-2 gap-4">
            {/* Savings */}
            <div
              onClick={handleSavings}
              className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col  gap-2 cursor-pointer"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                <img
                  src="/piggy.svg"
                  alt="piggy"
                  className="absolute inset-0 w-full h-full  object-cover z-0"
                />
              </div>
              <span className="text-gray-800 text-lg">Savings</span>
            </div>

            {/* Investment */}
            <div
              onClick={handleInvestment}
              className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                <img
                  src="/invest.svg"
                  alt="invest"
                  className="absolute inset-0 w-full h-full  object-cover z-0"
                />
              </div>
              <span className="text-gray-800 text-lg">Investment</span>
            </div>

            {/* Earn */}
            <div className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 ">
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                <img
                  src="/chart.svg"
                  alt="chart"
                  className="absolute inset-0 w-full h-full  object-cover z-0"
                />
              </div>
              <span className="text-gray-800 text-lg">Earn</span>
            </div>

            {/* Loan */}
            <div
              onClick={handleLoan}
              className="bg-white border-3 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-md">
                <img
                  src="/loan.svg"
                  alt="loan"
                  className="absolute inset-0 w-full h-full  object-cover z-0"
                />
              </div>
              <span className="text-gray-800 text-lg">Loan</span>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>

      {/* deposit modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
      />

      {/* Withdraw modal */}
      <WithdrawOptions
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </div>
  );
}
