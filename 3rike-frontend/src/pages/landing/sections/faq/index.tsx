import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Faq() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = t("faq.faqs", { returnObjects: true }) as Array<{ q: string; a: string }>;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="bg-black py-20 px-4 relative overflow-hidden">

      {/* --- DECORATIVE LINES IMAGE --- */}
      {/* Positioned absolute top-right to appear beside/behind the title */}
      <div className="hidden lg:block absolute top-0 -right-2 z-0 pointer-events-none">
        <img
          src="/faq.png"
          alt=""
          className="w-50 md:w-75 lg:w-125 object-contain opacity-90"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold text-white mb-4 text-left">
          {t("faq.header.title")}
        </h1>
        <p className="text-white max-w-3xl mb-10">
          {t("faq.header.subtitle")}
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#3f3f3f] text-white rounded-md overflow-hidden relative border-l-[6px] border-[#01C259]">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-semibold focus:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-200 text-md">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
