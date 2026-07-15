import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDiseaseConfig } from "@/components/illustrations/DiseaseIllustrations";
import TiltCard from "@/components/TiltCard";

export default function ResultDiseaseCards({ diseaseRisks, t }) {
  const entries = Object.entries(diseaseRisks);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([disease, risk], idx) => (
        <DiseaseCard key={disease} name={disease} risk={risk} delay={idx * 80} t={t} />
      ))}
    </div>
  );
}

function DiseaseCard({ name, risk, delay, t }) {
  const config = getDiseaseConfig(name);
  const Illustration = config.Illustration;
  const [animatedRisk, setAnimatedRisk] = useState(0);

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
      <TiltCard className="glass rounded-2xl p-5 border border-border hover:border-primary/20 transition-colors" intensity={5}>
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: config.color + "15", color: config.color, boxShadow: `0 4px 16px ${config.color}20` }}
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
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full ${riskBg} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${risk}%` }}
            transition={{ duration: 1, delay: delay / 1000, ease: "easeOut" }}
            style={{ boxShadow: `0 0 8px ${config.color}60` }}
          />
        </div>
      </TiltCard>
    </motion.div>
  );
}