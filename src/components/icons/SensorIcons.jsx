import React from "react";

/** Premium custom SVG icons for water quality sensors */

export function PhIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M24 6 C24 6, 12 18, 12 28 C12 35, 17 40, 24 40 C31 40, 36 35, 36 28 C36 18, 24 6, 24 6 Z"
        fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="18" y="25" width="12" height="2.5" rx="1.25" fill="currentColor" />
      <rect x="18" y="29.5" width="8" height="2" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="18" y="33.5" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="18" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function TdsIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="13" r="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <circle cx="37" cy="13" r="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="35" r="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <circle cx="37" cy="35" r="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <line x1="19" y1="21" x2="14" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="21" x2="34" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="27" x2="14" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="27" x2="34" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TurbidityIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M14 10 L14 14 L12 36 C12 39, 14 41, 17 41 L31 41 C34 41, 36 39, 36 36 L34 14 L34 10"
        fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 24 Q18 22, 24 24 T35 24 L36 36 C36 39, 34 41, 31 41 L17 41 C14 41, 12 39, 12 36 Z"
        fill="currentColor" fillOpacity="0.1" />
      <circle cx="19" cy="30" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="26" cy="33" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="28" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="36" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="31" cy="35" r="1.2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function TemperatureIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="21" y="8" width="6" height="24" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="36" r="7" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <rect x="22.5" y="18" width="3" height="16" rx="1.5" fill="currentColor" />
      <circle cx="24" cy="36" r="3.5" fill="currentColor" />
      <line x1="30" y1="14" x2="33" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="20" x2="33" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="26" x2="33" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}