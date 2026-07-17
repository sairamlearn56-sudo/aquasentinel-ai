import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import moment from "moment";

function generateSummary(scans) {
  if (!scans || scans.length === 0) return null;

  const latest = scans[0];

  // Trend computation
  const recent = scans.slice(0, Math.min(3, scans.length)).reverse();
  const older = scans.slice(3, Math.min(6, scans.length)).reverse();
  let trend = "stable";
  if (recent.length >= 2 && older.length >= 1) {
    const recentAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
    const olderAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
    if (recentAvg > olderAvg + 5) trend = "improving";
    else if (recentAvg < olderAvg - 5) trend = "declining";
  }

  // Build summary text
  const parts = [];
  const issues = [];
  if (classifyParameter("turbidity", latest.turbidity) !== "safe") issues.push("increased turbidity");
  if (classifyParameter("ph", latest.ph) !== "safe") issues.push("abnormal pH");
  if (classifyParameter("tds", latest.tds) !== "safe") issues.push("elevated TDS");
  if (classifyParameter("temperature", latest.temperature) !== "safe") issues.push("elevated temperature");

  if (trend === "declining") {
    parts.push("Based on the latest sensor data, water quality has declined");
  } else if (trend === "improving") {
    parts.push("Based on the latest sensor data, water quality is improving");
  } else {
    parts.push("Based on the latest sensor data, water quality remains stable");
  }

  if (issues.length > 0) {
    parts.push(` due to ${issues.join(" and ")}.`);
  } else {
    parts.push(" with all parameters within WHO safe limits.");
  }

  // Disease risk
  const risks = typeof latest.disease_risks === "string" ? JSON.parse(latest.disease_risks) : (latest.disease_risks || {});
  const topDisease = Object.entries(risks).sort(([, a], [, b]) => b - a)[0];
  if (topDisease && topDisease[1] > 30) {
    parts.push(` ${topDisease[0].charAt(0).toUpperCase() + topDisease[0].slice(1)} risk is elevated at ${topDisease[1]}%.`);
  }

  // Recommendation
  if (latest.risk_level === "safe") {
    parts.push(" Continue regular monitoring to maintain water quality.");
  } else if (latest.risk_level === "moderate") {
    parts.push(" Immediate chlorination and water treatment are recommended.");
  } else {
    parts.push(" Immediate water treatment and an alternative water source are strongly recommended.");
  }

  return {
    text: parts.join(""),
    trend,
    riskLevel: latest.risk_level,
    topDisease: topDisease ? { name: topDisease[0], risk: topDisease[1] } : null,
    lastUpdated: latest.created_date,
  };
}

export default function AISummary({ scans }) {
  const summary = useMemo(() => generateSummary(scans), [scans]);

  if (!summary) return null;

  const trendConfig = {
    improving: { icon: TrendingUp, color: "text-safe", bg: "bg-safe/10", label: "Improving" },
    declining: { icon: TrendingDown, color: "text-danger", bg: "bg-danger/10", label: "Declining" },
    stable: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted/50", label: "Stable" },
  };
  const tc = trendConfig[summary.trend];
  const TrendIcon = tc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="premium-card p-6 relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-5 bg-gradient-to-br from-purple-500 to-violet-600" />

      <div className="relative flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <h3 className="text-xl font-bold">AI Intelligence Summary</h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${tc.bg} ${tc.color}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              {tc.label}
            </span>
          </div>

          <p className="text-[15px] text-foreground/80 leading-relaxed mb-3">
            {summary.text}
          </p>

          <div className="flex items-center gap-3 text-[13px] text-muted-foreground flex-wrap">
            {summary.topDisease && summary.topDisease.risk > 30 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-danger/10 text-danger">
                <Activity className="w-3.5 h-3.5" />
                Top Risk: <span className="font-semibold capitalize">{summary.topDisease.name}</span> ({summary.topDisease.risk}%)
              </span>
            )}
            {summary.lastUpdated && (
              <span>Last updated {moment(summary.lastUpdated).fromNow()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}