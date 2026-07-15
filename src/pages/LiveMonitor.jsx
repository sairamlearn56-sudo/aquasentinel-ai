import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Brain, Volume2, VolumeX } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { useAqua } from "@/lib/AquaContext";
import { generateSensorData, analyzeWater } from "@/lib/waterAnalysis";
import ScanSequence from "@/components/ScanSequence";
import HealthScoreRing from "@/components/HealthScoreRing";
import SensorCard from "@/components/SensorCard";
import RiskBadge from "@/components/RiskBadge";
import DiseaseRiskCard from "@/components/DiseaseRiskCard";
import WaterStatusCard from "@/components/illustrations/WaterStatusCard";

export default function LiveMonitor() {
  const { t, lang, prefs } = useLanguage();
  const { speak, isSpeaking, stop } = useVoice();
  const { startAnalysis, speakAnalysisStep, completeAnalysis, replayResult } = useAqua();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("scanning"); // scanning | results
  const [familyMember, setFamilyMember] = useState("adult");
  const [result, setResult] = useState(null);
  const voicePlayedRef = useRef(false);

  useEffect(() => {
    if (prefs?.default_family_member) {
      setFamilyMember(prefs.default_family_member);
    }
  }, [prefs]);

  // Aqua AI Guide — speaks during scanning
  useEffect(() => {
    if (phase === "scanning") {
      startAnalysis();
      const timers = [
        setTimeout(() => speakAnalysisStep("connecting"), 300),
        setTimeout(() => speakAnalysisStep("collecting"), 2800),
        setTimeout(() => speakAnalysisStep("analyzing"), 5500),
        setTimeout(() => speakAnalysisStep("preparing"), 7500),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase, startAnalysis, speakAnalysisStep]);

  const scanSteps = [
    t("scanSteps.connecting"),
    t("scanSteps.sensorStatus"),
    t("scanSteps.collecting"),
    t("scanSteps.ph"),
    t("scanSteps.tds"),
    t("scanSteps.turbidity"),
    t("scanSteps.temperature"),
    t("scanSteps.sending"),
    t("scanSteps.analyzing"),
    t("scanSteps.generating"),
    t("scanSteps.complete"),
  ];

  const handleScanComplete = async () => {
    const sensorData = generateSensorData();
    const analysis = analyzeWater(sensorData, familyMember);
    
    try {
      const saved = await base44.entities.Scan.create({
        ...analysis,
        disease_risks: analysis.disease_risks,
        recommendations: [
          analysis.recommendations.immediatePrecautions.join("; "),
          analysis.recommendations.waterTreatment.join("; "),
          analysis.recommendations.whenToVisitDoctor,
          analysis.recommendations.emergencyAdvice,
        ],
        language: lang,
        location_name: "Community Zone A",
        latitude: 17.385 + (Math.random() - 0.5) * 0.05,
        longitude: 78.4867 + (Math.random() - 0.5) * 0.05,
        sensor_status: "connected",
      });
      setResult({ ...analysis, id: saved.id });
    } catch (e) {
      setResult(analysis);
    }
    setPhase("results");
    voicePlayedRef.current = false;
  };

  // Aqua reacts to results
  useEffect(() => {
    if (phase === "results" && result && !voicePlayedRef.current) {
      voicePlayedRef.current = true;
      setTimeout(() => {
        completeAnalysis(result.risk_level, result);
      }, 800);
    }
  }, [phase, result, completeAnalysis]);

  const handleReplayVoice = () => {
    if (!result) return;
    replayResult(result.risk_level);
  };

  const handleNewScan = () => {
    stop();
    setResult(null);
    setPhase("select");
    voicePlayedRef.current = false;
  };

  // ===== Phase: Scanning =====
  if (phase === "scanning") {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <ScanSequence steps={scanSteps} onComplete={handleScanComplete} />
        </motion.div>
      </div>
    );
  }

  // ===== Phase: Results =====
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
          <p className="text-sm text-muted-foreground mt-1">{t(familyMember)} · {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReplayVoice}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border border-border hover:bg-muted/50 transition-colors text-sm font-medium"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            AquaVoice
          </button>
          <button
            onClick={handleNewScan}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            {t("newScan")}
          </button>
        </div>
      </motion.div>

      {/* Water Status Card */}
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

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard type="ph" value={result.ph} label={t("pH")} delay={0} />
        <SensorCard type="tds" value={result.tds} label={t("tds")} delay={80} />
        <SensorCard type="temperature" value={result.temperature} label={t("temperature")} delay={160} />
        <SensorCard type="turbidity" value={result.turbidity} label={t("turbidity")} delay={240} />
      </div>

      {/* Disease Risk Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="font-semibold text-lg mb-4">{t("diseaseRisk")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(result.disease_risks).map(([disease, risk], idx) => (
            <DiseaseRiskCard key={disease} name={disease} risk={risk} delay={idx * 60} t={t} />
          ))}
        </div>
      </motion.div>

      {/* CTA to full analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={() => navigate("/analysis")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass border border-primary/20 hover:bg-primary/5 transition-colors font-medium"
        >
          <Brain className="w-5 h-5 text-primary" />
          {t("viewFullAnalysis")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}