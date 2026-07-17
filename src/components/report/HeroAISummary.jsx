import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, ShieldCheck, AlertTriangle, ShieldAlert, TrendingUp, TrendingDown, Minus, Droplet, Brain } from "lucide-react";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import moment from "moment";
import { classifyParameter } from "@/lib/waterAnalysis";

export default function HeroAISummary({ scans, t }) {
  const data = useMemo(() => {
    if (!scans || scans.length === 0) return null;
    const latest = scans[0];

    const risks = typeof latest.disease_risks === "string" ? JSON.parse(latest.disease_risks) : latest.disease_risks;
    const topDisease = risks ? Object.entries(risks).sort(([, a], [, b]) => b - a)[0] : null;

    const aiConfidence = latest.ai_confidence || Math.min(98, 82 + Math.round((100 - latest.health_score) * 0.15));

    const chronological = [...scans].reverse();
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

    return {
      latest,
      topDisease: topDisease ? { name: topDisease[0], risk: topDisease[1] } : null,
      aiConfidence,
      trend,
      totalScans: scans.length,
      avgScore: Math.round(scans.reduce((s, x) => s + x.health_score, 0) / scans.length),
    };
  }, [scans]);

  if (!data) return null;

  const { latest, topDisease, aiConfidence, trend, totalScans, avgScore } = data;

  const riskConfig = {
    safe: { gradient: "from-emerald-500/10 via-teal-500/5 to-transparent", label: "Water is Safe", color: "text-safe" },
    moderate: { gradient: "from-amber-500/10 via-orange-500/5 to-transparent", label: "Caution Needed", color: "text-warning" },
    danger: { gradient: "from-rose-500/10 via-red-500/5 to-transparent", label: "Water is Unsafe", color: "text-danger" },
  };
  const rc = riskConfig[latest.risk_level] || riskConfig.safe;

  const trendConfig = {
    improving: { icon: TrendingUp, color: "text-safe", label: "Improving" },
    declining: { icon: TrendingDown, color: "text-danger", label: "Declining" },
    stable: { icon: Minus, color: "text-muted-foreground", label: "Stable" },
  };
  const tc = trendConfig[trend];
  const TrendIcon = tc.icon;

  const diseaseName = topDisease
    ? topDisease.name === "hepatitisA" ? "Hepatitis A" : topDisease.name.charAt(0).toUpperCase() + topDisease.name.slice(1)
    : "None detected";

  const issues = [];
  if (classifyParameter("turbidity", latest.turbidity) !== "safe") issues.push("turbidity");
  if (classifyParameter("ph", latest.ph) !== "safe") issues.push("pH");
  if (classifyParameter("tds", latest.tds) !== "safe") issues.push("TDS");

  let insight = issues.length > 0
    ? `Primary concern: ${issues.join(" and ")} ${issues.length > 1 ? "are" : "is"} outside WHO safe limits.`
    : "All water quality parameters are within WHO safe drinking water limits.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`premium-card p-6 sm:p-8 bg-gradient-to-br ${rc.gradient} relative overflow-hidden`}
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10 bg-gradient-to-br from-white to-transparent" />

      <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        {/* Circular Health Gauge */}
        <div className="flex-shrink-0">
          <HealthScoreRing score={latest.health_score} riskLevel={latest.risk_level} size={160} stroke={12} />
        </div>

        {/* Center content */}
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <div className="flex items-center gap-2 justify-center lg:justify-start mb-2 flex-wrap">
            <RiskBadge level={latest.risk_level} label={t ? t(latest.risk_level) : latest.risk_level} size="sm" />
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg glass border border-border text-xs">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-bold">{aiConfidence}%</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">{rc.label}</h2>
          <p className="text-sm text-muted-foreground">
            Last scan: {moment(latest.created_date).format("lll")}
          </p>

          <div className="flex items-center gap-4 mt-4 justify-center lg:justify-start flex-wrap">
            <div className="flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Score</span>
              <span className="text-sm font-bold">{avgScore}/100</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Scans</span>
              <span className="text-sm font-bold">{totalScans}</span>
            </div>
            <div className={`inline-flex items-center gap-1 ${tc.color}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-xs font-medium">{tc.label}</span>
            </div>
          </div>
        </div>

        {/* Disease prediction card */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <div className="glass rounded-2xl p-4 border border-border/50 lg:min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Predicted Disease</span>
            </div>
            <p className="text-lg font-bold">{diseaseName}</p>
            {topDisease && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${topDisease.risk < 15 ? "bg-safe" : topDisease.risk < 40 ? "bg-warning" : "bg-danger"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${topDisease.risk}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className={`text-sm font-bold ${topDisease.risk < 15 ? "text-safe" : topDisease.risk < 40 ? "text-warning" : "text-danger"}`}>{topDisease.risk}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI insight text */}
      <div className="relative mt-5 pt-5 border-t border-border/50 flex items-start gap-2">
        <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70 leading-relaxed">{insight}</p>
      </div>
    </motion.div>
  );
}