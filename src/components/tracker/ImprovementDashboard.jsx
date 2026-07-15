import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Minus } from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";

function calcImprovement(before, after) {
  if (before === 0) return after === 0 ? 0 : 100;
  return Math.round(((before - after) / before) * 100);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

export default function ImprovementDashboard({ firstScan, latestScan }) {
  const comparison = useMemo(() => {
    if (!firstScan || !latestScan) return null;

    const tdsImp = calcImprovement(firstScan.tds, latestScan.tds);
    const turbImp = calcImprovement(firstScan.turbidity, latestScan.turbidity);
    const tempDiff = Math.round((latestScan.temperature - firstScan.temperature) * 10) / 10;
    const scoreImp = latestScan.health_score - firstScan.health_score;

    const riskOrder = { safe: 3, moderate: 2, danger: 1 };
    const riskImproved = riskOrder[latestScan.risk_level] > riskOrder[firstScan.risk_level];
    const riskSame = latestScan.risk_level === firstScan.risk_level;
    const riskWorse = riskOrder[latestScan.risk_level] < riskOrder[firstScan.risk_level];

    const improved = tdsImp > 0 || turbImp > 0 || riskImproved;
    const deteriorated = tdsImp < 0 || turbImp < 0 || riskWorse;

    // Generate AI summary
    let summary = "";
    if (improved && !deteriorated) {
      const parts = [];
      if (tdsImp > 0) parts.push(`TDS decreased by ${tdsImp}%`);
      if (turbImp > 0) parts.push(`Turbidity decreased by ${turbImp}%`);
      if (riskImproved) {
        summary = `Water quality has significantly improved. ${parts.join(", ")}, and the overall risk changed from ${capitalize(firstScan.risk_level)} to ${capitalize(latestScan.risk_level)} after treatment.`;
      } else if (parts.length > 0) {
        summary = `Water quality has improved. ${parts.join(", ")}. The overall risk remains ${capitalize(latestScan.risk_level)}.`;
      } else {
        summary = "Water quality has remained stable with minor improvements. Continue regular monitoring.";
      }
    } else if (deteriorated) {
      const worseParams = [];
      if (tdsImp < 0) worseParams.push(`TDS increased by ${Math.abs(tdsImp)}%`);
      if (turbImp < 0) worseParams.push(`Turbidity increased by ${Math.abs(turbImp)}%`);
      if (tempDiff > 0) worseParams.push(`Temperature rose by ${tempDiff}°C`);
      summary = `Water quality has deteriorated. ${worseParams.join(", ")}. The overall risk changed from ${capitalize(firstScan.risk_level)} to ${capitalize(latestScan.risk_level)}. Please take corrective action immediately.`;
    } else {
      summary = "Water quality has remained stable. No significant changes detected between the first and latest scans. Continue regular monitoring.";
    }

    return { tdsImp, turbImp, tempDiff, scoreImp, riskImproved, riskSame, riskWorse, improved, deteriorated, summary };
  }, [firstScan, latestScan]);

  if (!comparison) return null;

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-3xl p-6 border-2 ${
          comparison.deteriorated
            ? "border-danger/30 bg-danger/5"
            : comparison.improved
            ? "border-safe/30 bg-safe/5"
            : "border-border"
        }`}
      >
        <div className="flex items-start gap-3">
          {comparison.deteriorated ? (
            <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
          ) : comparison.improved ? (
            <TrendingUp className="w-6 h-6 text-safe flex-shrink-0 mt-0.5" />
          ) : (
            <Minus className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-semibold mb-1">AI Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{comparison.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Before / After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BeforeAfterCard title="Before" scan={firstScan} />
        <BeforeAfterCard title="After" scan={latestScan} />
      </div>

      {/* Improvement metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="TDS Improvement"
          value={`${comparison.tdsImp > 0 ? "↓" : comparison.tdsImp < 0 ? "↑" : "—"} ${Math.abs(comparison.tdsImp)}%`}
          positive={comparison.tdsImp > 0}
          negative={comparison.tdsImp < 0}
        />
        <MetricCard
          label="Turbidity Improvement"
          value={`${comparison.turbImp > 0 ? "↓" : comparison.turbImp < 0 ? "↑" : "—"} ${Math.abs(comparison.turbImp)}%`}
          positive={comparison.turbImp > 0}
          negative={comparison.turbImp < 0}
        />
        <MetricCard
          label="Temperature Diff"
          value={`${comparison.tempDiff > 0 ? "+" : ""}${comparison.tempDiff}°C`}
          positive={comparison.tempDiff < 0}
          negative={comparison.tempDiff > 0}
        />
        <MetricCard
          label="Overall Improvement"
          value={`${comparison.scoreImp > 0 ? "+" : ""}${comparison.scoreImp}%`}
          positive={comparison.scoreImp > 0}
          negative={comparison.scoreImp < 0}
        />
      </div>

      {/* Risk change */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 flex items-center justify-center gap-6"
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Before</p>
          <RiskBadge level={firstScan.risk_level} />
        </div>
        <ArrowRight
          className={`w-6 h-6 ${
            comparison.riskImproved ? "text-safe" : comparison.riskWorse ? "text-danger" : "text-muted-foreground"
          }`}
        />
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">After</p>
          <RiskBadge level={latestScan.risk_level} />
        </div>
      </motion.div>
    </div>
  );
}

function BeforeAfterCard({ title, scan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">
        {moment(scan.created_date).format("MMM D, YYYY · h:mm A")}
      </p>
      <div className="space-y-2.5">
        <Row label="TDS" value={`${scan.tds} ppm`} />
        <Row label="Turbidity" value={`${scan.turbidity} NTU`} />
        <Row label="Temperature" value={`${scan.temperature} °C`} />
        <Row label="Overall Risk" value={<RiskBadge level={scan.risk_level} size="sm" />} />
      </div>
    </motion.div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function MetricCard({ label, value, positive, negative }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-4 text-center border ${
        positive ? "border-safe/20" : negative ? "border-danger/20" : "border-border"
      }`}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          positive ? "text-safe" : negative ? "text-danger" : "text-muted-foreground"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}