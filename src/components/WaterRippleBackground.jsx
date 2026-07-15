import React from "react";

/**
 * Premium warm healthcare background — soft mesh gradients,
 * organic blobs, light water ripples, floating particles.
 */
export default function WaterRippleBackground() {
  return (
    <div className="mesh-bg">
      {/* ===== Soft Mesh Gradient Orbs ===== */}
      <div className="mesh-orb animate-mesh-drift" style={{ width: "500px", height: "500px", top: "-100px", right: "-60px", background: "radial-gradient(circle, hsl(187 85% 55%), transparent 70%)", animationDelay: "0s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "420px", height: "420px", top: "30%", left: "-80px", background: "radial-gradient(circle, hsl(152 60% 55%), transparent 70%)", animationDelay: "5s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "460px", height: "460px", bottom: "-100px", right: "15%", background: "radial-gradient(circle, hsl(200 82% 60%), transparent 70%)", animationDelay: "10s" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "360px", height: "360px", top: "15%", left: "25%", background: "radial-gradient(circle, hsl(255 65% 70%), transparent 70%)", animationDelay: "7s", opacity: "0.06" }} />
      <div className="mesh-orb animate-mesh-drift" style={{ width: "320px", height: "320px", bottom: "10%", left: "-40px", background: "radial-gradient(circle, hsl(38 85% 60%), transparent 70%)", animationDelay: "12s", opacity: "0.05" }} />

      {/* ===== Water Ripple Circles ===== */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-400/8"
            style={{ width: "280px", height: "280px", animation: `ripple 14s ease-out infinite`, animationDelay: `${i * 4}s` }}
          />
        ))}
      </div>

      {/* ===== Wave Pattern at Bottom ===== */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,100 640,20 960,60 C1280,100 1440,40 1440,60 L1440,120 L0,120 Z" fill="hsl(187 85% 55% / 0.025)" />
          <path d="M0,80 C360,50 720,110 1080,70 C1260,50 1440,80 1440,80 L1440,120 L0,120 Z" fill="hsl(152 60% 55% / 0.02)" />
          <path d="M0,100 C400,70 800,120 1200,90 C1320,80 1440,95 1440,95 L1440,120 L0,120 Z" fill="hsl(200 82% 60% / 0.018)" />
        </svg>
      </div>

      {/* ===== Floating Particles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 animate-float-up"
            style={{
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              left: `${(i * 10) % 100}%`,
              bottom: "0",
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${14 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* ===== Light Reflection Overlay ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(187 85% 55% / 0.03), transparent 70%)",
        }}
      />
    </div>
  );
}