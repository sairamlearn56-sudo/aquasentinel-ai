import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ILLUSTRATIONS = {
  safe: "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/8d9aa776c_generated_image.png",
  moderate: "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/53c2e24bd_generated_image.png",
  danger: "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/4c99f9c2d_generated_image.png",
};

const RING_COLORS = {
  safe: "border-emerald-400/30",
  moderate: "border-amber-400/30",
  danger: "border-rose-400/30",
};

/**
 * Displays a dynamic 3D healthcare illustration that changes
 * based on the water scan risk level.
 */
export default function ResultIllustration({ riskLevel }) {
  const src = ILLUSTRATIONS[riskLevel] || ILLUSTRATIONS.safe;
  const ringClass = RING_COLORS[riskLevel] || RING_COLORS.safe;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0"
    >
      {/* Glow behind illustration */}
      <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl" />

      <div className={`relative rounded-3xl overflow-hidden border-2 ${ringClass} bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm shadow-lg`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={src}
            src={src}
            alt={`Water safety illustration — ${riskLevel}`}
            className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Subtle inner glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-3xl" />
      </div>
    </motion.div>
  );
}