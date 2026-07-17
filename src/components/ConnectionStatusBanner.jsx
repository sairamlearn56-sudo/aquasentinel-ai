import React from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Clock } from "lucide-react";
import { useHardwareStatus } from "@/lib/HardwareStatusContext";
import moment from "moment";

export default function ConnectionStatusBanner() {
  const { status, lastUpdate, retry } = useHardwareStatus();

  if (status !== "disconnected") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-4 border-danger/20 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center flex-shrink-0">
          <WifiOff className="w-5 h-5 text-danger" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-medium text-danger">Hardware Not Connected</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Unable to receive live sensor data. Please connect the ESP32 device and ensure Wi-Fi is available.
          </p>
          {lastUpdate && (
            <p className="text-[12px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last data received: {moment(lastUpdate).format("lll")}
            </p>
          )}
        </div>
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 text-danger text-[13px] font-medium hover:bg-danger/20 transition-colors flex-shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </button>
      </div>
    </motion.div>
  );
}