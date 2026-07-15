import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Volume2, VolumeX, Sparkles, ChevronDown } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import SensorCard from "@/components/SensorCard";
import ResultDiseaseCards from "@/components/livescan/ResultDiseaseCards";
import ResultChecklist from "@/components/livescan/ResultChecklist";
import ResultTrendGraph from "@/components/livescan/ResultTrendGraph";
import PrimaryRecommendation from "@/components/livescan/PrimaryRecommendation";

function getSensorExplanation(type, value) {
  const status = classifyParameter(type, value);
  if (type === "ph") {
    if (status === "safe") return "Balanced — neither too acidic nor alkaline";
    if (status === "moderate")
      return value < 6.5 ? "Slightly acidic — may leach metals from pipes" : "Slightly alkaline — minor deviation";
    return value < 5.5 ? "Dangerously acidic — digestive health risk" : "Dangerously alkaline — health risk";
  }
  if (type === "tds") {
    if (status === "safe") return "Mineral content is balanced and appropriate";
    if (status === "moderate") return "Elevated dissolved substances detected";
    return "High contamination with dissolved solids";
  }
  if (type === "temperature") {
    if (status === "safe") return "Normal temperature for drinking water";
    if (status === "moderate") return "Slightly warm — may promote bacterial growth";
    return "High temperature accelerates bacterial growth";
  }
  if (type === "turbidity") {
    if (status === "safe") return "Clear — free of suspended particles";
    if (status === "moderate") return "Cloudy — suspended contaminants present";
    return "Very cloudy — shields pathogens from disinfection";
  }
  return "";
}

export default function ScanResults({ result, familyMember, t, isSpeaking, onReplayVoice, onNewScan }) {
  const rippleRef = useRef(null);

  if (!result) return null;

  const riskConfig = {
    safe: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      glow: "shadow-emerald-500/25",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/20",
    },
    moderate: {
      gradient: "from-amber-400 via-orange-500 to-yellow-500",
      glow: "shadow-amber-500/25",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
    },
    danger: {
      gradient: "from-rose-500 via-red-500 to-coral-600",
      glow: "shadow-rose-500/25",
      bg: "bg-rose-500/5",
      border: "border-rose-500/20",
    },
  };

  const rc = riskConfig[result.risk_level] || riskConfig.safe;

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.className = "ripple bg-white/30";
    const existing = button.getElementsByClassName("ripple")[0];
    if (existing) existing.remove();
    button.appendChild(circle);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ===== Hero Section — Large Health Score + Status ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden rounded-[2rem] border ${rc.border}`}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${rc.gradient} opacity-10`} />
        <div className={`absolute inset-0 ${rc.bg}`} />

        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-white to-transparent" />

        <div className="relative p-6 sm:p-8">
          {/* Top bar: title + actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse`} />
                <h1 className="text-2xl font-heading font-bold">{t("scanComplete")}</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(familyMember)} · {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onReplayVoice}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border border-border hover:bg-muted/40 transition-colors text-sm font-medium"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                AquaVoice
              </button>
              <button
                onClick={(e) => { createRipple(e); onNewScan(); }}
                className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm font-medium"
              >
                <Activity className="w-4 h-4" />
                New Scan
              </button>
            </div>
          </div>

          {/* Center: Health Score Ring + Status */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative"
            >
              <div className={`absolute inset-0 blur-2xl bg-gradient-to-br ${rc.gradient} opacity-30 rounded-full`} />
              <div className="relative">
                <HealthScoreRing score={result.health_score} riskLevel={result.risk_level} size={150} stroke={10} />
              </div>
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <RiskBadge level={result.risk_level} label={t(result.risk_level)} />
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2 leading-tight">
                {result.risk_level === "safe" && "Water is Safe"}
                {result.risk_level === "moderate" && "Caution Needed"}
                {result.risk_level === "danger" && "Water is Unsafe"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
                {result.risk_level === "safe" && "All parameters are within WHO safe drinking water limits. Your water is ready for consumption."}
                {result.risk_level === "moderate" && "Some parameters exceed safe limits. Treatment is recommended before drinking."}
                {result.risk_level === "danger" && "Multiple parameters are dangerously high. Do not drink this water without proper treatment."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== Primary Recommendation ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <PrimaryRecommendation riskLevel={result.risk_level} />
      </motion.div>

      {/* ===== AI Summary ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="premium-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="font-heading font-semibold text-lg">AI Summary</h2>
        </div>
        <div className="space-y-2">
          {(result.ai_analysis || "").split("\n\n").slice(0, 4).map((para, idx) => (
            <p key={idx} className="text-sm text-foreground/75 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </motion.div>

      {/* ===== Sensor Readings ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <h2 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-4 px-1">
          Averaged Sensor Readings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard type="ph" value={result.ph} label={t("pH")} delay={0} explanation={getSensorExplanation("ph", result.ph)} />
          <SensorCard type="tds" value={result.tds} label={t("tds")} delay={80} explanation={getSensorExplanation("tds", result.tds)} />
          <SensorCard type="temperature" value={result.temperature} label={t("temperature")} delay={160} explanation={getSensorExplanation("temperature", result.temperature)} />
          <SensorCard type="turbidity" value={result.turbidity} label={t("turbidity")} delay={240} explanation={getSensorExplanation("turbidity", result.turbidity)} />
        </div>
      </motion.div>

      {/* ===== Disease Risk Cards ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="premium-card p-6"
      >
        <h2 className="font-heading font-semibold text-lg mb-4">{t("diseaseRisk")}</h2>
        <ResultDiseaseCards diseaseRisks={result.disease_risks} waterData={result} t={t} />
      </motion.div>

      {/* ===== Recommendations ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <h2 className="text-xl font-heading font-bold mb-4 px-1">What Should You Do?</h2>
        <ResultChecklist recommendations={result.recommendations} riskLevel={result.risk_level} />
      </motion.div>

      {/* ===== Trend Graph ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <ResultTrendGraph currentScore={result.health_score} />
      </motion.div>
    </div>
  );
}