import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, Database, Cpu } from "lucide-react";
import ScanDevice from "@/components/livescan/ScanDevice";

export default function ScanWelcome({ isConnected, onStart, sampleName, onSampleNameChange }) {
  const rippleRef = useRef(null);

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.className = "ripple bg-white/30";
    const existing = button.getElementsByClassName("ripple")[0];
    if (existing) existing.remove();
    button.appendChild(circle);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Static subtle background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Scanner device */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <ScanDevice size={192} showBeam={true} />
      </motion.div>

      {/* Status indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap items-center justify-center gap-3 mb-6"
      >
        <StatusBadge icon={isConnected ? Wifi : WifiOff} label="ESP32" status={isConnected ? "Connected" : "Waiting..."} color={isConnected ? "emerald" : "amber"} />
        <StatusBadge icon={Database} label="Firebase" status="Connected" color="cyan" />
        <StatusBadge icon={Cpu} label="AI Engine" status="Ready" color="purple" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl sm:text-4xl font-heading font-bold text-center gradient-text"
      >
        Ready to Scan Water
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-sm text-muted-foreground text-center max-w-md mt-3 leading-relaxed"
      >
        Place the sensors in water and press Start Monitoring to begin an AI-powered water quality analysis.
      </motion.p>

      {/* Sample Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.38 }}
        className="mt-6 w-full max-w-xs"
      >
        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
          Sample Name (optional)
        </label>
        <input
          type="text"
          value={sampleName || ""}
          onChange={(e) => onSampleNameChange(e.target.value)}
          placeholder="e.g., Kitchen Tap Morning"
          className="w-full px-4 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:border-primary/40"
        />
      </motion.div>

      {/* Start Monitoring button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        onClick={(e) => { if (isConnected) { createRipple(e); onStart(); } }}
        disabled={!isConnected}
        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Activity className="w-4 h-4" />
        Start Monitoring
      </motion.button>

      {/* ESP32 disconnect message */}
      {!isConnected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-amber-400 mt-4 flex items-center gap-1.5"
        >
          <WifiOff className="w-4 h-4" />
          Waiting for ESP32 Connection...
        </motion.p>
      )}
    </div>
  );
}

function StatusBadge({ icon: Icon, label, status, color }) {
  const colors = {
    emerald: "text-safe bg-safe/10 border-safe/20",
    amber: "text-warning bg-warning/10 border-warning/20",
    cyan: "text-primary bg-primary/10 border-primary/20",
    purple: "text-purple bg-purple/10 border-purple/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${colors[color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {label} {status}
    </span>
  );
}