import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Brain, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { useAqua } from "@/lib/AquaContext";
import { analyzeWater } from "@/lib/waterAnalysis";
import { useWaterData } from "@/hooks/useWaterData";
import LiveScanSequence from "@/components/LiveScanSequence";
import SensorCard from "@/components/SensorCard";
import DiseaseRiskCard from "@/components/DiseaseRiskCard";
import WaterStatusCard from "@/components/illustrations/WaterStatusCard";

export default function LiveMonitor() {
  const { t, lang, prefs } = useLanguage();
  const { isSpeaking, stop } = useVoice();
  const { startAnalysis, speakAnalysisStep, completeAnalysis, replayResult } = useAqua();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("live"); // live | scanning | results
  const [familyMember, setFamilyMember] = useState("adult");
  const [result, setResult] = useState(null);
  const voicePlayedRef = useRef(false);
  const { waterData, isConnected } = useWaterData();

  // Scan state
  const readingsRef = useRef([]);
  const collectingRef = useRef(false);
  const lastWaterDataRef = useRef(null);
  const connectingTimerRef = useRef(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState("");

  useEffect(() => {
    if (prefs?.default_family_member) {
      setFamilyMember(prefs.default_family_member);
    }
  }, [prefs]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (connectingTimerRef.current) clearTimeout(connectingTimerRef.current);
    };
  }, []);

  // ===== Start Monitoring — begin a new 30-reading scan =====
  const handleStartMonitoring = () => {
    stop();
    if (connectingTimerRef.current) clearTimeout(connectingTimerRef.current);
    readingsRef.current = [];
    collectingRef.current = false;
    lastWaterDataRef.current = null;
    setScanProgress(0);
    setScanStepText("Connecting to ESP32...");
    setResult(null);
    setPhase("scanning");
    startAnalysis();
    speakAnalysisStep("connecting");

    // After "connecting" delay, start collecting live readings
    connectingTimerRef.current = setTimeout(() => {
      collectingRef.current = true;
      setScanStepText("Reading 1/30");
      speakAnalysisStep("collecting");
    }, 1500);
  };

  // ===== Collect live readings during scanning =====
  useEffect(() => {
    if (phase !== "scanning") return;
    if (!collectingRef.current) return;
    if (!waterData) return;
    if (readingsRef.current.length >= 30) return;
    if (lastWaterDataRef.current === waterData) return; // Skip duplicates

    lastWaterDataRef.current = waterData;
    readingsRef.current.push(waterData);
    const count = readingsRef.current.length;
    setScanProgress(count);

    if (count >= 30) {
      collectingRef.current = false;
      setScanStepText("Calculating Average...");
    } else {
      setScanStepText(`Reading ${count + 1}/30`);
    }
  }, [waterData, phase]);

  // ===== When all 30 readings collected, calculate average and analyze =====
  useEffect(() => {
    if (phase !== "scanning" || scanProgress !== 30) return;

    const timers = [];
    timers.push(
      setTimeout(() => {
        setScanStepText("AI Disease Analysis...");
        speakAnalysisStep("analyzing");

        timers.push(
          setTimeout(async () => {
            const readings = readingsRef.current;
            const avg = {
              ph: readings.reduce((s, r) => s + (r.ph || 0), 0) / readings.length,
              tds: readings.reduce((s, r) => s + (r.tds || 0), 0) / readings.length,
              temperature: readings.reduce((s, r) => s + (r.temperature || 0), 0) / readings.length,
              turbidity: readings.reduce((s, r) => s + (r.turbidity || 0), 0) / readings.length,
            };

            const analysis = analyzeWater(avg, familyMember);

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

            setScanStepText("Analysis Complete ✓");

            timers.push(
              setTimeout(() => {
                setPhase("results");
                voicePlayedRef.current = false;
              }, 1200)
            );
          }, 2000)
        );
      }, 1500)
    );

    return () => timers.forEach(clearTimeout);
  }, [phase, scanProgress]);

  // ===== Aqua reacts to results =====
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

  // ===== Phase: Live (initial) =====
  if (phase === "live") {
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
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-safe" : "bg-danger"} animate-pulse`} />
              Live Monitor
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              {isConnected ? (
                <><Wifi className="w-3.5 h-3.5 text-safe" /> ESP32 Connected</>
              ) : (
                <><WifiOff className="w-3.5 h-3.5 text-danger" /> Connecting to ESP32...</>
              )}
            </p>
          </div>
        </motion.div>

        {/* Live Sensor Cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Live Sensor Readings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SensorCard type="ph" value={waterData?.ph ?? 0} label={t("pH")} delay={0} />
            <SensorCard type="tds" value={waterData?.tds ?? 0} label={t("tds")} delay={80} />
            <SensorCard type="temperature" value={waterData?.temperature ?? 0} label={t("temperature")} delay={160} />
            <SensorCard type="turbidity" value={waterData?.turbidity ?? 0} label={t("turbidity")} delay={240} />
          </div>
        </div>

        {/* Start Monitoring CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={handleStartMonitoring}
            disabled={!isConnected}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-teal text-white font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-glow-pulse overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Activity className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Start Monitoring</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // ===== Phase: Scanning =====
  if (phase === "scanning") {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <LiveScanSequence stepText={scanStepText} progress={scanProgress} total={30} />
        </motion.div>
      </div>
    );
  }

  // ===== Phase: Results (Frozen report + live sensor cards) =====
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
            onClick={handleReplayVoice}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border border-border hover:bg-muted/50 transition-colors text-sm font-medium"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            AquaVoice
          </button>
          <button
            onClick={handleStartMonitoring}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Activity className="w-4 h-4" />
            Start Monitoring
          </button>
        </div>
      </motion.div>

      {/* AI Report (Frozen — based on 30-reading average) */}
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

      {/* Disease Risk Preview (Frozen) */}
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

      {/* Live Sensor Cards (Real-time — separate from frozen report) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Live Sensor Readings</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard type="ph" value={waterData?.ph ?? 0} label={t("pH")} delay={0} />
          <SensorCard type="tds" value={waterData?.tds ?? 0} label={t("tds")} delay={80} />
          <SensorCard type="temperature" value={waterData?.temperature ?? 0} label={t("temperature")} delay={160} />
          <SensorCard type="turbidity" value={waterData?.turbidity ?? 0} label={t("turbidity")} delay={240} />
        </div>
      </motion.div>
    </div>
  );
}