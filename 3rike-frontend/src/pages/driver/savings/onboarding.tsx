import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const onboardingData = [
    {
        image: "#",
        title: "Loans",
        description: "Grow your credit score and get loans up to GHS 16,000 with easy, flexible repayment.",
        color: "bg-[#BBE6C3]",
    },
    {
        image: "#",
        title: "Retail Investment",
        description: "Become a 3rike owner with just GHS 600 and start earning weekly.",
        color: "bg-[#7BCD8A]",
    },
];

export default function SavingsOnboarding() {
    const [currentScreen, setCurrentScreen] = useState(0);
    const navigate = useNavigate()


    const screenData = onboardingData[currentScreen];
    const isLastScreen = currentScreen === onboardingData.length - 1;

    const handleDashboard = () => {
        navigate("/driver/savings/dashboard")
    };

    return (
        <div
            className="fixed inset-0 bg-white flex flex-col p-3 overflow-y-auto"

        >

            <div className="relative flex items-center pt-10 p-6">
                {/* Back button */}
                {/* Back button */}
                <Button
                    variant="link"
                    onClick={() => {
                        if (currentScreen === 0) {
                            navigate(-1); // go back in browser history
                        } else {
                            setCurrentScreen(prev => prev - 1);
                        }
                    }}
                    className="pt-10 pb-5 absolute left-6 top-1/2 -translate-y-1/2"
                >
                    <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                </Button>


                {/* Centered title */}
                <p className="mx-auto font-medium text-md text-center">
                    Savings
                </p>
            </div>
            {/* Image Section */}
            <div className={`relative w-full h-115.5 rounded-4xl ${screenData.color} mb-6`}>
                <img
                    src={screenData.image}
                    alt="image"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                />
            </div>



            <div className="absolute bottom-0 right-25 -translate-x-1/2">

                {/* Footer */}
                <div className="absolute bottom-0 left-8 -translate-x-1/2 mb-10">
                    <Button
                        variant="link"
                        onClick={() => {
                            if (isLastScreen) {
                                handleDashboard(); // 🔁 change this route
                            } else {
                                setCurrentScreen(prev => prev + 1);
                            }
                        }}
                        className="w-auto py-6 rounded-xl text-[#01C259]  font-light text-lg shadow-none flex items-center gap-0.5"
                    >
                        {isLastScreen ? "Continue" : "Next"}
                        <img
                            src="/double_arrow_right.svg"
                            alt="arrow"
                            className="w-5 h-5"
                        />
                    </Button>
                </div>

            </div>

        </div>
    );
}
