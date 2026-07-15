import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/lib/VoiceContext";

/**
 * Aqua — the official mascot of AquaSentinel AI.
 * A premium 3D-style water-drop character with rich gradients,
 * expressive eyes, animated mouth, gesturing arms, and mood-based
 * glow, sparkles, holographic screens, and data particles.
 */
export default function AquaMascot({ mood, onClick }) {
  const { isSpeaking, isLoading } = useVoice();
  const isTalking = isSpeaking || isLoading;

  const [blink, setBlink] = useState(false);
  const [idleWave, setIdleWave] = useState(false);
  const [wink, setWink] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [eyeOffsetX, setEyeOffsetX] = useState(0);
  const [eyeOffsetY, setEyeOffsetY] = useState(0);
  const [bigSmile, setBigSmile] = useState(false);

  // Natural blinking — pauses during analyzing/listening
  useEffect(() => {
    if (mood === "analyzing" || mood === "listening") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [mood]);

  // Idle wave every 15–20 seconds
  useEffect(() => {
    if (mood !== "idle" || isTalking) return;
    const interval = setInterval(() => {
      setIdleWave(true);
      setTimeout(() => setIdleWave(false), 2000);
    }, 15000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [mood, isTalking]);

  // Occasional wink during safe mood
  useEffect(() => {
    if (mood !== "safe") return;
    const interval = setInterval(() => {
      setWink(true);
      setTimeout(() => setWink(false), 250);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [mood]);

  // Occasional head tilt during idle
  useEffect(() => {
    if (mood !== "idle" || isTalking) return;
    const interval = setInterval(() => {
      setHeadTilt(Math.random() * 6 - 3);
      setTimeout(() => setHeadTilt(0), 1500);
    }, 5000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [mood, isTalking]);

  // Occasional bigger smile during idle
  useEffect(() => {
    if (mood !== "idle" || isTalking) return;
    const interval = setInterval(() => {
      setBigSmile(true);
      setTimeout(() => setBigSmile(false), 1200);
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [mood, isTalking]);

  // Eye movement during talking — natural gaze shifts
  useEffect(() => {
    if (!isTalking) {
      setEyeOffsetX(0);
      setEyeOffsetY(0);
      return;
    }
    const interval = setInterval(() => {
      setEyeOffsetX(Math.random() * 4 - 2);
      setEyeOffsetY(Math.random() * 2 - 1);
    }, 600);
    return () => clearInterval(interval);
  }, [isTalking]);

  const glowMap = {
    safe: { color: "rgba(34, 197, 94, 0.4)", ring: "rgba(34, 197, 94, 0.2)" },
    moderate: { color: "rgba(234, 179, 8, 0.35)", ring: "rgba(234, 179, 8, 0.15)" },
    danger: { color: "rgba(239, 68, 68, 0.4)", ring: "rgba(239, 68, 68, 0.2)" },
    analyzing: { color: "rgba(6, 182, 212, 0.35)", ring: "rgba(6, 182, 212, 0.14)" },
    thinking: { color: "rgba(6, 182, 212, 0.3)", ring: "rgba(6, 182, 212, 0.12)" },
    waving: { color: "rgba(6, 182, 212, 0.35)", ring: "rgba(6, 182, 212, 0.14)" },
    listening: { color: "rgba(59, 130, 246, 0.35)", ring: "rgba(59, 130, 246, 0.14)" },
    speaking: { color: "rgba(6, 182, 212, 0.3)", ring: "rgba(6, 182, 212, 0.12)" },
    idle: { color: "rgba(6, 182, 212, 0.22)", ring: "rgba(6, 182, 212, 0.08)" },
  };
  const glow = glowMap[mood] || glowMap.idle;

  const showWave = mood === "waving" || (mood === "idle" && idleWave);
  const headNod = isTalking && mood !== "analyzing" && mood !== "thinking";

  // Right arm behavior
  const rightArmRotate = showWave
    ? [0, -35, 0, -35, 0]
    : mood === "safe"
    ? -75
    : mood === "danger"
    ? 30
    : mood === "thinking"
    ? -55
    : isTalking && mood !== "analyzing" && mood !== "thinking"
    ? [0, -10, 0]
    : 0;
  const rightArmTransition = showWave
    ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    : isTalking && mood !== "analyzing" && mood !== "thinking"
    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.3 };

  const renderEyes = () => {
    if (blink && mood !== "safe" && mood !== "waving") {
      return (
        <>
          <line x1="49" y1="70" x2="55" y2="70" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="70" x2="71" y2="70" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }

    // Wink during safe mood
    if (wink && mood === "safe") {
      return (
        <>
          <path d="M49 71 Q52 67 55 71" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="68" cy="70" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="69.5" cy="69" r="1.3" fill="white" />
        </>
      );
    }

    // Happy eyes (safe / waving)
    if (mood === "safe" || mood === "waving") {
      return (
        <>
          <path d="M48 72 Q52 66 56 72" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M64 72 Q68 66 72 72" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }

    // Worried eyes (danger)
    if (mood === "danger") {
      return (
        <>
          <circle cx="52" cy="71" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="68" cy="71" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="53.5" cy="70" r="1.2" fill="white" />
          <circle cx="69.5" cy="70" r="1.2" fill="white" />
          <line x1="47" y1="64" x2="56" y2="67" stroke="hsl(200, 25%, 20%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="73" y1="64" x2="64" y2="67" stroke="hsl(200, 25%, 20%)" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    }

    // Listening — attentive, wide eyes looking at user
    if (mood === "listening") {
      return (
        <>
          <circle cx="52" cy="70" r="4" fill="hsl(200, 25%, 20%)" />
          <circle cx="68" cy="70" r="4" fill="hsl(200, 25%, 20%)" />
          <circle cx="53" cy="69" r="1.5" fill="white" />
          <circle cx="69" cy="69" r="1.5" fill="white" />
        </>
      );
    }

    // Thinking — looking up-left at holographic display
    if (mood === "thinking") {
      return (
        <>
          <circle cx="50" cy="66" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="66" cy="66" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="51" cy="65" r="1.2" fill="white" />
          <circle cx="67" cy="65" r="1.2" fill="white" />
        </>
      );
    }

    // Analyzing — looking at screens
    if (mood === "analyzing") {
      return (
        <>
          <circle cx="50" cy="72" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="68" cy="72" r="3.5" fill="hsl(200, 25%, 20%)" />
          <circle cx="51" cy="71" r="1.2" fill="white" />
          <circle cx="69" cy="71" r="1.2" fill="white" />
        </>
      );
    }

    // Normal / talking eyes with pupil movement
    return (
      <>
        <circle cx={52 + eyeOffsetX} cy={70 + eyeOffsetY} r="3.5" fill="hsl(200, 25%, 20%)" />
        <circle cx={68 + eyeOffsetX} cy={70 + eyeOffsetY} r="3.5" fill="hsl(200, 25%, 20%)" />
        <circle cx={53.5 + eyeOffsetX} cy={69 + eyeOffsetY} r="1.3" fill="white" />
        <circle cx={69.5 + eyeOffsetX} cy={69 + eyeOffsetY} r="1.3" fill="white" />
      </>
    );
  };

  const renderMouth = () => {
    // Talking — animated mouth
    if (isTalking) {
      return (
        <motion.ellipse
          cx="60"
          cy="82"
          rx="4.5"
          fill="hsl(200, 25%, 20%)"
          animate={{ ry: [2, 5, 2, 4, 3, 5, 2] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    }

    // Big genuine smile (safe)
    if (mood === "safe") {
      return (
        <path
          d="M47 77 Q60 93 73 77 Q60 85 47 77 Z"
          fill="hsl(200, 25%, 20%)"
          stroke="hsl(200, 25%, 20%)"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      );
    }

    // Worried (danger)
    if (mood === "danger") {
      return <path d="M52 86 Q60 79 68 86" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
    }

    // Moderate — neutral line
    if (mood === "moderate") {
      return <path d="M54 83 L66 83" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
    }

    // Thinking — small circle
    if (mood === "thinking") {
      return <circle cx="60" cy="83" r="2.5" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2" />;
    }

    // Analyzing — small line
    if (mood === "analyzing") {
      return <path d="M56 83 L64 83" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2" strokeLinecap="round" />;
    }

    // Listening — slight smile
    if (mood === "listening") {
      return <path d="M54 81 Q60 85 66 81" fill="none" stroke="hsl(200, 25%, 20%)" strokeWidth="2.5" strokeLinecap="round" />;
    }

    // Idle — gentle smile, occasionally bigger
    return (
      <path
        d={bigSmile ? "M51 79 Q60 88 69 79" : "M53 81 Q60 86 67 81"}
        fill="none"
        stroke="hsl(200, 25%, 20%)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  };

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
          animate={{ scaleY: [1, 1.04, 1], scaleX: [1, 0.98, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 120 140" className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-lg group-hover:drop-shadow-xl transition-all">
            <defs>
              <linearGradient id="aquaBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(190, 88%, 68%)" />
                <stop offset="45%" stopColor="hsl(185, 82%, 50%)" />
                <stop offset="100%" stopColor="hsl(185, 80%, 36%)" />
              </linearGradient>
              <radialGradient id="aquaBodyHighlight" cx="35%" cy="28%" r="55%">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="aquaFace" cx="50%" cy="38%" r="58%">
                <stop offset="0%" stopColor="white" stopOpacity="0.98" />
                <stop offset="70%" stopColor="hsl(190, 30%, 95%)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="hsl(190, 25%, 88%)" stopOpacity="0.9" />
              </radialGradient>
              <linearGradient id="aquaArm" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(190, 85%, 60%)" />
                <stop offset="100%" stopColor="hsl(185, 80%, 42%)" />
              </linearGradient>
              <radialGradient id="aquaAntennaTip" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="hsl(185, 85%, 75%)" />
                <stop offset="100%" stopColor="hsl(185, 80%, 55%)" />
              </radialGradient>
            </defs>

            {/* Antenna */}
            <line x1="60" y1="24" x2="60" y2="12" stroke="hsl(185, 80%, 50%)" strokeWidth="2.5" strokeLinecap="round" />
            <motion.circle
              cx="60"
              cy="8"
              r="4.5"
              fill="url(#aquaAntennaTip)"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Left arm */}
            <ellipse cx="26" cy="84" rx="5.5" ry="4.5" fill="url(#aquaArm)" />

            {/* Right arm (animated) */}
            <motion.g
              style={{ transformOrigin: "92px 80px" }}
              animate={{ rotate: rightArmRotate }}
              transition={rightArmTransition}
            >
              <ellipse cx="94" cy="84" rx="5.5" ry="4.5" fill="url(#aquaArm)" />
              {/* Thumbs up (safe) */}
              {mood === "safe" && (
                <rect x="92" y="72" width="4.5" height="9" rx="2.5" fill="url(#aquaArm)" />
              )}
              {/* Pointing (danger) */}
              {mood === "danger" && (
                <ellipse cx="102" cy="84" rx="7" ry="2.8" fill="url(#aquaArm)" />
              )}
              {/* Chin touch (thinking) */}
              {mood === "thinking" && (
                <ellipse cx="92" cy="72" rx="5" ry="3.5" fill="url(#aquaArm)" />
              )}
            </motion.g>

            {/* Body — water drop */}
            <path
              d="M60 24 C60 24, 28 52, 28 80 C28 98, 43 110, 60 110 C77 110, 92 98, 92 80 C92 52, 60 24, 60 24 Z"
              fill="url(#aquaBody)"
            />
            {/* 3D highlight overlay */}
            <path
              d="M60 24 C60 24, 28 52, 28 80 C28 98, 43 110, 60 110 C77 110, 92 98, 92 80 C92 52, 60 24, 60 24 Z"
              fill="url(#aquaBodyHighlight)"
            />
            {/* Glossy shine */}
            <ellipse cx="46" cy="60" rx="8" ry="15" fill="white" opacity="0.25" />
            <ellipse cx="44" cy="55" rx="3" ry="6" fill="white" opacity="0.35" />

            {/* Head group — nods/tilts */}
            <motion.g
              animate={{ rotate: headNod ? [-1.5, 1.5, -1.5] : headTilt }}
              transition={headNod ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
              style={{ transformOrigin: "60px 80px" }}
            >
              {/* Face area */}
              <ellipse cx="60" cy="74" rx="25" ry="21" fill="url(#aquaFace)" />
              {/* Face inner shadow for depth */}
              <ellipse cx="60" cy="78" rx="23" ry="17" fill="none" stroke="hsl(190, 15%, 85%)" strokeWidth="0.5" opacity="0.5" />

              {/* Cheeks */}
              <circle cx="43" cy="80" r="3.5" fill="hsl(350, 70%, 72%)" opacity="0.4" />
              <circle cx="77" cy="80" r="3.5" fill="hsl(350, 70%, 72%)" opacity="0.4" />

              {/* Eyes */}
              {renderEyes()}

              {/* Mouth */}
              {renderMouth()}
            </motion.g>

            {/* Health badge */}
            <circle cx="60" cy="99" r="6.5" fill="white" stroke="hsl(185, 80%, 50%)" strokeWidth="1.5" />
            <path d="M60 95.5 L60 102.5 M56.5 99 L63.5 99" stroke="hsl(185, 80%, 45%)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
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
              className="absolute top-8 left-0 w-11 h-9 rounded-lg border border-aqua/40 bg-aqua/10 backdrop-blur-sm"
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
              className="absolute top-12 left-0 w-11 h-9 rounded-lg border border-aqua/40 bg-aqua/10 backdrop-blur-sm"
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
                style={{ bottom: "20%", left: `${28 + i * 12}%` }}
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
            className="absolute top-7 right-0 flex items-end gap-0.5 h-4"
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