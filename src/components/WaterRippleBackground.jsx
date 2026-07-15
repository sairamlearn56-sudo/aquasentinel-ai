import React from "react";

/**
 * Static dark healthcare background — subtle fixed gradient, no motion.
 */
export default function WaterRippleBackground() {
  return (
    <div className="mesh-bg">
      {/* Static subtle gradient orbs (no animation) */}
      <div className="mesh-orb" style={{ width: "500px", height: "500px", top: "-100px", right: "-60px", background: "radial-gradient(circle, hsl(173 66% 50%), transparent 70%)" }} />
      <div className="mesh-orb" style={{ width: "420px", height: "420px", bottom: "-80px", left: "10%", background: "radial-gradient(circle, hsl(199 92% 60%), transparent 70%)" }} />

      {/* Static wave pattern at bottom */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,100 640,20 960,60 C1280,100 1440,40 1440,60 L1440,120 L0,120 Z" fill="hsl(173 66% 50% / 0.015)" />
          <path d="M0,80 C360,50 720,110 1080,70 C1260,50 1440,80 1440,80 L1440,120 L0,120 Z" fill="hsl(199 92% 60% / 0.01)" />
        </svg>
      </div>
    </div>
  );
}