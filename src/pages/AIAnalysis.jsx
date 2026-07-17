import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Upload, Cpu, FileSearch, AlertCircle, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import AnalysisHeader from "@/components/analysis/AnalysisHeader";
import SummaryCards from "@/components/analysis/SummaryCards";
import AIStatusPanel from "@/components/analysis/AIStatusPanel";
import AnalysisCharts from "@/components/analysis/AnalysisCharts";
import AnalysisTable from "@/components/analysis/AnalysisTable";
import ReportDrawer from "@/components/analysis/ReportDrawer";
import AnalysisSkeletons from "@/components/analysis/AnalysisSkeletons";
import { filterByTimeRange, parseDiseaseRisks, downloadScanPDF } from "@/lib/analysisUtils";

function smartFilter(scans, query) {
  if (!query.trim()) return scans;
  const q = query.toLowerCase();
  let result = [...scans];

  if (q.includes("unsafe") || q.includes("danger")) result = result.filter((s) => s.risk_level === "danger");
  else if (q.includes("safe")) result = result.filter((s) => s.risk_level === "safe");
  else if (q.includes("moderate") || q.includes("caution")) result = result.filter((s) => s.risk_level === "moderate");

  if (q.includes("turbid")) result = result.filter((s) => s.turbidity > 5);
  if (q.includes("tds")) result = result.filter((s) => s.tds > 500);
  if (q.includes("ph")) result = result.filter((s) => s.ph < 6.5 || s.ph > 8.5);

  const diseaseNames = ["cholera", "typhoid", "diarrhea", "dysentery", "hepatitis"];
  diseaseNames.forEach((disease) => {
    if (q.includes(disease)) {
      result = result.filter((s) => {
        const risks = parseDiseaseRisks(s.disease_risks);
        const key = disease === "hepatitis" ? "hepatitisA" : disease;
        return risks?.[key] > 15;
      });
    }
  });

  if (q.includes("today")) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    result = result.filter((s) => new Date(s.created_date).getTime() >= todayStart);
  }
  if (q.includes("week")) {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    result = result.filter((s) => new Date(s.created_date).getTime() >= weekAgo);
  }

  const textMatch = result.filter((s) =>
    (s.sample_name || "").toLowerCase().includes(q) ||
    (s.water_source_name || "").toLowerCase().includes(q) ||
    (s.location_name || "").toLowerCase().includes(q) ||
    (s.id || "").toLowerCase().includes(q)
  );

  if (textMatch.length > 0) return textMatch;
  return result;
}

function applyFilter(scans, filter) {
  if (filter === "all") return scans;
  if (filter === "safe") return scans.filter((s) => s.risk_level === "safe");
  if (filter === "moderate") return scans.filter((s) => s.risk_level === "moderate");
  if (filter === "unsafe") return scans.filter((s) => s.risk_level === "danger" && s.health_score >= 30);
  if (filter === "critical") return scans.filter((s) => s.risk_level === "danger" && s.health_score < 30);
  return scans;
}

function applySort(scans, sortBy) {
  const arr = [...scans];
  if (sortBy === "oldest") return arr.reverse();
  if (sortBy === "score_high") return arr.sort((a, b) => b.health_score - a.health_score);
  if (sortBy === "score_low") return arr.sort((a, b) => a.health_score - b.health_score);
  return arr;
}

export default function AIAnalysis() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const [drawerScan, setDrawerScan] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadScans = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const results = await base44.entities.Scan.list("-created_date", 200);
      setScans(results || []);
    } catch (e) {
      setError(e.message || "Failed to load analysis data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadScans(); }, [loadScans]);

  const filteredScans = useMemo(() => {
    let result = smartFilter(scans, searchQuery);
    result = applyFilter(result, filter);
    result = filterByTimeRange(result, dateRange);
    result = applySort(result, sortBy);
    return result;
  }, [scans, searchQuery, filter, sortBy, dateRange]);

  const handleView = (scan) => { setDrawerScan(scan); setDrawerOpen(true); };
  const handleDownload = (scan) => downloadScanPDF(scan);
  const handleCompare = (scan) => navigate(`/analysis/${scan.id}`);

  if (loading) return <AnalysisSkeletons />;

  if (error) {
    return (
      <div className="font-manrope max-w-7xl mx-auto py-20 text-center">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Analysis could not be completed.</h2>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <button
          onClick={() => loadScans(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="font-manrope max-w-7xl mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
          <FileSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No AI analysis has been performed yet.</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Connect IoT sensors or upload laboratory water reports to begin AI-powered water quality analysis.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => navigate("/monitor")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Radio className="w-4 h-4" /> Start Analysis
          </button>
          <button onClick={() => navigate("/monitor")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
            <Cpu className="w-4 h-4" /> Connect IoT Device
          </button>
          <button onClick={() => navigate("/monitor")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
            <Upload className="w-4 h-4" /> Upload Water Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-manrope max-w-7xl mx-auto space-y-6">
      <AnalysisHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={() => loadScans(true)}
        refreshing={refreshing}
        scans={scans}
        onNavigate={(id) => navigate(`/analysis/${id}`)}
        t={t}
      />

      <SummaryCards scans={scans} />

      <AIStatusPanel scans={scans} />

      <AnalysisCharts scans={scans} />

      <AnalysisTable
        scans={filteredScans}
        onView={handleView}
        onDownload={handleDownload}
        onCompare={handleCompare}
        t={t}
      />

      <ReportDrawer
        scan={drawerScan}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onNavigate={(id) => navigate(`/analysis/${id}`)}
        onDownload={handleDownload}
      />
    </div>
  );
}