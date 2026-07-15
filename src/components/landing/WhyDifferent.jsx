import React from "react";
import { motion } from "framer-motion";
import { Radio, BrainCircuit, Mic, Globe, ShieldCheck, Heart } from "lucide-react";
import TiltCard from "@/components/TiltCard";

const items = [
  { icon: Radio, label: "Real-time IoT", color: "text-warning", bg: "bg-warning/10" },
  { icon: BrainCircuit, label: "AI Disease Prediction", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Mic, label: "Voice Assistant", color: "text-primary", bg: "bg-primary/10" },
  { icon: Globe, label: "Regional Languages", color: "text-teal", bg: "bg-teal/10" },
  { icon: ShieldCheck, label: "Healthcare Guidance", color: "text-safe", bg: "bg-safe/10" },
  { icon: Heart, label: "Family Friendly", color: "text-danger", bg: "bg-danger/10" },
];

export default function WhyDifferent() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <TiltCard className="flex flex-col items-center gap-3 glass rounded-2xl p-5 border border-border text-center" intensity={5}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bg}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}