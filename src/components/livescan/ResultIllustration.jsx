import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const RING_COLORS = {
  safe: "border-emerald-400/30",
  moderate: "border-amber-400/30",
  danger: "border-rose-400/30",
};

const DROP_COLORS = {
  safe: { c1: "#10b981", c2: "#06b6d4" },
  moderate: { c1: "#f59e0b", c2: "#f97316" },
  danger: { c1: "#ef4444", c2: "#f43f5e" },
};

/**
 * Displays a water drop SVG illustration that changes color
 * based on the water scan risk level. No AI-generated images.
 */
export default function ResultIllustration({ riskLevel }) {
  const ringClass = RING_COLORS[riskLevel] || RING_COLORS.safe;
  const colors = DROP_COLORS[riskLevel] || DROP_COLORS.safe;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0"
    >
      <div className="absolute inset-0 blur-2xl opacity-30 rounded-3xl" style={{ background: `linear-gradient(135deg, ${colors.c1}, ${colors.c2})` }} />

      <div className={`relative rounded-3xl overflow-hidden border-2 ${ringClass} bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm shadow-lg`}>
        <AnimatePresence mode="wait">
          <motion.svg
            key={riskLevel}
            viewBox="0 0 200 200"
            className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <defs>
              <linearGradient id={`dropGrad-${riskLevel}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.c1} />
                <stop offset="100%" stopColor={colors.c2} />
              </linearGradient>
            </defs>
            <path
              d="M100 30 C100 30, 55 90, 55 130 C55 160, 75 180, 100 180 C125 180, 145 160, 145 130 C145 90, 100 30, 100 30 Z"
              fill={`url(#dropGrad-${riskLevel})`}
              opacity="0.85"
            />
            <ellipse cx="82" cy="110" rx="12" ry="20" fill="white" opacity="0.4" />
            <path d="M65 145 Q100 155, 135 145" fill="none" stroke={colors.c1} strokeWidth="2" opacity="0.3" strokeLinecap="round" />
          </motion.svg>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}