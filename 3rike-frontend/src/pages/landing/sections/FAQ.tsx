import { useState } from "react";

const faqs = [
  {
    question: "How does the investment work ?",
    answer:
      "Retail investors can buy a full 3rike and earn weekly returns, or purchase shares in a 3rike and still earn weekly.",
  },
  {
    question: "How do driver earn",
    answer:
      "Riders earn daily by putting their 3riKE on the road and transporting passengers.",
  },
  {
    question: "How to save ?",
    answer:
      "Drivers, retail investors, and others can choose any of our savings plans and earn interest based on their selected plan.",
  },
  {
    question: "Who's eligible for Loan ?",
    answer:
      "Good credit and consistent savings improve your chances of getting a loan.",
  },
  {
    question: "Duration of of time of ownership",
    answer: "Complete ownership in just 70 weeks.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#F5F5F0] px-4 md:px-6 md:px-[78px] py-16 md:py-24">
      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:flex gap-16 items-start">
        {/* Left — Questions */}
        <div className="w-1/2">
          <div className="bg-white rounded-t-2xl overflow-hidden">
            <div className="h-3 bg-[#829E04]" />
            <div className="p-10">
              <h2 className="text-[#829E04] text-[32px] font-bold italic mb-8">
                How 3rike works
              </h2>

              <div>
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-[#E5E5E5]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
                    >
                      <span
                        className={`text-lg font-medium transition-colors duration-300 ${
                          openIndex === index
                            ? "text-[#829E04]"
                            : "text-[#1A1A1A]"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`text-2xl ml-4 transition-all duration-300 inline-block ${
                          openIndex === index
                            ? "text-[#829E04] rotate-45"
                            : "text-[#1A1A1A] rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Single Answer */}
        <div className="w-1/2 flex items-center pt-16">
          {openIndex !== null && (
            <p
              key={openIndex}
              className="text-[#1A1A1A] text-[28px] font-bold leading-snug animate-fade-in"
            >
              {faqs[openIndex].answer}
            </p>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: accordion dropdown */}
      <div className="lg:hidden">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="h-3 bg-[#829E04]" />
          <div className="p-6">
            <h2 className="text-[#829E04] text-2xl font-bold italic mb-6">
              How 3rike Works
            </h2>

            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
                  >
                    <span
                      className={`text-base font-medium transition-colors duration-300 ${
                        openIndex === index
                          ? "text-[#829E04]"
                          : "text-[#1A1A1A]"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`text-xl ml-3 transition-all duration-300 inline-block ${
                        openIndex === index
                          ? "text-[#829E04] rotate-45"
                          : "text-[#1A1A1A] rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Dropdown answer */}
                  <div
                    className={`overflow-hidden transition-all duration-400 ease-in-out ${
                      openIndex === index ? "max-h-60 pb-4" : "max-h-0"
                    }`}
                  >
                    <p className="text-[#555555] text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
