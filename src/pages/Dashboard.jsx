import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Activity, Wifi, Clock, AlertTriangle, TrendingUp, Droplets, ShieldCheck, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import { computeRiskLevel } from "@/lib/waterAnalysis";
import moment from "moment";

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [latestScan, setLatestScan] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await base44.entities.Scan.list("-created_date", 10);
        setScans(results || []);
        if (results && results.length > 0) setLatestScan(results[0]);
      } catch (e) {
        // empty state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const alerts = scans.filter((s) => s.risk_level !== "safe").slice(0, 3);
  const trendData = scans.slice(0, 7).reverse();

  const timeAgo = (date) => {
    const m = moment(date);
    const diff = moment().diff(m, "minutes");
    if (diff < 1) return t("justNow");
    if (diff < 60) return `${diff} ${t("minutesAgo")}`;
    const hours = moment().diff(m, "hours");
    if (hours < 24) return `${hours} ${t("hoursAgo")}`;
    return `${moment().diff(m, "days")} ${t("daysAgo")}`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-aqua/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-aqua flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("appName")}</h1>
            </div>
            <p className="text-base text-muted-foreground mb-6 max-w-md">{t("tagline")}</p>
            
            <button
              onClick={() => navigate("/monitor")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-aqua text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
            >
              <Radio className="w-5 h-5" />
              {t("startMonitoring")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Water drop illustration */}
          <div className="hidden sm:flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/20 to-primary/10 animate-pulse-soft" />
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-float">
                <defs>
                  <linearGradient id="heroDrop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(185, 80%, 65%)" />
                    <stop offset="100%" stopColor="hsl(185, 80%, 40%)" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 12 C50 12, 22 42, 22 64 C22 80, 35 90, 50 90 C65 90, 78 80, 78 64 C78 42, 50 12, 50 12 Z"
                  fill="url(#heroDrop)"
                  opacity="0.85"
                />
                <ellipse cx="40" cy="55" rx="7" ry="12" fill="white" opacity="0.35" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : !latestScan ? (
        <EmptyState
          title={t("noScansYet")}
          description={t("noScansYetDesc")}
          action={
            <button
              onClick={() => navigate("/monitor")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <Radio className="w-5 h-5" />
              {t("startMonitoring")}
            </button>
          }
        />
      ) : (
        <>
          {/* Health Status + Quick Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Water Health Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass rounded-3xl p-6 flex flex-col items-center justify-center"
            >
              <p className="text-sm text-muted-foreground mb-4 text-center">{t("waterHealthScore")}</p>
              <HealthScoreRing score={latestScan.health_score} riskLevel={latestScan.risk_level} size={160} />
              <div className="mt-4">
                <RiskBadge level={latestScan.risk_level} label={t(latestScan.risk_level)} size="lg" />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2 grid grid-cols-2 gap-4"
            >
              <StatWidget icon={Wifi} label={t("sensorStatus")} value={t("connected")} color="text-safe" bg="bg-safe/10" />
              <StatWidget icon={Clock} label={t("lastScan")} value={timeAgo(latestScan.created_date)} color="text-primary" bg="bg-primary/10" />
              <StatWidget icon={Activity} label={t("aiRisk")} value={t(latestScan.risk_level)} color={latestScan.risk_level === "safe" ? "text-safe" : latestScan.risk_level === "moderate" ? "text-warning" : "text-danger"} bg={latestScan.risk_level === "safe" ? "bg-safe/10" : latestScan.risk_level === "moderate" ? "bg-warning/10" : "bg-danger/10"} />
              <StatWidget icon={ShieldCheck} label={t("connectionStatus")} value="ESP32" color="text-teal" bg="bg-teal/10" />
            </motion.div>
          </div>

          {/* Recent Scan Summary + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent scan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{t("recentScan")}</h2>
                <Link to="/analysis" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  {t("viewDetails")} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ScanMetric label={t("pH")} value={latestScan.ph} />
                <ScanMetric label={t("tds")} value={`${latestScan.tds} ppm`} />
                <ScanMetric label={t("temperature")} value={`${latestScan.temperature}°C`} />
                <ScanMetric label={t("turbidity")} value={`${latestScan.turbidity} NTU`} />
              </div>
            </motion.div>

            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass rounded-3xl p-6"
            >
              <h2 className="font-semibold text-lg mb-4">{t("recentAlerts")}</h2>
              {alerts.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-safe">
                  <ShieldCheck className="w-5 h-5" />
                  {t("noAlerts")}
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${alert.risk_level === "moderate" ? "text-warning" : "text-danger"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{t(alert.risk_level)} risk detected</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(alert.created_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Trend Graph */}
          {trendData.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {t("trendGraph")}
                </h2>
                <Link to="/history" className="text-xs text-primary font-medium hover:underline">
                  {t("history")}
                </Link>
              </div>
              <TrendChart data={trendData} />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function StatWidget({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}

function ScanMetric({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-muted/30">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function TrendChart({ data }) {
  const maxScore = 100;
  const width = 100;
  const height = 40;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d.health_score / maxScore) * height,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="relative h-24">
      <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(185, 80%, 45%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(185, 80%, 45%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L 100 40 L 0 40 Z`} fill="url(#trendFill)" />
        <path d={path} fill="none" stroke="hsl(185, 80%, 45%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="hsl(185, 80%, 45%)" />
        ))}
      </svg>
    </div>
  );
}