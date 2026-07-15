import React from "react";
import { motion } from "framer-motion";
import { Activity, Volume2, VolumeX } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import WaterStatusCard from "@/components/illustrations/WaterStatusCard";
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
  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            {t("scanComplete")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t(familyMember)} · {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReplayVoice}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border border-border hover:bg-muted/50 transition-colors text-sm font-medium"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            AquaVoice
          </button>
          <button
            onClick={onNewScan}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Activity className="w-4 h-4" />
            New Scan
          </button>
        </div>
      </motion.div>

      {/* Hero Banner — Water Health Score + Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <WaterStatusCard
          status={result.risk_level}
          score={result.health_score}
          date={`${t(familyMember)} · ${new Date().toLocaleDateString()}`}
        />
      </motion.div>

      {/* Primary Recommendation — Drink Safe / Boil / Avoid Drinking */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <PrimaryRecommendation riskLevel={result.risk_level} />
      </motion.div>

      {/* Averaged Sensor Cards (value, safe range, status, explanation) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Averaged Sensor Readings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard type="ph" value={result.ph} label={t("pH")} delay={0} explanation={getSensorExplanation("ph", result.ph)} />
          <SensorCard type="tds" value={result.tds} label={t("tds")} delay={80} explanation={getSensorExplanation("tds", result.tds)} />
          <SensorCard type="temperature" value={result.temperature} label={t("temperature")} delay={160} explanation={getSensorExplanation("temperature", result.temperature)} />
          <SensorCard type="turbidity" value={result.turbidity} label={t("turbidity")} delay={240} explanation={getSensorExplanation("turbidity", result.turbidity)} />
        </div>
      </motion.div>

      {/* Disease Prediction Cards (illustration, risk %, level, confidence %, reason) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="font-semibold text-lg mb-4">{t("diseaseRisk")}</h2>
        <ResultDiseaseCards diseaseRisks={result.disease_risks} waterData={result} t={t} />
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4">What Should You Do?</h2>
        <ResultChecklist recommendations={result.recommendations} riskLevel={result.risk_level} />
      </motion.div>

      {/* Trend Graph */}
      <ResultTrendGraph currentScore={result.health_score} />
    </div>
  );
}