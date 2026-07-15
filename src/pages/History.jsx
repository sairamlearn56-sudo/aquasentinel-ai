import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar as CalendarIcon, X, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import EmptyState from "@/components/EmptyState";
import HistoryDatePicker from "@/components/history/HistoryDatePicker";
import HistoryTimelineCard from "@/components/history/HistoryTimelineCard";
import moment from "moment";

const FILTERS = [
  { key: "all", label: "All", color: "from-cyan-500 to-blue-500" },
  { key: "safe", label: "Safe", color: "from-emerald-500 to-teal-500" },
  { key: "moderate", label: "Moderate", color: "from-amber-500 to-orange-500" },
  { key: "danger", label: "Danger", color: "from-rose-500 to-red-500" },
];

export default function History() {
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await base44.entities.Scan.list("-created_date", 100);
        setScans(results || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Set of dates that have scans (YYYY-MM-DD)
  const scanDates = useMemo(() => {
    const set = new Set();
    scans.forEach((s) => {
      if (s.created_date) {
        set.add(moment(s.created_date).format("YYYY-MM-DD"));
      }
    });
    return set;
  }, [scans]);

  // Filtered scans
  const filteredScans = useMemo(() => {
    let result = scans;
    if (selectedDate) {
      result = result.filter((s) => moment(s.created_date).format("YYYY-MM-DD") === selectedDate);
    }
    if (filter !== "all") {
      result = result.filter((s) => s.risk_level === filter);
    }
    return result;
  }, [scans, filter, selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
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
          <Link
            to="/monitor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            {t("startMonitoring")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{t("historyTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{scans.length} scans recorded</p>
          </div>
        </div>
        {/* Calendar icon */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`p-2.5 rounded-xl glass border transition-colors ${
              showDatePicker || selectedDate
                ? "border-emerald-500/40 text-emerald-400"
                : "border-border hover:bg-muted/50"
            }`}
            title="Filter by date"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showDatePicker && (
              <HistoryDatePicker
                scanDates={scanDates}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Selected date banner */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between glass rounded-2xl px-4 py-3"
        >
          <p className="text-sm">
            Showing records for{" "}
            <span className="font-semibold">{moment(selectedDate).format("MMMM D, YYYY")}</span>
          </p>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear filter
          </button>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? `bg-gradient-to-r ${f.color} text-white shadow-lg`
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filteredScans.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No water quality records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan, idx) => (
            <motion.div
              key={scan.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.5) }}
            >
              <HistoryTimelineCard scan={scan} t={t} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}