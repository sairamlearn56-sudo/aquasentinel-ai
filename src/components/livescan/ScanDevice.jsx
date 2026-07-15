import React from "react";
import { motion } from "framer-motion";
import AquaRobotCharacter from "@/components/AquaRobotCharacter";

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
      {/* Inner glowing core with mascot */}
      <motion.div
        className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/15 to-aqua/5 flex items-center justify-center overflow-hidden"
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AquaRobotCharacter
          mood="idle"
          showLegs={false}
          className="h-[85%] w-auto"
        />
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