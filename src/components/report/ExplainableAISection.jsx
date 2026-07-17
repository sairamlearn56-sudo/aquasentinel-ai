import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";

export default function ExplainableAISection({ scans }) {
  const factors = useMemo(() => {
    if (scans.length === 0) return null;
    const latest = scans[0];
    const result = [];

    const turbStatus = classifyParameter("turbidity", latest.turbidity);
    if (turbStatus !== "safe") {
      const deviation = Math.round(((latest.turbidity - SAFE_RANGES.turbidity.max) / SAFE_RANGES.turbidity.max) * 100);
      result.push({ direction: "up", label: "Turbidity", detail: `+${Math.max(0, deviation)}% above WHO limit`, severity: turbStatus });
    }

    const phStatus = classifyParameter("ph", latest.ph);
    if (phStatus !== "safe") {
      result.push({ direction: latest.ph < 6.5 ? "down" : "up", label: "pH", detail: latest.ph < 6.5 ? `Below WHO standard (6.5) — current: ${latest.ph}` : `Above WHO standard (8.5) — current: ${latest.ph}`, severity: phStatus });
    }

    const tdsStatus = classifyParameter("tds", latest.tds);
    if (tdsStatus !== "safe") {
      const deviation = Math.round(((latest.tds - SAFE_RANGES.tds.max) / SAFE_RANGES.tds.max) * 100);
      result.push({ direction: "up", label: "High TDS", detail: `+${Math.max(0, deviation)}% above limit — current: ${latest.tds} ppm`, severity: tdsStatus });
    }

    const tempStatus = classifyParameter("temperature", latest.temperature);
    if (tempStatus !== "safe") {
      result.push({ direction: "up", label: "Temperature", detail: `Elevated — current: ${latest.temperature}°C`, severity: tempStatus });
    }

    if (result.length === 0) {
      result.push({ direction: "neutral", label: "All Parameters Normal", detail: "No anomalous factors detected — all sensors within WHO safe limits", severity: "safe" });
    }

    return result;
  }, [scans]);

  if (!factors) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Why Did AI Predict This?</h2>
          <p className="text-xs text-muted-foreground">Explainable AI prediction factors from actual sensor data</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {factors.map((factor, idx) => {
          const Icon = factor.direction === "up" ? ArrowUp : factor.direction === "down" ? ArrowDown : Minus;
          const color = factor.severity === "danger" ? "text-danger" : factor.severity === "moderate" ? "text-warning" : "text-safe";
          const bg = factor.severity === "danger" ? "bg-danger/10" : factor.severity === "moderate" ? "bg-warning/10" : "bg-safe/10";
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl glass border border-border/50"
            >
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{factor.label}</p>
                <p className="text-xs text-muted-foreground">{factor.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}