import React from "react";

export function getWaterGrade(score) {
  if (score >= 90) return { letter: "A+", color: "text-safe", bg: "bg-safe/10", border: "border-safe/20", label: "Excellent" };
  if (score >= 80) return { letter: "A", color: "text-safe", bg: "bg-safe/10", border: "border-safe/20", label: "Very Good" };
  if (score >= 70) return { letter: "B", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Good" };
  if (score >= 50) return { letter: "C", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Fair" };
  if (score >= 30) return { letter: "D", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Poor" };
  return { letter: "F", color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", label: "Unsafe" };
}

export default function WaterGradeBadge({ score, size = "md" }) {
  const grade = getWaterGrade(score);
  const sizeClasses = size === "lg" ? "w-14 h-14 text-2xl" : size === "sm" ? "w-9 h-9 text-sm" : "w-11 h-11 text-lg";

  return (
    <div className={`inline-flex flex-col items-center justify-center rounded-2xl border ${grade.bg} ${grade.border} ${sizeClasses} flex-shrink-0`}>
      <span className={`font-heading font-extrabold ${grade.color} leading-none`}>{grade.letter}</span>
      {size === "lg" && <span className="text-[9px] text-muted-foreground mt-0.5 font-medium">{grade.label}</span>}
    </div>
  );
}