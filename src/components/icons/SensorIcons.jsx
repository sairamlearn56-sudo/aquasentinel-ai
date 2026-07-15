import React from "react";

/** Premium 3D-style SVG icons for water quality sensors — uses currentColor for status adaptation */

export function PhIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="phGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="phShine" cx="30%" cy="20%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="10" ry="2" fill="currentColor" opacity="0.1" />
      <path d="M24 6 C24 6, 12 18, 12 28 C12 35, 17 40, 24 40 C31 40, 36 35, 36 28 C36 18, 24 6, 24 6 Z"
        fill="url(#phGrad)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="18" y="25" width="12" height="2.5" rx="1.25" fill="currentColor" opacity="0.8" />
      <rect x="18" y="29.5" width="8" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="18" y="33.5" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <circle cx="24" cy="18" r="1.5" fill="white" opacity="0.7" />
      <ellipse cx="20" cy="14" rx="3" ry="7" fill="url(#phShine)" />
    </svg>
  );
}

export function TdsIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="tdsCenter" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="tdsSat" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </radialGradient>
        <radialGradient id="tdsShine" cx="30%" cy="20%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="19" y1="21" x2="14" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="29" y1="21" x2="34" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="19" y1="27" x2="14" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="29" y1="27" x2="34" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="24" cy="24" r="7" fill="url(#tdsCenter)" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="13" r="4.5" fill="url(#tdsSat)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="37" cy="13" r="4.5" fill="url(#tdsSat)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="35" r="4.5" fill="url(#tdsSat)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="37" cy="35" r="4.5" fill="url(#tdsSat)" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="22" cy="21" rx="2.5" ry="3" fill="url(#tdsShine)" />
      <ellipse cx="9.5" cy="11" rx="1.5" ry="2" fill="white" opacity="0.3" />
      <ellipse cx="35.5" cy="11" rx="1.5" ry="2" fill="white" opacity="0.3" />
    </svg>
  );
}

export function TurbidityIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="turbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="turbShine" cx="28%" cy="15%" r="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="11" ry="2" fill="currentColor" opacity="0.1" />
      <path d="M14 10 L14 14 L12 36 C12 39, 14 41, 17 41 L31 41 C34 41, 36 39, 36 36 L34 14 L34 10"
        fill="url(#turbGrad)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 24 Q18 22, 24 24 T35 24 L36 36 C36 39, 34 41, 31 41 L17 41 C14 41, 12 39, 12 36 Z"
        fill="currentColor" fillOpacity="0.12" />
      <circle cx="19" cy="29" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="26" cy="33" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="27" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="36" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="31" cy="35" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="16" cy="33" r="1" fill="currentColor" opacity="0.3" />
      <path d="M14 18 L34 18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <ellipse cx="18" cy="14" rx="3" ry="4" fill="url(#turbShine)" />
    </svg>
  );
}

export function TemperatureIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="tempBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="tempMercury" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" />
        </linearGradient>
        <radialGradient id="tempBulb" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" />
        </radialGradient>
        <radialGradient id="tempShine" cx="28%" cy="20%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="44" rx="8" ry="2" fill="currentColor" opacity="0.1" />
      <rect x="21" y="8" width="6" height="24" rx="3" fill="url(#tempBody)" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="36" r="7.5" fill="url(#tempBulb)" stroke="currentColor" strokeWidth="2" />
      <rect x="22.5" y="18" width="3" height="16" rx="1.5" fill="url(#tempMercury)" />
      <circle cx="24" cy="36" r="4" fill="currentColor" />
      <line x1="30" y1="14" x2="33" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="30" y1="20" x2="33" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="30" y1="26" x2="33" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="22.5" cy="14" rx="1.5" ry="5" fill="url(#tempShine)" />
    </svg>
  );
}