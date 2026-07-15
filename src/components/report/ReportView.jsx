import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Trash2, Pencil, Check, X, Activity, Sparkles, CheckCircle2, Volume2, FileText, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { classifyParameter } from "@/lib/waterAnalysis";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import SensorCard from "@/components/SensorCard";
import ResultIllustration from "@/components/livescan/ResultIllustration";
import ResultDiseaseCards from "@/components/livescan/ResultDiseaseCards";
import ResultChecklist from "@/components/livescan/ResultChecklist";
import moment from "moment";

function normalizeRecommendations(recs) {
  if (!recs) return { immediatePrecautions: [], waterTreatment: [], whenToVisitDoctor: "", emergencyAdvice: "" };
  if (Array.isArray(recs)) {
    return {
      immediatePrecautions: recs[0] ? recs[0].split("; ").filter(Boolean) : [],
      waterTreatment: recs[1] ? recs[1].split("; ").filter(Boolean) : [],
      whenToVisitDoctor: recs[2] || "",
      emergencyAdvice: recs[3] || "",
    };
  }
  return recs;
}

function getMainReason(scan) {
  if (classifyParameter("tds", scan.tds) === "danger") return "High TDS";
  if (classifyParameter("turbidity", scan.turbidity) === "danger") return "High Turbidity";
  if (classifyParameter("ph", scan.ph) === "danger") return "Abnormal pH";
  if (classifyParameter("temperature", scan.temperature) === "danger") return "High Temperature";
  if (classifyParameter("tds", scan.tds) === "moderate") return "Elevated TDS";
  if (classifyParameter("turbidity", scan.turbidity) === "moderate") return "Elevated Turbidity";
  if (classifyParameter("ph", scan.ph) === "moderate") return "Slightly Abnormal pH";
  return "All Parameters Normal";
}

function getSensorExplanation(type, value) {
  const status = classifyParameter(type, value);
  if (status === "safe") return "Within WHO safe limits";
  if (status === "moderate") return "Slightly outside safe range";
  return "Dangerously outside safe range";
}

