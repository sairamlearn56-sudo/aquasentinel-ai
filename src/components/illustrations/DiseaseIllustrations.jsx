import React from "react";

/**
 * Premium 3D-style medical illustrations for waterborne diseases.
 * Each disease has a unique gradient, highlight, and shadow for depth.
 */

const DISEASE_CONFIG = {
  diarrhea: { color: "#F59E0B", Illustration: DiarrheaSvg },
  typhoid: { color: "#EF4444", Illustration: TyphoidSvg },
  cholera: { color: "#DC2626", Illustration: CholeraSvg },
  hepatitisA: { color: "#EAB308", Illustration: HepatitisSvg },
  dysentery: { color: "#F43F5E", Illustration: DysenterySvg },
  skinInfections: { color: "#8B5CF6", Illustration: SkinInfectionSvg },
};

export function getDiseaseConfig(name) {
  return DISEASE_CONFIG[name] || { color: "#64748B", Illustration: DefaultSvg };
}

function DiarrheaSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="diarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="diarShine" cx="32%" cy="25%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.5" fill="#000" opacity="0.12" />
      <path d="M16 10 Q9 14, 11 24 Q5 28, 10 36 Q17 42, 25 38 Q33 42, 38 35 Q42 27, 36 23 Q38 14, 31 10 Q23 7, 16 10 Z"
        fill="url(#diarGrad)" stroke="#92400E" strokeWidth="1" strokeLinejoin="round" />
      <path d="M17 18 Q24 21, 31 18" fill="none" stroke="#92400E" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <path d="M15 25 Q24 28, 33 25" fill="none" stroke="#92400E" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <path d="M17 32 Q24 34, 31 32" fill="none" stroke="#92400E" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      <path d="M24 20 C24 20, 21 26, 24 30 C27 26, 24 20, 24 20 Z" fill="#FBBF24" opacity="0.5" />
      <ellipse cx="18" cy="16" rx="4" ry="7" fill="url(#diarShine)" />
    </svg>
  );
}

function TyphoidSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="typhGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <radialGradient id="typhShine" cx="35%" cy="25%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="14" ry="2.5" fill="#000" opacity="0.12" />
      <rect x="12" y="18" width="24" height="13" rx="6.5" fill="url(#typhGrad)" stroke="#7F1D1D" strokeWidth="1" />
      <path d="M36 20 L42 16 M36 21 L43 21 M36 22 L43 24 M36 23 L42 28 M12 20 L6 16 M12 21 L5 21 M12 22 L5 24 M12 23 L6 28"
        fill="none" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <circle cx="19" cy="24" r="1.8" fill="#7F1D1D" opacity="0.4" />
      <circle cx="26" cy="24" r="1.5" fill="#7F1D1D" opacity="0.3" />
      <circle cx="30" cy="26" r="1" fill="#7F1D1D" opacity="0.3" />
      <ellipse cx="18" cy="20" rx="5" ry="3.5" fill="url(#typhShine)" />
    </svg>
  );
}

function CholeraSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="cholGrad" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FECACA" />
          <stop offset="45%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>
        <radialGradient id="cholShine" cx="30%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.5" fill="#000" opacity="0.12" />
      <path d="M14 12 Q7 22, 13 33 Q23 38, 29 29 Q33 20, 25 14 Q18 10, 14 12 Z"
        fill="url(#cholGrad)" stroke="#7F1D1D" strokeWidth="1" strokeLinejoin="round" />
      <path d="M29 29 Q35 32, 39 36 Q41 38, 43 36" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      <path d="M29 29 Q33 26, 37 26" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="19" cy="21" r="1.8" fill="#7F1D1D" opacity="0.35" />
      <circle cx="22" cy="27" r="1.2" fill="#7F1D1D" opacity="0.3" />
      <ellipse cx="17" cy="17" rx="4" ry="7" fill="url(#cholShine)" />
    </svg>
  );
}

function HepatitisSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="hepGrad" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="45%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        <radialGradient id="hepShine" cx="32%" cy="25%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="15" ry="2.5" fill="#000" opacity="0.12" />
      <path d="M8 16 Q11 7, 25 9 Q40 7, 42 18 Q44 31, 36 39 Q22 44, 12 38 Q5 30, 8 16 Z"
        fill="url(#hepGrad)" stroke="#78350F" strokeWidth="1" strokeLinejoin="round" />
      <path d="M20 14 Q25 22, 31 14" fill="none" stroke="#78350F" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <path d="M24 12 L24 38" fill="none" stroke="#78350F" strokeWidth="1.2" opacity="0.25" />
      <circle cx="17" cy="22" r="2" fill="#FBBF24" opacity="0.4" />
      <circle cx="30" cy="28" r="1.5" fill="#FBBF24" opacity="0.4" />
      <circle cx="22" cy="32" r="1.5" fill="#FBBF24" opacity="0.3" />
      <ellipse cx="16" cy="14" rx="5" ry="8" fill="url(#hepShine)" />
    </svg>
  );
}

function DysenterySvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="dysGrad" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FECDD3" />
          <stop offset="45%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <radialGradient id="dysShine" cx="30%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dysNuc" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="100%" stopColor="#9F1239" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="14" ry="2.5" fill="#000" opacity="0.12" />
      <path d="M10 22 Q8 10, 20 8 Q32 7, 36 18 Q40 28, 32 34 Q38 38, 40 42 Q34 44, 28 40 Q18 42, 12 36 Q6 30, 10 22 Z"
        fill="url(#dysGrad)" stroke="#881337" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="22" cy="22" r="6" fill="url(#dysNuc)" opacity="0.7" />
      <circle cx="22" cy="22" r="3" fill="#9F1239" opacity="0.5" />
      <circle cx="30" cy="14" r="1.5" fill="#9F1239" opacity="0.3" />
      <circle cx="32" cy="28" r="1.2" fill="#9F1239" opacity="0.3" />
      <ellipse cx="16" cy="14" rx="4" ry="6" fill="url(#dysShine)" />
    </svg>
  );
}

function SkinInfectionSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <radialGradient id="skinShine" cx="32%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.5" fill="#000" opacity="0.12" />
      <path d="M22 8 Q18 12, 18 20 L16 28 Q15 37, 24 40 L34 40 Q41 37, 40 28 L38 20 Q38 12, 34 8 Q32 5, 30 8 Q28 5, 26 8 Q24 5, 22 8 Z"
        fill="url(#skinGrad)" stroke="#4C1D95" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="23" cy="18" r="2.5" fill="#A78BFA" opacity="0.5" />
      <circle cx="30" cy="22" r="2" fill="#A78BFA" opacity="0.5" />
      <circle cx="26" cy="28" r="2.5" fill="#A78BFA" opacity="0.5" />
      <circle cx="33" cy="16" r="1.5" fill="#A78BFA" opacity="0.4" />
      <circle cx="21" cy="26" r="1.5" fill="#A78BFA" opacity="0.4" />
      <path d="M18 34 Q24 36, 30 34 Q35 36, 40 35" fill="none" stroke="#4C1D95" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <ellipse cx="22" cy="14" rx="4" ry="5" fill="url(#skinShine)" />
    </svg>
  );
}

function DefaultSvg({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="defGrad" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="13" ry="2.5" fill="#000" opacity="0.1" />
      <circle cx="24" cy="24" r="15" fill="url(#defGrad)" stroke="#334155" strokeWidth="1" />
      <path d="M17 24 L22 29 L31 19" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}