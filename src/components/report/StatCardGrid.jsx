import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Database, Activity, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import moment from "moment";

const TIME_RANGES = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "7 Days", days: 7 },
  { key: "30d", label: "30 Days", days: 30 },
  { key: "90d", label: "90 Days", days: 90 },
  { key: "1y", label: "1 Year", days: 365 },
];

function getRangeScans(scans, rangeKey, offset = 0) {
  const range = TIME_RANGES.find((r) => r.key === rangeKey);
  if (!range) return [];
  const now = Date.now();
  const currentStart = now - (range.days + offset) * 24 * 60 * 60 * 1000;
  const periodStart = now - offset * 24 * 60 * 60 * 1000;
  return scans.filter((s) => {
    const t = new Date(s.created_date).getTime();
    return t >= currentStart && t < periodStart;
  });
}

function computeStats(scans, timeRange) {
  const current = getRangeScans(scans, timeRange, 0);
  const previous = getRangeScans(scans, timeRange, TIME_RANGES.find((r) => r.key === timeRange)?.days || 30);

  const currentAvg = current.length > 0 ? Math.round(current.reduce((s, x) => s + x.health_score, 0) / current.length) : 0;
  const previousAvg = previous.length > 0 ? Math.round(previous.reduce((s, x) => s + x.health_score, 0) / previous.length) : 0;

  const currentSafe = current.filter((s) => s.risk_level === "safe").length;
  const previousSafe = previous.filter((s) => s.risk_level === "safe").length;

  const currentDanger = current.filter((s) => s.risk_level === "danger").length;
  const previousDanger = previous.filter((s) => s.risk_level === "danger").length;

  const pctChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / Math.abs(prev)) * 100);
  };

  const lastScan = current[0];

  return {
    total: current.length,
    avgScore: currentAvg,
    safe: currentSafe,
    danger: currentDanger,
    totalChange: pctChange(current.length, previous.length),
    avgChange: pctChange(currentAvg, previousAvg),
    safeChange: pctChange(currentSafe, previousSafe),
    dangerChange: pctChange(currentDanger, previousDanger),
    lastUpdated: lastScan?.created_date,
  };
}

function StatCard({ icon: Icon, label, value, change, positiveIsGood, gradient, iconBg, lastUpdated, delay }) {
  const hasChange = change !== null && change !== undefined && !isNaN(change);
  const isPositive = change > 0;
  const isNegative = change < 0;

  // Determine if the change is good or bad
  let changeColor = "text-muted-foreground";
  let ChangeIcon = Minus;
  if (hasChange) {
    if (positiveIsGood === null) {
      // Neutral metric (total reports)
      changeColor = isPositive ? "text-primary" : "text-muted-foreground";
      ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    } else if (positiveIsGood) {
      // Higher is better
      changeColor = isPositive ? "text-safe" : isNegative ? "text-danger" : "text-muted-foreground";
      ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    } else {
      // Lower is better
      changeColor = isNegative ? "text-safe" : isPositive ? "text-danger" : "text-muted-foreground";
      ChangeIcon = isNegative ? TrendingDown : isPositive ? TrendingUp : Minus;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`premium-card p-5 bg-gradient-to-br ${gradient}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {hasChange && (
          <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md glass border border-border text-xs font-medium ${changeColor}`}>
            <ChangeIcon className="w-3 h-3" />
            {isPositive && "+"}{change}%
          </div>
        )}
      </div>
      <p className="text-3xl font-extrabold leading-none mb-1">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {lastUpdated && (
        <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-safe animate-pulse" />
          Updated {moment(lastUpdated).fromNow()}
        </p>
      )}
    </motion.div>
  );
}

export default function StatCardGrid({ scans, timeRange }) {
  const stats = useMemo(() => computeStats(scans, timeRange), [scans, timeRange]);

  const cards = [
    {
      icon: Database,
      label: "Total Reports",
      value: stats.total,
      change: stats.totalChange,
      positiveIsGood: null,
      gradient: "from-violet-500/10 to-purple-600/5",
      iconBg: "bg-violet-500/15 text-violet-400",
      lastUpdated: stats.lastUpdated,
    },
    {
      icon: Activity,
      label: "Avg Health Score",
      value: `${stats.avgScore}`,
      change: stats.avgChange,
      positiveIsGood: true,
      gradient: "from-cyan-500/10 to-blue-500/5",
      iconBg: "bg-cyan-500/15 text-cyan-400",
      lastUpdated: null,
    },
    {
      icon: ShieldCheck,
      label: "Safe Reports",
      value: stats.safe,
      change: stats.safeChange,
      positiveIsGood: true,
      gradient: "from-emerald-500/10 to-teal-500/5",
      iconBg: "bg-emerald-500/15 text-emerald-400",
      lastUpdated: null,
    },
    {
      icon: AlertTriangle,
      label: "Unsafe Reports",
      value: stats.danger,
      change: stats.dangerChange,
      positiveIsGood: false,
      gradient: "from-rose-500/10 to-red-500/5",
      iconBg: "bg-rose-500/15 text-rose-400",
      lastUpdated: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} delay={idx * 0.05} />
      ))}
    </div>
  );
}