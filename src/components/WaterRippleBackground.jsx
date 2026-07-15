import React from "react";

/**
 * Premium mesh-gradient background with soft drifting colored orbs.
 * Replaces flat backgrounds with elegant layered depth.
 */
export default function WaterRippleBackground() {
  return (
    <div className="mesh-bg">
      {/* Cyan orb — top right */}
      <div
        className="mesh-orb animate-mesh-drift"
        style={{
          width: "520px",
          height: "520px",
          top: "-120px",
          right: "-80px",
          background: "radial-gradient(circle, hsl(189 94% 50%), transparent 70%)",
          animationDelay: "0s",
        }}
      />
      {/* Purple orb — center left */}
      <div
        className="mesh-orb animate-mesh-drift"
        style={{
          width: "440px",
          height: "440px",
          top: "30%",
          left: "-100px",
          background: "radial-gradient(circle, hsl(258 90% 65%), transparent 70%)",
          animationDelay: "5s",
        }}
      />
      {/* Emerald orb — bottom right */}
      <div
        className="mesh-orb animate-mesh-drift"
        style={{
          width: "480px",
          height: "480px",
          bottom: "-120px",
          right: "15%",
          background: "radial-gradient(circle, hsl(160 84% 45%), transparent 70%)",
          animationDelay: "10s",
        }}
      />
      {/* Blue orb — top left */}
      <div
        className="mesh-orb animate-mesh-drift"
        style={{
          width: "380px",
          height: "380px",
          top: "10%",
          left: "20%",
          background: "radial-gradient(circle, hsl(217 91% 60%), transparent 70%)",
          animationDelay: "7s",
        }}
      />
      {/* Coral orb — bottom left */}
      <div
        className="mesh-orb animate-mesh-drift"
        style={{
          width: "340px",
          height: "340px",
          bottom: "5%",
          left: "-60px",
          background: "radial-gradient(circle, hsl(349 87% 60%), transparent 70%)",
          animationDelay: "14s",
          opacity: "0.08",
        }}
      />
    </div>
  );
}