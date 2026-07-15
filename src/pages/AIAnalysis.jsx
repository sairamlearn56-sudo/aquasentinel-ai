import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileSearch,
  ShieldCheck,
  FileText,
  Search,
  HelpCircle,
  Microscope,
  HeartPulse,
  ListChecks,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Radio,
  Droplets,
  Thermometer,
  FlaskConical,
  Waves,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import InvestigationSection from "@/components/investigation/InvestigationSection";
import { generateInvestigationReport } from "@/lib/investigationReport";
import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";
import moment from "moment";

export default function AIAnalysis() {
  const { t } = useLanguage();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await base44.entities.Scan.list("-created_date", 1);
        if (results && results.length > 0) setScan(results[0]);
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

  if (!scan) {
    return (
      <EmptyState
        title={t("noScansYet")}
        description={t("noScansYetDesc")}
        action={
          <Link
            to="/monitor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            <Radio className="w-5 h-5" />
            {t("startMonitoring")}
          </Link>
        }
      />
    );
  }

  const report = generateInvestigationReport(scan);
  const riskColor =
    scan.risk_level === "safe" ? "safe" : scan.risk_level === "moderate" ? "warning" : "danger";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-aqua flex items-center justify-center shadow-lg shadow-primary/20">
            <FileSearch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Water Investigation Report</h1>
            <p className="text-xs text-muted-foreground">
              Comprehensive AI analysis of your latest water scan
            </p>
          </div>
        </div>
      </motion.div>

      {/* ===== 1. Overall Water Status ===== */}
      <InvestigationSection icon={ShieldCheck} title="Overall Water Status" number={1} color={riskColor} delay={0.05}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={110} stroke={8} />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} />
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <FileSearch className="w-3 h-3" />
                AI Confidence: {report.overallStatus.aiConfidence}%
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">{report.overallStatus.conclusion}</p>
          </div>
        </div>
      </InvestigationSection>

      {/* ===== 2. Scan Information ===== */}
      <InvestigationSection icon={FileText} title="Scan Information" number={2} color="primary" delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={Radio} label="Date & Time" value={moment(scan.created_date).format("MMM D, YYYY · h:mm A")} />
          <InfoRow icon={Droplets} label="Water Source" value={report.scanInfo.waterSource} />
          <InfoRow icon={MapPin} label="Location" value={report.scanInfo.locationName} />
          <InfoRow
            icon={Waves}
            label="GPS Coordinates"
            value={
              scan.latitude && scan.longitude
                ? `${scan.latitude.toFixed(4)}, ${scan.longitude.toFixed(4)}`
                : "Not available"
            }
          />
        </div>
      </InvestigationSection>

      {/* ===== 3. What Happened? ===== */}
      <InvestigationSection icon={Search} title="What Happened?" number={3} color="primary" delay={0.15}>
        <p>{report.whatHappened}</p>
      </InvestigationSection>

      {/* ===== 4. Why Did This Happen? ===== */}
      <InvestigationSection icon={HelpCircle} title="Why Did This Happen?" number={4} color="warning" delay={0.2}>
        <div className="whitespace-pre-line">{report.whyHappened}</div>
      </InvestigationSection>

      {/* ===== 5. What Is Happening Inside the Water? ===== */}
      <InvestigationSection icon={Microscope} title="What Is Happening Inside the Water?" number={5} color="purple" delay={0.25}>
        <div className="whitespace-pre-line">{report.insideWater}</div>
      </InvestigationSection>

      {/* ===== 6. Health Impact ===== */}
      <InvestigationSection icon={HeartPulse} title="Health Impact" number={6} color="danger" delay={0.3}>
        <div className="space-y-4">
          {/* Vulnerable group */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-danger/5 border border-danger/15">
            <HeartPulse className="w-5 h-5 text-danger flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                Most at risk: {report.healthImpact.vulnerableGroup}
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-danger/15 text-danger">
                  {report.healthImpact.vulnerabilityLevel} Risk
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {report.healthImpact.specialNote}
              </p>
            </div>
          </div>
          {/* Disease risks */}
          <p>{report.healthImpact.diseaseText}</p>
        </div>
      </InvestigationSection>

      {/* ===== 7. Recommended Actions ===== */}
      <InvestigationSection icon={ListChecks} title="Recommended Actions" number={7} color="safe" delay={0.35}>
        <div className="space-y-2">
          {report.recommendedActions.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-safe/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-safe">{idx + 1}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{rec.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </InvestigationSection>

      {/* ===== 8. What Happens If Ignored? ===== */}
      <InvestigationSection
        icon={AlertTriangle}
        title="What Happens If Ignored?"
        number={8}
        color={scan.risk_level === "safe" ? "safe" : "danger"}
        delay={0.4}
      >
        <p>{report.ifIgnored}</p>
      </InvestigationSection>

      {/* ===== 9. Location-Based AI Analysis ===== */}
      <InvestigationSection icon={MapPin} title="Location-Based AI Analysis" number={9} color="teal" delay={0.45}>
        <p>{report.locationAnalysis}</p>
      </InvestigationSection>

      {/* ===== 10. AI Improvement Prediction ===== */}
      <InvestigationSection icon={TrendingUp} title="AI Improvement Prediction" number={10} color="safe" delay={0.5}>
        <p>{report.improvementPrediction.text}</p>

        {/* Predicted metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <PredictionCard
            label="Predicted Score"
            value={`${report.improvementPrediction.predictedScore}/100`}
            icon={ShieldCheck}
          />
          <PredictionCard
            label="Predicted Status"
            value={report.improvementPrediction.predictedRisk}
            icon={TrendingUp}
          />
          <PredictionCard
            label="Contamination Reduction"
            value={report.improvementPrediction.contaminationReduction}
            icon={Microscope}
          />
        </div>

        {/* Treatment steps */}
        {report.improvementPrediction.treatments.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Expected Treatment Results
            </p>
            {report.improvementPrediction.treatments.map((tr, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-safe flex-shrink-0 mt-0.5">✓</span>
                <span className="text-muted-foreground">{tr}</span>
              </div>
            ))}
          </div>
        )}
      </InvestigationSection>

      {/* ===== Footer: Run New Scan ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="flex justify-center pt-4"
      >
        <Link
          to="/monitor"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-teal text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Radio className="w-5 h-5" />
          Run New Investigation
        </Link>
      </motion.div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function PredictionCard({ label, value, icon: Icon }) {
  return (
    <div className="p-3 rounded-xl bg-safe/5 border border-safe/15 text-center">
      <Icon className="w-4 h-4 text-safe mx-auto mb-1.5" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-safe">{value}</p>
    </div>
  );
}