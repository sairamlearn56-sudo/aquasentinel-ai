import React from "react";

/**
 * Premium subtle healthcare background — soft mesh gradients,
 * gentle water ripples, minimal floating particles.
 */
export default function WaterRippleBackground() {
  return (
    <div className="mesh-bg">
      {/* ===== Soft Mesh Gradient Orbs ===== */}
      <div className="mesh-orb animate-mesh-drift" style={{ width: "480px", height: "480px", top: "-100px", right: "-60px", background: "radial-gradient(circle, hsl(186 78% 55%), transparent 70%)", animationDelay: "0s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "400px", height: "400px", top: "30%", left: "-80px", background: "radial-gradient(circle, hsl(152 56% 55%), transparent 70%)", animationDelay: "5s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "440px", height: "440px", bottom: "-100px", right: "15%", background: "radial-gradient(circle, hsl(202 78% 60%), transparent 70%)", animationDelay: "10s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "340px", height: "340px", top: "15%", left: "25%", background: "radial-gradient(circle, hsl(252 58% 70%), transparent 70%)", animationDelay: "7s", opacity: "0.04" }} />

      {/* ===== Water Ripple Circles ===== */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-400/6"
            style={{ width: "260px", height: "260px", animation: `ripple 16s ease-out infinite`, animationDelay: `${i * 5}s` }}
          />
        ))}
      </div>

      {/* ===== Wave Pattern at Bottom ===== */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,100 640,20 960,60 C1280,100 1440,40 1440,60 L1440,120 L0,120 Z" fill="hsl(186 78% 55% / 0.02)" />
          <path d="M0,80 C360,50 720,110 1080,70 C1260,50 1440,80 1440,80 L1440,120 L0,120 Z" fill="hsl(152 56% 55% / 0.015)" />
          <path d="M0,100 C400,70 800,120 1200,90 C1320,80 1440,95 1440,95 L1440,120 L0,120 Z" fill="hsl(202 78% 60% / 0.012)" />
        </svg>
      </div>

      {/* ===== Floating Particles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/8 animate-float-up"
            style={{
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              left: `${(i * 12) % 100}%`,
              bottom: "0",
              animationDelay: `${i * 2}s`,
              animationDuration: `${16 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* ===== Soft Light Overlay ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(186 78% 55% / 0.022), transparent 70%)",
        }}
      />
    </div>
  );
}