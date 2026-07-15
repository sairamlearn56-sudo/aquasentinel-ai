import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const RING_COLORS = {
  safe: "border-safe/30",
  moderate: "border-warning/30",
  danger: "border-danger/30",
};

const BG_COLORS = {
  safe: "bg-safe/5",
  moderate: "bg-warning/5",
  danger: "bg-danger/5",
};

/**
 * Displays a calm flat-illustration droplet character
 * that changes expression based on the water scan risk level.
 */
export default function ResultIllustration({ riskLevel }) {
  const ringClass = RING_COLORS[riskLevel] || RING_COLORS.safe;
  const bgClass = BG_COLORS[riskLevel] || BG_COLORS.safe;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0"
    >
      <div className={`relative rounded-xl overflow-hidden border-2 ${ringClass} ${bgClass}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={riskLevel}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {riskLevel === "safe" && <SafeDroplet />}
            {riskLevel === "moderate" && <ModerateDroplet />}
            {riskLevel === "danger" && <DangerDroplet />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ===== Safe: happy, reassured droplet ===== */
function SafeDroplet() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60">
      <defs>
        <linearGradient id="safeDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="180" rx="40" ry="5" fill="#000" opacity="0.08" />
      <path d="M100 25 C100 25, 50 85, 50 125 C50 155, 72 175, 100 175 C128 175, 150 155, 150 125 C150 85, 100 25, 100 25 Z"
        fill="url(#safeDropGrad)" stroke="#2DD4BF" strokeWidth="2" strokeLinejoin="round" />
      {/* Happy eyes (curved) */}
      <path d="M78 115 Q84 108, 90 115" fill="none" stroke="#0B1220" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M110 115 Q116 108, 122 115" fill="none" stroke="#0B1220" strokeWidth="3.5" strokeLinecap="round" />
      {/* Smile */}
      <path d="M82 135 Q100 148, 118 135" fill="none" stroke="#0B1220" strokeWidth="3.5" strokeLinecap="round" />
      {/* Sparkles */}
      <g opacity="0.5">
        <path d="M150 70 L152 75 L157 77 L152 79 L150 84 L148 79 L143 77 L148 75 Z" fill="#34D399" />
        <circle cx="160" cy="95" r="2" fill="#34D399" />
      </g>
      {/* Shine */}
      <ellipse cx="80" cy="80" rx="10" ry="18" fill="white" opacity="0.15" />
    </svg>
  );
}

/* ===== Moderate: cautious, neutral droplet ===== */
function ModerateDroplet() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60">
      <defs>
        <linearGradient id="modDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="180" rx="40" ry="5" fill="#000" opacity="0.08" />
      <path d="M100 25 C100 25, 50 85, 50 125 C50 155, 72 175, 100 175 C128 175, 150 155, 150 125 C150 85, 100 25, 100 25 Z"
        fill="url(#modDropGrad)" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
      {/* Neutral eyes (circles) */}
      <circle cx="84" cy="115" r="4" fill="#0B1220" />
      <circle cx="116" cy="115" r="4" fill="#0B1220" />
      {/* Slight frown / uncertain mouth */}
      <path d="M85 138 Q100 132, 115 138" fill="none" stroke="#0B1220" strokeWidth="3.5" strokeLinecap="round" />
      {/* Caution indicator */}
      <g opacity="0.4">
        <path d="M150 65 L162 85 L138 85 Z" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
        <line x1="150" y1="72" x2="150" y2="78" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="150" cy="81" r="1.5" fill="#F59E0B" />
      </g>
      {/* Shine */}
      <ellipse cx="80" cy="80" rx="10" ry="18" fill="white" opacity="0.15" />
    </svg>
  );
}

/* ===== Danger: concerned but composed droplet ===== */
function DangerDroplet() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60">
      <defs>
        <linearGradient id="dangerDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="180" rx="40" ry="5" fill="#000" opacity="0.08" />
      <path d="M100 25 C100 25, 50 85, 50 125 C50 155, 72 175, 100 175 C128 175, 150 155, 150 125 C150 85, 100 25, 100 25 Z"
        fill="url(#dangerDropGrad)" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />
      {/* Concerned eyes — slightly slanted eyebrows + round eyes */}
      <line x1="76" y1="105" x2="92" y2="110" stroke="#0B1220" strokeWidth="3" strokeLinecap="round" />
      <line x1="124" y1="105" x2="108" y2="110" stroke="#0B1220" strokeWidth="3" strokeLinecap="round" />
      <circle cx="84" cy="118" r="4" fill="#0B1220" />
      <circle cx="116" cy="118" r="4" fill="#0B1220" />
      {/* Small frown — composed, not panicked */}
      <path d="M85 142 Q100 136, 115 142" fill="none" stroke="#0B1220" strokeWidth="3.5" strokeLinecap="round" />
      {/* Calm shield indicator — reassuring, not alarming */}
      <g opacity="0.35">
        <path d="M148 65 L160 60 L160 72 Q160 80, 148 84 Q136 80, 136 72 L136 60 Z" fill="none" stroke="#F87171" strokeWidth="2" strokeLinejoin="round" />
        <path d="M143 72 L147 76 L154 68" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Shine */}
      <ellipse cx="80" cy="80" rx="10" ry="18" fill="white" opacity="0.15" />
    </svg>
  );
}