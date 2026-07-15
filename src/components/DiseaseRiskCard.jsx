import React from "react";
import { getDiseaseConfig } from "@/components/illustrations/DiseaseIllustrations";

export default function DiseaseRiskCard({ name, risk, delay = 0, t }) {
  const config = getDiseaseConfig(name);
  const Illustration = config.Illustration;

  const riskColor = risk < 15 ? "text-safe" : risk < 40 ? "text-warning" : "text-danger";
  const riskBg = risk < 15 ? "bg-safe" : risk < 40 ? "bg-warning" : "bg-danger";
  const riskLabel = risk < 15 ? "Low Risk" : risk < 40 ? "Moderate" : "High Risk";

  return (
    <div
      className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.color + "15", color: config.color }}
        >
          <Illustration className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{t(name)}</p>
          <p className={`text-xs font-medium ${riskColor}`}>{riskLabel}</p>
        </div>
        <span className={`text-lg font-bold ${riskColor}`}>{risk}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${riskBg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(risk, 100)}%` }}
        />
      </div>
    </div>
  );
}