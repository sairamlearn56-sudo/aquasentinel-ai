import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/lib/VoiceContext";
import AquaRobotCharacter, { MASCOT_GLOW_MAP } from "@/components/AquaRobotCharacter";

/**
 * Aqua — the official mascot of AquaSentinel AI.
 * Wraps the shared AquaRobotCharacter with mood-based outer effects:
 * glow, sparkles, holographic screens, data particles, listening
 * indicator, and speaking sound waves.
 */
export default function AquaMascot({ mood, onClick }) {
  const { isSpeaking, isLoading } = useVoice();
  const isTalking = isSpeaking || isLoading;

  const glow = MASCOT_GLOW_MAP[mood] || MASCOT_GLOW_MAP.idle;

  return (
    <div className="relative cursor-pointer group" onClick={onClick}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: glow.color }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing ring for result moods */}
      {(mood === "safe" || mood === "moderate" || mood === "danger") && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: glow.ring }}
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Sparkles for safe mood */}
      <AnimatePresence>
        {mood === "safe" && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  top: `${15 + i * 12}%`,
                  left: i % 2 === 0 ? "-8%" : "92%",
                }}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="hsl(48, 95%, 65%)">
                  <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating + breathing wrapper */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          animate={{ scaleY: [1, 1.03, 1], scaleX: [1, 0.98, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <AquaRobotCharacter
            mood={mood}
            isTalking={isTalking}
            showLegs={false}
            className="w-24 sm:w-28 drop-shadow-lg group-hover:drop-shadow-xl transition-all"
          />
        </motion.div>
      </motion.div>

      {/* Holographic screens (analyzing + thinking) */}
      <AnimatePresence>
        {(mood === "analyzing" || mood === "thinking") && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -10, y: 10 }}
              animate={{ opacity: 1, x: -24, y: [0, -3, 0] }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, y: { duration: 2, repeat: Infinity } }}
              className="absolute top-6 left-0 w-11 h-9 rounded-lg border border-aqua/40 bg-aqua/10 backdrop-blur-sm"
            >
              <div className="p-1 space-y-0.5">
                <div className="h-0.5 bg-aqua/60 rounded w-3/4" />
                <div className="h-0.5 bg-aqua/40 rounded w-1/2" />
                <div className="h-0.5 bg-aqua/50 rounded w-2/3" />
                <div className="h-0.5 bg-aqua/30 rounded w-3/5" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10, y: 10 }}
              animate={{ opacity: 1, x: 96, y: [0, -3, 0] }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, delay: 0.2, y: { duration: 2, repeat: Infinity, delay: 0.5 } }}
              className="absolute top-10 left-0 w-11 h-9 rounded-lg border border-aqua/40 bg-aqua/10 backdrop-blur-sm"
            >
              <div className="p-1 space-y-0.5">
                <div className="h-0.5 bg-aqua/50 rounded w-2/3" />
                <div className="h-0.5 bg-aqua/60 rounded w-3/4" />
                <div className="h-0.5 bg-aqua/30 rounded w-1/2" />
                <div className="h-0.5 bg-aqua/40 rounded w-3/5" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Data particles (thinking / analyzing) */}
      <AnimatePresence>
        {(mood === "thinking" || mood === "analyzing") && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-aqua/70 pointer-events-none"
                style={{ bottom: "15%", left: `${28 + i * 12}%` }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [-5, -35, -65], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Listening — mic pulse + blue ring */}
      <AnimatePresence>
        {mood === "listening" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400/50"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-1 -right-1"
            >
              <div className="relative">
                <motion.div
                  className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                    <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
                    <path d="M19 11a7 7 0 01-14 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Speaking sound waves */}
      <AnimatePresence>
        {isTalking && mood !== "analyzing" && mood !== "thinking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-6 right-0 flex items-end gap-0.5 h-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{ height: [4, 13, 4] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}