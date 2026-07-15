import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Volume2, VolumeX, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import SensorCard from "@/components/SensorCard";
import ResultDiseaseCards from "@/components/livescan/ResultDiseaseCards";
import ResultChecklist from "@/components/livescan/ResultChecklist";
import ResultTrendGraph from "@/components/livescan/ResultTrendGraph";
import PrimaryRecommendation from "@/components/livescan/PrimaryRecommendation";
import ResultIllustration from "@/components/livescan/ResultIllustration";
import AIWaterReport from "@/components/livescan/AIWaterReport";

function formatSensorValue(type, value) {
  if (type === "tds" || type === "turbidity") return Math.round(value);
  if (type === "temperature" || type === "ph") return Math.round(value * 10) / 10;
  return value;
}

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
  const [showReport, setShowReport] = useState(false);

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

  // Derive main reason from worst parameter
  const mainReason = (() => {
    if (classifyParameter("tds", result.tds) === "danger") return "High TDS";
    if (classifyParameter("turbidity", result.turbidity) === "danger") return "High Turbidity";
    if (classifyParameter("ph", result.ph) === "danger") return "Abnormal pH";
    if (classifyParameter("temperature", result.temperature) === "danger") return "High Temperature";
    if (classifyParameter("tds", result.tds) === "moderate") return "Elevated TDS";
    if (classifyParameter("turbidity", result.turbidity) === "moderate") return "Elevated Turbidity";
    if (classifyParameter("ph", result.ph) === "moderate") return "Slightly Abnormal pH";
    return "All Parameters Normal";
  })();

  const aiConfidence = Math.min(98, 82 + Math.round((100 - result.health_score) * 0.15));
  const primaryRec = result.recommendations?.waterTreatment?.[0] || result.recommendations?.immediatePrecautions?.[0] || "";

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

          {/* Center: Illustration (40%) + Detailed Info (60%) */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left: Dynamic 3D Illustration */}
            <div className="w-full lg:w-2/5 flex justify-center">
              <ResultIllustration riskLevel={result.risk_level} />
            </div>

            {/* Right: Score + Status + Details */}
            <div className="flex-1 w-full space-y-4">
              {/* Badge + AI Confidence */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <RiskBadge level={result.risk_level} label={t(result.risk_level)} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-border/40">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-muted-foreground">AI Confidence</span>
                  <span className="text-xs font-bold text-foreground">{aiConfidence}%</span>
                </div>
              </div>

              {/* Score Ring + Status heading */}
              <div className="flex items-center gap-5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative flex-shrink-0"
                >
                  <div className={`absolute inset-0 blur-2xl bg-gradient-to-br ${rc.gradient} opacity-30 rounded-full`} />
                  <div className="relative">
                    <HealthScoreRing score={result.health_score} riskLevel={result.risk_level} size={120} stroke={9} />
                  </div>
                </motion.div>
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold leading-tight">
                    {result.risk_level === "safe" && "Water is Safe"}
                    {result.risk_level === "moderate" && "Caution Needed"}
                    {result.risk_level === "danger" && "Water is Unsafe"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {result.ai_analysis?.split("\n")[0] || (result.risk_level === "safe" ? "All parameters within WHO safe limits." : "Some parameters exceed safe limits.")}
                  </p>
                </div>
              </div>

              {/* Main Reason + Date */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-border/40">
                  <Activity className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Main Reason:</span>
                  <span className="text-xs font-semibold text-foreground">{mainReason}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-border/40">
                  <span className="text-xs text-muted-foreground">{new Date().toLocaleString()}</span>
                </div>
              </div>

              {/* Primary Recommendation */}
              {primaryRec && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">{primaryRec}</p>
                </div>
              )}
            </div>
          </div>
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
          <SensorCard type="ph" value={formatSensorValue("ph", result.ph)} label={t("pH")} delay={0} explanation={getSensorExplanation("ph", result.ph)} />
          <SensorCard type="tds" value={formatSensorValue("tds", result.tds)} label={t("tds")} delay={80} explanation={getSensorExplanation("tds", result.tds)} />
          <SensorCard type="temperature" value={formatSensorValue("temperature", result.temperature)} label={t("temperature")} delay={160} explanation={getSensorExplanation("temperature", result.temperature)} />
          <SensorCard type="turbidity" value={formatSensorValue("turbidity", result.turbidity)} label={t("turbidity")} delay={240} explanation={getSensorExplanation("turbidity", result.turbidity)} />
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

      {/* ===== Generate AI Water Report Button ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={() => setShowReport(!showReport)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 text-white font-heading font-semibold text-base shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Sparkles className="w-5 h-5 relative z-10" />
          <span className="relative z-10">{showReport ? "Hide AI Report" : "Generate AI Water Report"}</span>
        </button>
      </motion.div>

      {/* ===== Expandable Premium AI Report ===== */}
      <AnimatePresence>
        {showReport && <AIWaterReport result={result} t={t} />}
      </AnimatePresence>
    </div>
  );
}