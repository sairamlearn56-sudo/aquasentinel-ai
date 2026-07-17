import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea } from "recharts";
import { TrendingUp, TrendingDown, Minus, CloudRain, Waves, Droplets, FlaskConical, Bug } from "lucide-react";
import { classifyParameter } from "@/lib/waterAnalysis";
import moment from "moment";

const TIME_FILTERS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "1y", label: "1 Year" },
];

const RISK_COLORS = {
  safe: "#10b981",
  moderate: "#f59e0b",
  danger: "#ef4444",
};

const EVENT_CONFIG = {
  heavy_rainfall: { icon: CloudRain, color: "#3b82f6", label: "Heavy Rainfall" },
  high_turbidity: { icon: Waves, color: "#f97316", label: "High Turbidity" },
  low_ph: { icon: Droplets, color: "#8b5cf6", label: "Low pH" },
  high_tds: { icon: FlaskConical, color: "#06b6d4", label: "High TDS" },
  ecoli: { icon: Bug, color: "#ef4444", label: "E. coli Detection" },
};

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

function formatXLabel(date, filter) {
  const m = moment(date);
  switch (filter) {
    case "today": return m.format("HH:mm");
    case "7d": return m.format("ddd");
    case "30d": return m.format("MMM D");
    case "90d": return m.format("MMM D");
    case "1y": return m.format("MMM");
    default: return m.format("MMM D");
  }
}

function detectEvents(scan) {
  const events = [];
  if (classifyParameter("turbidity", scan.turbidity) === "danger") events.push("high_turbidity");
  if (classifyParameter("ph", scan.ph) === "danger" && scan.ph < 6.5) events.push("low_ph");
  if (classifyParameter("tds", scan.tds) === "danger") events.push("high_tds");
  if (classifyParameter("turbidity", scan.turbidity) !== "safe" && scan.temperature > 28) events.push("heavy_rainfall");
  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : (scan.disease_risks || {});
  if (risks.cholera > 60 || risks.diarrhea > 70) events.push("ecoli");
  return events;
}

