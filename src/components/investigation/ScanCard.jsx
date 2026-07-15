import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Droplets, MapPin } from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";

export default function ScanCard({ scan, onAnalyze, t, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className="glass rounded-2xl p-5 border border-border hover:border-primary/25 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-heading font-semibold">
            {moment(scan.created_date).format("MMM D, YYYY · h:mm A")}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {scan.water_source_name || "Unknown Source"}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {scan.location_name || "No location"}
            </span>
          </div>
        </div>
        <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
      </div>

      {/* Quick metrics */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs">
        <span className="text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{scan.health_score}/100</span>
        </span>
        <span className="text-muted-foreground">
          TDS: <span className="font-semibold text-foreground">{scan.tds} ppm</span>
        </span>
        <span className="text-muted-foreground">
          pH: <span className="font-semibold text-foreground">{scan.ph}</span>
        </span>
        <span className="text-muted-foreground">
          Turbidity: <span className="font-semibold text-foreground">{scan.turbidity} NTU</span>
        </span>
      </div>

      <button
        onClick={() => onAnalyze(scan)}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        Analyze
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}