import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, Database, Cpu, AlertTriangle, RefreshCw, CheckCircle2, XCircle, Droplets, Thermometer, Cloud } from "lucide-react";
import ScanDevice from "@/components/livescan/ScanDevice";

export default function ScanWelcome({ isConnected, allSensorsConnected, sensorStatus, lastUpdated, waterData, onStart, sampleName, onSampleNameChange }) {
  const [retrying, setRetrying] = useState(false);
  const connectedCount = [sensorStatus?.ph, sensorStatus?.tds, sensorStatus?.turbidity, sensorStatus?.temperature].filter(Boolean).length;

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 2000);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ===== Not Connected State =====
  if (!allSensorsConnected) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-warning/5 via-transparent to-transparent pointer-events-none" />

        {/* Warning icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-warning" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2"
        >
          ⚠ Device Not Connected
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-sm text-muted-foreground text-center max-w-md mb-8 leading-relaxed"
        >
          Please connect your ESP32 and all required sensors before starting monitoring.
        </motion.p>

        {/* Per-sensor status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-xl p-5 w-full max-w-md space-y-3 mb-6"
        >
          <SensorStatusItem label="pH Sensor" icon={Activity} connected={sensorStatus?.ph} />
          <SensorStatusItem label="TDS Sensor" icon={Droplets} connected={sensorStatus?.tds} />
          <SensorStatusItem label="Turbidity Sensor" icon={Cloud} connected={sensorStatus?.turbidity} />
          <SensorStatusItem label="Temperature Sensor" icon={Thermometer} connected={sensorStatus?.temperature} />
        </motion.div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass rounded-xl p-5 w-full max-w-md mb-6"
        >
          <h3 className="text-sm font-heading font-semibold mb-3">Connection Status</h3>
          <div className="space-y-2 text-xs">
            <StatusRow label="Device Status" value={isConnected ? "Connected" : "Not Connected"} color={isConnected ? "text-safe" : "text-danger"} />
            <StatusRow label="Wi-Fi Status" value={isConnected ? "Connected" : "Disconnected"} color={isConnected ? "text-safe" : "text-danger"} />
            <StatusRow label="Sensor Status" value={`${connectedCount}/4 Connected`} color={connectedCount === 4 ? "text-safe" : "text-warning"} />
            <StatusRow label="Last Connected" value={lastUpdated ? new Date(lastUpdated).toLocaleString() : "Never"} />
            <StatusRow label="Last Data Received" value={waterData ? (waterData.timestamp ? new Date(waterData.timestamp).toLocaleString() : new Date(lastUpdated).toLocaleString()) : "No data received"} />
            <StatusRow label="Overall Device Health" value={connectedCount === 4 ? "Healthy" : "Needs Attention"} color={connectedCount === 4 ? "text-safe" : "text-danger"} />
          </div>
        </motion.div>

        {/* Retry / Refresh buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3"
        >
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {retrying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Retry Connection
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border font-medium text-sm hover:bg-muted/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </motion.div>
      </div>
    );
  }

  // ===== Connected State =====
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

      {/* Device Connected Successfully indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safe/10 border border-safe/20 mb-4"
      >
        <CheckCircle2 className="w-4 h-4 text-safe" />
        <span className="text-sm font-medium text-safe">Device Connected Successfully</span>
      </motion.div>

      {/* Status indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap items-center justify-center gap-3 mb-6"
      >
        <StatusBadge icon={Wifi} label="ESP32" status="Connected" color="emerald" />
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
        onClick={(e) => { createRipple(e); onStart(); }}
        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all"
      >
        <Activity className="w-4 h-4" />
        Start Monitoring
      </motion.button>
    </div>
  );
}

function SensorStatusItem({ label, icon: Icon, connected }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {connected ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-safe" />
            <span className="text-xs font-medium text-safe">Connected</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-danger" />
            <span className="text-xs font-medium text-danger">Not Connected</span>
          </>
        )}
      </div>
    </div>
  );
}

function StatusRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${color || "text-foreground"}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ icon: Icon, label, status, color }) {
  const colors = {
    emerald: "text-safe bg-safe/10 border-safe/20",
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