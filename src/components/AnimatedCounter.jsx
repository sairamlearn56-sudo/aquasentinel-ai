import React, { useEffect, useRef, useState } from "react";

/**
 * AnimatedCounter — animates from 0 to target when scrolled into view.
 * Supports comma-separated large numbers and + suffix.
 */
export default function AnimatedCounter({ target, duration = 1500, suffix = "", prefix = "", className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const numericTarget = parseFloat(target.toString().replace(/[^0-9.]/g, "")) || 0;

          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(numericTarget * eased);
            if (progress >= 1) clearInterval(interval);
          }, 16);

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const isInteger = !target.toString().includes(".");
  const displayValue = isInteger ? Math.round(count).toLocaleString() : count.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}