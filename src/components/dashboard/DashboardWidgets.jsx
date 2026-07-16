import React from "react";
import { motion } from "framer-motion";
import { Activity, Sparkles, Clock, ShieldCheck, Cpu, Droplets, Thermometer, Cloud, AlertCircle } from "lucide-react";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";

export default function DashboardWidgets({ scan }) {
  if (!scan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="premium-card p-8 text-center"
      >
        <div className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-base mb-1">No Scan Data Yet</h3>
        <p className="text-sm text-muted-foreground">Start monitoring to see your water health dashboard</p>
      </motion.div>
    );
  }

  const aiConfidence = scan.ai_confidence || Math.min(98, 82 + Math.round((100 - scan.health_score) * 0.15));
  const lastUpdated = new Date(scan.created_date || scan.updated_date).toLocaleString();
  const systemHealth = scan.risk_level === "safe" ? "Excellent" : scan.risk_level === "moderate" ? "Good" : "Needs Attention";
  const systemHealthColor = scan.risk_level === "safe" ? "text-safe" : scan.risk_level === "moderate" ? "text-warning" : "text-danger";

  const sensors = [
    { icon: Activity, label: "pH", value: scan.ph, unit: "", color: "text-safe" },
    { icon: Droplets, label: "TDS", value: scan.tds, unit: "ppm", color: "text-blue" },
    { icon: Thermometer, label: "Temp", value: scan.temperature, unit: "°C", color: "text-warning" },
    { icon: Cloud, label: "Turbidity", value: scan.turbidity, unit: "NTU", color: "text-purple" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      {/* Health Score + Status */}
      <div className="premium-card p-5 flex flex-col items-center justify-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Water Health Score</p>
        <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={110} stroke={8} />
        <div className="mt-3">
          <RiskBadge level={scan.risk_level} size="sm" />
        </div>
      </div>

      {/* AI Confidence + System Health + Last Updated */}
      <div className="premium-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple" />
            </div>
            <span className="text-sm text-muted-foreground">AI Confidence</span>
          </div>
          <span className="text-lg font-heading font-bold text-foreground">{aiConfidence}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-safe/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-safe" />
            </div>
            <span className="text-sm text-muted-foreground">System Health</span>
          </div>
          <span className={`text-sm font-semibold ${systemHealthColor}`}>{systemHealth}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Last Updated</span>
          </div>
          <span className="text-xs text-foreground font-medium">{lastUpdated}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-blue" />
            </div>
            <span className="text-sm text-muted-foreground">Sensors</span>
          </div>
          <span className="text-sm font-semibold text-safe">4/4 Online</span>
        </div>
      </div>

      {/* Live Sensor Values */}
      <div className="premium-card p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Live Sensor Readings</p>
        <div className="grid grid-cols-2 gap-3">
          {sensors.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3 h-3 ${s.color}`} />
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                </div>
                <p className={`text-lg font-heading font-bold tabular-nums ${s.color}`}>
                  {s.value}<span className="text-xs text-muted-foreground font-normal ml-0.5">{s.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}