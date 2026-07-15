import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/lib/VoiceContext";

/**
 * Aqua — the AI Health Guide mascot.
 * A cute water-drop robot with expressive eyes, animated mouth,
 * and mood-based expressions/glow.
 */
export default function AquaMascot({ mood, onClick }) {
  const { isSpeaking } = useVoice();
  const [blink, setBlink] = useState(false);

  // Blinking — pauses during analyzing/listening
  useEffect(() => {
    if (mood === "analyzing" || mood === "listening") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [mood]);

  const glowMap = {
    safe: { color: "rgba(34, 197, 94, 0.35)", ring: "rgba(34, 197, 94, 0.15)" },
    moderate: { color: "rgba(234, 179, 8, 0.35)", ring: "rgba(234, 179, 8, 0.15)" },
    danger: { color: "rgba(239, 68, 68, 0.35)", ring: "rgba(239, 68, 68, 0.15)" },
    analyzing: { color: "rgba(6, 182, 212, 0.3)", ring: "rgba(6, 182, 212, 0.12)" },
    thinking: { color: "rgba(6, 182, 212, 0.25)", ring: "rgba(6, 182, 212, 0.1)" },
    waving: { color: "rgba(6, 182, 212, 0.3)", ring: "rgba(6, 182, 212, 0.12)" },
    listening: { color: "rgba(6, 182, 212, 0.3)", ring: "rgba(6, 182, 212, 0.12)" },
    idle: { color: "rgba(6, 182, 212, 0.2)", ring: "rgba(6, 182, 212, 0.08)" },
  };
  const glow = glowMap[mood] || glowMap.idle;

  // Mouth rendering
  const renderMouth = () => {
    if (isSpeaking) {
      return (
        <motion.ellipse
          cx="60" cy="82" rx="4"
          fill="hsl(200, 25%, 20%)"
          animate={{ ry: [2, 5, 2, 4, 3] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    }
    switch (mood) {
      case "safe":
        return <path d="M50 78 Q60 90 70 78" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
      case "danger":
        return <path d="M52 85 Q60 79 68 85" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
      case "moderate":
        return <path d="M55 82 L65 82" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
      case "thinking":
        return <circle cx="60" cy="82" r="2.5" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2" />;
      case "analyzing":
        return <path d="M56 82 L64 82" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2" strokeLinecap="round" />;
      default:
        return <path d="M54 81 Q60 85 66 81" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
    }
  };

  // Eyes
  const renderEyes = () => {
    if (blink) {
      return (
        <>
          <line x1="49" y1="70" x2="55" y2="70" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="70" x2="71" y2="70" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    const isHappy = mood === "safe" || mood === "waving";
    const isWorried = mood === "danger";
    if (isHappy) {
      // Happy curved eyes
      return (
        <>
          <path d="M49 71 Q52 67 55 71" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M65 71 Q68 67 71 71" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    if (isWorried) {
      // Worried eyes (slightly angled)
      return (
        <>
          <circle cx="52" cy="70" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="68" cy="70" r="3.5" fill="hsl(200, 25%, 20%)" />
          <line x1="48" y1="66" x2="55" y2="68" stroke="hsl(200, 25%, 20%)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="72" y1="66" x2="65" y2="68" stroke="hsl(200, 25%, 20%)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    }
    // Normal eyes
    return (
      <>
        <circle cx="52" cy="70" r="3.5" fill="hsl(200, 25%, 20%)" />
        <circle cx="68" cy="70" r="3.5" fill="hsl(200, 25%, 20%)" />
        <circle cx="53.5" cy="69" r="1.2" fill="white" />
        <circle cx="69.5" cy="69" r="1.2" fill="white" />
      </>
    );
  };

  // Right arm behavior
  const rightArmRotate = mood === "waving" ? [0, -30, 0, -30, 0] : mood === "safe" ? -50 : mood === "danger" ? 20 : 0;
  const rightArmTransition = mood === "waving"
    ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.3 };

  return (
    <div className="relative cursor-pointer group" onClick={onClick}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: glow.color }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing ring for result moods */}
      {(mood === "safe" || mood === "moderate" || mood === "danger") && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: glow.ring }}
          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Floating + breathing wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          animate={{ scaleY: [1, 1.03, 1], scaleX: [1, 0.99, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 120 140" className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-lg group-hover:drop-shadow-xl transition-all">
            <defs>
              <linearGradient id="aquaBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(190, 85%, 65%)" />
                <stop offset="100%" stopColor="hsl(185, 80%, 42%)" />
              </linearGradient>
              <radialGradient id="aquaFace" cx="50%" cy="40%">
                <stop offset="0%" stopColor="white" stopOpacity="0.98" />
                <stop offset="100%" stopColor="hsl(190, 30%, 92%)" stopOpacity="0.9" />
              </radialGradient>
              <linearGradient id="aquaArm" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(190, 85%, 58%)" />
                <stop offset="100%" stopColor="hsl(185, 80%, 45%)" />
              </linearGradient>
            </defs>

            {/* Antenna */}
            <line x1="60" y1="24" x2="60" y2="12" stroke="hsl(185, 80%, 50%)" strokeWidth="2.5" strokeLinecap="round" />
            <motion.circle
              cx="60" cy="8" r="4"
              fill="hsl(185, 80%, 60%)"
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Left arm */}
            <ellipse cx="26" cy="82" rx="5" ry="4" fill="url(#aquaArm)" />

            {/* Right arm (animated) */}
            <motion.g
              style={{ transformOrigin: "92px 78px" }}
              animate={{ rotate: rightArmRotate }}
              transition={rightArmTransition}
            >
              <ellipse cx="94" cy="82" rx="5" ry="4" fill="url(#aquaArm)" />
            </motion.g>

            {/* Body — water drop */}
            <path
              d="M60 24 C60 24, 28 52, 28 80 C28 98, 43 110, 60 110 C77 110, 92 98, 92 80 C92 52, 60 24, 60 24 Z"
              fill="url(#aquaBody)"
            />

            {/* Shine highlight */}
            <ellipse cx="46" cy="62" rx="7" ry="13" fill="white" opacity="0.22" />

            {/* Face area */}
            <ellipse cx="60" cy="74" rx="24" ry="20" fill="url(#aquaFace)" />

            {/* Cheeks */}
            <circle cx="44" cy="80" r="3" fill="hsl(350, 70%, 72%)" opacity="0.35" />
            <circle cx="76" cy="80" r="3" fill="hsl(350, 70%, 72%)" opacity="0.35" />

            {/* Eyes */}
            {renderEyes()}

            {/* Mouth */}
            {renderMouth()}

            {/* Health badge */}
            <circle cx="60" cy="98" r="6" fill="white" stroke="hsl(185, 80%, 50%)" strokeWidth="1.5" />
            <line x1="60" y1="95" x2="60" y2="101" stroke="hsl(185, 80%, 45%)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="57" y1="98" x2="63" y2="98" stroke="hsl(185, 80%, 45%)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Holographic screens (analyzing mode) */}
      <AnimatePresence>
        {mood === "analyzing" && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -10, y: 10 }}
              animate={{ opacity: 1, x: -22, y: [0, -3, 0] }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, y: { duration: 2, repeat: Infinity } }}
              className="absolute top-8 left-0 w-10 h-8 rounded-lg border border-aqua/40 bg-aqua/10 backdrop-blur-sm"
            >
              <div className="p-1 space-y-0.5">
                <div className="h-0.5 bg-aqua/50 rounded w-3/4" />
                <div className="h-0.5 bg-aqua/40 rounded w-1/2" />
                <div className="h-0.5 bg-aqua/30 rounded w-2/3" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10, y: 10 }}
              animate={{ opacity: 1, x: 92, y: [0, -3, 0] }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, delay: 0.2, y: { duration: 2, repeat: Infinity, delay: 0.5 } }}
              className="absolute top-12 left-0 w-10 h-8 rounded-lg border border-aqua/40 bg-aqua/10 backdrop-blur-sm"
            >
              <div className="p-1 space-y-0.5">
                <div className="h-0.5 bg-aqua/50 rounded w-2/3" />
                <div className="h-0.5 bg-aqua/40 rounded w-3/4" />
                <div className="h-0.5 bg-aqua/30 rounded w-1/2" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Listening indicator */}
      <AnimatePresence>
        {mood === "listening" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <div className="relative">
              <motion.div
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
                  <path d="M19 11a7 7 0 01-14 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking sound waves */}
      <AnimatePresence>
        {isSpeaking && mood !== "analyzing" && (
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
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}