import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import WaterGradeBadge from "@/components/report/WaterGradeBadge";
import { classifyParameter } from "@/lib/waterAnalysis";

function getMainReason(scan) {
  if (classifyParameter("tds", scan.tds) === "danger") return "High TDS";
  if (classifyParameter("turbidity", scan.turbidity) === "danger") return "High Turbidity";
  if (classifyParameter("ph", scan.ph) === "danger") return "Abnormal pH";
  if (classifyParameter("temperature", scan.temperature) === "danger") return "High Temperature";
  if (classifyParameter("tds", scan.tds) === "moderate") return "Elevated TDS";
  if (classifyParameter("turbidity", scan.turbidity) === "moderate") return "Elevated Turbidity";
  if (classifyParameter("ph", scan.ph) === "moderate") return "Slightly Abnormal pH";
  return "All Parameters Normal";
}

export default function ExecutiveSummary({ scan, t }) {
  const aiConfidence = scan.ai_confidence || Math.min(98, 82 + Math.round((100 - scan.health_score) * 0.15));
  const mainReason = getMainReason(scan);
  const isSafe = scan.risk_level === "safe";

  const summaryText = scan.ai_analysis?.split("\n\n")[0] || 
    (isSafe ? "All water quality parameters are within WHO safe limits." : "Some parameters exceed safe drinking water limits.");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="premium-card p-6 sm:p-7"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-lg">AI Executive Summary</h2>
          <p className="text-xs text-muted-foreground">Automated intelligence briefing</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Score + Grade */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={110} stroke={9} />
          </div>
          <WaterGradeBadge score={scan.health_score} size="lg" />
        </div>

        {/* Key metrics */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass border border-border text-xs">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-bold text-foreground">{aiConfidence}%</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass border border-border text-xs">
              <Activity className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Factor</span>
              <span className="font-semibold text-foreground">{mainReason}</span>
            </span>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">{summaryText}</p>

          <div className={`flex items-start gap-2 p-3 rounded-xl border ${
            isSafe ? "bg-safe/5 border-safe/15" : "bg-warning/5 border-warning/15"
          }`}>
            {isSafe ? (
              <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            )}
            <p className="text-xs text-foreground/75 leading-relaxed">
              {isSafe
                ? "Water is safe for drinking and household use. Continue regular monitoring."
                : "Treatment recommended before consumption. Follow the recommended actions below."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}