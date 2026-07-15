import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { RecIconBoilWater, RecIconDoctor, RecIconEmergency } from "@/components/illustrations/RecommendationIcons";
import { HEALTHCARE_IMAGES } from "@/lib/resultImages";

export default function ResultChecklist({ recommendations, riskLevel }) {
  const { immediatePrecautions, waterTreatment, whenToVisitDoctor, emergencyAdvice } = recommendations;

  const sections = [
    { title: "Immediate Precautions", icon: AlertTriangle, items: immediatePrecautions, color: riskLevel === "safe" ? "text-safe" : "text-warning", image: HEALTHCARE_IMAGES.boilingWater },
    { title: "Water Treatment", RecIcon: RecIconBoilWater, items: waterTreatment, color: "text-primary", image: HEALTHCARE_IMAGES.waterFilter },
    { title: "When to Visit a Doctor", RecIcon: RecIconDoctor, items: [whenToVisitDoctor], color: "text-safe", image: HEALTHCARE_IMAGES.medicalHelp },
    { title: "Emergency Advice", RecIcon: RecIconEmergency, items: [emergencyAdvice], color: "text-danger", image: HEALTHCARE_IMAGES.cleanWater },
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
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-border/30 shadow-sm">
              <img src={section.image} alt={section.title} className="w-full h-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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