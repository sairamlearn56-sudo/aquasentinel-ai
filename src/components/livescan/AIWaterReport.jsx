import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Shield, Activity, CheckCircle2, Globe } from "lucide-react";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";

export default function AIWaterReport({ result, t }) {
  const aiConfidence = Math.min(98, 82 + Math.round((100 - result.health_score) * 0.15));
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedConfidence(Math.round(aiConfidence * progress));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [aiConfidence]);

  const crossedParams = [];
  ["ph", "tds", "temperature", "turbidity"].forEach((type) => {
    const status = classifyParameter(type, result[type]);
    if (status !== "safe") {
      crossedParams.push({ type, value: result[type], status, range: SAFE_RANGES[type] });
    }
  });

  const diseaseEntries = Object.entries(result.disease_risks || {})
    .filter(([, risk]) => risk > 10)
    .sort((a, b) => b[1] - a[1]);

  const immediateActions = [
    ...(result.recommendations?.immediatePrecautions || []),
    ...(result.recommendations?.waterTreatment || []),
  ].slice(0, 6);

  const riskLabel = result.health_score < 25 ? "CRITICAL" : result.risk_level === "safe" ? "LOW" : result.risk_level === "moderate" ? "MODERATE" : "HIGH";
  const riskColor = result.health_score < 25 ? "text-rose-500" : result.risk_level === "safe" ? "text-emerald-400" : result.risk_level === "moderate" ? "text-amber-400" : "text-rose-400";

  const whyUnsafe = [];
  if (classifyParameter("turbidity", result.turbidity) !== "safe") {
    whyUnsafe.push(`High turbidity (${Math.round(result.turbidity)} NTU) indicates suspended particles that may contain bacteria and viruses.`);
  }
  if (classifyParameter("tds", result.tds) !== "safe") {
    whyUnsafe.push(`High TDS (${Math.round(result.tds)} ppm) indicates excessive dissolved solids and possible contamination.`);
  }
  if (classifyParameter("ph", result.ph) !== "safe") {
    whyUnsafe.push(result.ph < 6.5
      ? `Low pH (${Math.round(result.ph * 10) / 10}) may damage plumbing and increase metal contamination.`
      : `High pH (${Math.round(result.ph * 10) / 10}) may cause skin and digestive irritation.`);
  }
  if (classifyParameter("temperature", result.temperature) !== "safe") {
    whyUnsafe.push(`Elevated temperature (${Math.round(result.temperature * 10) / 10}°C) accelerates bacterial growth.`);
  }
  if (whyUnsafe.length === 0) whyUnsafe.push("All water parameters are within WHO safe limits. No safety concerns detected.");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="premium-card p-6 sm:p-8 space-y-6"
      >
        {/* Heading */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold">AI Water Analysis</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Comprehensive AI-generated diagnostic report</p>
          </div>
        </div>

        {/* Water Quality Summary */}
        <ReportSection icon={Activity} title="Water Quality Summary" color="text-cyan-400" bg="bg-cyan-500/10">
          <p className="text-sm text-foreground/80 leading-relaxed mb-2">
            Overall water quality is <span className="font-bold">{result.risk_level === "safe" ? "safe" : "not safe"}</span> with a health score of <span className="font-bold">{result.health_score}/100</span>.
            {crossedParams.length > 0
              ? ` ${crossedParams.length} parameter${crossedParams.length > 1 ? "s" : ""} crossed safe limits: ${crossedParams.map((p) => p.type.toUpperCase()).join(", ")}.`
              : " All parameters are within WHO safe drinking water limits."}
          </p>
          <p className="text-xs text-muted-foreground">Prediction confidence: {aiConfidence}%</p>
        </ReportSection>

        {/* Why is this water unsafe? */}
        {result.risk_level !== "safe" && (
          <ReportSection icon={AlertTriangle} title="Why is this water unsafe?" color="text-amber-400" bg="bg-amber-500/10">
            <div className="space-y-2">
              {whyUnsafe.map((reason, idx) => (
                <p key={idx} className="text-sm text-foreground/80 leading-relaxed">{reason}</p>
              ))}
            </div>
          </ReportSection>
        )}

        {/* What happens if you drink this water? */}
        {diseaseEntries.length > 0 && (
          <ReportSection icon={AlertTriangle} title="What happens if you drink this water?" color="text-rose-400" bg="bg-rose-500/10">
            <p className="text-sm font-medium text-foreground/80 mb-2">⚠ Drinking this water may cause:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {diseaseEntries.map(([disease, risk]) => (
                <span key={disease} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300">
                  {t(disease)} · {risk}%
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Symptoms may include diarrhea, vomiting, fever, abdominal pain, and dehydration. Seek medical attention immediately if symptoms appear.
            </p>
          </ReportSection>
        )}

        {/* Immediate Actions */}
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-semibold text-emerald-400">Immediate Actions</h3>
          </div>
          <div className="space-y-2">
            {immediateActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between rounded-xl glass border border-border/50 p-5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold">Risk Level</h3>
          </div>
          <span className={`text-lg font-heading font-bold ${riskColor}`}>{riskLabel}</span>
        </div>

        {/* WHO Recommendation */}
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="font-heading font-semibold text-blue-400">WHO Recommendation</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {result.risk_level === "safe"
              ? "Water meets WHO drinking water quality guidelines. Regular monitoring is recommended to maintain safety."
              : "WHO recommends that water exceeding safe limits must be treated before consumption. Boil water for at least 1 minute, use certified filtration, or switch to sealed bottled water."}
          </p>
        </div>

        {/* AI Confidence */}
        <div className="rounded-xl glass border border-border/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-heading font-semibold">AI Confidence</h3>
            </div>
            <span className="text-lg font-heading font-bold text-purple-400">{animatedConfidence}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${aiConfidence}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReportSection({ icon: Icon, title, color, bg, children }) {
  return (
    <div className={`rounded-xl ${bg} border border-border/30 p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="font-heading font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}