import ScrollReveal from "@/components/ScrollReveal";
import Hero from "./sections/Hero";
import Problems from "./sections/Problems";
import Features from "./sections/Features";
import Mission from "./sections/Mission";
import HowItWorks from "./sections/HowItWorks";
import FAQ from "./sections/FAQ";
import EnvironmentalImpact from "./sections/EnvironmentalImpact";
import CTA from "./sections/CTA";

export default function Landing() {
  return (
    <div className="bg-[#F5F5F0]">
      <Hero />

      <ScrollReveal>
        <Problems />
      </ScrollReveal>

      <ScrollReveal>
        <div id="features">
          <Features />
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-scale">
        <Mission />
      </ScrollReveal>

      <ScrollReveal>
        <div id="how-it-works">
          <HowItWorks />
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-left">
        <div id="faqs">
          <FAQ />
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-right">
        <EnvironmentalImpact />
      </ScrollReveal>

      <ScrollReveal animation="reveal-scale">
        <CTA />
      </ScrollReveal>
    </div>
  );
}
