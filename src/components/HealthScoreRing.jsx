import React, { useEffect, useState } from "react";

export default function HealthScoreRing({ score, size = 200, stroke = 14, riskLevel = "safe" }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  const gradId = `scoreGrad-${riskLevel}-${size}`;
  const colorMap = {
    safe: { c1: "#34D399", c2: "#2DD4BF", glow: "rgba(52,211,153,0.2)" },
    moderate: { c1: "#FBBF24", c2: "#FBBF24", glow: "rgba(251,191,36,0.2)" },
    danger: { c1: "#F87171", c2: "#F87171", glow: "rgba(248,113,113,0.2)" },
  };
  const cg = colorMap[riskLevel] || colorMap.safe;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cg.c1} />
            <stop offset="100%" stopColor={cg.c2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
          opacity={0.15}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.3s ease",
            filter: `drop-shadow(0 0 10px ${cg.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold" style={{ fontSize: size * 0.22, color: cg.c1 }}>
          {animatedScore}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5 font-medium">/ 100</span>
      </div>
    </div>
  );
}