import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      // Row 1, Item 1 (Wide - 58%)
      title: t("services.items.financing.title"),
      description: t("services.items.financing.description"),
      image: "/pie-chart.png", 
      className: "md:col-span-7", 
      imgClassName: "w-3/4 absolute bottom-0 right-0 translate-y-4 translate-x-4"
    },
    {
      // Row 1, Item 2 (Narrow - 42%)
      title: t("services.items.credit.title"),
      description: t("services.items.credit.description"),
      image: "/coins.png", 
      className: "md:col-span-5",
      imgClassName: "w-3/4 absolute bottom-0 right-0 translate-y-4 translate-x-4"
    },
    {
      // Row 2, Item 1 (Narrow - 42%)
      title: t("services.items.management.title"),
      description: t("services.items.management.description"),
      image: "/tricycle-front.png", 
      className: "md:col-span-5",
      imgClassName: "w-1/2 absolute bottom-0 right-0 translate-y-2 translate-x-2"
    },
    {
      // Row 2, Item 2 (Wide - 58%)
      title: t("services.items.savings.title"),
      description: t("services.items.savings.description"),
      image: null, 
      className: "md:col-span-7",
      imgClassName: ""
    },
    {
      // Row 3 (Full Width)
      title: t("services.items.loans.title"),
      description: t("services.items.loans.description"),
      image: null,
      className: "md:col-span-12",
      imgClassName: ""
    }
  ];

  return (
    <section 
      id="services" 
      className="bg-black py-20 px-6 md:px-12 text-white relative overflow-hidden"
    >
      
      {/* --- DECORATIVE LINES IMAGE --- */}
      {/* Positioned absolute top-right to appear beside/behind the title */}
      <div className="hidden lg:block absolute top-0 -right-2 z-0 pointer-events-none">
        <img 
          src="/services.png" 
          alt="" 
          className="w-50 md:w-75 lg:w-125 object-contain opacity-90"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold">
            {t("services.title")}
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Bento Grid Layout (12 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {services.map((item, index) => (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl bg-[#1A1A1A] p-8 h-80 
                flex flex-col justify-start items-start text-left
                transition-transform hover:scale-[1.01] duration-300
                ${item.className}
              `}
            >
              {/* Text Content */}
              <div className="relative z-10 max-w-md space-y-3">
                <h3 className="text-xl md:text-2xl font-bold leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Decorative Card Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className={`object-contain ${item.imgClassName}`}
                />
              )}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}