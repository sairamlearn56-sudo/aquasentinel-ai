import React from "react";
import { motion } from "framer-motion";
import { Droplets, ChevronRight, MapPin } from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";

export default function WaterSourceCard({ source, latestScan, totalScans, onProgress }) {
  const lastScanDate = latestScan
    ? moment(latestScan.created_date).format("MMM D, YYYY")
    : "No scans yet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-5 border border-border hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-aqua/10 flex items-center justify-center flex-shrink-0">
          <Droplets className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{source.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" />
            {source.label}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-muted/20">
          <p className="text-xs text-muted-foreground">Total Scans</p>
          <p className="text-lg font-bold">{totalScans}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-muted/20">
          <p className="text-xs text-muted-foreground">Last Scan</p>
          <p className="text-sm font-semibold">{lastScanDate}</p>
        </div>
      </div>

      {/* Latest Risk */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs text-muted-foreground">Latest Risk Status</span>
        {latestScan ? (
          <RiskBadge level={latestScan.risk_level} size="sm" />
        ) : (
          <span className="text-xs text-muted-foreground">No data</span>
        )}
      </div>

      {/* View Progress */}
      <button
        onClick={onProgress}
        disabled={totalScans === 0}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        View Progress
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Notes */}
      {source.notes && (
        <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{source.notes}</p>
      )}
    </motion.div>
  );
}