import React from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";

function formatValue(type, value) {
  if (value === null || value === undefined || value < 0) return "N/A";
  if (type === "tds" || type === "turbidity") return Math.round(value);
  if (type === "temperature" || type === "ph") return Math.round(value * 10) / 10;
  return value;
}

function getUnit(type) {
  return SAFE_RANGES[type]?.unit || "";
}

function getRiskContribution(status) {
  if (status === "safe") return 0;
  if (status === "moderate") return 52;
  return 88;
}

const PARAM_LABELS = {
  ph: "pH Level",
  tds: "Total Dissolved Solids",
  temperature: "Water Temperature",
  turbidity: "Turbidity",
};

const PARAM_EXPLANATIONS = {
  ph: { safe: "Balanced acidity — within WHO 6.5–8.5 range", moderate: "Slight pH deviation from ideal range", danger: "Severe pH imbalance — health risk" },
  tds: { safe: "Mineral content within safe limits (< 500 ppm)", moderate: "Elevated dissolved solids detected", danger: "Excessive dissolved contamination" },
  temperature: { safe: "Temperature within normal range (15–30°C)", moderate: "Slightly warm — may promote bacteria", danger: "High temperature accelerates pathogens" },
  turbidity: { safe: "Clear water (< 5 NTU)", moderate: "Cloudy — suspended particles present", danger: "Very cloudy — shields pathogens" },
};

const STATUS_CONFIG = {
  safe: { color: "text-safe", bg: "bg-safe", barBg: "bg-safe/20", label: "Safe", icon: TrendingDown },
  moderate: { color: "text-warning", bg: "bg-warning", barBg: "bg-warning/20", label: "Caution", icon: Minus },
  danger: { color: "text-danger", bg: "bg-danger", barBg: "bg-danger/20", label: "Critical", icon: TrendingUp },
};

export default function ExplainableAI({ scan }) {
  const params = ["ph", "tds", "temperature", "turbidity"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="premium-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-lg">Explainable AI</h2>
          <p className="text-xs text-muted-foreground">Key factors influencing this prediction</p>
        </div>
      </div>

      <div className="space-y-3">
        {params.map((param, idx) => {
          const value = scan[param];
          const status = classifyParameter(param, value);
          const sc = STATUS_CONFIG[status];
          const contribution = getRiskContribution(status);
          const explanation = PARAM_EXPLANATIONS[param]?.[status] || "";
          const range = SAFE_RANGES[param];
          const StatusIcon = sc.icon;

          return (
            <motion.div
              key={param}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + idx * 0.06 }}
              className="flex items-center gap-4 p-3.5 rounded-xl glass border border-border/50 hover:border-border transition-colors"
            >
              {/* Status icon */}
              <div className={`w-10 h-10 rounded-xl ${sc.barBg} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`w-5 h-5 ${sc.color}`} />
              </div>

              {/* Parameter info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium">{PARAM_LABELS[param]}</span>
                  <span className="text-sm font-bold">
                    {formatValue(param, value)}{value >= 0 && getUnit(param) ? ` ${getUnit(param)}` : ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{explanation}</p>

                {/* Risk contribution bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full ${sc.bg} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${contribution}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + idx * 0.06, ease: "easeOut" }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${sc.color} whitespace-nowrap`}>
                    {contribution === 0 ? "No risk" : `${contribution}% risk`}
                  </span>
                </div>
              </div>

              {/* WHO range */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">WHO Range</p>
                <p className="text-xs font-medium">{range.min}–{range.max}{range.unit && ` ${range.unit}`}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}