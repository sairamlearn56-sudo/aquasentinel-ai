import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { TrendingUp, Calendar, Clock, Radio } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import moment from "moment";

export default function History() {
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("daily");

  useEffect(() => {
    async function loadData() {
      try {
        const results = await base44.entities.Scan.list("-created_date", 50);
        setScans(results || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = useMemo(() => {
    if (scans.length === 0) return [];
    const grouped = {};
    scans.forEach((s) => {
      let key;
      if (tab === "daily") key = moment(s.created_date).format("MMM D");
      else if (tab === "weekly") key = moment(s.created_date).format("[W]w");
      else key = moment(s.created_date).format("MMM");
      
      if (!grouped[key]) grouped[key] = { label: key, scores: [], count: 0 };
      grouped[key].scores.push(s.health_score);
      grouped[key].count++;
    });
    return Object.values(grouped).map((g) => ({
      label: g.label,
      score: Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length),
    })).reverse();
  }, [scans, tab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <EmptyState
        title={t("noHistory")}
        description={t("noHistoryDesc")}
        illustration="history"
        action={
          <Link to="/monitor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            <Radio className="w-5 h-5" />
            {t("startMonitoring")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          {t("historyTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{scans.length} scans recorded</p>
      </motion.div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">{t("trendGraph")}</h2>
          <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
            {["daily", "weekly", "monthly"].map((tt) => (
              <button
                key={tt}
                onClick={() => setTab(tt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === tt ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tt)}
              </button>
            ))}
          </div>
        </div>
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(185, 80%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(185, 80%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={30} />
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
                stroke="hsl(185, 80%, 45%)"
                strokeWidth={2.5}
                dot={{ fill: "hsl(185, 80%, 45%)", r: 4 }}
                activeDot={{ r: 6 }}
                fill="url(#lineGrad)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {t("timeline")}
        </h2>
        <div className="space-y-3">
          {scans.slice(0, 20).map((scan, idx) => (
            <motion.div
              key={scan.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-aqua/10 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-primary">{scan.health_score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    {moment(scan.created_date).format("MMM D, h:mm A")}
                  </span>
                  <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  pH {scan.ph} · TDS {scan.tds} · {scan.temperature}°C · {scan.turbidity} NTU
                </p>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {t(scan.family_member)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}