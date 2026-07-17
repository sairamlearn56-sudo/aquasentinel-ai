import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Gauge, Award } from "lucide-react";
import { getWaterGrade } from "@/components/report/WaterGradeBadge";
import WaterGradeBadge from "@/components/report/WaterGradeBadge";

const HEAT_LEVELS = [
  { key: "safe", label: "Safe", color: "#10b981", bg: "bg-safe" },
  { key: "moderate", label: "Moderate", color: "#eab308", bg: "bg-warning" },
  { key: "high", label: "High", color: "#f97316", bg: "bg-orange-500" },
  { key: "critical", label: "Critical", color: "#ef4444", bg: "bg-danger" },
];

function getHeatLevel(riskLevel) {
  if (riskLevel === "safe") return 0;
  if (riskLevel === "moderate") return 1;
  if (riskLevel === "danger") return 3;
  return 0;
}

function ConfidenceMeter({ confidence }) {
  if (confidence == null) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative" style={{ width: 96, height: 96 }}>
          <svg width={96} height={96} className="-rotate-90">
            <circle cx={48} cy={48} r={38} fill="none" stroke="hsl(var(--muted))" strokeWidth={7} opacity={0.2} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">N/A</span>
          </div>
        </div>
        <span className="text-xs font-medium mt-1 text-muted-foreground">Confidence</span>
        <span className="text-[10px] text-muted-foreground">Unavailable</span>
      </div>
    );
  }

  const level = confidence >= 90 ? "Very High" : confidence >= 75 ? "High" : confidence >= 50 ? "Medium" : "Low";
  const color = confidence >= 90 ? "#10b981" : confidence >= 75 ? "#06b6d4" : confidence >= 50 ? "#f59e0b" : "#ef4444";
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: 96, height: 96 }}>
        <svg width={96} height={96} className="-rotate-90">
          <circle cx={48} cy={48} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={7} opacity={0.2} />
          <motion.circle
            cx={48} cy={48} r={radius} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold" style={{ color }}>{confidence}%</span>
        </div>
      </div>
      <span className="text-xs font-medium mt-1" style={{ color }}>{level}</span>
      <span className="text-[10px] text-muted-foreground">Confidence</span>
    </div>
  );
}

export default function StatusOverview({ scans }) {
  const data = useMemo(() => {
    const latest = scans[0];
    if (!latest) return null;
    const confidence = latest.ai_confidence != null ? latest.ai_confidence : null;
    const heatIdx = getHeatLevel(latest.risk_level);
    return { latest, confidence, heatIdx };
  }, [scans]);

  if (!data) return null;
  const { latest, confidence, heatIdx } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Risk Heat Index */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="premium-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold">Risk Heat Index</h3>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          {HEAT_LEVELS.map((level, idx) => (
            <div key={level.key} className="flex-1">
              <motion.div
                className={`h-3 rounded-full ${idx === heatIdx ? level.bg : "bg-muted"} ${idx === heatIdx ? "animate-pulse" : ""}`}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: idx === heatIdx ? 1 : 0.3 }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {HEAT_LEVELS.map((level, idx) => (
            <span key={level.key} className={`text-[10px] font-medium ${idx === heatIdx ? "" : "text-muted-foreground"}`} style={idx === heatIdx ? { color: level.color } : {}}>
              {level.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Confidence Meter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="premium-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">AI Confidence</h3>
        </div>
        <div className="flex items-center justify-center py-1">
          <ConfidenceMeter confidence={confidence} />
        </div>
      </motion.div>

      {/* Water Quality Grade */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="premium-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Award className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold">Water Grade</h3>
        </div>
        <div className="flex items-center justify-center gap-4 py-2">
          <WaterGradeBadge score={latest.health_score} size="lg" />
          <div>
            <p className="text-3xl font-extrabold">{latest.health_score}<span className="text-sm text-muted-foreground font-medium">/100</span></p>
            <p className="text-xs text-muted-foreground">Health Score</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}