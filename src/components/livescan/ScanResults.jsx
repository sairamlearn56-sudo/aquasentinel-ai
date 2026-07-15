import React from "react";
import { motion } from "framer-motion";
import { Activity, Volume2, VolumeX } from "lucide-react";
import WaterStatusCard from "@/components/illustrations/WaterStatusCard";
import SensorCard from "@/components/SensorCard";
import ResultDiseaseCards from "@/components/livescan/ResultDiseaseCards";
import ResultChecklist from "@/components/livescan/ResultChecklist";
import ResultTrendGraph from "@/components/livescan/ResultTrendGraph";

export default function ScanResults({ result, familyMember, t, isSpeaking, onReplayVoice, onNewScan }) {
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
            Start Monitoring
          </button>
        </div>
      </motion.div>

      {/* Hero Banner */}
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

      {/* Sensor Cards (Averages) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Averaged Sensor Readings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard type="ph" value={result.ph} label={t("pH")} delay={0} />
          <SensorCard type="tds" value={result.tds} label={t("tds")} delay={80} />
          <SensorCard type="temperature" value={result.temperature} label={t("temperature")} delay={160} />
          <SensorCard type="turbidity" value={result.turbidity} label={t("turbidity")} delay={240} />
        </div>
      </motion.div>

      {/* Disease Prediction Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="font-semibold text-lg mb-4">{t("diseaseRisk")}</h2>
        <ResultDiseaseCards diseaseRisks={result.disease_risks} t={t} />
      </motion.div>

      {/* What Should You Do? */}
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