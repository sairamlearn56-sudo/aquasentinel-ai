import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import moment from "moment";

const RISK_COLORS = {
  safe: "#10b981",
  moderate: "#f59e0b",
  danger: "#ef4444",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl p-3 border border-border text-xs shadow-lg">
      <p className="font-semibold mb-1">{data.label}</p>
      <p className="text-muted-foreground">{data.dateStr}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="w-2 h-2 rounded-full" style={{ background: RISK_COLORS[data.risk_level] || "#06b6d4" }} />
        <span className="font-bold text-base">{data.score}/100</span>
        <span className="text-muted-foreground capitalize">{data.risk_level}</span>
      </div>
      {data.sample_name && <p className="text-muted-foreground mt-1 truncate max-w-[180px]">{data.sample_name}</p>}
    </div>
  );
}

export default function RiskTimeline({ scans }) {
  const { chartData, trend, avgScore, safeCount } = useMemo(() => {
    const chronological = [...scans].reverse().slice(-30);
    const chartData = chronological.map((s) => ({
      label: moment(s.created_date).format("M/D"),
      dateStr: moment(s.created_date).format("lll"),
      score: s.health_score,
      risk_level: s.risk_level,
      sample_name: s.sample_name,
    }));

    const avgScore = scans.length > 0 ? Math.round(scans.reduce((sum, s) => sum + s.health_score, 0) / scans.length) : 0;
    const safeCount = scans.filter(s => s.risk_level === "safe").length;

    let trend = "stable";
    if (chronological.length >= 2) {
      const recent = chronological.slice(-3);
      const older = chronological.slice(-6, -3);
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((s, x) => s + x.health_score, 0) / recent.length;
        const olderAvg = older.reduce((s, x) => s + x.health_score, 0) / older.length;
        if (recentAvg > olderAvg + 5) trend = "improving";
        else if (recentAvg < olderAvg - 5) trend = "declining";
      }
    }

    return { chartData, trend, avgScore, safeCount };
  }, [scans]);

  if (chartData.length < 2) return null;

  const trendConfig = {
    improving: { icon: TrendingUp, color: "text-safe", label: "Improving" },
    declining: { icon: TrendingDown, color: "text-danger", label: "Declining" },
    stable: { icon: Minus, color: "text-muted-foreground", label: "Stable" },
  };
  const tc = trendConfig[trend];
  const TrendIcon = tc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="premium-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-lg">AI Risk Timeline</h2>
            <p className="text-xs text-muted-foreground">Water quality trend over {chartData.length} scans</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Average Score</p>
            <p className="text-lg font-heading font-bold">{avgScore}/100</p>
          </div>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg glass border border-border text-xs ${tc.color}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {tc.label}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fill="url(#timelineGrad)"
            dot={(props) => {
              const { cx, cy, payload, index } = props;
              return <Dot key={index} cx={cx} cy={cy} r={4} fill={RISK_COLORS[payload.risk_level] || "#06b6d4"} stroke="hsl(var(--card))" strokeWidth={2} />;
            }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs">
        {Object.entries(RISK_COLORS).map(([key, color]) => (
          <span key={key} className="inline-flex items-center gap-1.5 text-muted-foreground capitalize">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {key}
          </span>
        ))}
      </div>
    </motion.div>
  );
}