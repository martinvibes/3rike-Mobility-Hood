import useScreenSize from "@/hooks/useScreenSize";

const HowItWorks = () => {
  const { isDesktop } = useScreenSize();

  return (
    <div className="bg-[#829E04]">
      <div className="border-b-[10px] border-[#F3FFBC] px-4 md:px-6 md:px-[78px] pt-16 md:pt-24 pb-12 md:pb-16">
        {/* Title */}
        <h2 className="text-white text-[36px] md:text-[65px] font-bold text-center mb-10 md:mb-16">
          How 3riKE Works
        </h2>

        {/* DRIVERS label */}
        <p className="text-[#F3FFBC] text-base md:text-[25px] font-bold tracking-[0.15em] uppercase mb-4 md:mb-6">
          DRIVERS
        </p>

        {/* Top full-width image */}
        <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[400px] bg-[#6B8203] mb-4 md:mb-6">
          {isDesktop ? (
            <img
              src="/drive-work1.png"
              alt="Get an electric three-wheeler"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <img
              src="/drive1_mob.png"
              alt="Get an electric three-wheeler"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <span
            className={`absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 text-[#1C1C1C] text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg ${!isDesktop && "max-w-[240px] md:max-w-xs"}`}
          >
            Get an electric three-wheeler with minimal upfront cost
          </span>
        </div>

        {/* Two side-by-side images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[350px] bg-[#6B8203]">
            <img
              src="/drive-work2.png"
              alt="Pay affordable weekly installments"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 text-[#1C1C1C] text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg">
              Pay affordable weekly installments
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[350px] bg-[#6B8203]">
            <img
              src="/drive-work3.png"
              alt="Own the vehicle outright in ~70 weeks"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 text-[#1C1C1C] text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg">
              Own the vehicle outright in ~70 weeks
            </span>
          </div>
        </div>

        {/* Bottom full-width image */}
        <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[400px] bg-[#6B8203]">
          {isDesktop ? (
            <img
              src="/drive-work4.png"
              alt="Instant battery swaps"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <img
              src="/drive2_mob.png"
              alt="Instant battery swaps"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}

          <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 text-[#1C1C1C] text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg max-w-[280px] md:max-w-md">
            Instant battery swaps at our stations. No long charging waits, just
            swap and keep earning
          </span>
        </div>
      </div>

      {/* INVESTORS Section */}
      <div className="px-4 md:px-6 md:px-[78px] pb-16 md:pb-24">
        <h2 className="text-white text-[36px] md:text-[65px] font-bold text-center mt-16 md:mt-24 mb-10 md:mb-16">
          How 3riKE Works
        </h2>

        <p className="text-[#F3FFBC] text-base md:text-[25px] font-bold tracking-[0.15em] uppercase mb-4 md:mb-6">
          INVESTORS
        </p>

        {/* Two side-by-side images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6 mb-3 md:mb-6">
          <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[350px] bg-[#FFFFFF]">
            <img
              src="/investor_work1.png"
              alt="Track performance transparently"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="absolute bottom-3 left-4 bg-[#829E04]/80 text-white text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg max-w-[240px] md:max-w-xs">
              Track performance transparently through our platform
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[350px] bg-[#FFFFFF]">
            <img
              src="/investor_work2.png"
              alt="Buy fractional shares"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="absolute bottom-3 left-4 bg-[#829E04]/80 text-white text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg max-w-[240px] md:max-w-md">
              Buy fractional shares in vehicles and batteries
            </span>
          </div>
        </div>

        {/* Bottom full-width image */}
        <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[400px] bg-[#FFFFFF]">
          <img
            src="/investor_work3.png"
            alt="Earn predictable weekly yields"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="absolute top-4 left-4 bg-[#829E04]/80 text-white text-sm md:text-lg italic px-3 md:px-4 py-1.5 md:py-2 rounded-lg max-w-[280px] md:max-w-sm">
            Earn predictable weekly yields from real driver payments and swap
            fees
          </span>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
