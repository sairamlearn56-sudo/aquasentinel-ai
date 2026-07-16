import React, { useState, useEffect, useMemo } from "react";
import { BarChart3, Download, TrendingUp, Droplets, Cloud, Activity, Target, MapPin } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import { useTheme } from "@/lib/ThemeContext";

export default function Analytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const CHART_TOOLTIP = {
    background: isDark ? "hsl(221 40% 13%)" : "#ffffff",
    border: `1px solid ${isDark ? "hsl(219 37% 21%)" : "hsl(214 32% 91%)"}`,
    borderRadius: 8,
    fontSize: 12,
    color: isDark ? "hsl(210 40% 96%)" : "hsl(222 47% 11%)",
  };
  const AXIS_TICK = { fontSize: 10, fill: isDark ? "hsl(215 20% 65%)" : "hsl(215 16% 47%)" };
  const GRID_STROKE = isDark ? "hsl(219 37% 21%)" : "hsl(214 32% 91%)";

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const scanData = await base44.entities.Scan.list("-created_date", 200);
      setScans(scanData || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filteredScans = useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    return scans.filter((s) => new Date(s.created_date) >= cutoff);
  }, [scans, range]);

  const trendData = useMemo(() => {
    const byDate = {};
    filteredScans.forEach((s) => {
      const d = new Date(s.created_date).toLocaleDateString();
      if (!byDate[d]) byDate[d] = { date: d, ph: [], tds: [], turbidity: [], temperature: [], score: [] };
      byDate[d].ph.push(s.ph || 0);
      byDate[d].tds.push(s.tds || 0);
      byDate[d].turbidity.push(s.turbidity || 0);
      byDate[d].temperature.push(s.temperature || 0);
      byDate[d].score.push(s.health_score || 0);
    });
    return Object.values(byDate).map((d) => ({
      date: d.date,
      ph: (d.ph.reduce((a, b) => a + b, 0) / d.ph.length).toFixed(1),
      tds: Math.round(d.tds.reduce((a, b) => a + b, 0) / d.tds.length),
      turbidity: (d.turbidity.reduce((a, b) => a + b, 0) / d.turbidity.length).toFixed(1),
      temperature: (d.temperature.reduce((a, b) => a + b, 0) / d.temperature.length).toFixed(1),
      score: Math.round(d.score.reduce((a, b) => a + b, 0) / d.score.length),
    }));
  }, [filteredScans]);

  const stats = useMemo(() => {
    if (filteredScans.length === 0) return { avgScore: 0, avgTDS: 0, avgTurbidity: 0, avgPh: 0, avgTemp: 0, safeCount: 0, totalScans: 0 };
    const avg = (arr, fn = (x) => x) => arr.reduce((a, b) => a + fn(b), 0) / arr.length;
    return {
      avgScore: Math.round(avg(filteredScans, (s) => s.health_score || 0)),
      avgTDS: Math.round(avg(filteredScans, (s) => s.tds || 0)),
      avgTurbidity: (avg(filteredScans, (s) => s.turbidity || 0)).toFixed(1),
      avgPh: (avg(filteredScans, (s) => s.ph || 0)).toFixed(1),
      avgTemp: (avg(filteredScans, (s) => s.temperature || 0)).toFixed(1),
      safeCount: filteredScans.filter((s) => s.risk_level === "safe").length,
      totalScans: filteredScans.length,
    };
  }, [filteredScans]);

  const riskDistribution = useMemo(() => {
    const dist = { safe: 0, moderate: 0, danger: 0 };
    filteredScans.forEach((s) => { if (dist[s.risk_level] !== undefined) dist[s.risk_level]++; });
    return [
      { name: "Safe", value: dist.safe, fill: "hsl(158 64% 52%)" },
      { name: "Moderate", value: dist.moderate, fill: "hsl(43 96% 56%)" },
      { name: "Danger", value: dist.danger, fill: "hsl(0 91% 71%)" },
    ].filter((d) => d.value > 0);
  }, [filteredScans]);

  const topRiskLocations = useMemo(() => {
    const byVillage = {};
    filteredScans.forEach((s) => {
      const v = s.location_name || s.water_source_name || "Unknown";
      if (!byVillage[v]) byVillage[v] = { village: v, count: 0, avgScore: 0, scores: [] };
      byVillage[v].count++;
      byVillage[v].scores.push(s.health_score || 0);
    });
    return Object.values(byVillage).map((v) => ({ ...v, avgScore: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) }))
      .sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);
  }, [filteredScans]);

  const exportCSV = () => {
    const headers = ["Date", "pH", "TDS", "Turbidity", "Temperature", "Health Score", "Risk Level"];
    const rows = filteredScans.map((s) => [new Date(s.created_date).toLocaleString(), s.ph, s.tds, s.turbidity, s.temperature, s.health_score, s.risk_level]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analytics_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8"><LoadingState text="Loading analytics..." /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Comprehensive water quality insights and AI prediction metrics"
        icon={BarChart3}
        actions={
          <>
            <div className="flex gap-1 bg-muted/30 rounded-lg p-0.5">
              {["7d", "30d", "90d"].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}</button>
              ))}
            </div>
            <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Water Safety Score" value={stats.avgScore} suffix="/100" icon={Target} color="text-primary" />
        <KPICard label="Avg TDS" value={stats.avgTDS} suffix=" ppm" icon={Droplets} color="text-blue" />
        <KPICard label="Avg Turbidity" value={stats.avgTurbidity} suffix=" NTU" icon={Cloud} color="text-warning" />
        <KPICard label="Avg pH" value={stats.avgPh} icon={Activity} color="text-safe" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Water Quality Score Trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(173 66% 50%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(173 66% 50%)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} domain={[0, 100]} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Area type="monotone" dataKey="score" stroke="hsl(173 66% 50%)" strokeWidth={2} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="TDS Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Line type="monotone" dataKey="tds" stroke="hsl(199 92% 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Turbidity Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Line type="monotone" dataKey="turbidity" stroke="hsl(43 96% 56%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="pH & Temperature Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="ph" stroke="hsl(158 64% 52%)" strokeWidth={2} dot={false} name="pH" />
              <Line type="monotone" dataKey="temperature" stroke="hsl(24 82% 55%)" strokeWidth={2} dot={false} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <ChartCard title="Risk Distribution">
          {riskDistribution.length === 0 ? <p className="text-sm text-muted-foreground py-12 text-center">No data</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={(e) => `${e.name}: ${e.value}`}>
                  {riskDistribution.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Scan Risk Levels" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { name: "Safe", value: stats.safeCount, fill: "hsl(158 64% 52%)" },
              { name: "Moderate", value: filteredScans.filter((s) => s.risk_level === "moderate").length, fill: "hsl(43 96% 56%)" },
              { name: "Danger", value: filteredScans.filter((s) => s.risk_level === "danger").length, fill: "hsl(0 91% 71%)" },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="name" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top High-Risk Locations">
          {topRiskLocations.length === 0 ? <p className="text-sm text-muted-foreground py-12 text-center">No data</p> : (
            <div className="space-y-2 pt-2">
              {topRiskLocations.map((loc, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <MapPin className="w-4 h-4 text-danger flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{loc.village}</p>
                    <p className="text-[10px] text-muted-foreground">{loc.count} scans</p>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${loc.avgScore < 50 ? "text-danger" : loc.avgScore < 70 ? "text-warning" : "text-safe"}`}>{loc.avgScore}</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function KPICard({ label, value, suffix, icon: Icon, color }) {
  return (
    <div className="premium-card p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className={`text-2xl font-heading font-bold tabular-nums ${color}`}>{value}<span className="text-sm text-muted-foreground font-normal">{suffix}</span></p>
    </div>
  );
}

function ChartCard({ title, children, className }) {
  return (
    <div className={`premium-card p-5 ${className || ""}`}>
      <h3 className="text-sm font-heading font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}