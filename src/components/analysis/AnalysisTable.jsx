import React from "react";
import { motion } from "framer-motion";
import { Eye, Download, GitCompare, FileText } from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";
import { getTopDisease, formatSensorValue } from "@/lib/analysisUtils";

function getScoreColor(score) {
  if (score >= 70) return "text-safe";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

export default function AnalysisTable({ scans, onView, onDownload, onCompare, t }) {
  if (scans.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No reports found matching your search.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="premium-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Analysis ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sample Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Water Score</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Predicted Disease</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan, idx) => {
              const topDisease = getTopDisease(scan.disease_risks);
              const modelCompleted = scan.ai_analysis && scan.ai_analysis.trim();
              return (
                <motion.tr
                  key={scan.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.3) }}
                  onClick={() => onView(scan)}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono text-[13px] font-medium">#{scan.id?.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-4 text-[13px]">{moment(scan.created_date).format("MMM D, YYYY")}</td>
                  <td className="py-3 px-4 text-[13px] max-w-[150px] truncate">{scan.location_name || scan.water_source_name || "N/A"}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-lg font-bold ${getScoreColor(scan.health_score)}`}>{scan.health_score}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[13px]">
                    {topDisease ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span>{topDisease.name}</span>
                        <span className={`text-xs font-bold ${topDisease.risk < 15 ? "text-safe" : topDisease.risk < 40 ? "text-warning" : "text-danger"}`}>{topDisease.risk}%</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">No prediction</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${modelCompleted ? "bg-safe/10 text-safe" : "bg-warning/10 text-warning"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${modelCompleted ? "bg-safe" : "bg-warning animate-pulse"}`} />
                      {modelCompleted ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onView(scan); }}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDownload(scan); }}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onCompare(scan); }}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Compare"
                      >
                        <GitCompare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}