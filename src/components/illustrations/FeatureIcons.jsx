import React from "react";

/** Premium 3D-style feature illustrations for the landing page feature cards */

export function FeatureIconAI({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="aiBrain" cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
        <radialGradient id="aiShine" cx="32%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="13" ry="2.5" fill="#000" opacity="0.1" />
      <path d="M24 8 Q14 8, 12 18 Q8 22, 12 28 Q10 36, 20 38 Q24 40, 28 38 Q38 36, 36 28 Q40 22, 36 18 Q34 8, 24 8 Z"
        fill="url(#aiBrain)" stroke="#4C1D95" strokeWidth="1" strokeLinejoin="round" />
      <path d="M24 10 L24 36 M16 16 Q24 20, 32 16 M14 24 Q24 28, 34 24 M16 32 Q24 34, 32 32"
        fill="none" stroke="#4C1D95" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <circle cx="18" cy="20" r="1.5" fill="#C4B5FD" opacity="0.7" />
      <circle cx="30" cy="20" r="1.5" fill="#C4B5FD" opacity="0.7" />
      <circle cx="24" cy="26" r="1.5" fill="#C4B5FD" opacity="0.7" />
      <circle cx="20" cy="30" r="1.2" fill="#C4B5FD" opacity="0.5" />
      <circle cx="28" cy="30" r="1.2" fill="#C4B5FD" opacity="0.5" />
      <ellipse cx="18" cy="14" rx="4" ry="6" fill="url(#aiShine)" />
    </svg>
  );
}

export function FeatureIconVoice({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="voiceMic" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <radialGradient id="voiceShine" cx="30%" cy="20%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="10" ry="2" fill="#000" opacity="0.1" />
      <path d="M10 30 Q24 36, 38 30" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M8 34 Q24 42, 40 34" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <rect x="19" y="8" width="10" height="20" rx="5" fill="url(#voiceMic)" stroke="#0E7490" strokeWidth="1" />
      <path d="M14 22 Q14 32, 24 32 Q34 32, 34 22" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="32" x2="24" y2="38" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="38" x2="28" y2="38" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="22" cy="14" rx="2" ry="5" fill="url(#voiceShine)" />
    </svg>
  );
}

export function FeatureIconLanguage({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="langGlobe" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#065F46" />
        </radialGradient>
        <radialGradient id="langShine" cx="30%" cy="22%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="13" ry="2.5" fill="#000" opacity="0.1" />
      <circle cx="24" cy="24" r="16" fill="url(#langGlobe)" stroke="#065F46" strokeWidth="1" />
      <ellipse cx="24" cy="24" rx="16" ry="7" fill="none" stroke="#065F46" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="24" cy="24" rx="7" ry="16" fill="none" stroke="#065F46" strokeWidth="0.8" opacity="0.4" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="#065F46" strokeWidth="0.8" opacity="0.4" />
      <line x1="24" y1="8" x2="24" y2="40" stroke="#065F46" strokeWidth="0.8" opacity="0.4" />
      <path d="M34 8 Q40 8, 40 14 Q40 18, 36 20 L40 26" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="18" cy="16" rx="4" ry="6" fill="url(#langShine)" />
    </svg>
  );
}

export function FeatureIconIoT({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="iotChip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <radialGradient id="iotShine" cx="30%" cy="20%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="12" ry="2.5" fill="#000" opacity="0.1" />
      <path d="M38 14 Q42 14, 42 18 M38 14 Q42 10, 38 10" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M40 12 Q44 12, 44 16 M40 12 Q44 8, 40 8" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <rect x="14" y="14" width="20" height="20" rx="3" fill="url(#iotChip)" stroke="#92400E" strokeWidth="1" />
      <rect x="18" y="18" width="12" height="12" rx="1.5" fill="#92400E" fillOpacity="0.3" stroke="#92400E" strokeWidth="0.8" />
      <line x1="14" y1="20" x2="10" y2="20" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="24" x2="10" y2="24" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="28" x2="10" y2="28" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="20" x2="38" y2="20" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="24" x2="38" y2="24" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="28" x2="38" y2="28" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="14" x2="20" y2="10" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="14" x2="24" y2="10" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="14" x2="28" y2="10" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="34" x2="20" y2="38" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="34" x2="24" y2="38" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="34" x2="28" y2="38" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2" fill="#FBBF24" opacity="0.8" />
      <ellipse cx="18" cy="18" rx="3" ry="4" fill="url(#iotShine)" />
    </svg>
  );
}