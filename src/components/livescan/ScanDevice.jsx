import React from "react";
import { motion } from "framer-motion";

export default function ScanDevice({ size = 192, showBeam = true, isComplete = false }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer rotating dashed ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {/* Middle counter-rotating ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-primary/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Pulsing ripple rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-primary/15"
          style={{ animation: `ripple 3s ease-out infinite`, animationDelay: `${i * 1}s` }}
        />
      ))}
      {/* Inner glowing core */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-aqua/10 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 48 48" className="w-16 h-16 text-primary" fill="none">
          <path d="M24 6 C24 6, 12 20, 12 30 C12 37, 17 42, 24 42 C31 42, 36 37, 36 30 C36 20, 24 6, 24 6 Z"
            fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M20 28 Q24 24, 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        </svg>
      </motion.div>
      {/* Sweeping scan beam */}
      {showBeam && !isComplete && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 h-0.5 origin-left"
            style={{ width: "50%", background: "linear-gradient(to right, hsl(194 100% 50%), transparent)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}