import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileSearch, Radio, ArrowUpDown, FileText, ChevronDown, Sparkles, Activity, Download, MapPin, Calendar } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import EmptyState from "@/components/EmptyState";
import ReportView from "@/components/report/ReportView";
import RiskBadge from "@/components/RiskBadge";
import WaterGradeBadge, { getWaterGrade } from "@/components/report/WaterGradeBadge";
import RiskTimeline from "@/components/report/RiskTimeline";
import ReportCompare from "@/components/report/ReportCompare";
import StatCardGrid from "@/components/report/StatCardGrid";
import HeroAISummary from "@/components/report/HeroAISummary";
import ExplainableAI from "@/components/report/ExplainableAI";
import { classifyParameter } from "@/lib/waterAnalysis";
import moment from "moment";

const FILTERS = [
  { key: "all", label: "All", color: "from-purple-500 to-violet-600" },
  { key: "safe", label: "Safe", color: "from-emerald-500 to-teal-500" },
  { key: "moderate", label: "Moderate", color: "from-amber-500 to-orange-500" },
  { key: "danger", label: "Unsafe", color: "from-rose-500 to-red-500" },
];

const DATE_RANGES = [
  { key: "all", label: "All Time", days: 0 },
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "7 Days", days: 7 },
  { key: "30d", label: "30 Days", days: 30 },
];

function formatSensorValue(type, value) {
  if (value === null || value === undefined || value < 0) return "N/A";
  if (type === "tds" || type === "turbidity") return Math.round(value);
  if (type === "temperature" || type === "ph") return Math.round(value * 10) / 10;
  return value;
}

