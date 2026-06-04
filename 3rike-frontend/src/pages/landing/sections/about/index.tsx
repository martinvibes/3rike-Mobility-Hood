import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="bg-black -py-2 px-6 md:px-12 text-white relative overflow-hidden min-h-150 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        
        {/* --- LEFT CONTENT: Title & Text Box --- */}
        <div className="w-full md:w-1/2 space-y-8 relative z-10">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-center">
            {t("about.title")}
          </h2>

          {/* Dark Text Box */}
          <div className="bg-[#1C1C1C] rounded-2xl p-6 md:p-8 shadow-2xl max-w-xl ">
            <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
              <p>{t("about.paragraph1")}</p>
              <p>{t("about.paragraph2")}</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT CONTENT: Image --- */}
        <div 
          className="
            /* Mobile: Absolute, centered vertically, Fixed Width (500px) to maintain scale */
            absolute z-0 -right-60 top-3/4 -translate-y-1/2  w-125 pointer-events-none

            /* Desktop: Relative, Side-by-side, Normal Opacity */
            md:relative md:inset-auto md:w-1/2 md:flex md:justify-end md:opacity-100 
            md:top-auto md:translate-y-0 md:pointer-events-auto pl-0 md:pl-32
          "
        >
          <img
            src="/about.png"
            alt="About Graphic"
            className="w-full h-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
}