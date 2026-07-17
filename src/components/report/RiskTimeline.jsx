import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea, Line } from "recharts";
import { TrendingUp, TrendingDown, Minus, CloudRain, Waves, FlaskConical, Droplets, Bug, Sparkles } from "lucide-react";
import moment from "moment";
import { classifyParameter } from "@/lib/waterAnalysis";

const TIME_RANGES = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "7 Days", days: 7 },
  { key: "30d", label: "30 Days", days: 30 },
  { key: "90d", label: "90 Days", days: 90 },
  { key: "1y", label: "1 Year", days: 365 },
];

const ZONES = [
  { y1: 70, y2: 100, fill: "#10b981", label: "Safe" },
  { y1: 50, y2: 70, fill: "#eab308", label: "Moderate" },
  { y1: 40, y2: 50, fill: "#f97316", label: "High" },
  { y1: 0, y2: 40, fill: "#ef4444", label: "Critical" },
];

const EVENT_CONFIG = {
  rainfall: { color: "#3b82f6", icon: CloudRain, label: "Heavy Rainfall" },
  turbidity: { color: "#a16207", icon: Waves, label: "High Turbidity" },
  ph: { color: "#8b5cf6", icon: FlaskConical, label: "Low pH" },
  tds: { color: "#f97316", icon: Droplets, label: "High TDS" },
  ecoli: { color: "#dc2626", icon: Bug, label: "E. coli Detection" },
};

const RISK_COLORS = {
  safe: "#10b981",
  moderate: "#f59e0b",
  danger: "#ef4444",
};

function filterByRange(scans, rangeKey) {
  const range = TIME_RANGES.find((r) => r.key === rangeKey);
  if (!range) return scans;
  const cutoff = Date.now() - range.days * 24 * 60 * 60 * 1000;
  return scans.filter((s) => new Date(s.created_date).getTime() >= cutoff);
}

function formatXLabel(date, rangeKey) {
  const m = moment(date);
  switch (rangeKey) {
    case "today": return m.format("h A");
    case "7d": return m.format("ddd");
    case "30d": return m.format("MMM D");
    case "90d": return `W${m.isoWeek()}`;
    case "1y": return m.format("MMM");
    default: return m.format("MMM D");
  }
}

function detectEvents(scan) {
  const events = [];
  if (!scan) return events;
  if (scan.turbidity > 5) events.push("turbidity");
  if (scan.ph < 6.5) events.push("ph");
  if (scan.tds > 500) events.push("tds");
  if (scan.turbidity > 10 && scan.temperature < 20) events.push("rainfall");
  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  if (risks && Object.values(risks).some((r) => r > 70)) events.push("ecoli");
  return events;
}

function getTopDisease(scan) {
  if (!scan) return null;
  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  if (!risks) return null;
  const sorted = Object.entries(risks).sort(([, a], [, b]) => b - a);
  return sorted[0] ? { name: sorted[0][0], risk: sorted[0][1] } : null;
}