function getTopDiseases(diseaseRisks, limit = 2) {
  if (!diseaseRisks) return [];
  const risks = typeof diseaseRisks === "string" ? JSON.parse(diseaseRisks) : diseaseRisks;
  return Object.entries(risks || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
}

function downloadScanPDF(scan) {
  const doc = new jsPDF();
  const margin = 20;
  let y = 25;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 107, 180);
  doc.text("AquaSentinel", margin, y);
  y += 10;
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Water Quality Diagnostic Report", margin, y);
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);
  y += 12;

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Report Details", margin, y); y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`Sample Name: ${scan.sample_name || "Untitled"}`, margin, y); y += 6;
  doc.text(`Date: ${moment(scan.created_date).format("lll")}`, margin, y); y += 6;
  doc.text(`Scan ID: ${scan.id?.slice(-8) || "N/A"}`, margin, y); y += 6;
  if (scan.water_source_name) { doc.text(`Water Source: ${scan.water_source_name}`, margin, y); y += 6; }
  if (scan.location_name) { doc.text(`Location: ${scan.location_name}`, margin, y); y += 6; }
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.text(`Health Score: ${scan.health_score}/100`, margin, y); y += 6;
  doc.text(`Risk Level: ${scan.risk_level.toUpperCase()}`, margin, y); y += 6;
  const aiConfidence = scan.ai_confidence || Math.min(98, 82 + Math.round((100 - scan.health_score) * 0.15));
  doc.text(`AI Confidence: ${aiConfidence}%`, margin, y); y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Sensor Readings", margin, y); y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`pH: ${formatSensorValue("ph", scan.ph)}`, margin, y); y += 6;
  doc.text(`TDS: ${formatSensorValue("tds", scan.tds)} ppm`, margin, y); y += 6;
  doc.text(`Temperature: ${formatSensorValue("temperature", scan.temperature)} C`, margin, y); y += 6;
  doc.text(`Turbidity: ${formatSensorValue("turbidity", scan.turbidity)} NTU`, margin, y); y += 10;

  const risks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : scan.disease_risks;
  if (risks && Object.keys(risks).length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Disease Risk Assessment", margin, y); y += 7;
    doc.setFont("helvetica", "normal");
    Object.entries(risks).sort(([, a], [, b]) => b - a).forEach(([disease, risk]) => {
      const name = disease === "hepatitisA" ? "Hepatitis A" : disease.charAt(0).toUpperCase() + disease.slice(1);
      doc.text(`${name}: ${risk}%`, margin, y);
      y += 6;
    });
  }

  doc.save(`aquasentinel-${scan.id?.slice(-8) || "report"}.pdf`);
}

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
  const [expandedId, setExpandedId] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

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

  const locations = useMemo(() => {
    const locs = [...new Set(scans.map((s) => s.location_name).filter(Boolean))];
    return locs;
  }, [scans]);

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
    if (locationFilter !== "all") {
      result = result.filter((s) => s.location_name === locationFilter);
    }
    if (dateRange !== "all") {
      const dr = DATE_RANGES.find((d) => d.key === dateRange);
      if (dr && dr.days > 0) {
        const cutoff = Date.now() - dr.days * 24 * 60 * 60 * 1000;
        result = result.filter((s) => new Date(s.created_date).getTime() >= cutoff);
      }
    }
    if (sortBy === "oldest") {
      result = [...result].reverse();
    }
    return result;
  }, [scans, searchQuery, filter, locationFilter, dateRange, sortBy]);

  // ===== Loading state =====
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ===== Report Viewer Mode =====
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
        allScans={scans}
        onBack={() => navigate("/analysis")}
        onDeleted={() => navigate("/analysis")}
        onNavigate={(id) => navigate(`/analysis/${id}`)}
      />
    );
  }

  // ===== Empty state =====
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

  // ===== List View =====
  return (
    <div className="font-manrope max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">AI Diagnostic Center</h1>
              <p className="text-sm text-muted-foreground mt-1">{scans.length} report{scans.length !== 1 ? "s" : ""} on record</p>
            </div>
          </div>
          <ReportCompare scans={scans} onNavigate={(id) => navigate(`/analysis/${id}`)} t={t} />
        </div>
      </motion.div>

      {/* Hero AI Summary */}
      <HeroAISummary scans={scans} t={t} />

      {/* KPI Cards */}
      <StatCardGrid scans={scans} timeRange={timeRange} />

      {/* AI Risk Trend Chart */}
      <RiskTimeline scans={scans} timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      {/* AI Insights Panel */}
      <ExplainableAI scan={scans[0]} />

      {/* Search + Sort */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex items-center gap-3">
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

      {/* Filters: Risk Level + Location + Date Range */}
      <div className="flex items-center gap-2 flex-wrap">
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
        {locations.length > 0 && (
          <div className="relative inline-flex items-center">
            <MapPin className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-8 pr-8 py-2 rounded-xl glass border border-border text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-primary/40"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        )}
        <div className="relative inline-flex items-center">
          <Calendar className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="pl-8 pr-8 py-2 rounded-xl glass border border-border text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-primary/40"
          >
            {DATE_RANGES.map((dr) => (
              <option key={dr.key} value={dr.key}>{dr.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report list */}
      {filteredScans.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No reports found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredScans.map((scan, idx) => {
            const isExpanded = expandedId === scan.id;
            const aiConfidence = scan.ai_confidence || Math.min(98, 82 + Math.round((100 - scan.health_score) * 0.15));
            const topDiseases = getTopDiseases(scan.disease_risks, 2);
            const grade = getWaterGrade(scan.health_score);

            return (
              <motion.div
                key={scan.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                className={`premium-card overflow-hidden transition-all hover:shadow-xl ${isExpanded ? "border-purple-500/20 shadow-lg" : ""}`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : scan.id)}
                  className="p-5 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <WaterGradeBadge score={scan.health_score} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-lg truncate">{scan.sample_name || "Untitled Scan"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{moment(scan.created_date).format("lll")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg glass border border-border text-xs">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="font-bold">{aiConfidence}%</span>
                      </span>
                      <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs flex-wrap mb-2">
                    <span className="text-muted-foreground">Score: <span className="font-bold text-foreground">{scan.health_score}/100</span></span>
                    <span className="text-muted-foreground">Grade: <span className={`font-bold ${grade.color}`}>{grade.letter}</span></span>
                    <span className="text-muted-foreground">pH: <span className="font-semibold text-foreground">{formatSensorValue("ph", scan.ph)}</span></span>
                    <span className="text-muted-foreground">TDS: <span className="font-semibold text-foreground">{formatSensorValue("tds", scan.tds)} ppm</span></span>
                    {scan.water_source_name && <span className="text-muted-foreground truncate">{scan.water_source_name}</span>}
                  </div>

                  {topDiseases.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {topDiseases.map(([disease, risk]) => {
                        const name = disease === "hepatitisA" ? "Hepatitis A" : disease.charAt(0).toUpperCase() + disease.slice(1);
                        return (
                          <span key={disease} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md glass border border-border text-[10px]">
                            <span className="text-muted-foreground">{name}</span>
                            <span className={`font-bold ${risk < 15 ? "text-safe" : risk < 40 ? "text-warning" : "text-danger"}`}>{risk}%</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-border/50">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                          {[
                            { key: "ph", label: "pH", unit: "" },
                            { key: "tds", label: "TDS", unit: "ppm" },
                            { key: "temperature", label: "Temp", unit: "°C" },
                            { key: "turbidity", label: "Turbidity", unit: "NTU" },
                          ].map(({ key, label, unit }) => {
                            const val = formatSensorValue(key, scan[key]);
                            const status = classifyParameter(key, scan[key]);
                            const color = status === "safe" ? "text-safe" : status === "moderate" ? "text-warning" : "text-danger";
                            return (
                              <div key={key} className="rounded-xl glass border border-border/50 p-3 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                                <p className={`text-xl font-bold ${color}`}>{val}{val !== "N/A" && unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}</p>
                              </div>
                            );
                          })}
                        </div>

                        {scan.ai_analysis && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">
                            {scan.ai_analysis.split("\n\n")[0]}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => navigate(`/analysis/${scan.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                          >
                            <FileText className="w-4 h-4" /> View Full Report
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadScanPDF(scan); }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                          >
                            <Download className="w-4 h-4" /> Download PDF
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}