import React from "react";
import { motion } from "framer-motion";
import TiltCard from "@/components/TiltCard";
import { FeatureIconAI, FeatureIconVoice, FeatureIconLanguage, FeatureIconIoT } from "@/components/illustrations/FeatureIcons";

const features = [
  {
    Illustration: FeatureIconAI,
    title: "AI Disease Prediction",
    desc: "Predicts water-borne diseases like Cholera, Typhoid, and Dysentery before they affect your family.",
    bgClass: "bg-purple-500/10",
    borderClass: "hover:border-purple-500/30",
  },
  {
    Illustration: FeatureIconVoice,
    title: "Aqua Voice Guide",
    desc: "Your personal AI health companion that speaks naturally in your language and guides you through every step.",
    bgClass: "bg-cyan-500/10",
    borderClass: "hover:border-cyan-500/30",
  },
  {
    Illustration: FeatureIconLanguage,
    title: "Regional Language Support",
    desc: "Full multilingual support across 7 Indian languages with native accents and natural pronunciation.",
    bgClass: "bg-emerald-500/10",
    borderClass: "hover:border-emerald-500/30",
  },
  {
    Illustration: FeatureIconIoT,
    title: "Real-Time IoT Monitoring",
    desc: "Live ESP32 sensor data for pH, TDS, turbidity, and temperature — analyzed instantly by AI.",
    bgClass: "bg-amber-500/10",
    borderClass: "hover:border-amber-500/30",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {features.map((f, i) => {
        const Illustration = f.Illustration;
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <TiltCard className={`premium-card p-6 group ${f.borderClass}`} intensity={5}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${f.bgClass}`}>
                <Illustration className="w-9 h-9" />
              </div>
              <h3 className="font-heading font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}