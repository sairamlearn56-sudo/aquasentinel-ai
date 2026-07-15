import React from "react";

/**
 * Premium hero illustration for the AquaSentinel AI landing page.
 * Features a large water drop with shield, clean water, family, and nature.
 */
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 500 260" className="w-full h-auto" fill="none">
      <defs>
        <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#F0FDFA" />
        </linearGradient>
        <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Soft background circles */}
      <circle cx="250" cy="100" r="90" fill="#A7F3D0" opacity="0.15" />
      <circle cx="250" cy="100" r="70" fill="#67E8F9" opacity="0.1" />

      {/* Large water drop */}
      <g transform="translate(250, 110)">
        <path d="M0 -60 C0 -60, -45 -15, -45 20 C-45 45, -25 60, 0 60 C25 60, 45 45, 45 20 C45 -15, 0 -60, 0 -60 Z"
          fill="url(#dropGrad)" opacity="0.9" />
        {/* Shine on drop */}
        <ellipse cx="-18" cy="0" rx="8" ry="20" fill="white" opacity="0.25" />

        {/* Shield inside drop */}
        <g transform="translate(0, 15)">
          <path d="M0 -28 L22 -18 L22 8 C22 20, 12 30, 0 34 C-12 30, -22 20, -22 8 L-22 -18 Z"
            fill="url(#shieldGrad)" />
          <path d="M0 -22 L17 -14 L17 5 C17 14, 9 22, 0 25 C-9 22, -17 14, -17 5 L-17 -14 Z"
            fill="#10B981" />
          <path d="M-8 3 L-2 9 L9 -4" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* Water ripples below drop */}
      <ellipse cx="250" cy="180" rx="60" ry="6" fill="#0891B2" opacity="0.2" />
      <ellipse cx="250" cy="180" rx="45" ry="4" fill="#0891B2" opacity="0.3" />

      {/* Left: Tree */}
      <g transform="translate(80, 140)">
        <rect x="-3" y="0" width="6" height="30" rx="2" fill="#92400E" />
        <circle cx="0" cy="-8" r="20" fill="#16A34A" opacity="0.8" />
        <circle cx="-12" cy="-4" r="13" fill="#15803D" opacity="0.7" />
        <circle cx="12" cy="-4" r="13" fill="#15803D" opacity="0.7" />
        <circle cx="0" cy="-18" r="12" fill="#22C55E" opacity="0.7" />
      </g>

      {/* Right: Family silhouettes */}
      <g transform="translate(400, 130)">
        {/* Adult */}
        <circle cx="0" cy="0" r="8" fill="#0891B2" opacity="0.7" />
        <path d="M-7 8 L-7 35 L7 35 L7 8 Z" fill="#0891B2" opacity="0.7" />
        {/* Child */}
        <circle cx="20" cy="12" r="6" fill="#0891B2" opacity="0.6" />
        <path d="M15 18 L15 35 L25 35 L25 18 Z" fill="#0891B2" opacity="0.6" />
      </g>

      {/* Hills */}
      <path d="M0 175 Q125 155, 250 170 Q375 185, 500 160 L500 260 L0 260 Z" fill="url(#hillGrad)" opacity="0.3" />
      <path d="M0 195 Q100 175, 200 190 Q300 200, 400 185 Q450 180, 500 190 L500 260 L0 260 Z" fill="url(#hillGrad)" opacity="0.4" />

      {/* Water stream */}
      <path d="M200 185 Q250 180, 300 185 L300 200 Q250 195, 200 200 Z" fill="url(#waterGrad)" opacity="0.4" />
      <path d="M210 187 Q250 183, 290 187" fill="none" stroke="#93C5FD" strokeWidth="1.5" opacity="0.5" />

      {/* Small floating particles (clean water indicators) */}
      <circle cx="120" cy="60" r="3" fill="#67E8F9" opacity="0.5" />
      <circle cx="380" cy="50" r="2.5" fill="#67E8F9" opacity="0.4" />
      <circle cx="430" cy="80" r="2" fill="#A7F3D0" opacity="0.5" />
      <circle cx="70" cy="90" r="2" fill="#A7F3D0" opacity="0.4" />

      {/* Sun */}
      <circle cx="460" cy="35" r="14" fill="#FCD34D" opacity="0.8" />
      <circle cx="460" cy="35" r="20" fill="#FCD34D" opacity="0.2" />
    </svg>
  );
}