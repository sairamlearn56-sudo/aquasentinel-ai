import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AquaRobotCharacter from "@/components/AquaRobotCharacter";

export default function LandingLogo() {
  return (
    <div className="relative w-44 h-56 sm:w-52 sm:h-64 flex items-center justify-center">
      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-aqua/20"
          style={{ width: "85%", height: "60%" }}
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
        />
      ))}

      {/* Glow orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua/25 to-primary/10 blur-2xl" />

      {/* Robot mascot */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full"
      >
        <AquaRobotCharacter
          mood="waving"
          className="h-full w-auto drop-shadow-2xl"
        />
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
        className="absolute bottom-8 left-4 text-primary"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>
    </div>
  );
}