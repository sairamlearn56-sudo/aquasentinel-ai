import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";

/**
 * Aqua — the definitive 3D water-droplet robot mascot for AquaSentinel AI.
 * Glossy blue droplet head with friendly face, white metallic torso with
 * glowing chest light, articulated robot arms and legs. Single source of
 * truth for the character everywhere in the app.
 *
 * Props:
 *  - mood: "idle" | "waving" | "safe" | "moderate" | "danger" | "analyzing" | "thinking" | "listening" | "speaking"
 *  - isTalking: boolean — animates mouth + arm gestures
 *  - showLegs: boolean — render full body or upper body only
 *  - className: sizing/extra classes for the <svg>
 */
export const MASCOT_GLOW_MAP = {
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

export default function AquaRobotCharacter({
  mood = "idle",
  isTalking = false,
  showLegs = true,
  className = "",
}) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  const [blink, setBlink] = useState(false);
  const [idleWave, setIdleWave] = useState(false);
  const [wink, setWink] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [eyeOffsetX, setEyeOffsetX] = useState(0);
  const [eyeOffsetY, setEyeOffsetY] = useState(0);
  const [bigSmile, setBigSmile] = useState(false);

  // Natural blinking
  useEffect(() => {
    if (mood === "analyzing" || mood === "listening") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [mood]);

  // Idle wave every 15–20s
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

  // Eye movement during talking
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

  const showWave = mood === "waving" || (mood === "idle" && idleWave);
  const headNod = isTalking && mood !== "analyzing" && mood !== "thinking";

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

  const renderEyebrows = () => {
    if (mood === "danger") {
      return (
        <>
          <line x1="47" y1="63" x2="56" y2="66" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="73" y1="63" x2="64" y2="66" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    }
    if (mood === "safe" || mood === "waving") {
      return (
        <>
          <path d="M47 62 Q52 59 57 62" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M63 62 Q68 59 73 62" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    }
    if (mood === "thinking") {
      return (
        <>
          <path d="M47 63 Q52 61 57 63" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="63" y1="61" x2="73" y2="63" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <path d="M47 63 Q52 61 57 63" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M63 63 Q68 61 73 63" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </>
    );
  };

  const renderEyes = () => {
    if (blink && mood !== "safe" && mood !== "waving") {
      return (
        <>
          <line x1="49" y1="70" x2="55" y2="70" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="70" x2="71" y2="70" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    if (wink && mood === "safe") {
      return (
        <>
          <path d="M49 71 Q52 67 55 71" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="68" cy="70" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="69.5" cy="69" r="1.3" fill="white" />
        </>
      );
    }
    if (mood === "safe" || mood === "waving") {
      return (
        <>
          <path d="M48 72 Q52 66 56 72" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M64 72 Q68 66 72 72" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    if (mood === "danger") {
      return (
        <>
          <circle cx="52" cy="71" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="68" cy="71" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="53.5" cy="70" r="1.2" fill="white" />
          <circle cx="69.5" cy="70" r="1.2" fill="white" />
        </>
      );
    }
    if (mood === "listening") {
      return (
        <>
          <circle cx="52" cy="70" r="4" fill="hsl(200, 25%, 25%)" />
          <circle cx="68" cy="70" r="4" fill="hsl(200, 25%, 25%)" />
          <circle cx="53" cy="69" r="1.5" fill="white" />
          <circle cx="69" cy="69" r="1.5" fill="white" />
        </>
      );
    }
    if (mood === "thinking") {
      return (
        <>
          <circle cx="50" cy="66" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="66" cy="66" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="51" cy="65" r="1.2" fill="white" />
          <circle cx="67" cy="65" r="1.2" fill="white" />
        </>
      );
    }
    if (mood === "analyzing") {
      return (
        <>
          <circle cx="50" cy="72" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="68" cy="72" r="3.5" fill="hsl(200, 25%, 25%)" />
          <circle cx="51" cy="71" r="1.2" fill="white" />
          <circle cx="69" cy="71" r="1.2" fill="white" />
        </>
      );
    }
    return (
      <>
        <circle cx={52 + eyeOffsetX} cy={70 + eyeOffsetY} r="3.5" fill="hsl(200, 25%, 25%)" />
        <circle cx={68 + eyeOffsetX} cy={70 + eyeOffsetY} r="3.5" fill="hsl(200, 25%, 25%)" />
        <circle cx={53.5 + eyeOffsetX} cy={69 + eyeOffsetY} r="1.3" fill="white" />
        <circle cx={69.5 + eyeOffsetX} cy={69 + eyeOffsetY} r="1.3" fill="white" />
      </>
    );
  };

  const renderMouth = () => {
    if (isTalking) {
      return (
        <motion.ellipse
          cx="60" cy="82" rx="4.5" fill="hsl(200, 25%, 25%)"
          animate={{ ry: [2, 5, 2, 4, 3, 5, 2] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    }
    if (mood === "safe") {
      return (
        <path d="M47 77 Q60 93 73 77 Q60 85 47 77 Z" fill="hsl(200, 25%, 25%)" stroke="hsl(200, 25%, 25%)" strokeWidth="0.5" strokeLinejoin="round" />
      );
    }
    if (mood === "danger") {
      return <path d="M52 86 Q60 79 68 86" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />;
    }
    if (mood === "moderate") {
      return <path d="M54 83 L66 83" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />;
    }
    if (mood === "thinking") {
      return <circle cx="60" cy="83" r="2.5" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2" />;
    }
    if (mood === "analyzing") {
      return <path d="M56 83 L64 83" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2" strokeLinecap="round" />;
    }
    if (mood === "listening") {
      return <path d="M54 81 Q60 85 66 81" fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round" />;
    }
    return (
      <path
        d={bigSmile ? "M51 79 Q60 88 69 79" : "M53 81 Q60 86 67 81"}
        fill="none" stroke="hsl(200, 25%, 25%)" strokeWidth="2.5" strokeLinecap="round"
      />
    );
  };

  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      style={{ filter: "drop-shadow(0 6px 16px rgba(2, 132, 199, 0.2))" }}
    >
      <defs>
        <radialGradient id={`head-${uid}`} cx="35%" cy="22%" r="80%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="30%" stopColor="#38BDF8" />
          <stop offset="65%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#075985" />
        </radialGradient>
        <radialGradient id={`headShine-${uid}`} cx="30%" cy="18%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.75" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id={`limb-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="30%" stopColor="#F1F5F9" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <radialGradient id={`face-${uid}`} cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="white" stopOpacity="0.98" />
          <stop offset="70%" stopColor="#E0F2FE" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id={`chest-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* ===== Antenna ===== */}
      <line x1="60" y1="22" x2="60" y2="10" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <motion.circle
        cx="60" cy="8" r="4" fill="#22D3EE"
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="60" cy="8" r="6" fill="#22D3EE" opacity="0.25" />

      {/* ===== Left Arm (behind body) ===== */}
      <g>
        <circle cx="32" cy="126" r="6" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="24" y="124" width="12" height="20" rx="6" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.3" />
        <circle cx="30" cy="144" r="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="25" y="144" width="10" height="14" rx="5" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.3" />
        <circle cx="30" cy="160" r="5.5" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="26" y="163" width="2" height="6" rx="1" fill="#E2E8F0" />
        <rect x="29" y="164" width="2" height="6" rx="1" fill="#E2E8F0" />
        <rect x="32" y="163" width="2" height="6" rx="1" fill="#E2E8F0" />
      </g>

      {/* ===== Legs ===== */}
      {showLegs && (
        <>
          <g>
            <circle cx="46" cy="168" r="5" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
            <rect x="40" y="167" width="12" height="16" rx="6" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.3" />
            <circle cx="46" cy="183" r="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
            <rect x="41" y="183" width="10" height="10" rx="5" fill={`url(#limb-${uid})`} />
            <ellipse cx="46" cy="195" rx="9" ry="4" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
          </g>
          <g>
            <circle cx="74" cy="168" r="5" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
            <rect x="68" y="167" width="12" height="16" rx="6" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.3" />
            <circle cx="74" cy="183" r="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
            <rect x="69" y="183" width="10" height="10" rx="5" fill={`url(#limb-${uid})`} />
            <ellipse cx="74" cy="195" rx="9" ry="4" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
          </g>
        </>
      )}

      {/* ===== Body (torso) ===== */}
      <path
        d="M40 114 L80 114 Q90 114 90 124 L90 156 Q90 168 80 168 L40 168 Q30 168 30 156 L30 124 Q30 114 40 114 Z"
        fill={`url(#body-${uid})`} stroke="#94A3B8" strokeWidth="0.5"
      />
      <path
        d="M30 150 Q30 168 40 168 L80 168 Q90 168 90 150 L90 156 Q90 168 80 168 L40 168 Q30 168 30 156 Z"
        fill="#94A3B8" opacity="0.15"
      />
      <line x1="60" y1="116" x2="60" y2="166" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.4" />
      <line x1="38" y1="130" x2="38" y2="155" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.3" />
      <line x1="82" y1="130" x2="82" y2="155" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.3" />

      {/* ===== Chest glowing light ===== */}
      <motion.circle
        cx="60" cy="142" r="16" fill={`url(#chest-${uid})`} opacity="0.25"
        animate={{ r: [14, 18, 14], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="60" cy="142" r="11" fill={`url(#chest-${uid})`} />
      <circle cx="60" cy="142" r="7" fill="#67E8F9" opacity="0.9" />
      <motion.circle
        cx="60" cy="142" r="4" fill="white" opacity="0.8"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="58" cy="140" r="1.5" fill="white" />

      {/* ===== Right Arm (animated) ===== */}
      <motion.g
        style={{ transformOrigin: "88px 126px" }}
        animate={{ rotate: rightArmRotate }}
        transition={rightArmTransition}
      >
        <circle cx="88" cy="126" r="6" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="84" y="124" width="12" height="20" rx="6" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.3" />
        <circle cx="90" cy="144" r="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="85" y="144" width="10" height="14" rx="5" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.3" />
        <circle cx="90" cy="160" r="5.5" fill={`url(#limb-${uid})`} stroke="#94A3B8" strokeWidth="0.5" />
        <rect x="86" y="163" width="2" height="6" rx="1" fill="#E2E8F0" />
        <rect x="89" y="164" width="2" height="6" rx="1" fill="#E2E8F0" />
        <rect x="92" y="163" width="2" height="6" rx="1" fill="#E2E8F0" />
        {mood === "safe" && (
          <rect x="86" y="154" width="3" height="10" rx="1.5" fill={`url(#limb-${uid})`} />
        )}
      </motion.g>

      {/* ===== Head (water droplet) ===== */}
      <motion.g
        animate={{ rotate: headNod ? [-1.5, 1.5, -1.5] : headTilt }}
        transition={headNod ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
        style={{ transformOrigin: "60px 76px" }}
      >
        <path
          d="M60 22 C60 22, 28 50, 28 76 C28 94, 42 106, 60 106 C78 106, 92 94, 92 76 C92 50, 60 22, 60 22 Z"
          fill={`url(#head-${uid})`}
        />
        <path
          d="M60 22 C60 22, 28 50, 28 76 C28 94, 42 106, 60 106 C78 106, 92 94, 92 76 C92 50, 60 22, 60 22 Z"
          fill={`url(#headShine-${uid})`}
        />
        <ellipse cx="46" cy="58" rx="7" ry="14" fill="white" opacity="0.25" />
        <ellipse cx="44" cy="54" rx="3" ry="6" fill="white" opacity="0.35" />

        <ellipse cx="60" cy="74" rx="24" ry="20" fill={`url(#face-${uid})`} />
        <ellipse cx="60" cy="78" rx="22" ry="16" fill="none" stroke="#BAE6FD" strokeWidth="0.5" opacity="0.5" />

        <circle cx="43" cy="80" r="3.5" fill="hsl(350, 70%, 72%)" opacity="0.4" />
        <circle cx="77" cy="80" r="3.5" fill="hsl(350, 70%, 72%)" opacity="0.4" />

        {renderEyebrows()}
        {renderEyes()}
        {renderMouth()}
      </motion.g>
    </svg>
  );
}