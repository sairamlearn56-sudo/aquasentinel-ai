import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDiseaseConfig } from "@/components/illustrations/DiseaseIllustrations";
import { classifyParameter } from "@/lib/waterAnalysis";
import { DISEASE_IMAGES, DISEASE_PREVENTION_TIPS } from "@/lib/resultImages";
import { Lightbulb } from "lucide-react";
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
  const [animatedRisk, setAnimatedRisk] = useState(0);
  const imageUrl = DISEASE_IMAGES[name];
  const preventionTip = DISEASE_PREVENTION_TIPS[name] || "Practice good water hygiene and sanitation.";

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
  const riskTextOnImage = risk < 15 ? "text-emerald-300" : risk < 40 ? "text-amber-300" : "text-rose-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
    >
      <TiltCard className="premium-card overflow-hidden hover:border-purple-500/20" intensity={5}>
        {/* Large 3D illustration (40-50% of card) */}
        <div className="relative h-40 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={t(name)}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: delay / 1000 }}
            draggable={false}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {/* Risk % badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-2xl font-bold ${riskColor} drop-shadow-lg`}>{animatedRisk}%</span>
          </div>

          {/* Disease name + risk label on image */}
          <div className="absolute bottom-3 left-3">
            <p className="text-sm font-bold text-white drop-shadow-lg">{t(name)}</p>
            <p className={`text-xs font-medium ${riskTextOnImage}`}>{riskLabel}</p>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 space-y-3">
          {/* Animated risk bar */}
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full ${riskBg} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${risk}%` }}
              transition={{ duration: 1, delay: delay / 1000, ease: "easeOut" }}
            />
          </div>

          {/* AI Confidence + explanation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-medium text-foreground">{confidence}%</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
          </div>

          {/* Prevention tip */}
          <div className="flex items-start gap-2 pt-2 border-t border-border/50">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70 leading-relaxed">{preventionTip}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}