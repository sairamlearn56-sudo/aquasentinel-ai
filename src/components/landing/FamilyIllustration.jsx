import React from "react";
import { motion } from "framer-motion";

/**
 * A warm SVG illustration showing a family with clean water —
 * stylized, modern, flat-design with soft gradients.
 */
export default function FamilyIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 200" className="w-full h-auto">
        <defs>
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(185, 80%, 60%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(185, 80%, 45%)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(190, 85%, 70%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(185, 80%, 50%)" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="bodyAdult" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(185, 70%, 55%)" />
            <stop offset="100%" stopColor="hsl(185, 75%, 42%)" />
          </linearGradient>
          <linearGradient id="bodyChild" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(175, 65%, 55%)" />
            <stop offset="100%" stopColor="hsl(175, 70%, 42%)" />
          </linearGradient>
          <linearGradient id="bodyElder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(200, 60%, 55%)" />
            <stop offset="100%" stopColor="hsl(200, 65%, 42%)" />
          </linearGradient>
        </defs>

        {/* Water surface wave */}
        <motion.path
          d="M0,150 Q100,135 200,150 T400,150 L400,200 L0,200 Z"
          fill="url(#waterGrad)"
          animate={{ d: [
            "M0,150 Q100,135 200,150 T400,150 L400,200 L0,200 Z",
            "M0,150 Q100,160 200,150 T400,150 L400,200 L0,200 Z",
            "M0,150 Q100,135 200,150 T400,150 L400,200 L0,200 Z",
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Water glass in center */}
        <g transform="translate(165, 95)">
          {/* Glass body */}
          <path d="M5,0 L55,0 L50,55 L10,55 Z" fill="url(#glassGrad)" stroke="hsl(185, 80%, 50%)" strokeWidth="1.5" opacity="0.8" />
          {/* Water inside */}
          <motion.path
            d="M8,12 L52,12 L48,53 L12,53 Z"
            fill="hsl(185, 80%, 55%)"
            opacity="0.6"
            animate={{ opacity: [0.6, 0.75, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Water surface line */}
          <motion.path
            d="M8,12 Q30,8 52,12"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.6"
            animate={{ d: ["M8,12 Q30,8 52,12", "M8,12 Q30,16 52,12", "M8,12 Q30,8 52,12"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Sparkle */}
          <circle cx="20" cy="25" r="2" fill="white" opacity="0.7" />
        </g>

        {/* Adult (left) */}
        <g transform="translate(70, 60)">
          <circle cx="25" cy="20" r="14" fill="hsl(35, 60%, 70%)" />
          <path d="M10,40 Q25,32 40,40 L42,95 Q25,100 8,95 Z" fill="url(#bodyAdult)" />
          <circle cx="25" cy="90" r="3" fill="white" opacity="0.4" />
        </g>

        {/* Child (left-center) */}
        <g transform="translate(115, 85)">
          <circle cx="18" cy="14" r="10" fill="hsl(35, 65%, 72%)" />
          <path d="M6,28 Q18,22 30,28 L31,65 Q18,68 5,65 Z" fill="url(#bodyChild)" />
        </g>

        {/* Elder (right) */}
        <g transform="translate(285, 55)">
          <circle cx="22" cy="20" r="13" fill="hsl(35, 55%, 68%)" />
          {/* Gray hair */}
          <path d="M10,16 Q22,6 34,16 Q34,12 22,8 Q10,12 10,16" fill="hsl(220, 10%, 70%)" />
          <path d="M7,40 Q22,32 37,40 L39,100 Q22,105 5,100 Z" fill="url(#bodyElder)" />
        </g>

        {/* Child (right-center) */}
        <g transform="translate(335, 85)">
          <circle cx="15" cy="12" r="9" fill="hsl(35, 65%, 72%)" />
          <path d="M5,24 Q15,19 25,24 L26,55 Q15,58 4,55 Z" fill="url(#bodyChild)" />
        </g>

        {/* Floating bubbles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={140 + i * 35}
            cy={170}
            r={2 + (i % 2)}
            fill="white"
            opacity="0.4"
            animate={{ y: [0, -30, -60], opacity: [0.4, 0.2, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
          />
        ))}
      </svg>
    </div>
  );
}