import React from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Loader2, RefreshCw, Clock, Cpu, Database } from "lucide-react";
import { useHardwareStatus } from "@/lib/HardwareStatusContext";
import moment from "moment";

const BANNER_CONFIG = {
  connected: {
    color: "text-safe", border: "border-safe/20", bg: "bg-safe/10",
    icon: Wifi, title: "Hardware Connected", message: "Receiving live sensor data.",
  },
  connecting: {
    color: "text-warning", border: "border-warning/20", bg: "bg-warning/10",
    icon: Loader2, title: "Connecting", message: "Waiting for ESP32 to send sensor data...",
  },
  disconnected: {
    color: "text-danger", border: "border-danger/20", bg: "bg-danger/10",
    icon: WifiOff, title: "Hardware Offline", message: "No live device detected.",
  },
};

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function ConnectionStatusBanner() {
  const { status, lastUpdate, deviceId, firebaseStatus, validationError, retry } = useHardwareStatus();
  const c = BANNER_CONFIG[status] || BANNER_CONFIG.connecting;
  const Icon = c.icon;
  const wifiStatus = status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`premium-card p-4 ${c.border} mb-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.color} ${status === "connecting" ? "animate-spin" : ""}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[15px] font-medium ${c.color}`}>{c.title}</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">{c.message}</p>
          {validationError && status !== "connected" && (
            <p className="text-[12px] text-muted-foreground mt-1">⚠ {validationError}</p>
          )}

          {/* Detailed info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[12px]">
            <InfoItem icon={Clock} label="Last Data" value={lastUpdate ? moment(lastUpdate).fromNow() : "Never"} />
            <InfoItem icon={Cpu} label="Device" value={deviceId || "Unknown"} />
            <InfoItem icon={Wifi} label="Wi-Fi" value={wifiStatus} />
            <InfoItem icon={Database} label="Firebase" value={firebaseStatus === "connected" ? "Connected" : firebaseStatus === "error" ? "Error" : "Connecting"} />
            <InfoItem icon={Clock} label="Last Sync" value={lastUpdate ? moment(lastUpdate).format("HH:mm:ss") : "Never"} />
          </div>
        </div>

        {status === "disconnected" && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 text-danger text-[13px] font-medium hover:bg-danger/20 transition-colors flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        )}
      </div>
    </motion.div>
  );
}