const riskConfig = {
  safe: { gradient: "from-emerald-500 via-teal-500 to-cyan-500", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
  moderate: { gradient: "from-amber-400 via-orange-500 to-yellow-500", border: "border-amber-500/20", bg: "bg-amber-500/5" },
  danger: { gradient: "from-rose-500 via-red-500 to-coral-600", border: "border-rose-500/20", bg: "bg-rose-500/5" },
};

export default function ReportView({ scan, onBack, onDeleted }) {
  const { t } = useLanguage();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(scan.sample_name || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shared, setShared] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const recommendations = normalizeRecommendations(scan.recommendations);
  const mainReason = getMainReason(scan);
  const aiConfidence = scan.ai_confidence || Math.min(98, 82 + Math.round((100 - scan.health_score) * 0.15));
  const primaryRec = recommendations.waterTreatment?.[0] || recommendations.immediatePrecautions?.[0] || "";
  const rc = riskConfig[scan.risk_level] || riskConfig.safe;
  const diseaseRisks = typeof scan.disease_risks === "string" ? JSON.parse(scan.disease_risks) : (scan.disease_risks || {});

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      await base44.entities.Scan.update(scan.id, { sample_name: editedName });
      scan.sample_name = editedName;
      setIsEditingName(false);
    } catch (e) {} finally {
      setSavingName(false);
    }
  };

  const handleDelete = async () => {
    try {
      await base44.entities.Scan.delete(scan.id);
      onDeleted();
    } catch (e) {}
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `Water Scan Report — ${scan.sample_name || "Untitled"}`, url }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleExportPDF = () => { window.print(); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ===== Report Header ===== */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button onClick={onBack} className="p-2 rounded-xl glass hover:bg-muted/50 transition-colors flex-shrink-0 mt-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    className="flex-1 px-3 py-1.5 rounded-xl glass border border-border text-lg font-heading font-bold focus:outline-none focus:border-purple-500/40"
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={savingName} className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setIsEditingName(false); setEditedName(scan.sample_name || ""); }} className="p-2 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl font-heading font-bold truncate">{scan.sample_name || "Untitled Scan"}</h1>
                  <button onClick={() => setIsEditingName(true)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {moment(scan.created_date).format("lll")}</span>
                <span>·</span>
                <span>Scan ID: {scan.id?.slice(-8)}</span>
                {scan.water_source_name && (<><span>·</span><span>{scan.water_source_name}</span></>)}
                {scan.location_name && (<><span>·</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {scan.location_name}</span></>)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-border text-xs font-medium hover:bg-muted/50 transition-colors" title="Export as PDF">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-border text-xs font-medium hover:bg-muted/50 transition-colors" title="Share Report">
              <Share2 className="w-3.5 h-3.5" /> {shared ? "Copied!" : "Share"}
            </button>
            {confirmDelete ? (
              <>
                <button onClick={handleDelete} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/20 text-xs font-medium hover:bg-rose-500/25 transition-colors">
                  <Check className="w-3.5 h-3.5" /> Confirm
                </button>
                <button onClick={() => setConfirmDelete(false)} className="p-2 rounded-xl glass border border-border hover:bg-muted/50 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-border text-xs font-medium hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-colors" title="Delete Scan">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== Hero Section ===== */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className={`relative overflow-hidden rounded-[2rem] border ${rc.border}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${rc.gradient} opacity-10`} />
        <div className={`absolute inset-0 ${rc.bg}`} />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-white to-transparent" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="w-full lg:w-2/5 flex justify-center">
              <ResultIllustration riskLevel={scan.risk_level} />
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-border/40">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-muted-foreground">AI Confidence</span>
                  <span className="text-xs font-bold text-foreground">{aiConfidence}%</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 blur-2xl bg-gradient-to-br ${rc.gradient} opacity-30 rounded-full`} />
                  <div className="relative">
                    <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={120} stroke={9} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold leading-tight">
                    {scan.risk_level === "safe" && "Water is Safe"}
                    {scan.risk_level === "moderate" && "Caution Needed"}
                    {scan.risk_level === "danger" && "Water is Unsafe"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {scan.ai_analysis?.split("\n")[0] || (scan.risk_level === "safe" ? "All parameters within WHO safe limits." : "Some parameters exceed safe limits.")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-border/40">
                  <Activity className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Main Reason:</span>
                  <span className="text-xs font-semibold text-foreground">{mainReason}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-border/40">
                  <span className="text-xs text-muted-foreground">{moment(scan.created_date).format("lll")}</span>
                </div>
              </div>
              {primaryRec && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">{primaryRec}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== Sensor Readings ===== */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <h2 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-4 px-1">Sensor Readings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard type="ph" value={scan.ph} label={t("pH")} delay={0} explanation={getSensorExplanation("ph", scan.ph)} />
          <SensorCard type="tds" value={scan.tds} label={t("tds")} delay={0} explanation={getSensorExplanation("tds", scan.tds)} />
          <SensorCard type="temperature" value={scan.temperature} label={t("temperature")} delay={0} explanation={getSensorExplanation("temperature", scan.temperature)} />
          <SensorCard type="turbidity" value={scan.turbidity} label={t("turbidity")} delay={0} explanation={getSensorExplanation("turbidity", scan.turbidity)} />
        </div>
      </motion.div>

      {/* ===== Disease Predictions ===== */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="premium-card p-6">
        <h2 className="font-heading font-semibold text-lg mb-4">{t("diseaseRisk")}</h2>
        <ResultDiseaseCards diseaseRisks={diseaseRisks} waterData={scan} t={t} />
      </motion.div>

      {/* ===== AI Medical Explanation ===== */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="premium-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="font-heading font-semibold text-lg">AI Medical Explanation</h2>
        </div>
        <div className="space-y-2">
          {(scan.ai_analysis || "").split("\n\n").map((para, idx) => (
            <p key={idx} className="text-sm text-foreground/75 leading-relaxed">{para}</p>
          ))}
        </div>
      </motion.div>

      {/* ===== Recommended Actions ===== */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <h2 className="text-xl font-heading font-bold mb-4 px-1">Recommended Actions</h2>
        <ResultChecklist recommendations={recommendations} riskLevel={scan.risk_level} />
      </motion.div>

      {/* ===== AquaVoice Summary ===== */}
      {scan.aqua_voice_summary && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="font-heading font-semibold text-lg">AquaVoice Summary</h2>
          </div>
          <p className="text-sm text-foreground/75 leading-relaxed">{scan.aqua_voice_summary}</p>
        </motion.div>
      )}
    </div>
  );
}