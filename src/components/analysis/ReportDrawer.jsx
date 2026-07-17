import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Droplets, Thermometer, Beaker, Cloud, Cpu, Bug, ClipboardList,
  Clock, Calendar, ArrowRight, FileText, Download, Activity, Sparkles, Zap,
} from "lucide-react";
import moment from "moment";
import RiskBadge from "@/components/RiskBadge";
import HealthScoreRing from "@/components/HealthScoreRing";
import {
  validateSensor, formatSensorValue, parseDiseaseRisks,
  normalizeRecommendations, getInferenceTime,
} from "@/lib/analysisUtils";

const SENSORS = [
  { key: "ph", label: "pH", unit: "", icon: Beaker },
  { key: "tds", label: "TDS", unit: "ppm", icon: Droplets },
  { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer },
  { key: "turbidity", label: "Turbidity", unit: "NTU", icon: Cloud },
];

const SENSOR_STATUS_STYLES = {
  normal: "text-safe bg-safe/10 border-safe/20",
  elevated: "text-warning bg-warning/10 border-warning/20",
  critical: "text-danger bg-danger/10 border-danger/20",
  offline: "text-muted-foreground bg-muted/50 border-border",
  invalid: "text-danger bg-danger/10 border-danger/20",
  error: "text-danger bg-danger/10 border-danger/20",
  calibration: "text-warning bg-warning/10 border-warning/20",
};

const REC_SECTIONS = [
  { key: "immediatePrecautions", label: "Immediate Precautions" },
  { key: "waterTreatment", label: "Water Treatment" },
];

