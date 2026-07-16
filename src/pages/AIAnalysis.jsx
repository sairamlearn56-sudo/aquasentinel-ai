import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileSearch, Radio, ArrowUpDown, FileText, ArrowLeft, Sparkles, Activity } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import EmptyState from "@/components/EmptyState";
import ReportView from "@/components/report/ReportView";
import AnalysisLoading from "@/components/analysis/AnalysisLoading";
import RiskBadge from "@/components/RiskBadge";
import SensorCard from "@/components/SensorCard";
import HealthScoreRing from "@/components/HealthScoreRing";
import moment from "moment";

const FILTERS = [
  { key: "all", label: "All", activeClass: "bg-primary text-primary-foreground" },
  { key: "safe", label: "Safe", activeClass: "bg-safe text-white" },
  { key: "moderate", label: "Moderate", activeClass: "bg-warning text-black" },
  { key: "danger", label: "Unsafe", activeClass: "bg-danger text-white" },
];

export default function AIAnalysis() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [analyzeTriggered, setAnalyzeTriggered] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await base44.entities.Scan.list("-created_date", 200);
        setScans(results || []);
      } catch (e) {} finally { setLoading(false); }
    }
    loadData();
  }, []);

  useEffect(() => {
    setAnalyzeTriggered(false);
    setAnalyzing(false);
    if (scanId) {
      setScanLoading(true);
      async function loadScan() {
        try {
          const scan = await base44.entities.Scan.get(scanId);
          setSelectedScan(scan);
        } catch (e) { setSelectedScan(null); } finally { setScanLoading(false); }
      }
      loadScan();
    } else {
      setSelectedScan(null);
    }
  }, [scanId]);

  const filteredScans = useMemo(() => {
    let result = scans;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) =>
        (s.sample_name || "").toLowerCase().includes(q) ||
        (s.water_source_name || "").toLowerCase().includes(q) ||
        (s.location_name || "").toLowerCase().includes(q)
      );
    }
    if (filter !== "all") {
      result = result.filter((s) => s.risk_level === filter);
    }
    if (sortBy === "oldest") {
      result = [...result].reverse();
    }
    return result;
  }, [scans, searchQuery, filter, sortBy]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzeTriggered(true);
    }, 2800);
  };

  // ===== Loading state (initial) =====
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // ===== Report Viewer Mode (scanId in URL) =====
  if (scanId) {
    if (scanLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      );
    }
    if (!selectedScan) {
      return (
        <EmptyState
          title="Report Not Found"
          description="This scan report may have been deleted."
          illustration="history"
          action={
            <button onClick={() => navigate("/analysis")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
              <FileSearch className="w-5 h-5" /> Back to Reports
            </button>
          }
        />
      );
    }

    // ===== AI Analysis Loading Animation =====
    if (analyzing) {
      return <AnalysisLoading />;
    }

    // ===== Full Report (after AI Analysis button clicked) =====
    if (analyzeTriggered) {
      return (
        <ReportView
          scan={selectedScan}
          onBack={() => navigate("/analysis")}
          onDeleted={() => navigate("/analysis")}
        />
      );
    }

    // ===== Scan Preview with AI Analysis Button =====
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/analysis")} className="p-2 rounded-xl glass hover:bg-muted/50 transition-colors flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-heading font-bold">{selectedScan.sample_name || "Untitled Scan"}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{moment(selectedScan.created_date).format("lll")}</p>
            </div>
          </div>
        </motion.div>

        {/* Scan Overview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="premium-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <HealthScoreRing score={selectedScan.health_score} riskLevel={selectedScan.risk_level} size={100} stroke={8} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <RiskBadge level={selectedScan.risk_level} label={t(selectedScan.risk_level)} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                Health Score: <span className="font-bold text-foreground">{selectedScan.health_score}/100</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tap "AI Analysis" below to generate a detailed diagnostic report
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sensor Readings Preview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <h2 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-4 px-1">Sensor Readings</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SensorCard type="ph" value={selectedScan.ph} label={t("pH")} delay={0} explanation="" />
            <SensorCard type="tds" value={selectedScan.tds} label={t("tds")} delay={0} explanation="" />
            <SensorCard type="temperature" value={selectedScan.temperature} label={t("temperature")} delay={0} explanation="" />
            <SensorCard type="turbidity" value={selectedScan.turbidity} label={t("turbidity")} delay={0} explanation="" />
          </div>
        </motion.div>

        {/* AI Analysis Button */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="flex justify-center pt-2">
          <button
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-purple text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5" />
            AI Analysis
          </button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Activity className="w-3 h-3" />
          AI will analyze disease risks, water quality, and generate recommendations
        </motion.p>
      </div>
    );
  }

  // ===== Empty state (no scans at all) =====
  if (scans.length === 0) {
    return (
      <EmptyState
        title={t("noScansYet")}
        description={t("noScansYetDesc")}
        action={
          <button onClick={() => navigate("/monitor")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all">
            <Radio className="w-5 h-5" /> {t("startMonitoring")}
          </button>
        }
      />
    );
  }

  // ===== List View with Search + Filters =====
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center">
            <FileSearch className="w-6 h-6 text-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Water Diagnostic Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{scans.length} report{scans.length !== 1 ? "s" : ""} on record</p>
          </div>
        </div>
      </motion.div>

      {/* Search + Sort */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sample name, source, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:border-purple-500/40"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors whitespace-nowrap"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortBy === "newest" ? "Newest" : "Oldest"}
        </button>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key ? f.activeClass : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Report list */}
      {filteredScans.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No reports found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredScans.map((scan, idx) => (
            <motion.button
              key={scan.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
              onClick={() => navigate(`/analysis/${scan.id}`)}
              className="premium-card p-5 text-left hover:border-purple-500/20 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{scan.sample_name || "Untitled Scan"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{moment(scan.created_date).format("lll")}</p>
                </div>
                <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Score: <span className="font-bold text-foreground">{scan.health_score}/100</span></span>
                <span className="text-muted-foreground">pH: <span className="font-semibold text-foreground">{scan.ph}</span></span>
                <span className="text-muted-foreground">TDS: <span className="font-semibold text-foreground">{scan.tds}</span></span>
              </div>
              {scan.water_source_name && (
                <p className="text-xs text-muted-foreground mt-2 truncate">{scan.water_source_name}</p>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}