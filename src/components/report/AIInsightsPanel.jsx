import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, TrendingDown, Bug, MapPin, Activity, Sparkles, Award, Database } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import { getWaterGrade } from "@/components/report/WaterGradeBadge";

function parseDiseaseRisks(scan) {
  if (!scan?.disease_risks) return null;
  try {
    return typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  } catch (e) {
    return null;
  }
}

export default function AIInsightsPanel({ scans }) {
  const insights = useMemo(() => {
    if (scans.length === 0) return null;
    const latest = scans[0];

    // Primary contamination source — from actual sensor values
    const params = [
      { key: "turbidity", label: "Turbidity" },
      { key: "tds", label: "TDS" },
      { key: "ph", label: "pH" },
      { key: "temperature", label: "Temperature" },
    ];
    let worstParam = "None";
    let worstStatus = "safe";
    params.forEach((p) => {
      const status = classifyParameter(p.key, latest[p.key]);
      if (status === "danger" && worstStatus !== "danger") { worstParam = p.label; worstStatus = status; }
      else if (status === "moderate" && worstStatus === "safe") { worstParam = p.label; worstStatus = status; }
    });

    // Trend — compare previous readings with current
    let trend = "stable";
    if (scans.length >= 4) {
      const chronological = [...scans].reverse();
      const recent = chronological.slice(-3);
      const older = chronological.slice(-6, -3);
      if (older.length > 0) {
        const rAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
        const oAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
        if (rAvg > oAvg + 5) trend = "improving";
        else if (rAvg < oAvg - 5) trend = "declining";
      }
    }

    // Top disease — from actual stored disease_risks
    const risks = parseDiseaseRisks(latest);
    const topDisease = risks ? Object.entries(risks).sort(([, a], [, b]) => b - a)[0] : null;

    // Highest-risk location — from actual scan data
    const withLocations = scans.filter((s) => s.location_name);
    const riskiestLocation = withLocations.length > 0
      ? withLocations.reduce((min, s) => (s.health_score < min.health_score ? s : min))
      : null;

    // AI confidence — from actual stored field
    const confidence = latest.ai_confidence != null ? latest.ai_confidence : null;

    const grade = getWaterGrade(latest.health_score);

    return { latest, worstParam, trend, topDisease, riskiestLocation, confidence, grade };
  }, [scans]);

  if (!insights) return null;
  const { latest, worstParam, trend, topDisease, riskiestLocation, confidence, grade } = insights;

  const TrendIcon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Activity;
  const trendColor = trend === "improving" ? "text-safe" : trend === "declining" ? "text-danger" : "text-muted-foreground";

  const items = [
    { icon: AlertCircle, label: "Primary Contamination", value: worstParam, color: "text-orange-400", bg: "bg-orange-500/15" },
    { icon: TrendIcon, label: "Quality Trend", value: trend.charAt(0).toUpperCase() + trend.slice(1), color: trendColor, bg: "bg-muted/50" },
    {
      icon: Bug,
      label: "Most Likely Disease",
      value: topDisease ? (topDisease[0] === "hepatitisA" ? "Hepatitis A" : topDisease[0].charAt(0).toUpperCase() + topDisease[0].slice(1)) : "No data",
      sub: topDisease ? `${topDisease[1]}%` : "",
      color: "text-rose-400",
      bg: "bg-rose-500/15",
    },
    {
      icon: MapPin,
      label: "Highest-Risk Location",
      value: riskiestLocation?.location_name || "No location data",
      sub: riskiestLocation ? `${riskiestLocation.health_score}/100` : "",
      color: "text-amber-400",
      bg: "bg-amber-500/15",
    },
    { icon: Activity, label: "Most Abnormal Sensor", value: worstParam !== "None" ? worstParam : "All Normal", color: worstParam !== "None" ? "text-warning" : "text-safe", bg: "bg-muted/50" },
    { icon: Sparkles, label: "AI Confidence", value: confidence != null ? `${confidence}%` : "Unavailable", color: confidence != null ? "text-primary" : "text-muted-foreground", bg: "bg-primary/15" },
    { icon: Award, label: "Health Grade", value: grade.letter, sub: grade.label, color: grade.color, bg: grade.bg },
    { icon: Database, label: "Reports Analyzed", value: scans.length, color: "text-violet-400", bg: "bg-violet-500/15" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Insights</h2>
          <p className="text-xs text-muted-foreground">Decision-support intelligence from actual sensor data</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="rounded-xl glass border border-border/50 p-4 hover:border-border transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mb-2.5`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{item.label}</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-base font-bold truncate">{item.value}</p>
                {item.sub && <span className={`text-xs font-medium ${item.color}`}>{item.sub}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}