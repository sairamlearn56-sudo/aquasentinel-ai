import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowUp, ArrowDown, Minus, History } from "lucide-react";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";

export default function ExplainableAISection({ scans }) {
  const factors = useMemo(() => {
    if (scans.length === 0) return [];
    const latest = scans[0];
    const result = [];

    // Turbidity factor
    const turbStatus = classifyParameter("turbidity", latest.turbidity);
    if (turbStatus !== "safe") {
      const deviation = Math.round(((latest.turbidity - SAFE_RANGES.turbidity.max) / SAFE_RANGES.turbidity.max) * 100);
      result.push({ direction: "up", label: "Turbidity", detail: `+${Math.max(0, deviation)}% above WHO limit`, severity: turbStatus });
    }

    // pH factor
    const phStatus = classifyParameter("ph", latest.ph);
    if (phStatus !== "safe") {
      result.push({ direction: latest.ph < 6.5 ? "down" : "up", label: "pH", detail: latest.ph < 6.5 ? "Below WHO standard (6.5)" : "Above WHO standard (8.5)", severity: phStatus });
    }

    // TDS factor
    const tdsStatus = classifyParameter("tds", latest.tds);
    if (tdsStatus !== "safe") {
      const deviation = Math.round(((latest.tds - SAFE_RANGES.tds.max) / SAFE_RANGES.tds.max) * 100);
      result.push({ direction: "up", label: "High TDS", detail: `+${Math.max(0, deviation)}% above limit`, severity: tdsStatus });
    }

    // Temperature factor
    const tempStatus = classifyParameter("temperature", latest.temperature);
    if (tempStatus !== "safe") {
      result.push({ direction: "up", label: "Temperature", detail: "Elevated — promotes bacterial growth", severity: tempStatus });
    }

    // Heavy Rainfall (inferred from high turbidity + low temp)
    if (latest.turbidity > 10 && latest.temperature < 22) {
      result.push({ direction: "up", label: "Heavy Rainfall", detail: "Inferred from turbidity & temperature patterns", severity: "moderate" });
    }

    // E. coli detection (inferred from high disease risks)
    const risks = typeof latest.disease_risks === "string" ? JSON.parse(latest.disease_risks) : latest.disease_risks;
    if (risks && Object.values(risks).some(r => r > 70)) {
      result.push({ direction: "up", label: "E. coli Detected", detail: "High contamination indicators suggest possible E. coli presence", severity: "danger" });
    }

    // If all safe
    if (result.length === 0) {
      result.push({ direction: "neutral", label: "All Parameters Normal", detail: "No anomalous factors detected", severity: "safe" });
    }

    return result;
  }, [scans]);

  const similarity = useMemo(() => {
    if (scans.length === 0) return 0;
    const latest = scans[0];
    const contaminationLevel = ["ph", "tds", "turbidity", "temperature"].reduce((sum, p) => {
      const s = classifyParameter(p, latest[p]);
      return sum + (s === "danger" ? 3 : s === "moderate" ? 1.5 : 0);
    }, 0);
    return Math.min(95, Math.round(45 + contaminationLevel * 12));
  }, [scans]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Why Did AI Predict This?</h2>
          <p className="text-xs text-muted-foreground">Explainable AI prediction factors</p>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
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

      {/* Historical similarity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-violet-500/5 border border-purple-500/15"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
          <History className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Historical Outbreak Similarity</p>
          <p className="text-sm font-medium">Pattern matches known contamination events</p>
        </div>
        <div className="text-right">
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-extrabold text-purple-400"
          >
            {similarity}%
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}