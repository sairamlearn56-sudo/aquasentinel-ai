import React from "react";

/**
 * Premium medical illustrations for waterborne diseases.
 * Each disease has a unique color and recognizable anatomical/microbial illustration.
 */

const DISEASE_CONFIG = {
  diarrhea: {
    color: "#F59E0B",
    Illustration: DiarrheaSvg,
  },
  typhoid: {
    color: "#EF4444",
    Illustration: TyphoidSvg,
  },
  cholera: {
    color: "#DC2626",
    Illustration: CholeraSvg,
  },
  hepatitisA: {
    color: "#EAB308",
    Illustration: HepatitisSvg,
  },
  dysentery: {
    color: "#F43F5E",
    Illustration: DysenterySvg,
  },
  skinInfections: {
    color: "#8B5CF6",
    Illustration: SkinInfectionSvg,
  },
};

export function getDiseaseConfig(name) {
  return DISEASE_CONFIG[name] || { color: "#64748B", Illustration: DefaultSvg };
}

function DiarrheaSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M16 12 Q10 16, 12 24 Q6 28, 10 36 Q16 42, 24 39 Q32 42, 38 36 Q42 28, 36 24 Q38 16, 32 12 Q24 9, 16 12 Z"
        fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 20 Q24 23, 30 20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M16 28 Q24 31, 32 28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M18 35 Q24 37, 30 35" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

function TyphoidSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="14" y="18" width="22" height="12" rx="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <circle cx="21" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="28" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
      <path d="M36 21 L42 17 M36 24 L44 24 M36 27 L42 31" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CholeraSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M16 14 Q10 24, 16 34 Q26 38, 32 30 Q35 22, 28 16 Q22 12, 16 14 Z"
        fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 30 Q38 33, 41 37" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function HepatitisSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M10 16 Q13 8, 26 10 Q40 8, 42 18 Q44 30, 37 38 Q24 43, 14 38 Q7 30, 10 16 Z"
        fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 16 Q24 24, 30 16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="25" y1="14" x2="25" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function DysenterySvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M12 24 Q12 12, 22 12 Q32 12, 32 22 Q32 32, 22 32 Q12 32, 12 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 22 Q32 14, 40 14 Q44 18, 42 24 Q40 30, 34 28"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="20" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="25" cy="26" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="37" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function SkinInfectionSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M22 10 Q19 14, 19 22 L17 30 Q17 38, 25 40 L33 40 Q40 38, 40 30 L38 22 Q38 14, 35 10 Q33 7, 31 10 Q29 7, 27 10 Q25 7, 22 10 Z"
        fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="23" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="27" cy="30" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="33" cy="18" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="22" cy="28" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function DefaultSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="14" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
      <path d="M18 24 L22 28 L30 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}