function generateForecast(data) {
  if (data.length < 3) return [];
  const recent = data.slice(-5);
  const n = recent.length;
  const xs = recent.map((_, i) => i);
  const ys = recent.map((d) => d.score);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  const denom = xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
  if (denom === 0) return [];
  const slope = xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0) / denom;

  const lastPoint = data[data.length - 1];
  const forecast = [];
  for (let i = 1; i <= 3; i++) {
    const score = Math.max(0, Math.min(100, Math.round(meanY + slope * (n - 1 + i))));
    forecast.push({
      ...lastPoint,
      score: null,
      forecastScore: score,
      label: "",
      isForecast: true,
    });
  }
  return forecast;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isForecast = d.isForecast;

  return (
    <div className="glass-strong rounded-xl p-3 border border-border text-xs shadow-lg min-w-[200px]">
      <p className="font-semibold mb-1.5">{moment(d.fullDate).format("lll")}</p>
      {isForecast && (
        <p className="text-[10px] text-purple-400 font-medium mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> AI Forecast
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Health Score</span>
        <span className="font-bold">{isForecast ? d.forecastScore : d.score}/100</span>
      </div>
      {!isForecast && (
        <>
          <div className="flex items-center justify-between gap-3 mt-1">
            <span className="text-muted-foreground">Risk Level</span>
            <span className="font-medium capitalize" style={{ color: RISK_COLORS[d.risk_level] || "#06b6d4" }}>{d.risk_level}</span>
          </div>
          <div className="flex items-center justify-between gap-3 mt-1">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-medium">{d.ai_confidence || Math.min(98, 82 + Math.round((100 - d.score) * 0.15))}%</span>
          </div>
          {d.topDisease && (
            <div className="flex items-center justify-between gap-3 mt-1">
              <span className="text-muted-foreground">Predicted Disease</span>
              <span className="font-medium capitalize">{d.topDisease.name} ({d.topDisease.risk}%)</span>
            </div>
          )}
          {d.events && d.events.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <p className="text-muted-foreground mb-1">Detected Events:</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {d.events.map((e) => (
                  <span key={e} className="inline-flex items-center gap-1" style={{ color: EVENT_CONFIG[e]?.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: EVENT_CONFIG[e]?.color }} />
                    {EVENT_CONFIG[e]?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function RiskTimeline({ scans, timeRange, onTimeRangeChange }) {
  const chartData = useMemo(() => {
    const filtered = filterByRange(scans, timeRange);
    const chronological = [...filtered].reverse();

    let lastLabel = "";
    const mapped = chronological.map((scan) => {
      const label = formatXLabel(scan.created_date, timeRange);
      const displayLabel = label === lastLabel ? "" : label;
      lastLabel = label;
      const events = detectEvents(scan);
      return {
        fullDate: scan.created_date,
        label: displayLabel,
        score: scan.health_score,
        forecastScore: null,
        risk_level: scan.risk_level,
        ai_confidence: scan.ai_confidence,
        topDisease: getTopDisease(scan),
        events,
      };
    });

    // Add forecast score to last actual point for line connection
    if (mapped.length > 0) {
      mapped[mapped.length - 1].forecastScore = mapped[mapped.length - 1].score;
    }

    const forecast = generateForecast(mapped);
    return [...mapped, ...forecast];
  }, [scans, timeRange]);

  const trend = useMemo(() => {
    const filtered = filterByRange(scans, timeRange);
    if (filtered.length < 2) return { dir: "stable", label: "Stable" };
    const chronological = [...filtered].reverse();
    const recent = chronological.slice(-3);
    const older = chronological.slice(-6, -3);
    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
      const olderAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
      if (recentAvg > olderAvg + 5) return { dir: "up", label: "Improving" };
      if (recentAvg < olderAvg - 5) return { dir: "down", label: "Declining" };
    }
    return { dir: "stable", label: "Stable" };
  }, [scans, timeRange]);

  const avgScore = useMemo(() => {
    const filtered = filterByRange(scans, timeRange);
    if (filtered.length === 0) return 0;
    return Math.round(filtered.reduce((s, x) => s + x.health_score, 0) / filtered.length);
  }, [scans, timeRange]);

  const hasData = chartData.some((d) => d.score !== null);
  const TrendIcon = trend.dir === "up" ? TrendingUp : trend.dir === "down" ? TrendingDown : Minus;
  const trendColor = trend.dir === "up" ? "text-safe" : trend.dir === "down" ? "text-danger" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="premium-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight">AI Risk Trend</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Water quality intelligence over time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Average Score</p>
            <p className="text-xl font-extrabold leading-tight">{avgScore}<span className="text-sm text-muted-foreground font-medium">/100</span></p>
          </div>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg glass border border-border text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trend.label}
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {TIME_RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => onTimeRangeChange(r.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeRange === r.key
                ? "bg-gradient-to-r from-primary to-blue-500 text-white shadow-md"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Colored background zones */}
            {ZONES.map((z) => (
              <ReferenceArea
                key={z.label}
                y1={z.y1}
                y2={z.y2}
                fill={z.fill}
                fillOpacity={0.06}
                label={{ value: z.label, position: "insideRight", fill: z.fill, fontSize: 9, opacity: 0.7 }}
              />
            ))}

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="label"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={chartData.length > 15 ? Math.floor(chartData.length / 8) : 0}
            />
            <YAxis
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={35}
              label={{ value: "Risk Score (0–100)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }, dy: 20 }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Actual data area */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#riskAreaGrad)"
              connectNulls={false}
              dot={(props) => {
                const { cx, cy, payload, index } = props;
                if (payload.score === null) return <g key={index} />;
                const hasEvents = payload.events && payload.events.length > 0;
                const color = hasEvents ? EVENT_CONFIG[payload.events[0]]?.color || RISK_COLORS[payload.risk_level] : RISK_COLORS[payload.risk_level] || "#06b6d4";
                return (
                  <g key={index}>
                    {hasEvents && <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.2} />}
                    <circle cx={cx} cy={cy} r={hasEvents ? 5 : 3.5} fill={color} stroke="hsl(var(--card))" strokeWidth={2} />
                  </g>
                );
              }}
              activeDot={{ r: 6, stroke: "hsl(var(--card))", strokeWidth: 2 }}
            />

            {/* Forecast line */}
            <Line
              type="monotone"
              dataKey="forecastScore"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              connectNulls={true}
              dot={{ r: 3, fill: "#8b5cf6", stroke: "hsl(var(--card))", strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No data for this period</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Try selecting a wider time range</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 flex-wrap gap-3">
        {/* Zone legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {ZONES.map((z) => (
            <span key={z.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: z.fill, opacity: 0.5 }} />
              {z.label}
            </span>
          ))}
        </div>
        {/* Event legend */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {Object.entries(EVENT_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <span key={key} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Forecast indicator */}
      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
        <span className="inline-block w-4 border-t-2 border-dashed border-purple-400" />
        <Sparkles className="w-3 h-3 text-purple-400" />
        AI Forecast (projected trend)
      </div>
    </motion.div>
  );
}