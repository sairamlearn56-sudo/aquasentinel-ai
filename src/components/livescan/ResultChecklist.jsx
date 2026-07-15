import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { RecIconBoilWater, RecIconDoctor, RecIconEmergency } from "@/components/illustrations/RecommendationIcons";

export default function ResultChecklist({ recommendations, riskLevel }) {
  const { immediatePrecautions, waterTreatment, whenToVisitDoctor, emergencyAdvice } = recommendations;

  const sections = [
    { title: "Immediate Precautions", icon: AlertTriangle, items: immediatePrecautions, color: riskLevel === "safe" ? "text-safe" : "text-warning" },
    { title: "Water Treatment", RecIcon: RecIconBoilWater, items: waterTreatment, color: "text-primary" },
    { title: "When to Visit a Doctor", RecIcon: RecIconDoctor, items: [whenToVisitDoctor], color: "text-safe" },
    { title: "Emergency Advice", RecIcon: RecIconEmergency, items: [emergencyAdvice], color: "text-danger" },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="premium-card p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-muted/20 ${section.color}`}>
              {section.RecIcon ? <section.RecIcon className="w-6 h-6" /> : section.icon ? <section.icon className="w-6 h-6" /> : null}
            </div>
            <h3 className="font-heading font-semibold text-sm">{section.title}</h3>
          </div>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${section.color}`} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}