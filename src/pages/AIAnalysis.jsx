import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileSearch, Radio } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import EmptyState from "@/components/EmptyState";
import ScanCard from "@/components/investigation/ScanCard";
import InvestigationReport from "@/components/investigation/InvestigationReport";

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
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Radio className="w-5 h-5" />
            {t("startMonitoring")}
          </Link>
        }
      />
    );
  }

  // If a scan is selected, show the investigation report
  if (selectedScan) {
    return (
      <div className="max-w-4xl mx-auto">
        <InvestigationReport scan={selectedScan} onBack={() => setSelectedScan(null)} />
      </div>
    );
  }

  // Otherwise, show the list of all scans
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-aqua flex items-center justify-center shadow-lg shadow-primary/20">
            <FileSearch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-semibold">AI Water Investigation</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Select a scan to generate a detailed AI investigation report
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scan count */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-sm text-muted-foreground"
      >
        {scans.length} scan{scans.length !== 1 ? "s" : ""} recorded
      </motion.div>

      {/* Scan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scans.map((scan, idx) => (
          <ScanCard key={scan.id || idx} scan={scan} onAnalyze={setSelectedScan} t={t} index={idx} />
        ))}
      </div>
    </div>
  );
}