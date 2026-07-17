import React from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, AlertTriangle, CheckCircle2 } from "lucide-react";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";

function formatValue(type, value) {
  if (value === null || value === undefined || value < 0) return "N/A";
  if (type === "tds" || type === "turbidity") return Math.round(value);
  if (type === "temperature" || type === "ph") return Math.round(value * 10) / 10;
  return value;
}

function getSensorStatus(value) {
  if (value === null || value === undefined || value < 0 || value === -1) return "offline";
  return "online";
}

const STATUS_CONFIG = {
  online_safe: { icon: CheckCircle2, color: "text-safe", dot: "bg-safe", label: "Online", desc: "Within safe range" },
  online_moderate: { icon: AlertTriangle, color: "text-warning", dot: "bg-warning", label: "Caution", desc: "Slightly outside range" },
  online_danger: { icon: AlertTriangle, color: "text-danger", dot: "bg-danger", label: "Abnormal", desc: "Critically outside range" },
  offline: { icon: WifiOff, color: "text-muted-foreground", dot: "bg-muted-foreground", label: "Offline", desc: "Sensor not responding" },
};

const PARAM_META = {
  ph: { label: "pH", icon: "🧪" },
  tds: { label: "TDS", icon: "💧" },
  temperature: { label: "Temperature", icon: "🌡️" },
  turbidity: { label: "Turbidity", icon: "🌫️" },
};

export default function SensorStatusGrid({ scan, t }) {
  const params = ["ph", "tds", "temperature", "turbidity"];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide">Sensor Status</h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wifi className="w-3.5 h-3.5 text-safe" />
          {params.filter(p => getSensorStatus(scan[p]) === "online").length}/{params.length} sensors online
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {params.map((param, idx) => {
          const value = scan[param];
          const isOnline = getSensorStatus(value) === "online";
          const status = isOnline ? classifyParameter(param, value) : "offline";
          const configKey = isOnline ? `online_${status}` : "offline";
          const sc = STATUS_CONFIG[configKey];
          const meta = PARAM_META[param];
          const range = SAFE_RANGES[param];
          const StatusIcon = sc.icon;
          const formattedValue = formatValue(param, value);
          const unit = range?.unit || "";

          return (
            <motion.div
              key={param}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="premium-card p-4"
            >
              {/* Header: icon + status dot */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{meta.icon}</span>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${sc.dot} ${isOnline ? "animate-pulse" : ""}`} />
                  <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                </div>
              </div>

              {/* Value */}
              <p className="text-2xl font-heading font-bold leading-none mb-1">
                {formattedValue}
                {isOnline && unit && <span className="text-sm text-muted-foreground font-medium ml-1">{unit}</span>}
              </p>

              {/* Label */}
              <p className="text-xs text-muted-foreground mb-2">{meta.label}</p>

              {/* Status explanation */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                <StatusIcon className={`w-3 h-3 ${sc.color} flex-shrink-0`} />
                <span className="text-[10px] text-muted-foreground truncate">{sc.desc}</span>
              </div>

              {/* WHO range */}
              {isOnline && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Safe: {range.min}–{range.max}{unit && ` ${unit}`}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}