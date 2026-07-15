import React from "react";
import { motion } from "framer-motion";

export default function PageLoader({ text = "Loading", subtext = "" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Animated water drop with ripple rings */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20 flex items-center justify-center"
      >
        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
        {/* Water drop */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-xl shadow-primary/30">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
            <path d="M12 2 C12 2, 5 9, 5 15 C5 18.866, 8.134 22, 12 22 C15.866 22, 19 18.866, 19 15 C19 9, 12 2, 12 2 Z" />
          </svg>
          {/* Shine */}
          <div className="absolute top-2 left-3 w-3 h-4 rounded-full bg-white/30 blur-sm" />
        </div>
      </motion.div>

      {/* Loading text */}
      <div className="text-center">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-medium text-muted-foreground"
        >
          {text}
          <span className="inline-flex">
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >.</motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >.</motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >.</motion.span>
          </span>
        </motion.p>
        {subtext && <p className="text-xs text-muted-foreground/60 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}