import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export default function RiskBadge({ level, label, size = "md" }) {
  const config = {
    safe: {
      icon: CheckCircle2,
      color: "text-safe",
      bg: "bg-safe/10",
      border: "border-safe/20",
      defaultLabel: "Safe",
    },
    moderate: {
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
      defaultLabel: "Moderate",
    },
    danger: {
      icon: ShieldAlert,
      color: "text-danger",
      bg: "bg-danger/10",
      border: "border-danger/20",
      defaultLabel: "Danger",
    },
  };

  const c = config[level] || config.safe;
  const Icon = c.icon;
  const sizeClasses = size === "lg" ? "px-5 py-2.5 text-base" : size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${c.bg} ${c.color} ${c.border} ${sizeClasses}`}>
      <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {label || c.defaultLabel}
    </span>
  );
}