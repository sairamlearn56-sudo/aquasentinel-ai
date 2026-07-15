import React from "react";

export default function EmptyState({ title, description, illustration = "drop", action }) {
  const illustrations = {
    drop: (
      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-pulse-soft blur-xl" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
        <svg viewBox="0 0 100 100" className="relative w-full h-full animate-float">
          <defs>
            <linearGradient id="dropGradEmpty" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(189 94% 60%)" />
              <stop offset="100%" stopColor="hsl(217 91% 55%)" />
            </linearGradient>
          </defs>
          <path
            d="M50 15 C50 15, 25 45, 25 65 C25 80, 36 90, 50 90 C64 90, 75 80, 75 65 C75 45, 50 15, 50 15 Z"
            fill="url(#dropGradEmpty)"
            opacity="0.85"
          />
          <ellipse cx="42" cy="55" rx="6" ry="10" fill="white" opacity="0.4" />
        </svg>
      </div>
    ),
    history: (
      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
        <svg viewBox="0 0 100 100" className="relative w-full h-full animate-float">
          <defs>
            <linearGradient id="clockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(160 84% 45%)" />
              <stop offset="100%" stopColor="hsl(189 94% 50%)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#clockGrad)" strokeWidth="3" opacity="0.3" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#clockGrad)" strokeWidth="3" opacity="0.15" />
          <path d="M50 50 L50 30 M50 50 L65 55" stroke="url(#clockGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
      {illustrations[illustration] || illustrations.drop}
      <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}