import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileSearch, Radio, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import EmptyState from "@/components/EmptyState";
import ScanCard from "@/components/investigation/ScanCard";
import InvestigationReport from "@/components/investigation/InvestigationReport";

const ICON_BANNER = "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/027f2bf46_WhatsAppImage2026-07-16at122012AM.jpg";

export default function AIAnalysis() {
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <EmptyState
        title={t("noScansYet")}
        description={t("noScansYetDesc")}
        action={
          <Link
            to="/monitor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Radio className="w-5 h-5" />
            {t("startMonitoring")}
          </Link>
        }
      />
    );
  }

  if (selectedScan) {
    return (
      <div className="max-w-4xl mx-auto">
        <InvestigationReport scan={selectedScan} onBack={() => setSelectedScan(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Header with 3D Icon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 mb-2"
      >
        <img src={ICON_BANNER} alt="" className="w-full h-36 sm:h-44 object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/30" />
        <div className="absolute inset-0 flex items-center p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-semibold text-white">AI Water Investigation</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Select a scan to generate a detailed AI investigation report</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scan count */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {scans.length} scan{scans.length !== 1 ? "s" : ""} recorded · Click Analyze to generate a report
      </motion.div>

      {/* Scan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {scans.map((scan, idx) => (
          <ScanCard key={scan.id || idx} scan={scan} onAnalyze={setSelectedScan} t={t} index={idx} />
        ))}
      </div>
    </div>
  );
}