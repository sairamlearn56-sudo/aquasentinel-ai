import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Mic, Globe, Radio } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Disease Prediction",
    desc: "Predicts water-borne diseases like Cholera, Typhoid, and Dysentery before they affect your family.",
    iconClass: "text-violet-400",
    bgClass: "bg-violet-500/10",
  },
  {
    icon: Mic,
    title: "Aqua Voice Guide",
    desc: "Your personal AI health companion that speaks naturally in your language and guides you through every step.",
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    icon: Globe,
    title: "Regional Language Support",
    desc: "Full multilingual support across 7 Indian languages with native accents and natural pronunciation.",
    iconClass: "text-teal",
    bgClass: "bg-teal/10",
  },
  {
    icon: Radio,
    title: "Real-Time IoT Monitoring",
    desc: "Live ESP32 sensor data for pH, TDS, turbidity, and temperature — analyzed instantly by AI.",
    iconClass: "text-warning",
    bgClass: "bg-warning/10",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="premium-card p-6 group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${f.bgClass}`}>
              <Icon className={`w-6 h-6 ${f.iconClass}`} />
            </div>
            <h3 className="font-bold text-base mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}