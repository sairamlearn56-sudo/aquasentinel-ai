import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";

export default function SmartRecommendations({ scans }) {
  const recommendations = useMemo(() => {
    if (scans.length === 0) return [];
    const latest = scans[0];
    const recs = [];

    if (latest.risk_level === "safe") {
      recs.push({ text: "Continue regular monitoring", priority: "low" });
      recs.push({ text: "Maintain current water treatment protocols", priority: "low" });
      recs.push({ text: "Log results for trend analysis", priority: "low" });
    } else {
      recs.push({ text: "Boil water before consumption", priority: "high" });
      recs.push({ text: "Increase chlorination dosage", priority: "high" });

      if (classifyParameter("turbidity", latest.turbidity) !== "safe") {
        recs.push({ text: "Inspect nearby pipeline for contamination source", priority: "medium" });
      }
      if (classifyParameter("tds", latest.tds) !== "safe") {
        recs.push({ text: "Install or service RO filtration system", priority: "medium" });
      }
      if (classifyParameter("ph", latest.ph) !== "safe") {
        recs.push({ text: "Test water source for acid/alkaline contamination", priority: "medium" });
      }

      recs.push({ text: "Increase water testing frequency", priority: "medium" });

      if (latest.risk_level === "danger") {
        recs.push({ text: "Notify healthcare centers of potential outbreak risk", priority: "high" });
        recs.push({ text: "Deploy emergency response team", priority: "high" });
        recs.push({ text: "Issue public water advisory immediately", priority: "high" });
      }
    }

    return recs;
  }, [scans]);

  if (recommendations.length === 0) return null;

  const priorityConfig = {
    high: { color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
    medium: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    low: { color: "text-safe", bg: "bg-safe/10", border: "border-safe/20" },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Smart Recommendations</h2>
          <p className="text-xs text-muted-foreground">AI-generated action plan</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, idx) => {
          const pc = priorityConfig[rec.priority];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl glass border border-border/50 hover:border-border transition-colors"
            >
              <div className={`w-7 h-7 rounded-lg ${pc.bg} flex items-center justify-center flex-shrink-0`}>
                <CheckCircle2 className={`w-4 h-4 ${pc.color}`} />
              </div>
              <p className="text-sm flex-1">{rec.text}</p>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${pc.bg} ${pc.color} ${pc.border} border uppercase`}>
                {rec.priority}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}