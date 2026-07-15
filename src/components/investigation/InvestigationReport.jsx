import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Search,
  HelpCircle,
  FlaskConical,
  HeartPulse,
  Lightbulb,
  AlertTriangle,
  Bot,
  ArrowLeft,
} from "lucide-react";
import moment from "moment";
import HealthScoreRing from "@/components/HealthScoreRing";
import RiskBadge from "@/components/RiskBadge";
import InvestigationSection from "@/components/investigation/InvestigationSection";
import { generateInvestigationReport } from "@/lib/investigationReport";
import { useLanguage } from "@/lib/LanguageContext";

const SAFE_WATER_INFOGRAPHIC = "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/8b8b3c3d5_WhatsAppImage2026-07-16at122527AM1.jpg";
const CONTAMINATED_WATER_INFOGRAPHIC = "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/f60cbfa04_WhatsAppImage2026-07-16at122527AM.jpg";

export default function InvestigationReport({ scan, onBack }) {
  const { t } = useLanguage();
  const report = generateInvestigationReport(scan);
  const riskColor = scan.risk_level === "safe" ? "safe" : scan.risk_level === "moderate" ? "warning" : "danger";
  const isSafe = scan.risk_level === "safe";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Scans
      </button>

      {/* 1. Overall Status */}
      <InvestigationSection icon={ShieldCheck} title="Overall Status" number={1} color={riskColor} delay={0.05}>
        <div className="flex items-center gap-5">
          <HealthScoreRing score={scan.health_score} riskLevel={scan.risk_level} size={90} stroke={7} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <RiskBadge level={scan.risk_level} label={t(scan.risk_level)} size="sm" />
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <Bot className="w-3 h-3" />
                {report.overallStatus.aiConfidence}% confidence
              </span>
            </div>
            <BulletList
              items={[
                `Water Quality Score: ${scan.health_score}/100`,
                `Risk Level: ${scan.risk_level.charAt(0).toUpperCase() + scan.risk_level.slice(1)}`,
              ]}
              color={riskColor}
            />
          </div>
        </div>
      </InvestigationSection>

      {/* 2. Scan Details */}
      <InvestigationSection icon={MapPin} title="Scan Details" number={2} color="primary" delay={0.1}>
        <BulletList
          items={[
            `Date & Time: ${moment(scan.created_date).format("MMM D, YYYY · h:mm A")}`,
            `Water Source: ${report.scanInfo.waterSource}`,
            `Location: ${report.scanInfo.locationName}`,
          ]}
        />
      </InvestigationSection>

      {/* 3. What Happened? */}
      <InvestigationSection icon={Search} title="What Happened?" number={3} color="primary" delay={0.15}>
        <BulletList items={report.whatHappened} color="primary" />
      </InvestigationSection>

      {/* 4. Why Did This Happen? */}
      <InvestigationSection icon={HelpCircle} title="Why Did This Happen?" number={4} color="warning" delay={0.2}>
        <BulletList items={report.whyHappened} color="warning" />
      </InvestigationSection>

      {/* 5. What's Happening Inside the Water? */}
      <InvestigationSection icon={FlaskConical} title="What's Happening Inside the Water?" number={5} color="purple" delay={0.25}>
        <BulletList items={report.insideWater} color="purple" />
      </InvestigationSection>

      {/* 6. Health Impact — with educational infographic */}
      <InvestigationSection icon={HeartPulse} title="Health Impact" number={6} color="danger" delay={0.3}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Possible Health Effects</p>
        <BulletList items={report.healthImpact.effects} color="danger" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Who Is Most at Risk</p>
        <BulletList items={report.healthImpact.atRisk} color="danger" />

        {/* Educational Infographic */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-4 rounded-2xl overflow-hidden bg-white p-2 shadow-lg"
        >
          <img
            src={isSafe ? SAFE_WATER_INFOGRAPHIC : CONTAMINATED_WATER_INFOGRAPHIC}
            alt={isSafe ? "Benefits of drinking safe, clean water" : "Health risks of drinking contaminated water"}
            className="w-full rounded-xl"
          />
        </motion.div>
      </InvestigationSection>

      {/* 7. Recommended Actions */}
      <InvestigationSection icon={Lightbulb} title="Recommended Actions" number={7} color="safe" delay={0.35}>
        <div className="space-y-2">
          {report.recommendedActions.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20">
              <div className="w-6 h-6 rounded-lg bg-safe/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-safe">{idx + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{rec.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rec.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </InvestigationSection>

      {/* 8. If Ignored */}
      <InvestigationSection
        icon={AlertTriangle}
        title="If Ignored"
        number={8}
        color={isSafe ? "safe" : "danger"}
        delay={0.4}
      >
        <BulletList items={report.ifIgnored} color={isSafe ? "safe" : "danger"} />
      </InvestigationSection>

      {/* 9. AI Suggestions */}
      <InvestigationSection icon={Bot} title="AI Suggestions" number={9} color="primary" delay={0.45}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best Treatment Method</p>
        <p className="text-sm text-foreground/80">{report.aiSuggestions.bestTreatment}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Preventive Measures</p>
        <BulletList items={report.aiSuggestions.preventiveMeasures} color="primary" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Next Test</p>
        <p className="text-sm text-foreground/80">{report.aiSuggestions.nextTest}</p>
      </InvestigationSection>
    </div>
  );
}

function BulletList({ items, color = "primary" }) {
  const dotColor = {
    primary: "bg-primary",
    safe: "bg-safe",
    warning: "bg-warning",
    danger: "bg-danger",
    purple: "bg-purple",
    teal: "bg-teal",
  };
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm">
          <span className={`flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${dotColor[color] || dotColor.primary}`} />
          <span className="text-foreground/80 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}