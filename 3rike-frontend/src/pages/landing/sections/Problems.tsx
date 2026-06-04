import useScreenSize from "../../../hooks/useScreenSize";

const Problems = () => {
  const { isDesktop } = useScreenSize();

  return (
    <div>
      <div>
        <img className="w-full" src="/the_problem1.svg" alt="problems 1 img" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between bg-[#829E04] px-4 md:px-6 md:px-[78px] py-12 md:py-[100px] gap-6 md:gap-8">
        <div>
          <h1 className="text-[#F3FFBC] text-lg md:text-[26px] font-semibold tracking-wider">
            WHY NOW
          </h1>

          <h1 className="mt-4 font-bold">
            <div className="text-[36px] md:text-[65px] tracking-tighter text-white">
              The Problem
            </div>
            <div className="text-[36px] md:text-[65px] tracking-tighter text-white md:-mt-8 md:-mb-2">
              Why we <span className="text-[#E2F490]">Exist</span>
            </div>
          </h1>
        </div>

        <div className="md:w-[650px] text-base md:text-[23px] text-[#FEFFF8] space-y-4">
          <p>
            Millions of African drivers generate daily income but lack
            ownership, credit access, and transparent financial systems.
          </p>
          <p>
            3riKE is building transparent financial infrastructure for the next
            generation of electric mobility workers.
          </p>
        </div>
      </div>

      <div>
        {isDesktop ? (
          <img
            className="w-full"
            src="/the_problem2.svg"
            alt="problems 2 img"
          />
        ) : (
          <img className="w-full" src="/prob_mob.png" alt="problems 2 img" />
        )}
      </div>
    </div>
  );
};

export default Problems;
