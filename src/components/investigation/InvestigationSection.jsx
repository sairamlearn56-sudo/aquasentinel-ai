import React from "react";
import { motion } from "framer-motion";

const COLOR_MAP = {
  primary: "text-primary bg-primary/10",
  safe: "text-safe bg-safe/10",
  warning: "text-warning bg-warning/10",
  danger: "text-danger bg-danger/10",
  teal: "text-teal bg-teal/10",
  purple: "text-purple bg-purple/10",
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
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        {number && (
          <span className="text-xs font-bold text-muted-foreground/60 tabular-nums">
            {String(number).padStart(2, "0")}
          </span>
        )}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[color] || COLOR_MAP.primary}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed space-y-3">{children}</div>
    </motion.div>
  );
}