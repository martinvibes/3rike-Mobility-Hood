import { useEffect, useRef } from "react";

const features = [
  {
    title: "Investment",
    description: "Earn weekly returns for 70 weeks.",
    image: "/investment_.svg",
  },
  {
    title: "Payment",
    description: "Users can send and receive money.",
    image: "/payment_.svg",
  },
  {
    title: "Loan",
    description: "Get instant loan with good credit score.",
    image: "/loan_.svg",
  },
  {
    title: "Savings",
    description: "Set target savings and withdraw anytime.",
    image: "/savings_.svg",
  },
  {
    title: "Swap batteries",
    description: "Drivers can efficiently swap batteries.",
    image: "/swap_batteries.svg",
  },
];

const Features = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    const speed = 0.5;

    const animate = () => {
      if (!isPaused.current && container) {
        container.scrollLeft += speed;
        const halfScroll = container.scrollWidth / 2;
        if (container.scrollLeft >= halfScroll) {
          container.scrollLeft -= halfScroll;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isPaused.current = true;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = scrollRef.current?.scrollLeft ?? 0;
    scrollRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartX.current - dx;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setTimeout(() => {
      if (!isDragging.current) isPaused.current = false;
    }, 2000);
  };

  const allCards = [...features, ...features];

  return (
    <div className="bg-[#829E04] pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row md:justify-between lg:items-center px-4 md:px-6 md:px-[75px] pt-6 lg:pt-[130px] mb-10 md:mb-20 gap-6">
        <div>
          <p className="text-[#F3FFBC] text-lg md:text-[26px] font-semibold tracking-[0.2em] uppercase mb-2">
            WHAT WE DO
          </p>
          <h2 className="text-white text-[36px] md:text-[65px] font-semibold tracking-tight leading-tight">
            3rike <span className="text-[#E2F490] italic">Features</span>
          </h2>
        </div>

        <p className="md:max-w-[650px] text-base md:text-[22px] text-[#FEFFF8] leading-relaxed">
          We finance and power Africa's transition to electric mobility through
          mobility financial infrastructure for drivers and fleet operators.
        </p>
      </div>

      {/* Sliding Cards */}
      <div
        ref={scrollRef}
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => {
          if (!isDragging.current) isPaused.current = false;
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex gap-4 md:gap-6 px-6 md:px-[78px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        {allCards.map((feature, index) => (
          <div key={index} className="flex-shrink-0 w-[240px] md:w-[340px]">
            <div className="bg-transparent h-[200px] md:h-[280px] flex items-center justify-center overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="object-contain pointer-events-none"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span class="text-[#829E04] text-3xl md:text-5xl font-bold opacity-30">${feature.title}</span>`;
                    }
                  }}
                />
              </div>
            </div>

            <h3 className="text-white text-2xl md:text-[40px] font-bold mt-3 md:mt-5">
              {feature.title}
            </h3>
            <p className="text-[#E2F490] font-medium text-sm md:text-base mt-1">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
