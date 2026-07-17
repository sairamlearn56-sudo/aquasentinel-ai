import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Clock, Bug } from "lucide-react";
import moment from "moment";

const DISEASE_LABELS = {
  cholera: "Cholera",
  typhoid: "Typhoid",
  diarrhea: "Diarrhea",
  dysentery: "Dysentery",
  hepatitisA: "Hepatitis A",
};

function getRiskLabel(risk) {
  if (risk < 15) return { label: "Low", color: "text-safe", bg: "bg-safe/10", border: "border-safe/20", barColor: "bg-safe" };
  if (risk < 40) return { label: "Moderate", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", barColor: "bg-warning" };
  if (risk < 70) return { label: "High", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", barColor: "bg-orange-500" };
  return { label: "Critical", color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", barColor: "bg-danger" };
}

function parseDiseaseRisks(scan) {
  if (!scan?.disease_risks) return null;
  try {
    return typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  } catch (e) {
    return null;
  }
}

export default function DiseasePredictionPanel({ scans }) {
  const data = useMemo(() => {
    if (scans.length === 0) return null;
    const latest = scans[0];
    const risks = parseDiseaseRisks(latest);
    if (!risks || Object.keys(risks).length === 0) return null;

    const prevRisks = scans[1] ? parseDiseaseRisks(scans[1]) : null;
    const aiConfidence = latest.ai_confidence != null ? latest.ai_confidence : null;

    return Object.entries(risks)
      .sort(([, a], [, b]) => b - a)
      .map(([key, risk]) => {
        const prevRisk = prevRisks?.[key] || 0;
        const trend = risk > prevRisk + 2 ? "up" : risk < prevRisk - 2 ? "down" : "stable";
        return {
          key,
          label: DISEASE_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
          risk,
          aiConfidence,
          riskLabel: getRiskLabel(risk),
          trend,
          lastUpdated: latest.created_date,
        };
      });
  }, [scans]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
          <Bug className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Disease Prediction Panel</h2>
          <p className="text-xs text-muted-foreground">AI-powered epidemiological risk assessment</p>
        </div>
      </div>
      {!data ? (
        <div className="text-center py-12">
          <Bug className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No prediction available.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Run a water quality scan to generate AI disease risk predictions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((d, idx) => {
            const TrendIcon = d.trend === "up" ? TrendingUp : d.trend === "down" ? TrendingDown : Minus;
            const trendColor = d.trend === "up" ? "text-danger" : d.trend === "down" ? "text-safe" : "text-muted-foreground";
            return (
              <motion.div
                key={d.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-xl glass border border-border/50 p-4 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold">{d.label}</p>
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${d.riskLabel.bg} ${d.riskLabel.color} ${d.riskLabel.border} border`}>
                    {d.riskLabel.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold">{d.risk}</span>
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${d.riskLabel.barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.risk}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence: <span className="font-medium text-foreground">{d.aiConfidence != null ? `${d.aiConfidence}%` : "N/A"}</span></span>
                  <span className={`inline-flex items-center gap-0.5 ${trendColor}`}>
                    <TrendIcon className="w-3 h-3" />
                    {d.trend === "up" ? "Rising" : d.trend === "down" ? "Falling" : "Stable"}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {moment(d.lastUpdated).fromNow()}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}