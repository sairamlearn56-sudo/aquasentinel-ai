import React from "react";

export default function WaterRippleBackground() {
  return (
    <div className="water-ripple">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="ripple-circle"
          style={{
            top: `${20 + i * 15}%`,
            left: `${15 + i * 18}%`,
            animationDelay: `${i * 1.6}s`,
            animationDuration: `${7 + i}s`,
          }}
        />
      ))}
      {/* Soft gradient orbs */}
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: "400px",
          height: "400px",
          top: "-100px",
          right: "-100px",
          background: "radial-gradient(circle, hsl(185, 80%, 55%), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15"
        style={{
          width: "350px",
          height: "350px",
          bottom: "-80px",
          left: "10%",
          background: "radial-gradient(circle, hsl(175, 70%, 50%), transparent 70%)",
        }}
      />
    </div>
  );
}