import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import ComingSoonModal from "@/components/modal/coming-soon";

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [, setOpen] = useState(false);

  const handleOnboardingNavigate = () => {
    navigate('/onboarding')
  };

  return (
    <div className="bg-black relative min-h-screen w-full overflow-x-hidden text-white">
      <section
        id="home"
        // Changed to flex-col to stack the "Top Row" and "Bottom Features" vertically
        className="
          relative flex flex-col justify-center min-h-screen
          px-6 md:px-12 lg:px-20
          pt-20 lg:pt-0
          pb-10 sm:pb-10 md:pb-0
        "
      >

        {/* === TOP ROW: Left Text & Right Image === */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 lg:gap-8 mb-12 lg:mb-0">

          {/* --- LEFT CONTENT (Text & Buttons) --- */}
          <div className="flex flex-col max-w-md md:max-w-lg md:-mt-37.5 justify-center lg:w-1/2 space-y-8 lg:space-y-10 items-center lg:items-start text-center lg:text-left z-10 ">
            {/* 1. Hero Text */}
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight">
                {t("hero.title")}
              </h1>

              <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleOnboardingNavigate} className="px-3 sm:px-3 md:px-3 py-6 bg-white text-black hover:bg-[#b5b5b5] rounded-full cursor-pointer hover:scale-105 transition-transform duration-300">
                {t("hero.cta.primary")} <img src="ebike.svg" alt="" className="w-5 h-5" />
              </Button>
              <Button onClick={() => setOpen(true)} className="px-3 sm:px-3 md:px-3 py-6 bg-black hover:bg-[#b5b5b5] hover:text-white text-white border-white border rounded-full cursor-pointer hover:scale-105 transition-transform duration-300">
                {t("hero.cta.secondary")} <img src="investment.svg" alt="" className="w-5 h-5" />
              </Button>
              <Button
                onClick={() =>
                  document
                    .getElementById("waitlist")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-3 sm:px-3 md:px-3 py-6 bg-[#01C259] hover:bg-[#00a049] text-white rounded-full cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#01C259]/20"
              >
                Join the waitlist
              </Button>
            </div>
          </div>

          {/* --- RIGHT CONTENT (Image) --- */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative z-0">

            {/* Mobile image */}
            <img
              src="/heromain-mobile.png"
              alt="Hero Graphic"
              className="block lg:hidden w-full max-w-lg h-auto -mb-8 object-contain"
            />

            {/* Desktop image */}
            <img
              src="/heromain.png"
              alt="Hero Graphic"
              className="hidden lg:block max-w-md h-auto object-contain lg:-mr-20"
            />

          </div>

        </div>

        {/* === BOTTOM ROW: Features === */}
        {/* This sits under the Top Row, aligning left (start) naturally */}
        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-3 gap-6 w-full md:-mt-62.5 max-w-xl">

            {/* Feature 1 */}
            <div className="flex flex-col items-start gap-1 text-left">
              <img src="/affordable.svg" alt="Affordable Fare" className="w-8 h-8 lg:w-10 lg:h-10" />
              <h3 className="text-sm md:text-lg ">Affordable Fare</h3>
              <p className="text-gray-400 text-xs md:text-sm md:leading-relaxed max-w-62.5">
                Ensuring transport fares are affordable for the masses, allowing easy movement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start gap-1 text-left">
              <img src="/safety.svg" alt="Ensured Safety" className="w-8 h-8 lg:w-10 lg:h-10" />
              <h3 className="text-sm md:text-lg ">Ensured Safety</h3>
              <p className="text-gray-400 text-xs md:text-sm md:leading-relaxed max-w-62.5">
                Advanced AI, real-time monitoring, and built-in redundancies ensure a safe journey.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start gap-1 text-left">
              <img src="employment.svg" alt="Employment Opportunities" className="w-8 h-8 lg:w-10 lg:h-10" />
              <h3 className="text-sm md:text-lg ">Employment Opportunities</h3>
              <p className="text-gray-400 text-xs md:text-sm md:leading-relaxed max-w-62.5">
                Creating job opportunities that allow people to earn a living and own 3-rikes.
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* <ComingSoonModal open={open} onClose={() => setOpen(false)} /> */}
    </div>
  );
}