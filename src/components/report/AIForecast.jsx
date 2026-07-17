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

function parseDiseaseRisks(scan) {
  if (!scan?.disease_risks) return null;
  try {
    return typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  } catch (e) {
    return null;
  }
}

export default function AIForecast({ scans }) {
  const forecasts = useMemo(() => {
    if (scans.length < 3) return null;
    const chronological = [...scans].reverse();
    const recent = chronological.slice(-5);
    const n = recent.length;
    const xs = recent.map((_, i) => i);
    const ys = recent.map((s) => s.health_score);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    const denom = xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
    const slope = denom === 0 ? 0 : xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0) / denom;

    const latest = scans[0];
    const risks = parseDiseaseRisks(latest);
    const topDisease = risks ? Object.entries(risks).sort(([, a], [, b]) => b - a)[0] : null;
    const aiConfidence = latest.ai_confidence != null ? latest.ai_confidence : null;

    return PERIODS.map((p) => {
      const projectedScore = Math.max(0, Math.min(100, Math.round(latest.health_score + slope * p.days)));
      const diseaseRiskChange = Math.round(slope * p.days * 0.4);
      const projectedDiseaseRisk = topDisease ? Math.max(0, Math.min(95, topDisease[1] + diseaseRiskChange)) : null;
      const riskLevel = computeRiskLevel(projectedScore);

      return {
        ...p,
        healthScore: projectedScore,
        diseaseRisk: projectedDiseaseRisk,
        diseaseName: topDisease
          ? topDisease[0] === "hepatitisA"
            ? "Hep A"
            : topDisease[0].charAt(0).toUpperCase() + topDisease[0].slice(1)
          : "No data",
        aiConfidence,
        riskLevel,
      };
    });
  }, [scans]);

  const riskColors = { safe: "text-safe", moderate: "text-warning", danger: "text-danger" };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Forecast</h2>
          <p className="text-xs text-muted-foreground">Predictive modeling based on historical readings</p>
        </div>
      </div>
      {!forecasts ? (
        <div className="text-center py-12">
          <Activity className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Collect more sensor readings to generate reliable AI predictions.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">At least 3 scans are needed for trend-based forecasting.</p>
        </div>
      ) : (
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
                {f.diseaseRisk != null ? (
                  <p className="text-xs text-muted-foreground">{f.diseaseRisk}%</p>
                ) : (
                  <p className="text-xs text-muted-foreground/60">No data</p>
                )}
              </div>
              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground">Confidence</p>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {f.aiConfidence != null ? `${f.aiConfidence}%` : "Confidence unavailable"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}