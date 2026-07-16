import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2, AlertTriangle, Wrench, Droplets, Thermometer, Cloud, Activity } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";

export default function AIRecommendations({ scan }) {
  const recommendations = useMemo(() => {
    if (!scan) return [];
    const recs = [];

    const turbStatus = classifyParameter("turbidity", scan.turbidity);
    if (turbStatus === "danger") recs.push({ icon: Cloud, text: "Turbidity is very high. Clean or replace water filters immediately — suspended particles may harbor pathogens.", color: "text-danger", bg: "bg-danger/10" });
    else if (turbStatus === "moderate") recs.push({ icon: Cloud, text: "Turbidity is slightly elevated. Consider cleaning water filters and checking the water source.", color: "text-warning", bg: "bg-warning/10" });

    const tdsStatus = classifyParameter("tds", scan.tds);
    if (tdsStatus === "danger") recs.push({ icon: Droplets, text: "TDS is dangerously high. Install an RO filtration system — dissolved solids may include heavy metals.", color: "text-danger", bg: "bg-danger/10" });
    else if (tdsStatus === "moderate") recs.push({ icon: Droplets, text: "TDS is above recommended levels. Use a water filter or boil before drinking.", color: "text-warning", bg: "bg-warning/10" });

    const phStatus = classifyParameter("ph", scan.ph);
    if (phStatus === "danger") recs.push({ icon: Activity, text: `pH is ${scan.ph < 6.5 ? "too acidic" : "too alkaline"} (${scan.ph}). Use pH balancers or switch to a different water source.`, color: "text-danger", bg: "bg-danger/10" });
    else if (phStatus === "moderate") recs.push({ icon: Activity, text: `pH is slightly ${scan.ph < 6.5 ? "acidic" : "alkaline"} (${scan.ph}). Monitor closely and consider adjustment.`, color: "text-warning", bg: "bg-warning/10" });

    const tempStatus = classifyParameter("temperature", scan.temperature);
    if (tempStatus === "danger") recs.push({ icon: Thermometer, text: `Water temperature is high (${scan.temperature}°C). This accelerates bacterial growth — cool the water before use.`, color: "text-danger", bg: "bg-danger/10" });
    else if (tempStatus === "moderate") recs.push({ icon: Thermometer, text: `Water temperature is slightly warm (${scan.temperature}°C). Monitor for bacterial growth.`, color: "text-warning", bg: "bg-warning/10" });

    if (recs.length === 0) {
      recs.push({ icon: CheckCircle2, text: "Water quality is excellent. No immediate action required.", color: "text-safe", bg: "bg-safe/10" });
    }

    return recs;
  }, [scan]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="premium-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-purple" />
        </div>
        <h3 className="font-heading font-semibold text-base">AI Recommendations</h3>
      </div>
      {!scan ? (
        <p className="text-sm text-muted-foreground">No scan data available. Start monitoring to get AI recommendations.</p>
      ) : (
        <div className="space-y-2">
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl ${rec.bg}`}>
                <Icon className={`w-4 h-4 ${rec.color} flex-shrink-0 mt-0.5`} />
                <p className="text-xs text-foreground/80 leading-relaxed">{rec.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}