import React from "react";

/**
 * Premium layered background — mesh gradient orbs, wave patterns,
 * water ripples, floating particles, and light reflections.
 */
export default function WaterRippleBackground() {
  return (
    <div className="mesh-bg">
      {/* ===== Mesh Gradient Orbs ===== */}
      <div className="mesh-orb animate-mesh-drift" style={{ width: "520px", height: "520px", top: "-120px", right: "-80px", background: "radial-gradient(circle, hsl(189 94% 50%), transparent 70%)", animationDelay: "0s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "440px", height: "440px", top: "30%", left: "-100px", background: "radial-gradient(circle, hsl(258 90% 65%), transparent 70%)", animationDelay: "5s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "480px", height: "480px", bottom: "-120px", right: "15%", background: "radial-gradient(circle, hsl(160 84% 45%), transparent 70%)", animationDelay: "10s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "380px", height: "380px", top: "10%", left: "20%", background: "radial-gradient(circle, hsl(217 91% 60%), transparent 70%)", animationDelay: "7s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "340px", height: "340px", bottom: "5%", left: "-60px", background: "radial-gradient(circle, hsl(349 87% 60%), transparent 70%)", animationDelay: "14s", opacity: "0.06" }} />

      {/* ===== Water Ripple Circles ===== */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-500/5"
            style={{ width: "300px", height: "300px", animation: `ripple 12s ease-out infinite`, animationDelay: `${i * 3}s` }}
          />
        ))}
      </div>

      {/* ===== Wave Pattern at Bottom ===== */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,100 640,20 960,60 C1280,100 1440,40 1440,60 L1440,120 L0,120 Z" fill="hsl(var(--primary) / 0.03)" />
          <path d="M0,80 C360,50 720,110 1080,70 C1260,50 1440,80 1440,80 L1440,120 L0,120 Z" fill="hsl(var(--purple) / 0.025)" />
          <path d="M0,100 C400,70 800,120 1200,90 C1320,80 1440,95 1440,95 L1440,120 L0,120 Z" fill="hsl(var(--blue) / 0.02)" />
        </svg>
      </div>

      {/* ===== Floating Particles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500/10 animate-float-up"
            style={{
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              left: `${(i * 8) % 100}%`,
              bottom: "0",
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${12 + (i % 6) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* ===== Light Reflection Overlay ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(189 94% 50% / 0.04), transparent 70%)",
        }}
      />
    </div>
  );
}