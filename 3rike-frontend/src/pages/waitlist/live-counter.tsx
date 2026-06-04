import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  durationMs?: number;
  className?: string;
};

// LiveCounter animates from 0 → value with an ease-out curve. Re-runs whenever
// `value` changes (e.g. after the user signs up, the counter ticks up by 1).
export default function LiveCounter({ value, durationMs = 1200, className }: Props) {
  const [display, setDisplay] = useState(0);
  const startedAt = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startedAt.current = null;
    let raf = 0;
    const tick = (t: number) => {
      if (startedAt.current === null) startedAt.current = t;
      const elapsed = t - startedAt.current;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
