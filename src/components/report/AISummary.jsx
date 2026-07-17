import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus, Activity, ShieldCheck, AlertTriangle, CloudRain, Waves, FlaskConical, Droplets } from "lucide-react";
import moment from "moment";
import { classifyParameter } from "@/lib/waterAnalysis";

const TIME_RANGES = [
  { key: "today", label: "today", days: 1 },
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

function getTopDisease(scan) {
  if (!scan) return null;
  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  if (!risks) return null;
  const sorted = Object.entries(risks).sort(([, a], [, b]) => b - a);
  return sorted[0] ? { name: sorted[0][0], risk: sorted[0][1] } : null;
}

function generateSummary(scans, timeRange) {
  const range = TIME_RANGES.find((r) => r.key === timeRange) || TIME_RANGES[2];
  const filtered = filterByRange(scans, timeRange);

  if (filtered.length === 0) {
    return {
      text: `No water quality data available for ${range.label}. Start a new scan to receive AI-powered insights and risk predictions.`,
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
      const recentAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
      const olderAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
      if (recentAvg > olderAvg + 5) trend = "improving";
      else if (recentAvg < olderAvg - 5) trend = "declining";
    }
  }

  // Issues
  const issues = [];
  if (classifyParameter("turbidity", latest.turbidity) !== "safe") issues.push("increased turbidity");
  if (classifyParameter("ph", latest.ph) !== "safe") issues.push("abnormal pH");
  if (classifyParameter("tds", latest.tds) !== "safe") issues.push("high TDS levels");
  if (classifyParameter("temperature", latest.temperature) !== "safe") issues.push("elevated temperature");

  const topDisease = getTopDisease(latest);

  let text = `Based on the latest sensor data from ${moment(latest.created_date).format("MMM D, h:mm A")}, `;

  if (trend === "declining") {
    text += "water quality has declined";
  } else if (trend === "improving") {
    text += "water quality is improving";
  } else {
    text += "water quality remains stable";
  }

  if (issues.length > 0) {
    text += ` due to ${issues.join(" and ")}.`;
  } else {
    text += " with all parameters within WHO safe limits.";
  }

  if (topDisease && topDisease.risk > 15) {
    const diseaseName = topDisease.name === "hepatitisA" ? "Hepatitis A" : topDisease.name.charAt(0).toUpperCase() + topDisease.name.slice(1);
    text += ` ${diseaseName} risk is ${topDisease.risk > 40 ? "elevated" : "moderate"} at ${topDisease.risk}%.`;
  }

  if (latest.risk_level === "safe") {
    text += " Continue regular monitoring to ensure consistent quality.";
  } else if (latest.risk_level === "moderate") {
    text += " Immediate chlorination and water treatment are recommended.";
  } else {
    text += " URGENT: Do not consume this water without proper treatment.";
  }

  return { text, level: latest.risk_level };
}

const LEVEL_STYLES = {
  safe: { bg: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/15", icon: "bg-emerald-500/15 text-emerald-400", accent: "text-emerald-400" },
  moderate: { bg: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/15", icon: "bg-amber-500/15 text-amber-400", accent: "text-amber-400" },
  danger: { bg: "from-rose-500/10 to-red-500/5", border: "border-rose-500/15", icon: "bg-rose-500/15 text-rose-400", accent: "text-rose-400" },
  neutral: { bg: "from-primary/10 to-blue-500/5", border: "border-primary/15", icon: "bg-primary/15 text-primary", accent: "text-primary" },
};

export default function AISummary({ scans, timeRange }) {
  const summary = useMemo(() => generateSummary(scans, timeRange), [scans, timeRange]);
  const style = LEVEL_STYLES[summary.level] || LEVEL_STYLES.neutral;
  const rangeLabel = (TIME_RANGES.find((r) => r.key === timeRange) || TIME_RANGES[2]).label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`premium-card p-6 bg-gradient-to-br ${style.bg} ${style.border}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${style.icon} flex items-center justify-center flex-shrink-0`}>
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-lg font-semibold">AI Intelligence Summary</h3>
            <span className="text-xs text-muted-foreground">· {rangeLabel}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{summary.text}</p>
        </div>
      </div>
    </motion.div>
  );
}