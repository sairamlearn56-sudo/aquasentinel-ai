import React from "react";

/**
 * Premium custom icons for water safety recommendations.
 * Each icon is a detailed, professional SVG illustration.
 */

export function RecIconBoilWater({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Pot */}
      <path d="M10 22 L38 22 L35 38 C35 40, 33 42, 31 42 L17 42 C15 42, 13 40, 13 38 Z"
        fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Handles */}
      <path d="M10 24 Q6 24, 6 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 24 Q42 24, 42 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Water surface */}
      <path d="M13 26 Q24 24, 35 26 L35 30 Q24 28, 13 30 Z" fill="currentColor" fillOpacity="0.12" />
      {/* Bubbles */}
      <circle cx="18" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="17" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="30" cy="19" r="2" fill="currentColor" opacity="0.5" />
      {/* Steam */}
      <path d="M20 12 Q18 8, 22 6 Q20 4, 22 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M28 12 Q26 8, 30 6 Q28 4, 30 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function RecIconWaterTreatment({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Water drop */}
      <path d="M24 6 C24 6, 12 18, 12 28 C12 35, 17 40, 24 40 C31 40, 36 35, 36 28 C36 18, 24 6, 24 6 Z"
        fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Tablet/pill inside */}
      <rect x="18" y="22" width="12" height="8" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24" y1="22" x2="24" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Sparkle indicators (clean) */}
      <path d="M16 16 L17 18 L19 19 L17 20 L16 22 L15 20 L13 19 L15 18 Z" fill="currentColor" opacity="0.5" />
      <path d="M33 14 L33.5 15.5 L35 16 L33.5 16.5 L33 18 L32.5 16.5 L31 16 L32.5 15.5 Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function RecIconDoctor({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Medical cross in circle */}
      <circle cx="24" cy="24" r="16" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
      <rect x="21" y="14" width="6" height="20" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="21" width="20" height="6" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      {/* Pulse line */}
      <path d="M10 32 L16 32 L18 28 L21 36 L24 30 L27 34 L30 32 L38 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function RecIconEmergency({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Triangle warning */}
      <path d="M24 8 L40 36 L8 36 Z"
        fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Exclamation */}
      <line x1="24" y1="18" x2="24" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="33" r="2" fill="currentColor" />
      {/* Pulse waves */}
      <path d="M4 24 L10 24 L12 20 L15 28 L18 22 L20 24 L24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}