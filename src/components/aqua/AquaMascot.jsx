import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/lib/VoiceContext";

const HAPPY_IMAGE = "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/351c30065_happy.jpg";
const CONCERNED_IMAGE = "https://media.base44.com/images/public/6a574a21e1fc72b4f71b88d8/97cff114b_sad.jpg";

/**
 * Aqua — the official AI assistant character.
 * Uses uploaded character images with expression switching,
 * floating, breathing, blinking, lip-sync pulse, and thinking indicators.
 */
export default function AquaMascot({ mood, onClick }) {
  const { isSpeaking, isLoading } = useVoice();
  const isTalking = isSpeaking || isLoading;
  const isGeneratingVoice = isLoading && !isSpeaking;

  // Determine expression image
  const concernedMoods = ["danger", "moderate"];
  const isConcerned = concernedMoods.includes(mood);
  const currentImage = isConcerned ? CONCERNED_IMAGE : HAPPY_IMAGE;

  // Glow colors per mood
  const glowMap = {
    safe:      { color: "rgba(34, 197, 94, 0.3)",  ring: "rgba(34, 197, 94, 0.2)" },
    moderate:  { color: "rgba(234, 179, 8, 0.25)", ring: "rgba(234, 179, 8, 0.15)" },
    danger:    { color: "rgba(239, 68, 68, 0.3)",  ring: "rgba(239, 68, 68, 0.2)" },
    analyzing: { color: "rgba(6, 182, 212, 0.25)", ring: "rgba(6, 182, 212, 0.14)" },
    thinking:  { color: "rgba(6, 182, 212, 0.2)",  ring: "rgba(6, 182, 212, 0.12)" },
    waving:    { color: "rgba(6, 182, 212, 0.25)", ring: "rgba(6, 182, 212, 0.14)" },
    listening: { color: "rgba(59, 130, 246, 0.25)",ring: "rgba(59, 130, 246, 0.14)" },
    speaking:  { color: "rgba(6, 182, 212, 0.25)", ring: "rgba(6, 182, 212, 0.12)" },
    idle:      { color: "rgba(6, 182, 212, 0.15)", ring: "rgba(6, 182, 212, 0.08)" },
  };
  const glow = glowMap[mood] || glowMap.idle;

  // Simulated blinking — brief overlay flash (pauses during analyzing/listening)
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (mood === "analyzing" || mood === "listening") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 3500 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [mood]);

  // Subtle eye-movement simulation during thinking — horizontal shift
  const [eyeShift, setEyeShift] = useState(0);
  useEffect(() => {
    if (mood !== "thinking" && mood !== "analyzing") {
      setEyeShift(0);
      return;
    }
    const interval = setInterval(() => {
      setEyeShift(Math.random() * 3 - 1.5);
    }, 800);
    return () => clearInterval(interval);
  }, [mood]);

  // Lip-sync pulse — subtle scale when actively speaking (not just loading)
  const [lipPulse, setLipPulse] = useState(false);
  useEffect(() => {
    if (!isSpeaking) {
      setLipPulse(false);
      return;
    }
    const interval = setInterval(() => {
      setLipPulse((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className="relative cursor-pointer group" onClick={onClick}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: glow.color }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing ring for result moods */}
      {(mood === "safe" || mood === "moderate" || mood === "danger") && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: glow.ring }}
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Sparkles for safe mood */}
      <AnimatePresence>
        {mood === "safe" && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{ top: `${10 + i * 20}%`, left: i % 2 === 0 ? "-12%" : "95%" }}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="hsl(48, 95%, 65%)">
                  <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating + breathing wrapper */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          animate={{ scaleY: [1, 1.03, 1], scaleX: [1, 0.98, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Character image with smooth fade transition */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg group-hover:shadow-xl transition-shadow">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt="Aqua Assistant"
                className="w-full h-full object-cover"
                style={{ transform: `translateX(${eyeShift}px)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: isSpeaking && lipPulse ? 1.03 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, scale: { duration: 0.15 } }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Blink overlay */}
            <AnimatePresence>
              {blink && (
                <motion.div
                  className="absolute inset-0 bg-current"
                  style={{ color: "rgba(0,0,0,0.12)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.2, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                />
              )}
            </AnimatePresence>

            {/* Generating Voice overlay */}
            <AnimatePresence>
              {isGeneratingVoice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                >
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Speaking waveform — appears when actively speaking */}
          <AnimatePresence>
            {isSpeaking && mood !== "analyzing" && mood !== "thinking" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-3.5"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full bg-gradient-to-t from-primary to-cyan-400"
                    animate={{ height: [2, 10, 4, 8, 2] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thinking dots — appears during thinking/analyzing */}
          <AnimatePresence>
            {(mood === "thinking" || mood === "analyzing") && !isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-1 -right-1 flex gap-0.5 bg-white dark:bg-slate-800 rounded-full px-1 py-0.5 shadow-sm border border-border/30"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listening — mic pulse ring */}
          <AnimatePresence>
            {mood === "listening" && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-blue-400/30"
                  animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}