function computeForecast(dataPoints, filter) {
  if (dataPoints.length < 3) return [];
  const recent = dataPoints.slice(-5);
  const n = recent.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = recent.reduce((s, p) => s + p.score, 0);
  const sumXY = recent.reduce((s, p, i) => s + p.score * i, 0);
  const sumX2 = recent.reduce((s, _, i) => s + i * i, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  const lastPoint = recent[n - 1];
  const stepUnit = filter === "1y" ? "weeks" : "days";
  const fmt = filter === "1y" ? "MMM" : filter === "today" ? "HH:mm" : "MMM D";

  return Array.from({ length: 3 }, (_, i) => {
    const projected = Math.max(0, Math.min(100, Math.round(intercept + slope * (n - 1 + i + 1))));
    return {
      label: moment(lastPoint.date).add(i + 1, stepUnit).format(fmt),
      date: moment(lastPoint.date).add(i + 1, stepUnit).toISOString(),
      score: null,
      forecast: projected,
      isForecast: true,
    };
  });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  const isForecast = data.isForecast;
  const displayScore = isForecast ? data.forecast : data.score;

  return (
    <div className="glass-strong rounded-xl p-3 border border-border text-xs shadow-xl min-w-[200px]">
      <p className="font-semibold mb-2">{moment(data.date).format("lll")}</p>
      {isForecast && <p className="text-purple-400 text-[10px] font-medium mb-1.5">✦ AI Forecast</p>}
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Water Health Score</span>
          <span className="font-bold">{displayScore}/100</span>
        </div>
        {!isForecast && (
          <>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Risk Level</span>
              <span className="capitalize font-medium" style={{ color: RISK_COLORS[data.risk_level] || "#06b6d4" }}>{data.risk_level}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-medium">{data.confidence}%</span>
            </div>
            {data.topDisease && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Predicted Disease</span>
                <span className="font-medium capitalize">{data.topDisease}</span>
              </div>
            )}
            {data.events?.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-border/50">
                {data.events.map(ev => {
                  const ec = EVENT_CONFIG[ev];
                  const EIcon = ec?.icon;
                  return (
                    <span key={ev} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]" style={{ background: `${ec.color}15`, color: ec.color }}>
                      {EIcon && <EIcon className="w-2.5 h-2.5" />}
                      {ec.label}
                    </span>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RiskTimeline({ scans, timeFilter, onTimeFilterChange }) {
  const { chartData, forecastData, allEvents, trend, avgScore } = useMemo(() => {
    const cutoff = getTimeRange(timeFilter);
    const filtered = scans.filter(s => moment(s.created_date).isAfter(cutoff));
    const chronological = [...filtered].reverse().slice(-50);

    const chartData = chronological.map((s) => {
      const risks = typeof s.disease_risks === "string" ? JSON.parse(s.disease_risks) : (s.disease_risks || {});
      const topDisease = Object.entries(risks).sort(([, a], [, b]) => b - a)[0];
      return {
        label: formatXLabel(s.created_date, timeFilter),
        date: s.created_date,
        score: s.health_score,
        forecast: null,
        risk_level: s.risk_level,
        confidence: s.ai_confidence || Math.min(98, 82 + Math.round((100 - s.health_score) * 0.15)),
        topDisease: topDisease ? topDisease[0] : null,
        events: detectEvents(s),
      };
    });

    const forecastData = computeForecast(chartData, timeFilter);

    const allEvents = chartData.flatMap((d, idx) => (d.events || []).map(ev => ({ ...d, idx, eventType: ev })));

    const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((s, x) => s + x.health_score, 0) / filtered.length) : 0;

    let trend = "stable";
    if (chronological.length >= 2) {
      const recent = chronological.slice(-3);
      const older = chronological.slice(-6, -3);
      if (recent.length > 0 && older.length > 0) {
        const rAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
        const oAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
        if (rAvg > oAvg + 5) trend = "improving";
        else if (rAvg < oAvg - 5) trend = "declining";
      }
    }

    return { chartData, forecastData, allEvents, trend, avgScore };
  }, [scans, timeFilter]);

  const combinedData = [...chartData, ...forecastData];

  const trendConfig = {
    improving: { icon: TrendingUp, color: "text-safe", label: "Improving" },
    declining: { icon: TrendingDown, color: "text-danger", label: "Declining" },
    stable: { icon: Minus, color: "text-muted-foreground", label: "Stable" },
  };
  const tc = trendConfig[trend];
  const TrendIcon = tc.icon;

  // Collect unique event types for legend
  const eventTypes = [...new Set(allEvents.map(e => e.eventType))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="premium-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[26px] font-bold leading-tight">AI Risk Trend</h2>
            <p className="text-[13px] text-muted-foreground">Water quality intelligence over time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-muted-foreground">Average Score</p>
            <p className="text-lg font-bold">{avgScore}/100</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass border border-border text-xs font-medium ${tc.color}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {tc.label}
          </span>
        </div>
      </div>

      {/* Time filter buttons */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {TIME_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onTimeFilterChange(f.key)}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
              timeFilter === f.key
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length < 1 ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
          No data available for this time range. Try a wider filter.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Colored background zones */}
            <ReferenceArea y1={70} y2={100} fill="#10b981" fillOpacity={0.06} />
            <ReferenceArea y1={50} y2={70} fill="#f59e0b" fillOpacity={0.06} />
            <ReferenceArea y1={30} y2={50} fill="#f97316" fillOpacity={0.06} />
            <ReferenceArea y1={0} y2={30} fill="#ef4444" fillOpacity={0.06} />

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="label"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={25}
            />
            <YAxis
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={35}
              label={{ value: "Risk Score (0–100)", angle: -90, position: "insideLeft", style: { fill: "hsl(var(--muted-foreground))", fontSize: 10, textAnchor: "middle" }, offset: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Actual scores — Area with gradient */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#scoreAreaGrad)"
              connectNulls={false}
              dot={(props) => {
                const { cx, cy, payload, index } = props;
                if (payload.score === null && payload.score !== 0) return <g key={index} />;
                const color = RISK_COLORS[payload.risk_level] || "#06b6d4";
                const hasEvent = payload.events?.length > 0;
                return (
                  <g key={index}>
                    {hasEvent && <circle cx={cx} cy={cy} r={7} fill={color} opacity={0.2} />}
                    <circle cx={cx} cy={cy} r={4} fill={color} stroke="hsl(var(--card))" strokeWidth={2} />
                  </g>
                );
              }}
              activeDot={{ r: 6, fill: "#06b6d4", stroke: "hsl(var(--card))", strokeWidth: 2 }}
            />

            {/* AI Forecast — dashed Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: "#a855f7", strokeWidth: 0 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 flex-wrap text-[11px]">
        {/* Risk zone legend */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Zones:</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-safe/30" />Safe</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-warning/30" />Moderate</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500/30" />High</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-danger/30" />Critical</span>
        </div>
        {/* Divider */}
        <span className="w-px h-4 bg-border hidden sm:block" />
        {/* Event markers */}
        {eventTypes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground font-medium">Events:</span>
            {eventTypes.map(ev => {
              const ec = EVENT_CONFIG[ev];
              const EIcon = ec.icon;
              return (
                <span key={ev} className="inline-flex items-center gap-1 text-muted-foreground">
                  <EIcon className="w-3 h-3" style={{ color: ec.color }} />
                  {ec.label}
                </span>
              );
            })}
          </div>
        )}
        {/* Divider */}
        <span className="w-px h-4 bg-border hidden sm:block" />
        {/* Forecast legend */}
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-500" />
          AI Forecast
        </span>
      </div>
    </motion.div>
  );
}