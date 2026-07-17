import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Download, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ReportCompare from "@/components/report/ReportCompare";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "safe", label: "Safe" },
  { key: "moderate", label: "Moderate" },
  { key: "unsafe", label: "Unsafe" },
  { key: "critical", label: "Critical" },
];

const DATE_RANGES = [
  { key: "all", label: "All Time" },
  { key: "24h", label: "24 Hours" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

export default function AnalysisHeader({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  dateRange,
  onDateRangeChange,
  onRefresh,
  refreshing,
  scans,
  onNavigate,
  t,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[40px] font-extrabold leading-tight font-heading">AI Analysis Center</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Analyze historical water quality reports and AI-generated predictions.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <ReportCompare scans={scans} onNavigate={onNavigate} t={t} />
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, location, disease, date..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2.5 rounded-xl glass border border-border text-sm font-medium focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score_high">Highest Score</option>
            <option value="score_low">Lowest Score</option>
          </select>
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2.5 rounded-xl glass border border-border text-sm font-medium focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            {DATE_RANGES.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "glass text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}