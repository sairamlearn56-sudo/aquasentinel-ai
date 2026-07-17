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
  safe: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
  moderate: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
  danger: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-rose-500/10" },
};

export default function SensorCard({ type, value, label, delay = 0, explanation }) {
  const Icon = ICONS[type] || TdsIcon;

  // Handle disconnected pH sensor (ESP32 sends -1 when sensor is not connected)
  if (type === "ph" && (value === -1 || value === "-1")) {
    return (
      <div
        className="premium-card p-5 border border-muted animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-muted/20 text-muted-foreground">
            <Icon className="w-7 h-7" />
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted/20 text-muted-foreground">
            Offline
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-muted-foreground">pH Sensor Not Connected</p>
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">Check sensor wiring</p>
        </div>
      </div>
    );
  }

  const status = classifyParameter(type, value);
  const range = SAFE_RANGES[type];
  const colors = COLOR_MAP[status];

  const unit = range?.unit || "";
  const safeText = `${range?.min}–${range?.max}${unit}`;

  return (
    <div
      className={`premium-card p-5 border ${colors.border} animate-fade-in-up overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.text} flex-shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} flex-shrink-0`}>
          {status === "safe" ? "✓ Safe" : status === "moderate" ? "⚠ Caution" : "✕ Danger"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1 font-medium">{label}</p>
      <div className="flex items-baseline gap-1 overflow-hidden min-w-0">
        <span className={`text-2xl sm:text-3xl font-heading font-bold ${colors.text} break-all`}>{value}</span>
        <span className="text-sm text-muted-foreground flex-shrink-0">{unit}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Safe range: <span className="font-medium">{safeText}</span>
        </p>
        {explanation && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{explanation}</p>
        )}
      </div>
    </div>
  );
}