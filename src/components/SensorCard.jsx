import React from "react";
import { SAFE_RANGES, classifyParameter } from "@/lib/waterAnalysis";
import { PhIcon, TdsIcon, TurbidityIcon, TemperatureIcon } from "@/components/icons/SensorIcons";

const ICONS = {
  ph: PhIcon,
  tds: TdsIcon,
  temperature: TemperatureIcon,
  turbidity: TurbidityIcon,
};

const COLOR_MAP = {
  safe: { text: "text-safe", bg: "bg-safe/5", border: "border-safe/20", ring: "ring-safe/20" },
  moderate: { text: "text-warning", bg: "bg-warning/5", border: "border-warning/20", ring: "ring-warning/20" },
  danger: { text: "text-danger", bg: "bg-danger/5", border: "border-danger/20", ring: "ring-danger/20" },
};

export default function SensorCard({ type, value, label, delay = 0 }) {
  const Icon = ICONS[type] || TdsIcon;
  const status = classifyParameter(type, value);
  const range = SAFE_RANGES[type];
  const colors = COLOR_MAP[status];

  const unit = range?.unit || "";
  const safeText = `${range?.min}–${range?.max}${unit}`;

  return (
    <div
      className={`glass rounded-3xl p-5 border ${colors.border} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
          <Icon className="w-7 h-7" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
          {status === "safe" ? "✓ Safe" : status === "moderate" ? "⚠ Caution" : "✕ Danger"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${colors.text}`}>{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Safe range: <span className="font-medium">{safeText}</span>
        </p>
      </div>
    </div>
  );
}