export default function ReportDrawer({ scan, open, onOpenChange, onNavigate, onDownload }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onOpenChange(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const diseaseRisks = scan ? parseDiseaseRisks(scan.disease_risks) : null;
  const recommendations = scan ? normalizeRecommendations(scan.recommendations) : null;
  const inferenceTime = scan ? getInferenceTime(scan) : null;
  const aiConfidence = scan?.ai_confidence != null ? scan.ai_confidence : null;
  const topDisease = diseaseRisks
    ? Object.entries(diseaseRisks).sort(([, a], [, b]) => b - a)[0]
    : null;

  return (
    <AnimatePresence>
      {open && scan && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-xl bg-background overflow-y-auto border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={56} stroke={5} />
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold font-heading truncate">{scan.sample_name || "Untitled Scan"}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RiskBadge level={scan.risk_level} size="sm" />
                      <span className="text-xs text-muted-foreground">{moment(scan.created_date).format("lll")}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onOpenChange(false)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Water Sample Information */}
              <section>
                <h3 className="text-sm font-bold font-heading uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Water Sample Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow label="Source" value={scan.water_source_name || "N/A"} />
                  <InfoRow label="Location" value={scan.location_name || "N/A"} />
                  <InfoRow label="Family Member" value={scan.family_member ? scan.family_member.replace("_", " ") : "N/A"} capitalize />
                  <InfoRow label="Language" value={scan.language?.toUpperCase() || "N/A"} />
                </div>
              </section>

              {/* Sensor Readings */}
              <section>
                <h3 className="text-sm font-bold font-heading uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Sensor Readings
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {SENSORS.map(({ key, label, unit, icon: Icon }) => {
                    const validation = validateSensor(key, scan[key], scan.sensor_status);
                    const statusStyle = SENSOR_STATUS_STYLES[validation.status] || SENSOR_STATUS_STYLES.invalid;
                    return (
                      <div key={key} className="rounded-xl glass border border-border/50 p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon className="w-3.5 h-3.5" /> {label}
                          </span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${statusStyle}`}>
                            {validation.label}
                          </span>
                        </div>
                        {validation.valid ? (
                          <p className="text-xl font-bold">
                            {formatSensorValue(key, scan[key])}
                            {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-muted-foreground">{validation.label}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AI Model Output */}
              <section>
                <h3 className="text-sm font-bold font-heading uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> AI Model Output
                </h3>
                <div className="rounded-xl glass border border-border/50 p-4 space-y-3">
                  <ModelRow label="Model" value="Unavailable" />
                  <ModelRow label="Prediction" value={topDisease ? (topDisease[0] === "hepatitisA" ? "Hepatitis A" : topDisease[0].charAt(0).toUpperCase() + topDisease[0].slice(1)) : "No prediction available"} />
                  <ModelRow label="Confidence" value={aiConfidence != null ? `${aiConfidence}%` : "Unavailable"} />
                  <ModelRow label="Reason" value={scan.ai_analysis ? scan.ai_analysis.split("\n")[0] : "Unavailable"} />
                </div>
              </section>

              {/* Disease Predictions */}
              {diseaseRisks && Object.keys(diseaseRisks).length > 0 && (
                <section>
                  <h3 className="text-sm font-bold font-heading uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                    <Bug className="w-4 h-4" /> Disease Predictions
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(diseaseRisks).sort(([, a], [, b]) => b - a).map(([key, risk]) => {
                      const name = key === "hepatitisA" ? "Hepatitis A" : key.charAt(0).toUpperCase() + key.slice(1);
                      const riskColor = risk < 15 ? "bg-safe" : risk < 40 ? "bg-warning" : "bg-danger";
                      return (
                        <div key={key} className="flex items-center gap-3 p-2.5 rounded-lg glass border border-border/50">
                          <span className="text-sm font-medium flex-1">{name}</span>
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${riskColor}`} style={{ width: `${risk}%` }} />
                          </div>
                          <span className="text-sm font-bold w-10 text-right">{risk}%</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              {recommendations && (
                <section>
                  <h3 className="text-sm font-bold font-heading uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> Recommendations
                  </h3>
                  <div className="space-y-3">
                    {REC_SECTIONS.map(({ key, label }) => {
                      const items = recommendations[key];
                      if (!items || (Array.isArray(items) && items.length === 0)) return null;
                      return (
                        <div key={key} className="rounded-xl glass border border-border/50 p-3">
                          <p className="text-xs font-semibold mb-2">{label}</p>
                          <ul className="space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className="text-[13px] text-foreground/80 flex items-start gap-1.5">
                                <span className="text-primary mt-0.5">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    {recommendations.whenToVisitDoctor && (
                      <div className="rounded-xl bg-warning/5 border border-warning/15 p-3">
                        <p className="text-xs font-semibold mb-1 text-warning">When to Visit a Doctor</p>
                        <p className="text-[13px] text-foreground/80">{recommendations.whenToVisitDoctor}</p>
                      </div>
                    )}
                    {recommendations.emergencyAdvice && (
                      <div className="rounded-xl bg-danger/5 border border-danger/15 p-3">
                        <p className="text-xs font-semibold mb-1 text-danger">Emergency Advice</p>
                        <p className="text-[13px] text-foreground/80">{recommendations.emergencyAdvice}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Timeline & Processing Time */}
              <section>
                <h3 className="text-sm font-bold font-heading uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Timeline
                </h3>
                <div className="rounded-xl glass border border-border/50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{moment(scan.created_date).format("lll")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Updated</p>
                      <p className="text-sm font-medium">{moment(scan.updated_date).format("lll")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing Time</p>
                      <p className="text-sm font-medium">{inferenceTime || "Unavailable"}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 flex gap-3">
              <button
                onClick={() => { onOpenChange(false); onNavigate(scan.id); }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <FileText className="w-4 h-4" /> View Full Report
              </button>
              <button
                onClick={() => onDownload(scan)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, value, capitalize }) {
  return (
    <div className="rounded-lg glass border border-border/50 p-2.5">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function ModelRow({ label, value }) {
  const isUnavailable = value === "Unavailable" || value === "No prediction available";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-right ${isUnavailable ? "text-muted-foreground/60" : "text-foreground"}`}>{value}</span>
    </div>
  );
}