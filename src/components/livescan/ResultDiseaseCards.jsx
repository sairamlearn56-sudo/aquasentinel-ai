import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDiseaseConfig } from "@/components/illustrations/DiseaseIllustrations";
import { DISEASE_PREVENTION_TIPS } from "@/lib/resultImages";
import { Lightbulb } from "lucide-react";

export default function ResultDiseaseCards({ diseaseRisks, t }) {
  const entries = Object.entries(diseaseRisks || {});

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No prediction available.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Complete analysis to receive disease risk predictions.</p>
      </div>
    );
  }

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
  const [animatedRisk, setAnimatedRisk] = useState(0);
  const preventionTip = DISEASE_PREVENTION_TIPS[name] || "Practice good water hygiene and sanitation.";
  const Illustration = config?.Illustration;

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
      className="premium-card overflow-hidden hover:border-purple-500/20"
    >
      {/* Header with SVG medical illustration */}
      <div className="relative p-4 flex items-center gap-3 border-b border-border/50">
        {Illustration && <Illustration className="w-12 h-12 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{t(name)}</p>
          <p className={`text-xs font-medium ${riskColor}`}>{riskLabel}</p>
        </div>
        <span className={`text-2xl font-bold ${riskColor}`}>{animatedRisk}%</span>
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

        {/* Confidence + Reason — only display if returned by model */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-medium text-muted-foreground">Confidence unavailable</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Reason</span>
            <span className="font-medium text-muted-foreground">Reason unavailable</span>
          </div>
        </div>

        {/* Prevention tip */}
        <div className="flex items-start gap-2 pt-2 border-t border-border/50">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70 leading-relaxed">{preventionTip}</p>
        </div>
      </div>
    </motion.div>
  );
}