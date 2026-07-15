import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";

export default function HistoryTimelineCard({ scan, t }) {
  const [expanded, setExpanded] = useState(false);
  const aiRec = scan.recommendations?.[0] || "No recommendation available";

  return (
    <div className="glass rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        {/* Top row: time + source + risk */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {moment(scan.created_date).format("MMM D, h:mm A")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {scan.water_source_name || "Unknown Source"}
            </p>
          </div>
          <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
        </div>

        {/* Metrics row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
          <span className="text-muted-foreground">
            TDS: <span className="font-semibold text-foreground">{scan.tds} ppm</span>
          </span>
          <span className="text-muted-foreground">
            Turbidity: <span className="font-semibold text-foreground">{scan.turbidity} NTU</span>
          </span>
          <span className="text-muted-foreground">
            Temp: <span className="font-semibold text-foreground">{scan.temperature}°C</span>
          </span>
        </div>

        {/* AI Recommendation (truncated) */}
        <p className="text-xs text-muted-foreground truncate">{aiRec}</p>

        {/* Expand hint */}
        <div className="flex items-center justify-end mt-1">
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-3 border-t border-border/50">
              {/* Detailed metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <Metric label="Health Score" value={`${scan.health_score}/100`} />
                <Metric label="pH" value={scan.ph} />
                <Metric label="Family Member" value={t(scan.family_member) || scan.family_member || "—"} />
                <Metric label="Sensor" value={scan.sensor_status || "connected"} />
              </div>

              {/* Full AI Recommendation */}
              {scan.recommendations?.length > 0 && (
                <div className="p-3 rounded-xl bg-muted/30 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">AI Recommendations</p>
                  {scan.recommendations.map((rec, i) => (
                    <p key={i} className="text-xs text-foreground leading-relaxed">
                      • {rec}
                    </p>
                  ))}
                </div>
              )}

              {/* AI Analysis */}
              {scan.ai_analysis && (
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">AI Analysis</p>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {scan.ai_analysis}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-2.5 rounded-xl bg-muted/20">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}