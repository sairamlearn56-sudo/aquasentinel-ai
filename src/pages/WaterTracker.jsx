import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Droplets, Search, TrendingUp, Activity, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import moment from "moment";

export default function WaterTracker() {
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const scanList = await base44.entities.Scan.list("-created_date", 200);
        setScans(scanList || []);
      } catch (e) {} finally { setLoading(false); }
    }
    loadData();
  }, []);

  const sampleNames = useMemo(() => {
    const names = new Set();
    scans.forEach((s) => { if (s.sample_name) names.add(s.sample_name); });
    return Array.from(names);
  }, [scans]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return sampleNames.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return sampleNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery, sampleNames]);

  const trackedScans = useMemo(() => {
    if (!selectedName) return [];
    return scans.filter((s) => s.sample_name === selectedName);
  }, [scans, selectedName]);

  const chartData = [...trackedScans].reverse().map((scan) => ({
    name: moment(scan.created_date).format("M/D"),
    score: scan.health_score,
  }));

  const latestScan = trackedScans[0];
  const avgScore = trackedScans.length > 0
    ? Math.round(trackedScans.reduce((s, scan) => s + scan.health_score, 0) / trackedScans.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Water Tracker</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Search by sample name to track a specific water source over time</p>
          </div>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSelectedName(null); }}
            placeholder="Type the sample name you gave while scanning..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-border text-sm focus:outline-none focus:border-cyan-500/40"
          />
        </div>
        {suggestions.length > 0 && !selectedName && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => { setSelectedName(name); setSearchQuery(name); }}
                className="px-3 py-1.5 rounded-xl glass border border-border text-xs font-medium hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {scans.length === 0 ? (
        <EmptyState
          title="No scans yet"
          description="Perform a water scan to start tracking specific water sources over time."
          illustration="history"
        />
      ) : selectedName && trackedScans.length > 0 ? (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={Activity} label="Latest Score" value={`${latestScan.health_score}/100`} color="text-cyan-400" />
            <StatCard icon={TrendingUp} label="Average" value={`${avgScore}/100`} color="text-purple-400" />
            <StatCard icon={Calendar} label="Total Scans" value={trackedScans.length} color="text-emerald-400" />
            <StatCard icon={Droplets} label="Status" value={t(latestScan.risk_level)} color="text-amber-400" />
          </div>

          {/* Graph */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="premium-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold">{selectedName}</h2>
                  <p className="text-xs text-muted-foreground">Health score trend over time</p>
                </div>
              </div>
              <RiskBadge level={latestScan.risk_level} label={t(latestScan.risk_level)} size="sm" />
            </div>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="trackerLineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(189 94% 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(189 94% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px", backdropFilter: "blur(20px)" }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(189 94% 50%)" strokeWidth={2.5} dot={{ fill: "hsl(189 94% 50%)", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }} activeDot={{ r: 6, fill: "hsl(217 91% 60%)" }} fill="url(#trackerLineGrad)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground text-center px-4">
                Only one scan recorded for this sample. Perform more scans with the same name to see the trend.
              </div>
            )}
          </motion.div>

          {/* Scan history for this sample */}
          <div>
            <h2 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
              All Scans for "{selectedName}"
            </h2>
            <div className="space-y-2">
              {trackedScans.map((scan, idx) => (
                <motion.div
                  key={scan.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.4) }}
                  className="glass rounded-2xl p-4 border border-border flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium">{moment(scan.created_date).format("lll")}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>pH: <span className="font-semibold text-foreground">{scan.ph}</span></span>
                      <span>TDS: <span className="font-semibold text-foreground">{scan.tds}</span></span>
                      <span>Score: <span className="font-semibold text-foreground">{scan.health_score}/100</span></span>
                    </div>
                  </div>
                  <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : selectedName ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No scans found with that sample name.</p>
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Search for a sample name above to view its tracking graph.</p>
          {sampleNames.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">{sampleNames.length} sample{sampleNames.length !== 1 ? "s" : ""} available</p>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="premium-card p-4 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
      <p className="text-lg font-heading font-bold capitalize">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}