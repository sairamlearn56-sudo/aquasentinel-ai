import React from "react";
import HealthScoreRing from "@/components/HealthScoreRing";

/**
 * Premium illustrated water status card with shield, landscape scene,
 * and health score gauge. Used on AI Analysis and Live Monitor results.
 */
export default function WaterStatusCard({ status, score, date }) {
  const config = {
    safe: {
      bgClass: "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600",
      title: "WATER IS SAFE",
      subtitle: "Safe for drinking and household use",
      scene: <SafeScene />,
    },
    moderate: {
      bgClass: "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600",
      title: "CAUTION NEEDED",
      subtitle: "Treat water before drinking",
      scene: <ModerateScene />,
    },
    danger: {
      bgClass: "bg-gradient-to-br from-red-500 via-rose-500 to-red-700",
      title: "WATER IS NOT SAFE",
      subtitle: "Do not drink without proper treatment",
      scene: <DangerScene />,
    },
  };

  const c = config[status] || config.safe;

  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl ${c.bgClass}`}>
      <div className="relative h-44 sm:h-52">{c.scene}</div>
      <div className="bg-white dark:bg-card px-5 py-4 flex items-center gap-4 sm:gap-5">
        <HealthScoreRing score={score} riskLevel={status} size={80} stroke={7} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-foreground">{c.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{c.subtitle}</p>
          {date && <p className="text-xs text-muted-foreground mt-1.5">{date}</p>}
        </div>
      </div>
    </div>
  );
}

/* ===== Safe Scene — shield, sun, hills, trees, clean water ===== */
function SafeScene() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="safeSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#safeSky)" />
      {/* Sun */}
      <circle cx="340" cy="38" r="16" fill="#FCD34D" opacity="0.9" />
      <circle cx="340" cy="38" r="24" fill="#FCD34D" opacity="0.25" />
      {/* Cloud */}
      <g opacity="0.7">
        <ellipse cx="65" cy="32" rx="22" ry="9" fill="white" />
        <ellipse cx="80" cy="36" rx="16" ry="7" fill="white" opacity="0.8" />
      </g>
      {/* Back hills */}
      <path d="M0 135 Q80 105, 160 125 Q240 145, 320 120 L400 115 L400 200 L0 200 Z" fill="#16A34A" opacity="0.35" />
      {/* Front hills */}
      <path d="M0 155 Q60 130, 130 150 Q200 165, 270 145 Q330 135, 400 150 L400 200 L0 200 Z" fill="#22C55E" opacity="0.45" />
      {/* Trees */}
      <g transform="translate(35, 130)">
        <rect x="-2" y="0" width="4" height="14" rx="1" fill="#92400E" />
        <circle cx="0" cy="-5" r="11" fill="#15803D" opacity="0.8" />
        <circle cx="-7" cy="-2" r="7" fill="#16A34A" opacity="0.7" />
        <circle cx="7" cy="-2" r="7" fill="#16A34A" opacity="0.7" />
      </g>
      <g transform="translate(365, 135)">
        <rect x="-2" y="0" width="4" height="12" rx="1" fill="#92400E" />
        <circle cx="0" cy="-4" r="9" fill="#15803D" opacity="0.8" />
        <circle cx="-5" cy="-1" r="6" fill="#16A34A" opacity="0.7" />
      </g>
      {/* Water stream */}
      <path d="M120 165 Q170 158, 220 165 L220 175 Q170 170, 120 175 Z" fill="#3B82F6" opacity="0.35" />
      <path d="M130 167 Q170 162, 210 167" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
      {/* Shield */}
      <g transform="translate(200, 80)">
        <path d="M0 -42 L38 -26 L38 16 C38 38, 22 54, 0 60 C-22 54, -38 38, -38 16 L-38 -26 Z"
          fill="white" opacity="0.95" />
        <path d="M0 -35 L32 -22 L32 12 C32 30, 18 45, 0 50 C-18 45, -32 30, -32 12 L-32 -22 Z"
          fill="#16A34A" />
        <path d="M-14 6 L-4 17 L16 -8" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ===== Moderate Scene — shield with caution, partial landscape ===== */
function ModerateScene() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="modSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#modSky)" />
      {/* Cloud */}
      <g opacity="0.5">
        <ellipse cx="60" cy="35" rx="20" ry="8" fill="white" />
        <ellipse cx="75" cy="38" rx="14" ry="6" fill="white" opacity="0.8" />
      </g>
      {/* Hills */}
      <path d="M0 140 Q80 115, 160 135 Q240 150, 320 130 L400 125 L400 200 L0 200 Z" fill="#D97706" opacity="0.3" />
      <path d="M0 160 Q60 140, 130 155 Q200 165, 270 150 Q330 142, 400 155 L400 200 L0 200 Z" fill="#F59E0B" opacity="0.35" />
      {/* Partially dry tree */}
      <g transform="translate(40, 135)">
        <rect x="-2" y="0" width="4" height="14" rx="1" fill="#92400E" />
        <circle cx="0" cy="-4" r="8" fill="#D97706" opacity="0.6" />
        <circle cx="-5" cy="-1" r="5" fill="#F59E0B" opacity="0.5" />
      </g>
      {/* Murky water */}
      <path d="M130 165 Q180 160, 230 165 L230 175 Q180 170, 130 175 Z" fill="#D97706" opacity="0.3" />
      {/* Shield */}
      <g transform="translate(200, 80)">
        <path d="M0 -42 L38 -26 L38 16 C38 38, 22 54, 0 60 C-22 54, -38 38, -38 16 L-38 -26 Z"
          fill="white" opacity="0.95" />
        <path d="M0 -35 L32 -22 L32 12 C32 30, 18 45, 0 50 C-18 45, -32 30, -32 12 L-32 -22 Z"
          fill="#D97706" />
        {/* Exclamation */}
        <line x1="0" y1="-15" x2="0" y2="12" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <circle cx="0" cy="22" r="3.5" fill="white" />
      </g>
    </svg>
  );
}

/* ===== Danger Scene — shield with warning, barren land, dead tree ===== */
function DangerScene() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dangerSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#dangerSky)" />
      {/* Dark clouds */}
      <g opacity="0.4">
        <ellipse cx="70" cy="35" rx="24" ry="10" fill="#7F1D1D" />
        <ellipse cx="85" cy="40" rx="16" ry="7" fill="#991B1B" opacity="0.8" />
      </g>
      <g opacity="0.3">
        <ellipse cx="320" cy="28" rx="20" ry="8" fill="#7F1D1D" />
      </g>
      {/* Cracked ground */}
      <path d="M0 145 Q80 125, 160 140 Q240 155, 320 135 L400 130 L400 200 L0 200 Z" fill="#991B1B" opacity="0.3" />
      <path d="M0 160 Q60 145, 130 155 Q200 165, 270 150 Q330 145, 400 155 L400 200 L0 200 Z" fill="#DC2626" opacity="0.35" />
      {/* Crack lines */}
      <path d="M80 165 L95 172 L88 180" fill="none" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
      <path d="M250 160 L265 168 L258 178" fill="none" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
      {/* Dead tree */}
      <g transform="translate(45, 140)">
        <rect x="-2" y="0" width="4" height="14" rx="1" fill="#451A03" />
        <path d="M0 -2 L-10 -12 M0 -2 L10 -14 M0 -6 L-8 -16 M0 -6 L8 -18" fill="none" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Polluted puddle */}
      <path d="M140 165 Q190 160, 240 165 L240 178 Q190 173, 140 178 Z" fill="#7F1D1D" opacity="0.35" />
      <circle cx="165" cy="168" r="1.5" fill="#450A0A" opacity="0.5" />
      <circle cx="195" cy="170" r="1.5" fill="#450A0A" opacity="0.5" />
      <circle cx="220" cy="167" r="1.5" fill="#450A0A" opacity="0.5" />
      {/* Shield */}
      <g transform="translate(200, 80)">
        <path d="M0 -42 L38 -26 L38 16 C38 38, 22 54, 0 60 C-22 54, -38 38, -38 16 L-38 -26 Z"
          fill="white" opacity="0.95" />
        <path d="M0 -35 L32 -22 L32 12 C32 30, 18 45, 0 50 C-18 45, -32 30, -32 12 L-32 -22 Z"
          fill="#DC2626" />
        {/* Exclamation */}
        <line x1="0" y1="-15" x2="0" y2="12" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <circle cx="0" cy="22" r="3.5" fill="white" />
      </g>
    </svg>
  );
}