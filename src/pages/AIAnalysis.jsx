import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Stethoscope, Pill, Shield, Siren, Droplets, Thermometer, Activity, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import DiseaseRiskCard from "@/components/DiseaseRiskCard";
import EmptyState from "@/components/EmptyState";
import { DISEASE_INFO, classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";
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
          <Link to="/monitor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            {t("startMonitoring")}
          </Link>
        }
      />
    );
  }

  const diseaseKeys = Object.entries(scan.disease_risks || {}).filter(([, risk]) => risk > 10).map(([k]) => k);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-aqua flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{t("aiAnalysisTitle")}</h1>
        </div>
      </motion.div>

      {/* Score + Risk */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6"
      >
        <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={150} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-muted-foreground mb-2">{t("overallRisk")}</p>
          <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="lg" />
          <p className="text-xs text-muted-foreground mt-3">
            {t("recentScan")}: {moment(scan.created_date).format("MMM D, YYYY h:mm A")}
          </p>
        </div>
      </motion.div>

      {/* AI Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">AI Health Report</h2>
        </div>
        <div className="prose prose-sm max-w-none">
          {(scan.ai_analysis || "").split("\n\n").map((para, idx) => (
            <p key={idx} className="text-sm text-foreground/80 leading-relaxed mb-3 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Disease Risk Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          {t("diseaseRisk")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {Object.entries(scan.disease_risks || {}).map(([disease, risk], idx) => (
            <DiseaseRiskCard key={disease} name={disease} risk={risk} delay={idx * 60} t={t} />
          ))}
        </div>

        {/* Disease Details */}
        {diseaseKeys.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="font-medium text-sm text-muted-foreground">{t("possibleSymptoms")} & {t("treatment")}</h3>
            {diseaseKeys.map((disease, idx) => {
              const info = DISEASE_INFO[disease];
              if (!info) return null;
              return (
                <motion.div
                  key={disease}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="rounded-2xl border border-border p-5 bg-muted/20"
                >
                  <h4 className="font-semibold mb-3 text-primary">{t(disease)}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <DiseaseDetail label={t("symptoms")} content={info.symptoms} />
                    <DiseaseDetail label={t("transmission")} content={info.transmission} />
                    <DiseaseDetail label={t("prevention")} content={info.prevention} />
                    <DiseaseDetail label={t("treatment")} content={info.treatment} />
                    <DiseaseDetail label={t("recovery")} content={info.recovery} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Personalized Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-3xl p-6"
      >
        <h2 className="font-semibold text-lg mb-4">{t("recommendations")}</h2>
        
        {scan.recommendations && scan.recommendations.length >= 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RecCard
              icon={Shield}
              title={t("immediatePrecautions")}
              items={scan.recommendations[0].split("; ").filter(Boolean)}
              color="text-warning"
              bg="bg-warning/10"
            />
            <RecCard
              icon={Droplets}
              title={t("waterTreatment")}
              items={scan.recommendations[1].split("; ").filter(Boolean)}
              color="text-primary"
              bg="bg-primary/10"
            />
            <RecCard
              icon={Stethoscope}
              title={t("whenToVisitDoctor")}
              content={scan.recommendations[2]}
              color="text-teal"
              bg="bg-teal/10"
            />
            <RecCard
              icon={Siren}
              title={t("emergencyAdvice")}
              content={scan.recommendations[3]}
              color="text-danger"
              bg="bg-danger/10"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function DiseaseDetail({ label, content }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
      <p className="text-xs text-foreground/80 leading-relaxed">{content}</p>
    </div>
  );
}

function RecCard({ icon: Icon, title, items, content, color, bg }) {
  return (
    <div className={`rounded-2xl border border-border p-5 ${bg}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {items ? (
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-xs text-foreground/80 leading-relaxed flex gap-1.5">
              <span className={`flex-shrink-0 ${color}`}>•</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-foreground/80 leading-relaxed">{content}</p>
      )}
    </div>
  );
}