import React from "react";

export default function WaterRippleBackground() {
  return (
    <div className="water-ripple">
      {/* Ripple circles */}
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
          width: "500px",
          height: "500px",
          top: "-150px",
          right: "-100px",
          background: "radial-gradient(circle, hsl(194, 100%, 50%), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-80px",
          left: "5%",
          background: "radial-gradient(circle, hsl(175, 59%, 57%), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-10"
        style={{
          width: "300px",
          height: "300px",
          top: "40%",
          left: "50%",
          background: "radial-gradient(circle, hsl(194, 100%, 50%), transparent 70%)",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`p-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/20 animate-float-up"
          style={{
            left: `${(i * 8.33) % 100}%`,
            bottom: "0",
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${10 + (i % 4) * 3}s`,
          }}
        />
      ))}
    </div>
  );
}