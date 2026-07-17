import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";
import moment from "moment";

function formatValue(type, value) {
  if (value === null || value === undefined || value < 0) return "N/A";
  if (type === "tds" || type === "turbidity") return Math.round(value);
  if (type === "temperature" || type === "ph") return Math.round(value * 10) / 10;
  return value;
}

function Delta({ value, suffix = "" }) {
  if (value === null || value === undefined || isNaN(value)) return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  const isImproved = value > 0;
  const isWorsened = value < 0;
  const Icon = isImproved ? TrendingUp : isWorsened ? TrendingDown : Minus;
  const color = isImproved ? "text-safe" : isWorsened ? "text-danger" : "text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {value !== 0 && `${value > 0 ? "+" : ""}${value}${suffix}`}
    </span>
  );
}

const PARAMS = [
  { key: "ph", label: "pH", unit: "" },
  { key: "tds", label: "TDS", unit: "ppm" },
  { key: "temperature", label: "Temperature", unit: "°C" },
  { key: "turbidity", label: "Turbidity", unit: "NTU" },
];

export default function ReportCompare({ scans, onNavigate, t }) {
  const [open, setOpen] = useState(false);
  const [scanA, setScanA] = useState(null);
  const [scanB, setScanB] = useState(null);

  const sortedScans = useMemo(() => [...scans].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)), [scans]);

  const a = scanA ? sortedScans.find(s => s.id === scanA) : null;
  const b = scanB ? sortedScans.find(s => s.id === scanB) : null;

  const scoreDelta = a && b ? b.health_score - a.health_score : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-border text-xs font-medium hover:bg-muted/50 transition-colors"
        title="Compare Reports"
      >
        <GitCompare className="w-3.5 h-3.5" /> Compare
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="premium-card w-full max-w-4xl max-h-[85vh] overflow-y-auto scrollbar-thin p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <GitCompare className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading font-semibold text-lg">Report Comparison</h2>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Report A (Earlier)</label>
                  <select
                    value={scanA || ""}
                    onChange={(e) => setScanA(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:border-primary/40"
                  >
                    <option value="">Select a report...</option>
                    {sortedScans.map((s) => (
                      <option key={s.id} value={s.id}>{s.sample_name || "Untitled"} — {moment(s.created_date).format("lll")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Report B (Later)</label>
                  <select
                    value={scanB || ""}
                    onChange={(e) => setScanB(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:border-primary/40"
                  >
                    <option value="">Select a report...</option>
                    {sortedScans.filter(s => s.id !== scanA).map((s) => (
                      <option key={s.id} value={s.id}>{s.sample_name || "Untitled"} — {moment(s.created_date).format("lll")}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison */}
              {a && b ? (
                <div className="space-y-4">
                  {/* Score comparison */}
                  <div className="grid grid-cols-3 items-center gap-4 p-5 rounded-2xl glass border border-border">
                    <div className="flex flex-col items-center gap-2">
                      <HealthScoreRing score={a.health_score} riskLevel={a.risk_level} size={90} stroke={8} />
                      <p className="text-xs font-medium truncate max-w-[120px]">{a.sample_name || "Untitled"}</p>
                      <p className="text-[10px] text-muted-foreground">{moment(a.created_date).format("ll")}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      {scoreDelta !== null && <Delta value={scoreDelta} />}
                      <span className="text-[10px] text-muted-foreground">Score Change</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <HealthScoreRing score={b.health_score} riskLevel={b.risk_level} size={90} stroke={8} />
                      <p className="text-xs font-medium truncate max-w-[120px]">{b.sample_name || "Untitled"}</p>
                      <p className="text-[10px] text-muted-foreground">{moment(b.created_date).format("ll")}</p>
                    </div>
                  </div>

                  {/* Parameter comparison */}
                  <div className="rounded-2xl glass border border-border overflow-hidden">
                    {PARAMS.map((param) => {
                      const valA = formatValue(param.key, a[param.key]);
                      const valB = formatValue(param.key, b[param.key]);
                      const numDelta = (typeof valA === "number" && typeof valB === "number") ? Math.round((valB - valA) * 10) / 10 : null;
                      const statusA = classifyParameter(param.key, a[param.key]);
                      const statusB = classifyParameter(param.key, b[param.key]);
                      const improved = statusB === "safe" && statusA !== "safe";
                      const worsened = statusB !== "safe" && statusA === "safe";

                      return (
                        <div key={param.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0">
                          <div className="text-right">
                            <p className="text-sm font-medium">{valA}<span className="text-muted-foreground ml-1 text-xs">{param.unit}</span></p>
                          </div>
                          <div className="flex flex-col items-center min-w-[80px]">
                            <span className="text-xs text-muted-foreground">{param.label}</span>
                            {numDelta !== null && <Delta value={numDelta} />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{valB}<span className="text-muted-foreground ml-1 text-xs">{param.unit}</span></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Risk level comparison */}
                  <div className="grid grid-cols-3 items-center gap-4 p-4 rounded-2xl glass border border-border">
                    <div className="flex justify-center"><RiskBadge level={a.risk_level} label={t(a.risk_level)} size="sm" /></div>
                    <div className="text-center text-xs text-muted-foreground">Risk Level</div>
                    <div className="flex justify-center"><RiskBadge level={b.risk_level} label={t(b.risk_level)} size="sm" /></div>
                  </div>

                  {/* Open buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { onNavigate(a.id); setOpen(false); }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                    >
                      Open Report A <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { onNavigate(b.id); setOpen(false); }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-all"
                    >
                      Open Report B <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  Select two reports above to compare their water quality metrics.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}