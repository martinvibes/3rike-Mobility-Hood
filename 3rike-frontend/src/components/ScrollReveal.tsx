import { useScrollReveal } from "@/hooks/useScrollReveal";

type Props = {
  children: React.ReactNode;
  animation?: "reveal" | "reveal-left" | "reveal-right" | "reveal-scale";
  delay?: string;
  className?: string;
};

export default function ScrollReveal({
  children,
  animation = "reveal",
  delay,
  className = "",
}: Props) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? "visible" : ""} ${delay ?? ""} ${className}`}
    >
      {children}
    </div>
  );
}
