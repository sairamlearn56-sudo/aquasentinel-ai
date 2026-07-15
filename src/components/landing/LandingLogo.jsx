import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LandingLogo() {
  return (
    <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-aqua/20"
          style={{ width: "100%", height: "100%" }}
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
        />
      ))}

      {/* Glow orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/25 to-primary/10 blur-2xl" />

      {/* Water drop with AI sparkle */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <svg viewBox="0 0 120 120" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-2xl">
          <defs>
            <linearGradient id="logoDrop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(190, 85%, 68%)" />
              <stop offset="50%" stopColor="hsl(185, 80%, 50%)" />
              <stop offset="100%" stopColor="hsl(180, 75%, 35%)" />
            </linearGradient>
            <linearGradient id="logoShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M60 10 C60 10, 25 48, 25 76 C25 94, 41 106, 60 106 C79 106, 95 94, 95 76 C95 48, 60 10, 60 10 Z"
            fill="url(#logoDrop)"
          />
          {/* Shine highlight */}
          <ellipse cx="45" cy="60" rx="10" ry="18" fill="url(#logoShine)" />
          {/* Inner AI pulse dot */}
          <circle cx="60" cy="76" r="14" fill="white" opacity="0.15" />
          <motion.circle
            cx="60"
            cy="76"
            r="7"
            fill="white"
            opacity="0.9"
            animate={{ scale: [1, 1.3, 1], opacity: [0.9, 0.6, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Sparkle accents */}
      <motion.div
        className="absolute top-2 right-6 text-aqua"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-4 text-primary"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>
    </div>
  );
}