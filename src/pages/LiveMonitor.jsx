import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { useAqua } from "@/lib/AquaContext";
import { analyzeWater, validateSensorData } from "@/lib/waterAnalysis";
import { useWaterData } from "@/hooks/useWaterData";
import ScanWelcome from "@/components/livescan/ScanWelcome";
import LiveScanSequence from "@/components/LiveScanSequence";
import AIProcessingTimeline from "@/components/livescan/AIProcessingTimeline";
import ScanResults from "@/components/livescan/ScanResults";

export default function LiveMonitor() {
  const { t, lang, prefs } = useLanguage();
  const { speak, isSpeaking, stop } = useVoice();
  const { startAnalysis, speakAnalysisStep, completeAnalysis, replayResult } = useAqua();
  const [phase, setPhase] = useState("welcome"); // welcome | scanning | processing | results
  const [familyMember, setFamilyMember] = useState("adult");
  const [result, setResult] = useState(null);
  const voicePlayedRef = useRef(false);
  const welcomeVoiceRef = useRef(false);
  const { waterData, isConnected } = useWaterData();

  // Scan state
  const readingsRef = useRef([]);
  const waterDataRef = useRef(null);
  const intervalRef = useRef(null);
  const countRef = useRef(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sampleName, setSampleName] = useState("");

  // Track latest waterData from Firebase
  useEffect(() => {
    waterDataRef.current = waterData;
  }, [waterData]);

  // Set default family member from prefs
  useEffect(() => {
    if (prefs?.default_family_member) {
      setFamilyMember(prefs.default_family_member);
    }
  }, [prefs]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ===== Interval: collect 1 reading per second =====
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      const current = waterDataRef.current;
      if (current) {
        readingsRef.current.push(current);
      }
      countRef.current += 1;
      setScanProgress(countRef.current);

      if (countRef.current >= 20) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setPhase("processing"), 400);
      }
    }, 1000);
  };

  // ===== Start Monitoring — begin a new 20-reading scan =====
  const handleStartMonitoring = () => {
    stop();
    readingsRef.current = [];
    countRef.current = 0;
    setScanProgress(0);
    setIsPaused(false);
    setElapsedSeconds(0);
    setResult(null);
    setPhase("scanning");
    startAnalysis();
    speakAnalysisStep("connecting");

    // Brief delay then start collecting
    setTimeout(() => {
      speakAnalysisStep("collecting");
      startInterval();
    }, 1000);
  };

  // ===== Stop (Pause) the scan =====
  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(true);
    stop();
  };

  // ===== Resume from the same reading count =====
  const handleResume = () => {
    setIsPaused(false);
    startInterval();
  };

  // ===== Cancel — discard scan and return to Ready =====
  const handleCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    readingsRef.current = [];
    countRef.current = 0;
    setScanProgress(0);
    setIsPaused(false);
    setElapsedSeconds(0);
    setResult(null);
    welcomeVoiceRef.current = false;
    setPhase("welcome");
  };

  // ===== Processing phase — compute analysis and save to DB =====
  useEffect(() => {
    if (phase !== "processing") return;
    speakAnalysisStep("analyzing");

    const readings = readingsRef.current.filter((r) => r != null);
    if (readings.length === 0) return;

    const avg = {
      ph: readings.reduce((s, r) => s + (r.ph || 0), 0) / readings.length,
      tds: readings.reduce((s, r) => s + (r.tds || 0), 0) / readings.length,
      temperature: readings.reduce((s, r) => s + (r.temperature || 0), 0) / readings.length,
      turbidity: readings.reduce((s, r) => s + (r.turbidity || 0), 0) / readings.length,
    };

    // Validate sensor data before analysis — reject invalid readings
    const validation = validateSensorData(avg);
    if (!validation.valid) {
      setResult({ sensorErrors: validation.errors, ...avg });
      return;
    }

    const analysis = analyzeWater(avg, familyMember);
    setResult(analysis);

    // Save to database — only real computed values, no fabricated confidence or location
    base44.entities.Scan.create({
      ...analysis,
      disease_risks: analysis.disease_risks,
      recommendations: analysis.recommendations,
      language: lang,
      sensor_status: "connected",
      sample_name: sampleName || `Scan ${new Date().toLocaleString()}`,
      aqua_voice_summary: analysis.ai_analysis,
    }).then((saved) => {
      setResult((prev) => (prev ? { ...prev, id: saved.id } : prev));
    }).catch(() => {});
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== Timeline complete → show results =====
  const handleProcessingComplete = () => {
    setPhase("results");
    voicePlayedRef.current = false;
  };

  // ===== Aqua reacts to results with voice =====
  useEffect(() => {
    if (phase === "results" && result && !voicePlayedRef.current) {
      voicePlayedRef.current = true;
      setTimeout(() => {
        completeAnalysis(result.risk_level, result);
      }, 800);
    }
  }, [phase, result, completeAnalysis]);

  // ===== Render phases =====
  if (phase === "welcome") {
    return (
      <ScanWelcome
        isConnected={isConnected}
        onStart={handleStartMonitoring}
        sampleName={sampleName}
        onSampleNameChange={setSampleName}
      />
    );
  }

  if (phase === "scanning") {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <LiveScanSequence
            progress={scanProgress}
            total={20}
            isPaused={isPaused}
            elapsedSeconds={elapsedSeconds}
            onStop={handleStop}
            onResume={handleResume}
            onCancel={handleCancel}
          />
        </motion.div>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="max-w-3xl mx-auto">
        <AIProcessingTimeline onComplete={handleProcessingComplete} />
      </div>
    );
  }

  return (
    <ScanResults
      result={result}
      familyMember={familyMember}
      t={t}
      isSpeaking={isSpeaking}
      onReplayVoice={() => replayResult(result.risk_level)}
      onNewScan={handleStartMonitoring}
    />
  );
}