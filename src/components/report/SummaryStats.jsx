import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Database, Activity, ShieldCheck, AlertTriangle } from "lucide-react";
import moment from "moment";

function getTimeRange(filter) {
  switch (filter) {
    case "today": return moment().startOf("day");
    case "7d": return moment().subtract(7, "days");
    case "30d": return moment().subtract(30, "days");
    case "90d": return moment().subtract(90, "days");
    case "1y": return moment().subtract(1, "year");
    default: return moment().subtract(30, "days");
  }
}

function getDurationDays(filter) {
  switch (filter) {
    case "today": return 1;
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 365;
    default: return 30;
  }
}

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

function StatCard({ icon: Icon, label, value, change, trendUp, gradient, lastUpdated, delay }) {
  const TrendIcon = trendUp === null ? Minus : trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendUp === null ? "text-muted-foreground" : trendUp ? "text-safe" : "text-danger";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="premium-card p-5 relative overflow-hidden"
    >
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-10 bg-gradient-to-br ${gradient}`} />
      <div className="relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-[13px] text-muted-foreground mb-0.5 font-medium">{label}</p>
        <p className="text-[28px] font-bold leading-tight mb-2.5">{value}</p>
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {change > 0 ? "+" : ""}{change}%
          </span>
          {lastUpdated && (
            <span className="text-[11px] text-muted-foreground">
              {moment(lastUpdated).fromNow()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SummaryStats({ scans, timeFilter }) {
  const stats = useMemo(() => {
    const cutoff = getTimeRange(timeFilter);
    const duration = getDurationDays(timeFilter);
    const prevEnd = moment(cutoff);
    const prevStart = moment(cutoff).subtract(duration, "days");

    const current = scans.filter(s => moment(s.created_date).isAfter(cutoff));
    const previous = scans.filter(s => moment(s.created_date).isBetween(prevStart, prevEnd, null, "(]"));

    const total = current.length;
    const avgScore = total > 0 ? Math.round(current.reduce((s, x) => s + x.health_score, 0) / total) : 0;
    const safeCount = current.filter(s => s.risk_level === "safe").length;
    const dangerCount = current.filter(s => s.risk_level === "danger").length;

    const prevTotal = previous.length;
    const prevAvg = previous.length > 0 ? Math.round(previous.reduce((s, x) => s + x.health_score, 0) / previous.length) : 0;
    const prevSafe = previous.filter(s => s.risk_level === "safe").length;
    const prevDanger = previous.filter(s => s.risk_level === "danger").length;

    return {
      total, avgScore, safeCount, dangerCount,
      totalChange: pctChange(total, prevTotal),
      avgScoreChange: pctChange(avgScore, prevAvg),
      safeChange: pctChange(safeCount, prevSafe),
      dangerChange: pctChange(dangerCount, prevDanger),
      lastUpdated: scans.length > 0 ? scans[0].created_date : null,
    };
  }, [scans, timeFilter]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Database} label="Total Reports" value={stats.total} change={stats.totalChange} trendUp={stats.totalChange > 0 ? true : stats.totalChange < 0 ? false : null} gradient="from-purple-500 to-violet-600" lastUpdated={stats.lastUpdated} delay={0.05} />
      <StatCard icon={Activity} label="Avg Health Score" value={`${stats.avgScore}`} change={stats.avgScoreChange} trendUp={stats.avgScoreChange > 0 ? true : stats.avgScoreChange < 0 ? false : null} gradient="from-cyan-500 to-blue-600" lastUpdated={stats.lastUpdated} delay={0.1} />
      <StatCard icon={ShieldCheck} label="Safe Reports" value={stats.safeCount} change={stats.safeChange} trendUp={stats.safeChange > 0 ? true : stats.safeChange < 0 ? false : null} gradient="from-emerald-500 to-teal-600" lastUpdated={stats.lastUpdated} delay={0.15} />
      <StatCard icon={AlertTriangle} label="Unsafe Reports" value={stats.dangerCount} change={stats.dangerChange} trendUp={stats.dangerChange > 0 ? false : stats.dangerChange < 0 ? true : null} gradient="from-rose-500 to-red-600" lastUpdated={stats.lastUpdated} delay={0.2} />
    </div>
  );
}