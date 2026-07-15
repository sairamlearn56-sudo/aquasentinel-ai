import React from "react";
import { motion } from "framer-motion";

const COLOR_MAP = {
  primary: "text-cyan-400 bg-cyan-500/10",
  safe: "text-emerald-400 bg-emerald-500/10",
  warning: "text-amber-400 bg-amber-500/10",
  danger: "text-rose-400 bg-rose-500/10",
  teal: "text-teal-400 bg-teal-500/10",
  purple: "text-purple-400 bg-purple-500/10",
};

export default function InvestigationSection({
  icon: Icon,
  title,
  number,
  color = "primary",
  delay = 0,
  children,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="premium-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        {number && (
          <span className="text-xs font-bold text-muted-foreground/50 tabular-nums">
            {String(number).padStart(2, "0")}
          </span>
        )}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[color] || COLOR_MAP.primary}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-heading font-semibold text-lg">{title}</h2>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed space-y-3">{children}</div>
    </motion.div>
  );
}