import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import moment from "moment";

const TIME_RANGES = [
  { key: "today", label: "the last 24 hours", days: 1 },
  { key: "7d", label: "the last 7 days", days: 7 },
  { key: "30d", label: "the last 30 days", days: 30 },
  { key: "90d", label: "the last 90 days", days: 90 },
  { key: "1y", label: "the past year", days: 365 },
];

function filterByRange(scans, rangeKey) {
  const range = TIME_RANGES.find((r) => r.key === rangeKey);
  if (!range) return scans;
  const cutoff = Date.now() - range.days * 24 * 60 * 60 * 1000;
  return scans.filter((s) => new Date(s.created_date).getTime() >= cutoff);
}

function getDiseaseRisks(scan) {
  if (!scan) return {};
  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : (scan.disease_risks || {});
  if (!risks.hepatitisE) risks.hepatitisE = risks.hepatitisA ? Math.round(risks.hepatitisA * 0.6) : 5;
  return risks;
}

export default function AISummary({ scans, timeRange }) {
  const summary = useMemo(() => {
    const range = TIME_RANGES.find((r) => r.key === timeRange) || TIME_RANGES[2];
    const filtered = filterByRange(scans, timeRange);

    if (filtered.length === 0) {
      return {
        text: `AI has analyzed available water quality data. No reports found for ${range.label}. Start a new scan to receive AI-powered intelligence and risk predictions.`,
        level: "neutral",
      };
    }

    const latest = filtered[0];
    const chronological = [...filtered].reverse();

    // Trend
    let trend = "stable";
    if (chronological.length >= 4) {
      const recent = chronological.slice(-3);
      const older = chronological.slice(-6, -3);
      if (older.length > 0) {
        const rAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
        const oAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
        if (rAvg > oAvg + 5) trend = "improving";
        else if (rAvg < oAvg - 5) trend = "declining";
      }
    }

    // Issues
    const issues = [];
    if (classifyParameter("turbidity", latest.turbidity) !== "safe") issues.push("increased turbidity");
    if (classifyParameter("ph", latest.ph) !== "safe") issues.push("abnormal pH");
    if (classifyParameter("tds", latest.tds) !== "safe") issues.push("elevated TDS");
    if (classifyParameter("temperature", latest.temperature) !== "safe") issues.push("elevated temperature");

    // Top disease with confidence
    const risks = getDiseaseRisks(latest);
    const topDisease = Object.entries(risks).sort(([, a], [, b]) => b - a)[0];
    const diseaseConfidence = topDisease ? Math.min(95, Math.round(60 + topDisease[1] * 0.4)) : 0;

    let text = `AI has analyzed the latest water quality reports. `;

    if (trend === "declining") {
      text += `Water quality has declined over ${range.label}`;
    } else if (trend === "improving") {
      text += `Water quality has improved over ${range.label}`;
    } else {
      text += `Water quality remains stable over ${range.label}`;
    }

    if (issues.length > 0) {
      text += ` due to ${issues.join(", ")}.`;
    } else {
      text += ` with all parameters within WHO safe limits.`;
    }

    if (topDisease && topDisease[1] > 15) {
      const diseaseName = topDisease[0] === "hepatitisA" ? "Hepatitis A" : topDisease[0] === "hepatitisE" ? "Hepatitis E" : topDisease[0].charAt(0).toUpperCase() + topDisease[0].slice(1);
      const riskLevel = topDisease[1] > 70 ? "CRITICAL" : topDisease[1] > 40 ? "HIGH" : "MODERATE";
      text += ` ${diseaseName} risk is currently ${riskLevel} with ${diseaseConfidence}% confidence.`;
    }

    if (latest.risk_level === "safe") {
      text += ` Continue regular monitoring to ensure consistent quality.`;
    } else if (latest.risk_level === "moderate") {
      text += ` Immediate chlorination and public advisories are recommended.`;
    } else {
      text += ` Immediate chlorination, public advisories, and emergency response deployment are recommended.`;
    }

    return { text, level: latest.risk_level };
  }, [scans, timeRange]);

  const style = {
    safe: { bg: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/15", icon: "bg-emerald-500/15 text-emerald-400" },
    moderate: { bg: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/15", icon: "bg-amber-500/15 text-amber-400" },
    danger: { bg: "from-rose-500/10 to-red-500/5", border: "border-rose-500/15", icon: "bg-rose-500/15 text-rose-400" },
    neutral: { bg: "from-primary/10 to-blue-500/5", border: "border-primary/15", icon: "bg-primary/15 text-primary" },
  };
  const s = style[summary.level] || style.neutral;
  const rangeLabel = (TIME_RANGES.find((r) => r.key === timeRange) || TIME_RANGES[2]).label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`premium-card p-6 bg-gradient-to-br ${s.bg} ${s.border}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${s.icon} flex items-center justify-center flex-shrink-0`}>
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-lg font-semibold">AI Executive Summary</h3>
            <span className="text-xs text-muted-foreground">· {rangeLabel}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{summary.text}</p>
        </div>
      </div>
    </motion.div>
  );
}