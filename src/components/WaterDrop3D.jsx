import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function WaterDrop3D({ size = 160 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
      style={{ width: size, height: size * 1.3, perspective: 1000 }}
    >
      {/* Glow platform */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full bg-primary/20 blur-2xl" />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          <svg
            viewBox="0 0 120 156"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 12px 32px rgba(0, 163, 255, 0.35))" }}
          >
            <defs>
              <radialGradient id="drop3dBody" cx="35%" cy="25%" r="80%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="30%" stopColor="#38BDF8" />
                <stop offset="65%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0C4A6E" />
              </radialGradient>
              <radialGradient id="drop3dShine" cx="30%" cy="20%" r="35%">
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="drop3dBottom" cx="50%" cy="90%" r="40%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M60 6 C60 6, 16 56, 16 100 C16 128, 35 148, 60 148 C85 148, 104 128, 104 100 C104 56, 60 6, 60 6 Z"
              fill="url(#drop3dBody)"
            />
            <path
              d="M60 6 C60 6, 16 56, 16 100 C16 128, 35 148, 60 148 C85 148, 104 128, 104 100 C104 56, 60 6, 60 6 Z"
              fill="url(#drop3dBottom)"
            />
            <ellipse cx="42" cy="48" rx="16" ry="26" fill="url(#drop3dShine)" />
            <motion.circle
              cx="60" cy="92" r="14" fill="#00C2FF" fillOpacity="0.25"
              animate={{ r: [11, 15, 11], fillOpacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="60" cy="92" r="6" fill="white" fillOpacity="0.7"
              animate={{ fillOpacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}