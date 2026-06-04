const EnvironmentalImpact = () => {
  return (
    <div className="bg-[#829E04] pl-4 md:pl-5 md:pl-[78px] pt-10 overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block bg-[#829E04] rounded-2xl overflow-hidden relative h-[420px]">
        <div className="absolute inset-0 pr-12 flex flex-col justify-center z-10 w-full max-w-[650px]">
          <p className="text-[#F3FFBC] text-[18px] font-semibold tracking-wide mb-4">
            Environmental Impact
          </p>
          <p className="text-[#FEFFF8] text-[28px] font-medium leading-[1.6]">
            Our electric bikes cut carbon emissions and air pollution by
            replacing petrol vehicles. We ensure responsible battery recycling
            and power our swap stations with renewable energy to support a
            cleaner, greener Africa.
          </p>
        </div>

        <img
          src="/world_faq1.png"
          alt="Environmental impact"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[420px] object-contain object-right"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Mobile — text on top, image below */}
      <div className="md:hidden relative rounded-2xl">
        <div className="pr-4 md:pr-5 pb-0">
          <p className="text-[#F3FFBC] text-sm font-semibold tracking-wide mb-3">
            Environmental Impact
          </p>
          <p className="text-[#FEFFF8] text-lg font-medium leading-[1.6]">
            Our electric bikes cut carbon emissions and air pollution by
            replacing petrol vehicles. We ensure responsible battery recycling
            and power our swap stations with renewable energy to support a
            cleaner, greener Africa.
          </p>
        </div>

        <div className="flex justify-end">
          <img
            src="/env_mob.png"
            alt="Environmental impact"
            className="object-contain object-right"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
