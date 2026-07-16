import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { useAqua } from "@/lib/AquaContext";
import { analyzeWater } from "@/lib/waterAnalysis";
import { useWaterData } from "@/hooks/useWaterData";
import ScanWelcome from "@/components/livescan/ScanWelcome";
import LiveScanSequence from "@/components/LiveScanSequence";
import AIProcessingTimeline from "@/components/livescan/AIProcessingTimeline";
import ScanResults from "@/components/livescan/ScanResults";

export default function LiveMonitor() {
  const { t, lang, prefs } = useLanguage();
  const { speak, isSpeaking, stop } = useVoice();
  const { startAnalysis, speakAnalysisStep, completeAnalysis, replayResult } = useAqua();
  const [phase, setPhase] = useState("welcome");
  const [familyMember, setFamilyMember] = useState("adult");
  const [result, setResult] = useState(null);
  const [connectionLost, setConnectionLost] = useState(false);
  const voicePlayedRef = useRef(false);
  const welcomeVoiceRef = useRef(false);
  const { waterData, isConnected, sensorStatus, allSensorsConnected, lastUpdated } = useWaterData();

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

  // Track connection status
  useEffect(() => {
    if (phase === "scanning" && !isConnected && !connectionLost) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setConnectionLost(true);
    }
  }, [phase, isConnected, connectionLost]);

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
    if (!allSensorsConnected) return;
    stop();
    readingsRef.current = [];
    countRef.current = 0;
    setScanProgress(0);
    setIsPaused(false);
    setElapsedSeconds(0);
    setResult(null);
    setConnectionLost(false);
    setPhase("scanning");
    startAnalysis();
    speakAnalysisStep("connecting");

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
    setConnectionLost(false);
    welcomeVoiceRef.current = false;
    setPhase("welcome");
  };

  // ===== Reconnect after connection loss =====
  const handleReconnect = () => {
    if (isConnected && allSensorsConnected) {
      setConnectionLost(false);
      setIsPaused(false);
      startInterval();
    }
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

    const analysis = analyzeWater(avg, familyMember);
    setResult(analysis);

    const aiConfidence = Math.min(98, 82 + Math.round((100 - analysis.health_score) * 0.15));
    const voiceSummary = `Water health score: ${analysis.health_score} out of 100. Risk level: ${analysis.risk_level}. ${analysis.ai_analysis.split("\n\n").pop()}`;

    base44.entities.Scan.create({
      ...analysis,
      disease_risks: analysis.disease_risks,
      recommendations: analysis.recommendations,
      language: lang,
      location_name: "Community Zone A",
      latitude: 17.385 + (Math.random() - 0.5) * 0.05,
      longitude: 78.4867 + (Math.random() - 0.5) * 0.05,
      sensor_status: "connected",
      sample_name: sampleName || `Scan ${new Date().toLocaleString()}`,
      ai_confidence: aiConfidence,
      aqua_voice_summary: voiceSummary,
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
        allSensorsConnected={allSensorsConnected}
        sensorStatus={sensorStatus}
        lastUpdated={lastUpdated}
        waterData={waterData}
        onStart={handleStartMonitoring}
        sampleName={sampleName}
        onSampleNameChange={setSampleName}
      />
    );
  }

  // ===== Connection Lost during scanning =====
  if (phase === "scanning" && connectionLost) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-6"
        >
          <WifiOff className="w-10 h-10 text-danger" />
        </motion.div>
        <h2 className="text-2xl font-heading font-bold mb-2">Connection Lost</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
          Please reconnect your device to continue monitoring. Live updates and AI analysis have been paused.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReconnect}
            disabled={!isConnected || !allSensorsConnected}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            Reconnect
          </button>
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border font-medium text-sm hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel Scan
          </button>
        </div>
        {(!isConnected || !allSensorsConnected) && (
          <p className="text-xs text-muted-foreground mt-4">Waiting for ESP32 and sensors to reconnect...</p>
        )}
      </div>
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