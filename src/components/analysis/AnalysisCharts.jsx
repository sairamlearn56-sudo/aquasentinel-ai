import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { LineChart, BarChart3, Table2, Activity } from "lucide-react";
import moment from "moment";
import { filterByTimeRange, formatSensorValue, validateSensor } from "@/lib/analysisUtils";
import RiskBadge from "@/components/RiskBadge";

const TIME_RANGES = [
  { key: "24h", label: "24 Hours" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

const VIEWS = [
  { key: "area", label: "Trend", icon: LineChart },
  { key: "bar", label: "Distribution", icon: BarChart3 },
  { key: "table", label: "Readings", icon: Table2 },
];

const RISK_COLORS = { safe: "#10b981", moderate: "#f59e0b", danger: "#ef4444" };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-border shadow-lg">
      <p className="text-xs font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AnalysisCharts({ scans }) {
  const [timeRange, setTimeRange] = useState("30d");
  const [view, setView] = useState("area");

  const filtered = useMemo(() => filterByTimeRange(scans, timeRange), [scans, timeRange]);

  const areaData = useMemo(() => {
    return [...filtered].reverse().map((s) => ({
      date: moment(s.created_date).format(timeRange === "24h" ? "HH:mm" : "MMM D"),
      score: s.health_score,
      risk_level: s.risk_level,
    }));
  }, [filtered, timeRange]);

  const barData = useMemo(() => {
    const counts = { Safe: 0, Moderate: 0, Unsafe: 0, Critical: 0 };
    filtered.forEach((s) => {
      if (s.risk_level === "safe") counts.Safe++;
      else if (s.risk_level === "moderate") counts.Moderate++;
      else if (s.risk_level === "danger" && s.health_score >= 30) counts.Unsafe++;
      else if (s.risk_level === "danger") counts.Critical++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const tableData = useMemo(() => filtered.slice(0, 10), [filtered]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="premium-card p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading">Historical Data</h2>
            <p className="text-[13px] text-muted-foreground">Visualized from {filtered.length} stored readings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
            {VIEWS.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    view === v.key ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
            {TIME_RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setTimeRange(r.key)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timeRange === r.key ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No data available for this time period.</p>
          <p className="text-[13px] text-muted-foreground/70 mt-1">Select a different time range or perform new scans.</p>
        </div>
      ) : view === "area" ? (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" name="Health Score" stroke="#06b6d4" strokeWidth={2} fill="url(#scoreGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : view === "bar" ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Reports" radius={[6, 6, 0, 0]}>
              {barData.map((entry, idx) => (
                <Cell key={idx} fill={RISK_COLORS[entry.name === "Safe" ? "safe" : entry.name === "Moderate" ? "moderate" : "danger"]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">pH</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">TDS</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Temp</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Turbidity</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Score</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((s) => {
                const phVal = validateSensor("ph", s.ph, s.sensor_status);
                const tdsVal = validateSensor("tds", s.tds, s.sensor_status);
                const tempVal = validateSensor("temperature", s.temperature, s.sensor_status);
                const turbVal = validateSensor("turbidity", s.turbidity, s.sensor_status);
                return (
                  <tr key={s.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 text-[13px]">{moment(s.created_date).format("MMM D, HH:mm")}</td>
                    <td className="py-2.5 px-3 text-center">{phVal.valid ? formatSensorValue("ph", s.ph) : <span className="text-[11px] text-danger">{phVal.label}</span>}</td>
                    <td className="py-2.5 px-3 text-center">{tdsVal.valid ? formatSensorValue("tds", s.tds) : <span className="text-[11px] text-danger">{tdsVal.label}</span>}</td>
                    <td className="py-2.5 px-3 text-center">{tempVal.valid ? formatSensorValue("temperature", s.temperature) : <span className="text-[11px] text-danger">{tempVal.label}</span>}</td>
                    <td className="py-2.5 px-3 text-center">{turbVal.valid ? formatSensorValue("turbidity", s.turbidity) : <span className="text-[11px] text-danger">{turbVal.label}</span>}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{s.health_score}</td>
                    <td className="py-2.5 px-3 text-center"><RiskBadge level={s.risk_level} size="sm" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}