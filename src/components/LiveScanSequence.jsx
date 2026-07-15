import React from "react";
import { motion } from "framer-motion";
import ScanDevice from "@/components/livescan/ScanDevice";

export default function LiveScanSequence({ stepText, progress, total = 20 }) {
  const isComplete = stepText.includes("Complete");
  const percent = Math.min((progress / total) * 100, 100);
  const isCollecting = stepText.startsWith("Reading");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[500px]">
      {/* Scanner device */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <ScanDevice size={160} showBeam={!isComplete} isComplete={isComplete} />
      </motion.div>

      {/* Signal waves (during reading collection) */}
      {isCollecting && (
        <div className="flex items-end gap-1 mb-6 h-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-primary"
              animate={{ height: [8, 24, 8] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

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
            animate={{ width: `${isComplete ? 100 : percent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isComplete ? "Done" : `${progress} / ${total} readings`}
        </p>
      </div>
    </div>
  );
}