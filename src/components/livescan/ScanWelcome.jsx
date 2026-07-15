import React from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, Database, Cpu } from "lucide-react";
import ScanDevice from "@/components/livescan/ScanDevice";

export default function ScanWelcome({ isConnected, onStart }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Water ripple background */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/8"
            style={{ width: 200, height: 200 }}
            animate={{ scale: [1, 6], opacity: [0.15, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Floating blue particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 animate-float-up"
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
        transition={{ duration: 0.7, ease: "easeOut" }}
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
        <StatusBadge icon={isConnected ? Wifi : WifiOff} label="ESP32" status={isConnected ? "Connected" : "Waiting..."} color={isConnected ? "safe" : "warning"} />
        <StatusBadge icon={Database} label="Firebase" status="Connected" color="safe" />
        <StatusBadge icon={Cpu} label="AI Engine" status="Ready" color="safe" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="text-3xl sm:text-4xl font-bold text-center gradient-text"
      >
        Ready to Scan Water
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-sm text-muted-foreground text-center max-w-md mt-3"
      >
        Place the sensors in water and press Start Monitoring to begin an AI-powered water quality analysis.
      </motion.p>

      {/* Start Monitoring button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={onStart}
        disabled={!isConnected}
        className="mt-8 group relative inline-flex items-center gap-3 px-12 py-4 rounded-full bg-gradient-to-r from-primary to-teal text-white font-semibold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-glow-pulse overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          className="text-sm text-warning mt-4 flex items-center gap-1.5"
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
    safe: "text-safe bg-safe/10 border-safe/20",
    warning: "text-warning bg-warning/10 border-warning/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${colors[color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {label} {status}
    </span>
  );
}