import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileSearch, Radio, ArrowUpDown, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import EmptyState from "@/components/EmptyState";
import ReportView from "@/components/report/ReportView";
import RiskBadge from "@/components/RiskBadge";
import moment from "moment";

const FILTERS = [
  { key: "all", label: "All", color: "from-purple-500 to-violet-600" },
  { key: "safe", label: "Safe", color: "from-emerald-500 to-teal-500" },
  { key: "moderate", label: "Moderate", color: "from-amber-500 to-orange-500" },
  { key: "danger", label: "Unsafe", color: "from-rose-500 to-red-500" },
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

  // ===== Loading state (initial) =====
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ===== Report Viewer Mode (scanId in URL) =====
  if (scanId) {
    if (scanLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
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
            <button onClick={() => navigate("/analysis")} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium">
              <FileSearch className="w-5 h-5" /> Back to Reports
            </button>
          }
        />
      );
    }
    return (
      <ReportView
        scan={selectedScan}
        onBack={() => navigate("/analysis")}
        onDeleted={() => navigate("/analysis")}
      />
    );
  }

  // ===== Empty state (no scans at all) =====
  if (scans.length === 0) {
    return (
      <EmptyState
        title={t("noScansYet")}
        description={t("noScansYetDesc")}
        action={
          <button onClick={() => navigate("/monitor")} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <FileSearch className="w-6 h-6 text-white" />
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
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass border border-border text-sm focus:outline-none focus:border-purple-500/40"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors whitespace-nowrap"
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
              filter === f.key ? `bg-gradient-to-r ${f.color} text-white shadow-lg` : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Report list */}
      {filteredScans.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
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