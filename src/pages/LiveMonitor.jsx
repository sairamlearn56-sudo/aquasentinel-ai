import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { useAqua } from "@/lib/AquaContext";
import { analyzeWater } from "@/lib/waterAnalysis";
import { useWaterData } from "@/hooks/useWaterData";
import ScanWelcome from "@/components/livescan/ScanWelcome";
import LiveScanSequence from "@/components/LiveScanSequence";
import ScanResults from "@/components/livescan/ScanResults";

export default function LiveMonitor() {
  const { t, lang, prefs } = useLanguage();
  const { speak, isSpeaking, stop } = useVoice();
  const { startAnalysis, speakAnalysisStep, completeAnalysis, replayResult } = useAqua();
  const [phase, setPhase] = useState("welcome"); // welcome | scanning | results
  const [familyMember, setFamilyMember] = useState("adult");
  const [result, setResult] = useState(null);
  const voicePlayedRef = useRef(false);
  const welcomeVoiceRef = useRef(false);
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

  // Welcome voice — Aqua greets when ESP32 connects
  useEffect(() => {
    if (phase === "welcome" && isConnected && !welcomeVoiceRef.current) {
      welcomeVoiceRef.current = true;
      const voiceEnabled = prefs?.voice_enabled !== false;
      if (voiceEnabled) {
        const timer = setTimeout(() => {
          speak(
            "Hello! I'm Aqua. Your water health assistant. Place the sensors in water and press Start Monitoring whenever you're ready.",
            lang,
            prefs?.voice_speed || 0.9
          );
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, isConnected, speak, lang, prefs]);

  // ===== Start Monitoring — begin a new 20-reading scan =====
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

    connectingTimerRef.current = setTimeout(() => {
      collectingRef.current = true;
      setScanStepText("Reading 1/20");
      speakAnalysisStep("collecting");
    }, 1500);
  };

  // ===== Collect live readings during scanning =====
  useEffect(() => {
    if (phase !== "scanning") return;
    if (!collectingRef.current) return;
    if (!waterData) return;
    if (readingsRef.current.length >= 20) return;
    if (lastWaterDataRef.current === waterData) return; // Skip duplicates

    lastWaterDataRef.current = waterData;
    readingsRef.current.push(waterData);
    const count = readingsRef.current.length;
    setScanProgress(count);

    if (count >= 20) {
      collectingRef.current = false;
      setScanStepText("Calculating Average...");
    } else {
      setScanStepText(`Reading ${count + 1}/20`);
    }
  }, [waterData, phase]);

  // ===== Post-readings: step sequence + calculate average + analyze =====
  useEffect(() => {
    if (phase !== "scanning" || scanProgress !== 20) return;

    const timers = [];

    // Step 2: Running AI Model (1.5s after Calculating Average)
    timers.push(
      setTimeout(() => {
        setScanStepText("Running AI Model...");
        speakAnalysisStep("analyzing");
      }, 1500)
    );

    // Step 3: Predicting Disease Risk (3s)
    timers.push(
      setTimeout(() => {
        setScanStepText("Predicting Disease Risk...");
      }, 3000)
    );

    // Step 4: Generating Recommendations (4.5s)
    timers.push(
      setTimeout(() => {
        setScanStepText("Generating Recommendations...");
      }, 4500)
    );

    // Step 5: Finalizing Report + calculate (6s)
    timers.push(
      setTimeout(async () => {
        setScanStepText("Finalizing Report...");

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

        // Step 6: Analysis Complete (7.5s)
        timers.push(
          setTimeout(() => {
            setScanStepText("Analysis Complete ✓");
            timers.push(
              setTimeout(() => {
                setPhase("results");
                voicePlayedRef.current = false;
              }, 1200)
            );
          }, 1500)
        );
      }, 6000)
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

  // ===== Render phases =====
  if (phase === "welcome") {
    return <ScanWelcome isConnected={isConnected} onStart={handleStartMonitoring} />;
  }

  if (phase === "scanning") {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <LiveScanSequence stepText={scanStepText} progress={scanProgress} total={20} />
        </motion.div>
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