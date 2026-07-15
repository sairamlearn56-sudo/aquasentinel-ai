import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Droplets, Plus, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import WaterSourceCard from "@/components/tracker/WaterSourceCard";
import AddWaterSourceDialog from "@/components/tracker/AddWaterSourceDialog";
import EmptyState from "@/components/EmptyState";

export default function WaterTracker() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [sourceList, scanList] = await Promise.all([
          base44.entities.WaterSource.list("-created_date", 100),
          base44.entities.Scan.list("-created_date", 100),
        ]);
        setSources(sourceList || []);
        setScans(scanList || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Overall trend chart data (newest last for chart)
  const chartData = [...scans].reverse().map((scan, idx) => ({
    name: `S${idx + 1}`,
    score: scan.health_score,
  }));

  const getScansForSource = (sourceId) => scans.filter((s) => s.water_source_id === sourceId);

  const handleSaved = (newSource) => {
    setSources((prev) => [newSource, ...prev]);
  };

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Water Tracker</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track the improvement of water sources over time
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Water Source
        </button>
      </motion.div>

      {/* Overall Trend Graph */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="premium-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="font-heading font-semibold">{t("trendGraph")}</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="trackerLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(189 94% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(189 94% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                  backdropFilter: "blur(20px)",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(189 94% 50%)"
                strokeWidth={2.5}
                dot={{ fill: "hsl(189 94% 50%)", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                activeDot={{ r: 6, fill: "hsl(217 91% 60%)" }}
                fill="url(#trackerLineGrad)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Water Source Cards */}
      {sources.length === 0 ? (
        <EmptyState
          title="No water sources yet"
          description="Add a water source to start tracking its improvement over time."
          illustration="history"
          action={
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Water Source
            </button>
          }
        />
      ) : (
        <div>
          <h2 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Your Water Sources ({sources.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => {
              const sourceScans = getScansForSource(source.id);
              const latestScan = sourceScans[0];
              return (
                <WaterSourceCard
                  key={source.id}
                  source={source}
                  latestScan={latestScan}
                  totalScans={sourceScans.length}
                  onProgress={() => navigate(`/tracker/${source.id}`)}
                />
              );
            })}
          </div>
        </div>
      )}

      <AddWaterSourceDialog open={showAdd} onClose={() => setShowAdd(false)} onSaved={handleSaved} />
    </div>
  );
}