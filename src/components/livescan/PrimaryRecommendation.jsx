import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Flame, Filter, Ban, Droplets } from "lucide-react";

const CONFIG = {
  safe: {
    icon: CheckCircle2,
    title: "Drink Safe",
    subtitle: "Your water is safe to drink as-is",
    borderClass: "border-emerald-500/30",
    textClass: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    bgClass: "from-emerald-500/15 via-teal-500/5 to-transparent",
    glow: "shadow-emerald-500/10",
    chips: [{ icon: CheckCircle2, label: "Safe to Drink", color: "text-emerald-400" }],
  },
  moderate: {
    icon: Flame,
    title: "Boil Before Drinking",
    subtitle: "Boil water for 1-3 minutes, or use an RO filter",
    borderClass: "border-amber-500/30",
    textClass: "text-amber-400",
    iconBg: "bg-amber-500/15",
    bgClass: "from-amber-500/15 via-orange-500/5 to-transparent",
    glow: "shadow-amber-500/10",
    chips: [
      { icon: Flame, label: "Boil Water", color: "text-amber-400" },
      { icon: Filter, label: "RO Filter", color: "text-cyan-400" },
    ],
  },
  danger: {
    icon: Ban,
    title: "Avoid Drinking",
    subtitle: "Do not drink. Use sealed bottled water or boil thoroughly for 3+ minutes",
    borderClass: "border-rose-500/30",
    textClass: "text-rose-400",
    iconBg: "bg-rose-500/15",
    bgClass: "from-rose-500/15 via-red-500/5 to-transparent",
    glow: "shadow-rose-500/10",
    chips: [
      { icon: Ban, label: "Avoid Drinking", color: "text-rose-400" },
      { icon: Flame, label: "Boil 3+ min", color: "text-amber-400" },
      { icon: Droplets, label: "Use Bottled Water", color: "text-cyan-400" },
    ],
  },
};

export default function PrimaryRecommendation({ riskLevel }) {
  const c = CONFIG[riskLevel] || CONFIG.safe;
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`premium-card p-6 border-2 ${c.borderClass} bg-gradient-to-r ${c.bgClass} ${c.glow}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${c.iconBg} ${c.textClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-heading font-bold ${c.textClass}`}>{c.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{c.subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {c.chips.map((chip, i) => {
          const ChipIcon = chip.icon;
          return (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-border text-xs font-medium ${chip.color}`}
            >
              <ChipIcon className="w-3.5 h-3.5" />
              {chip.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}