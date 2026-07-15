import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Droplets, MapPin, Calendar } from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";

export default function ScanCard({ scan, onAnalyze, t, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className="premium-card p-6 hover:border-purple-500/25"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-heading font-semibold">
            <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            {moment(scan.created_date).format("MMM D, YYYY · h:mm A")}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              {scan.water_source_name || "Unknown Source"}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {scan.location_name || "No location"}
            </span>
          </div>
        </div>
        <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
          <span className="text-muted-foreground">Score</span>
          <span className="font-semibold text-foreground">{scan.health_score}/100</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
          <span className="text-muted-foreground">TDS</span>
          <span className="font-semibold text-foreground">{scan.tds} ppm</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
          <span className="text-muted-foreground">pH</span>
          <span className="font-semibold text-foreground">{scan.ph}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
          <span className="text-muted-foreground">Turbidity</span>
          <span className="font-semibold text-foreground">{scan.turbidity} NTU</span>
        </div>
      </div>

      <button
        onClick={() => onAnalyze(scan)}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/15 to-violet-500/15 text-purple-400 text-sm font-medium hover:from-purple-500/25 hover:to-violet-500/25 transition-all group"
      >
        Analyze
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
}