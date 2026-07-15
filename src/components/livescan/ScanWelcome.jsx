import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, Database, Cpu } from "lucide-react";
import ScanDevice from "@/components/livescan/ScanDevice";

export default function ScanWelcome({ isConnected, onStart, waterSources, selectedWaterSourceId, onSelectWaterSource, sampleName, onSampleNameChange }) {
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
      {/* Layered gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Drifting orbs */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-mesh-drift" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-mesh-drift" style={{ animationDelay: "5s" }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-emerald-500/6 rounded-full blur-3xl animate-mesh-drift" style={{ animationDelay: "10s" }} />
        {/* Ripple circles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-500/8"
            style={{ width: 200, height: 200, left: "50%", top: "45%" }}
            animate={{ scale: [1, 6], opacity: [0.12, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500/12 animate-float-up"
            style={{
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              left: `${(i * 5) % 100}%`,
              bottom: "0",
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${10 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

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
          className="w-full px-4 py-2.5 rounded-2xl glass border border-border text-sm focus:outline-none focus:border-cyan-500/40"
        />
      </motion.div>

      {/* Water Source Selector */}
      {waterSources && waterSources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="mt-6 w-full max-w-xs"
        >
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
            Water Source (optional)
          </label>
          <select
            value={selectedWaterSourceId || ""}
            onChange={(e) => onSelectWaterSource(e.target.value || null)}
            className="w-full px-4 py-2.5 rounded-2xl glass border border-border text-sm focus:outline-none focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="">No water source</option>
            {waterSources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.label})
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Start Monitoring button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        onClick={(e) => { if (isConnected) { createRipple(e); onStart(); } }}
        disabled={!isConnected}
        className="mt-8 group relative inline-flex items-center gap-3 px-12 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-heading font-semibold text-lg shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 animate-glow-pulse overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <Activity className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Start Monitoring</span>
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
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${colors[color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {label} {status}
    </span>
  );
}