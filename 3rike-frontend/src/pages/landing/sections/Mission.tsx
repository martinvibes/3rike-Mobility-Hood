import { useEffect, useRef, useState } from "react";

const Mission = () => {
  const greenRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = greenRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Start revealing when the element enters the bottom 80% of viewport
      // Fully revealed when it reaches the middle 45%
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.45;
      const current = rect.top;

      if (current >= start) {
        setProgress(0);
      } else if (current <= end) {
        setProgress(1);
      } else {
        setProgress((start - current) / (start - end));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white py-12 md:py-24 px-4 md:px-6">
      <div className="max-w-[1106px] mx-auto text-center">
        <p className="text-[#829E04] text-[14px] md:text-[20px] font-semibold tracking-[0.2em] uppercase mb-6 md:mb-8">
          OUR MISSION
        </p>

        <p className="text-[#1A1A1A] text-xl sm:text-2xl md:text-[40px] font-bold leading-snug mb-6 md:mb-10">
          We are building the financial operating system for Africa's mobility
          workers. 3riKE empowers drivers with affordable electric mobility,
          transparent ownership, and access to financial tools that build
          long-term prosperity.
        </p>

        <p className="text-[#1A1A1A] text-xl sm:text-2xl md:text-[40px] font-bold leading-snug">
          <span
            ref={greenRef}
            style={{
              backgroundImage: `linear-gradient(to right, #829E04 ${progress * 100}%, #1A1A1A ${progress * 100}%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transition: "background-image 0.1s ease-out",
            }}
          >
            By combining clean mobility with trusted financial infrastructure,
            we help drivers earn more, own more, and build verifiable financial
            identity.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Mission;
