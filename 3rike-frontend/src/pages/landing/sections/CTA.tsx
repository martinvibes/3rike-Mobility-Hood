import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#829E04] px-4 md:px-6 md:px-[78px] py-12 md:py-20 border-t-[10px] border-[#F3FFBC]">
      <div className="bg-[#F5F5F0] rounded-3xl md:rounded-[40px] py-16 md:py-32 px-4 md:px-16 text-center mx-auto">
        <h2 className="text-[#829E04] text-[20px] sm:text-[36px] md:text-[55px] font-extrabold leading-tight mb-4 md:mb-6">
          Powering the Future of Greener
          <br />
          Smart - City Mobility
        </h2>

        <p className="text-[#999999] text-sm md:text-2xl italic mb-6 md:mb-10">
          Empowering 3rike drivers to own their tricycle while
          <br className="hidden sm:block" />
          {" "}investors earns constant returns.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <button
            type="button"
            onClick={() => navigate("/create-account-rider")}
            className="bg-[#829E04] text-white py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-medium cursor-pointer"
          >
            Join as a 3riker
          </button>
          <button
            type="button"
            onClick={() => navigate("/waitlist")}
            className="border border-[#829E04] py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-medium text-[#829E04] cursor-pointer"
          >
            Earn yields
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
