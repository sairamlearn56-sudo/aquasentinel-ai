import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, Activity, AlertTriangle, Calendar, ArrowUp, ArrowDown, Minus } from "lucide-react";
import moment from "moment";
import { getSummaryStats } from "@/lib/analysisUtils";

function DiffIndicator({ diff }) {
  if (diff === null || diff === undefined) {
    return <span className="text-xs text-muted-foreground/50">—</span>;
  }
  if (diff === 0) {
    return <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="w-3 h-3" /> 0</span>;
  }
  const isPositive = diff > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-safe" : "text-danger"}`}>
      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{diff}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, current, previous, diff, isDate, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="premium-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {!isDate && <DiffIndicator diff={diff} />}
      </div>
      <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      {isDate ? (
        <p className="text-lg font-bold font-heading">{current ? moment(current).format("MMM D, YYYY") : "N/A"}</p>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold font-heading">{current}</span>
          {previous !== null && previous !== undefined && (
            <span className="text-xs text-muted-foreground">prev: {previous}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function SummaryCards({ scans }) {
  const stats = useMemo(() => getSummaryStats(scans), [scans]);
  if (!stats) return null;

  const cards = [
    { icon: FileText, label: "Total Reports", ...stats.total },
    { icon: CheckCircle2, label: "Completed Analyses", ...stats.completed },
    { icon: Clock, label: "Pending Analyses", ...stats.pending },
    { icon: Activity, label: "Avg Water Health", ...stats.avgScore },
    { icon: AlertTriangle, label: "Unsafe Samples", ...stats.unsafe },
    { icon: Calendar, label: "Latest Analysis", current: stats.latestDate, isDate: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <SummaryCard key={idx} {...card} index={idx} />
      ))}
    </div>
  );
}