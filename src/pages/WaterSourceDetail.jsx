import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowLeft, Droplets, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import RiskBadge from "@/components/RiskBadge";
import ImprovementDashboard from "@/components/tracker/ImprovementDashboard";
import EmptyState from "@/components/EmptyState";
import moment from "moment";

export default function WaterSourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [source, setSource] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sourceData, sourceScans] = await Promise.all([
          base44.entities.WaterSource.get(id),
          base44.entities.Scan.filter({ water_source_id: id }, "-created_date", 200),
        ]);
        setSource(sourceData);
        setScans(sourceScans || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!source) {
    return (
      <EmptyState
        title="Water source not found"
        description="This water source may have been deleted."
        illustration="history"
      />
    );
  }

  // Chronological order (oldest first)
  const chronological = [...scans].reverse();
  const firstScan = chronological[0];
  const latestScan = scans[0]; // newest first (scans sorted -created_date)
  const chartData = chronological.map((scan) => ({
    name: moment(scan.created_date).format("M/D"),
    score: scan.health_score,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => navigate("/tracker")}
          className="p-2 rounded-xl glass hover:bg-muted/50 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Droplets className="w-6 h-6 text-primary flex-shrink-0" />
            <span className="truncate">{source.name}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {source.label} · {scans.length} scans recorded
          </p>
        </div>
      </motion.div>

      {scans.length === 0 ? (
        <EmptyState
          title="No scans yet"
          description="Perform a scan with this water source selected to start tracking its progress."
          illustration="history"
        />
      ) : (
        <>
          {/* Trend Graph for this source */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Water Quality Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="detailLineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(194 100% 50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(194 100% 50%)" stopOpacity={0} />
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
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(194 100% 50%)"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(194 100% 50%)", r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#detailLineGrad)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Improvement Dashboard (Before vs After) */}
          {firstScan && latestScan && firstScan.id !== latestScan.id && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-4">Improvement Dashboard</h2>
              <ImprovementDashboard firstScan={firstScan} latestScan={latestScan} />
            </motion.div>
          )}

          {/* All Recorded Readings */}
          <div>
            <h2 className="text-lg font-bold mb-4">All Recorded Readings</h2>
            <div className="space-y-3">
              {chronological.map((scan, idx) => (
                <motion.div
                  key={scan.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.5) }}
                  className="glass rounded-2xl p-4 border border-border"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-medium">
                        {moment(scan.created_date).format("MMM D, YYYY")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {moment(scan.created_date).format("h:mm A")}
                      </p>
                    </div>
                    <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
                    <span className="text-muted-foreground">
                      TDS: <span className="font-semibold text-foreground">{scan.tds} ppm</span>
                    </span>
                    <span className="text-muted-foreground">
                      Turbidity:{" "}
                      <span className="font-semibold text-foreground">{scan.turbidity} NTU</span>
                    </span>
                    <span className="text-muted-foreground">
                      Temp:{" "}
                      <span className="font-semibold text-foreground">{scan.temperature}°C</span>
                    </span>
                    <span className="text-muted-foreground">
                      Score: <span className="font-semibold text-foreground">{scan.health_score}/100</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {scan.recommendations?.[0] || "No recommendation available"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}