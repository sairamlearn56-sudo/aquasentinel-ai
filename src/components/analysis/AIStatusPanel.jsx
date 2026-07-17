import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Cpu, Clock, Zap, TrendingUp } from "lucide-react";
import moment from "moment";
import { getInferenceTime } from "@/lib/analysisUtils";

export default function AIStatusPanel({ scans }) {
  const status = useMemo(() => {
    if (scans.length === 0) return null;
    const total = scans.length;
    const completed = scans.filter((s) => s.ai_analysis && s.ai_analysis.trim()).length;
    const pending = total - completed;

    const modelStatus = pending > 0 ? "Pending" : "Ready";
    const statusColor = modelStatus === "Ready" ? "text-safe" : "text-warning";
    const dotColor = modelStatus === "Ready" ? "bg-safe" : "bg-warning";

    const latestWithAI = scans.find((s) => s.ai_analysis && s.ai_analysis.trim());
    const lastUpdate = latestWithAI?.updated_date || latestWithAI?.created_date || null;

    const inferenceTime = latestWithAI ? getInferenceTime(latestWithAI) : null;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { modelStatus, statusColor, dotColor, lastUpdate, inferenceTime, successRate, completed, total, pending };
  }, [scans]);

  if (!status) return null;

  const items = [
    {
      icon: Cpu,
      label: "Model Status",
      value: status.modelStatus,
      sub: `${status.completed}/${status.total} processed`,
      color: status.statusColor,
      dot: status.dotColor,
    },
    {
      icon: Clock,
      label: "Last Model Update",
      value: status.lastUpdate ? moment(status.lastUpdate).format("MMM D, HH:mm") : "Unavailable",
      sub: status.lastUpdate ? moment(status.lastUpdate).fromNow() : "",
      color: "text-muted-foreground",
    },
    {
      icon: Zap,
      label: "Inference Time",
      value: status.inferenceTime || "Unavailable",
      sub: status.inferenceTime ? "Latest scan" : "",
      color: status.inferenceTime ? "text-primary" : "text-muted-foreground",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: `${status.successRate}%`,
      sub: `${status.pending} pending`,
      color: status.successRate >= 90 ? "text-safe" : status.successRate >= 50 ? "text-warning" : "text-danger",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="premium-card p-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                <div className="flex items-center gap-1.5">
                  {item.dot && <span className={`w-2 h-2 rounded-full ${item.dot} animate-pulse`} />}
                  <p className={`text-lg font-bold truncate ${item.color}`}>{item.value}</p>
                </div>
                {item.sub && <p className="text-[11px] text-muted-foreground">{item.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}