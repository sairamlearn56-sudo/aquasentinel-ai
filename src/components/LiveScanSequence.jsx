import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Radio } from "lucide-react";

export default function LiveScanSequence({ stepText, progress, total = 30 }) {
  const isComplete = stepText.includes("Complete");
  const percent = Math.min((progress / total) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[500px]">
      {/* Central animated sensor visual */}
      <div className="relative w-40 h-40 mb-10">
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            style={{
              animation: `ripple 3s ease-out infinite`,
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}
        {/* Center circle */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-aqua/10 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {isComplete ? (
            <CheckCircle2 className="w-12 h-12 text-safe" />
          ) : (
            <Radio className="w-10 h-10 text-primary animate-pulse" />
          )}
        </motion.div>
        {/* Orbiting dot */}
        {!isComplete && (
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/50" />
          </div>
        )}
      </div>

      {/* Current step text */}
      <motion.div
        key={stepText}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className={`text-2xl font-bold ${isComplete ? "text-safe" : "text-primary"}`}>
          {stepText}
        </h2>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-aqua rounded-full"
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {progress} / {total} readings
        </p>
      </div>
    </div>
  );
}