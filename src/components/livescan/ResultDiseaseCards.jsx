import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDiseaseConfig } from "@/components/illustrations/DiseaseIllustrations";
import { classifyParameter } from "@/lib/waterAnalysis";
import TiltCard from "@/components/TiltCard";

function getDiseaseConfidence(risk) {
  return Math.min(95, Math.round(60 + risk * 0.4));
}

function getDiseaseReason(disease, waterData) {
  if (!waterData) return "Based on overall water quality analysis";

  const phStatus = classifyParameter("ph", waterData.ph);
  const tdsStatus = classifyParameter("tds", waterData.tds);
  const turbStatus = classifyParameter("turbidity", waterData.turbidity);

  const reasons = {
    cholera:
      turbStatus === "danger"
        ? "High turbidity indicates possible bacterial contamination"
        : turbStatus === "moderate"
        ? "Elevated turbidity may harbor Vibrio cholerae bacteria"
        : "Water clarity is within acceptable limits",
    typhoid:
      tdsStatus === "danger"
        ? "Excessive dissolved solids suggest sewage contamination"
        : tdsStatus === "moderate"
        ? "TDS levels indicate possible organic contamination"
        : "Dissolved solids within safe range",
    diarrhea:
      turbStatus !== "safe" || phStatus !== "safe"
        ? "Turbidity and pH levels indicate pathogen presence"
        : "Water parameters show low pathogen risk",
    dysentery:
      phStatus !== "safe"
        ? "pH imbalance may allow parasitic and bacterial growth"
        : "pH levels are within safe range",
    hepatitisA:
      turbStatus === "danger" && tdsStatus === "danger"
        ? "Multiple severe violations indicate viral contamination risk"
        : turbStatus !== "safe"
        ? "Turbidity levels suggest possible viral contamination"
        : "Low viral contamination risk based on water parameters",
  };

  return reasons[disease] || "Based on overall water quality analysis";
}

export default function ResultDiseaseCards({ diseaseRisks, waterData, t }) {
  const entries = Object.entries(diseaseRisks);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([disease, risk], idx) => (
        <DiseaseCard
          key={disease}
          name={disease}
          risk={risk}
          waterData={waterData}
          delay={idx * 80}
          t={t}
        />
      ))}
    </div>
  );
}

function DiseaseCard({ name, risk, waterData, delay, t }) {
  const config = getDiseaseConfig(name);
  const Illustration = config.Illustration;
  const [animatedRisk, setAnimatedRisk] = useState(0);

  const confidence = getDiseaseConfidence(risk);
  const reason = getDiseaseReason(name, waterData);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        setAnimatedRisk(Math.round(risk * progress));
        if (progress >= 1) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [risk, delay]);

  const riskColor = risk < 15 ? "text-safe" : risk < 40 ? "text-warning" : "text-danger";
  const riskBg = risk < 15 ? "bg-safe" : risk < 40 ? "bg-warning" : "bg-danger";
  const riskLabel = risk < 15 ? "Low Risk" : risk < 40 ? "Moderate" : "High Risk";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
    >
      <TiltCard
        className="premium-card p-5 hover:border-purple-500/20"
        intensity={5}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: config.color + "15",
              color: config.color,
              boxShadow: `0 4px 16px ${config.color}20`,
            }}
            animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay / 1000 }}
          >
            <Illustration className="w-8 h-8" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{t(name)}</p>
            <p className={`text-xs font-medium ${riskColor}`}>{riskLabel}</p>
          </div>
          <span className={`text-2xl font-bold ${riskColor}`}>{animatedRisk}%</span>
        </div>

        {/* Animated risk bar */}
        <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-3">
          <motion.div
            className={`h-full ${riskBg} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${risk}%` }}
            transition={{ duration: 1, delay: delay / 1000, ease: "easeOut" }}
            style={{ boxShadow: `0 0 8px ${config.color}60` }}
          />
        </div>

        {/* Confidence + Reason */}
        <div className="space-y-1.5 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium text-foreground">{confidence}%</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
        </div>
      </TiltCard>
    </motion.div>
  );
}