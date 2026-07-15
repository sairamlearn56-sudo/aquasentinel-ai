import React from "react";
import { motion } from "framer-motion";
import { Droplet, Cpu, Brain, Activity, Volume2, ShieldCheck, ChevronRight, ChevronDown } from "lucide-react";

const steps = [
  { icon: Droplet, label: "Water Sample", color: "text-primary", bg: "bg-primary/10" },
  { icon: Cpu, label: "ESP32 Sensors", color: "text-warning", bg: "bg-warning/10" },
  { icon: Brain, label: "AI Analysis", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Activity, label: "Disease Prediction", color: "text-danger", bg: "bg-danger/10" },
  { icon: Volume2, label: "Voice Guidance", color: "text-teal", bg: "bg-teal/10" },
  { icon: ShieldCheck, label: "Stay Safe", color: "text-safe", bg: "bg-safe/10" },
];

export default function WorkflowSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-1 flex-wrap">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <React.Fragment key={step.label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${step.bg} border border-border transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                <Icon className={`w-7 h-7 ${step.color} relative z-10`} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center max-w-[80px]">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.12 + 0.1 }}
                className="text-muted-foreground/40 flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 lg:hidden" />
                <ChevronRight className="w-5 h-5 hidden lg:block" />
              </motion.div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}