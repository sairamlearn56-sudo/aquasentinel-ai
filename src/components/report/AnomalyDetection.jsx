import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";

const SEVERITY_CONFIG = {
  high: { icon: AlertOctagon, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", label: "Critical" },
  medium: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Warning" },
  low: { icon: Info, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Info" },
};

export default function AnomalyDetection({ scans }) {
  const anomalies = useMemo(() => {
    if (scans.length === 0) return [];
    const latest = scans[0];
    const result = [];

    const params = [
      { key: "turbidity", label: "Turbidity", safeMax: 5 },
      { key: "ph", label: "pH", safeMin: 6.5, safeMax: 8.5 },
      { key: "tds", label: "TDS", safeMax: 500 },
      { key: "temperature", label: "Temperature", safeMin: 15, safeMax: 30 },
    ];

    params.forEach(p => {
      const value = latest[p.key];
      const status = classifyParameter(p.key, value);
      if (status === "danger") {
        result.push({
          type: `Abnormal ${p.label}`,
          severity: "high",
          detail: `${p.label} at ${value} — critically outside WHO safe range`,
        });
      } else if (status === "moderate") {
        result.push({
          type: `${p.label} Deviation`,
          severity: "medium",
          detail: `${p.label} at ${value} — slightly outside safe range`,
        });
      }
    });

    // Rapid changes
    if (scans.length >= 2) {
      const prev = scans[1];
      const tdsChange = latest.tds - prev.tds;
      if (Math.abs(tdsChange) > 200) {
        result.push({
          type: "Rapid TDS Increase",
          severity: Math.abs(tdsChange) > 400 ? "high" : "medium",
          detail: `TDS changed by ${tdsChange > 0 ? "+" : ""}${Math.round(tdsChange)} ppm since last scan`,
        });
      }
      const phChange = latest.ph - prev.ph;
      if (Math.abs(phChange) > 1) {
        result.push({
          type: "Unexpected pH Shift",
          severity: Math.abs(phChange) > 2 ? "high" : "medium",
          detail: `pH shifted ${phChange > 0 ? "up" : "down"} by ${Math.round(Math.abs(phChange) * 10) / 10} units`,
        });
      }
    }

    // Sensor failure
    if (latest.ph < 0 || latest.tds < 0 || latest.temperature < 0 || latest.turbidity < 0) {
      result.push({
        type: "Possible Sensor Failure",
        severity: "low",
        detail: "One or more sensors returned invalid readings",
      });
    }

    return result;
  }, [scans]);

  if (anomalies.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
          <AlertOctagon className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Anomaly Detection</h2>
          <p className="text-xs text-muted-foreground">{anomalies.length} unusual pattern{anomalies.length !== 1 ? "s" : ""} detected</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {anomalies.map((a, idx) => {
          const sc = SEVERITY_CONFIG[a.severity];
          const Icon = sc.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border ${sc.bg} ${sc.border}`}
            >
              <div className={`w-9 h-9 rounded-lg ${sc.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${sc.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{a.type}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${sc.bg} ${sc.color} ${sc.border} border flex-shrink-0`}>
                {sc.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}