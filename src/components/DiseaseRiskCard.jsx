import React from "react";
import { Activity } from "lucide-react";

const DISEASE_COLORS = {
  cholera: "text-red-500",
  typhoid: "text-orange-500",
  diarrhea: "text-amber-500",
  dysentery: "text-rose-500",
  hepatitisA: "text-yellow-600",
};

export default function DiseaseRiskCard({ name, risk, delay = 0, t }) {
  const colorClass = DISEASE_COLORS[name] || "text-muted-foreground";
  
  const riskColor = risk < 15 ? "text-safe" : risk < 40 ? "text-warning" : "text-danger";
  const riskBg = risk < 15 ? "bg-safe" : risk < 40 ? "bg-warning" : "bg-danger";

  return (
    <div
      className="glass rounded-2xl p-4 border border-border animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center ${colorClass}`}>
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{t(name)}</span>
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