import React from "react";

export default function WaterRippleBackground() {
  return (
    <div className="water-ripple">
      {/* Single subtle gradient orb — top right */}
      <div
        className="absolute rounded-full blur-[120px] opacity-[0.07]"
        style={{
          width: "600px",
          height: "600px",
          top: "-200px",
          right: "-150px",
          background: "radial-gradient(circle, hsl(194, 100%, 50%), transparent 70%)",
        }}
      />
      {/* Single subtle gradient orb — bottom left */}
      <div
        className="absolute rounded-full blur-[120px] opacity-[0.05]"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-150px",
          left: "-100px",
          background: "radial-gradient(circle, hsl(175, 59%, 57%), transparent 70%)",
        }}
      />
    </div>
  );
}