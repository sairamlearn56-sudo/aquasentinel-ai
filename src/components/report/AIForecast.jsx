import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Activity } from "lucide-react";
import { computeRiskLevel } from "@/lib/waterAnalysis";

const PERIODS = [
  { key: "today", label: "Today", days: 0 },
  { key: "tomorrow", label: "Tomorrow", days: 1 },
  { key: "3d", label: "3 Days", days: 3 },
  { key: "7d", label: "7 Days", days: 7 },
  { key: "30d", label: "30 Days", days: 30 },
];

function getDiseaseRisks(scan) {
  if (!scan) return {};
  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : (scan.disease_risks || {});
  if (!risks.hepatitisE) risks.hepatitisE = risks.hepatitisA ? Math.round(risks.hepatitisA * 0.6) : 5;
  return risks;
}

export default function AIForecast({ scans }) {
  const forecasts = useMemo(() => {
    if (scans.length < 2) return null;
    const chronological = [...scans].reverse();
    const recent = chronological.slice(-5);
    const n = recent.length;
    const xs = recent.map((_, i) => i);
    const ys = recent.map(s => s.health_score);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    const denom = xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
    const slope = denom === 0 ? 0 : xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0) / denom;

    const latest = scans[0];
    const risks = getDiseaseRisks(latest);
    const topDisease = Object.entries(risks).sort(([, a], [, b]) => b - a)[0];

    return PERIODS.map(p => {
      const projectedScore = Math.max(0, Math.min(100, Math.round(latest.health_score + slope * p.days)));
      const diseaseRiskChange = Math.round(slope * p.days * 0.4);
      const projectedDiseaseRisk = Math.max(0, Math.min(95, (topDisease?.[1] || 0) + diseaseRiskChange));
      const confidence = Math.max(35, Math.round(95 - p.days * 3.5));
      const riskLevel = computeRiskLevel(projectedScore);

      return {
        ...p,
        healthScore: projectedScore,
        diseaseRisk: projectedDiseaseRisk,
        diseaseName: topDisease ? (topDisease[0] === "hepatitisA" ? "Hep A" : topDisease[0] === "hepatitisE" ? "Hep E" : topDisease[0].charAt(0).toUpperCase() + topDisease[0].slice(1)) : "N/A",
        confidence,
        riskLevel,
      };
    });
  }, [scans]);

  if (!forecasts) return null;

  const riskColors = { safe: "text-safe", moderate: "text-warning", danger: "text-danger" };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Forecast</h2>
          <p className="text-xs text-muted-foreground">Predictive water quality modeling</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecasts.map((f, idx) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            className="rounded-xl glass border border-border/50 p-4 text-center"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">{f.label}</p>
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground">Water Health</p>
              <p className={`text-2xl font-extrabold ${riskColors[f.riskLevel]}`}>{f.healthScore}</p>
              <p className={`text-[10px] font-medium capitalize ${riskColors[f.riskLevel]}`}>{f.riskLevel}</p>
            </div>
            <div className="mb-2 pt-2 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Disease Risk</p>
              <p className="text-sm font-bold">{f.diseaseName}</p>
              <p className="text-xs text-muted-foreground">{f.diseaseRisk}%</p>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Confidence</p>
              <div className="flex items-center justify-center gap-1">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden max-w-[40px]">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${f.confidence}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.06 }}
                  />
                </div>
                <span className="text-[10px] font-medium text-primary">{f.confidence}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}