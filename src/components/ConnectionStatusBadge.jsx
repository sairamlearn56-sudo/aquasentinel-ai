import React from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useHardwareStatus } from "@/lib/HardwareStatusContext";
import moment from "moment";

const STATUS_CONFIG = {
  connected: { color: "text-safe", bg: "bg-safe/10", border: "border-safe/20", dot: "bg-safe", icon: Wifi, label: "Connected" },
  connecting: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", dot: "bg-warning", icon: Loader2, label: "Connecting" },
  disconnected: { color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", dot: "bg-danger", icon: WifiOff, label: "Offline" },
};

export default function ConnectionStatusBadge({ compact = false }) {
  const { status, lastUpdate } = useHardwareStatus();
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.connecting;
  const Icon = c.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${c.bg} ${c.border} ${c.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status !== "connected" ? "animate-pulse" : ""}`} />
        <span className="text-[11px] font-medium">{c.label}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${c.bg} ${c.border} ${c.color}`}>
      <Icon className={`w-3.5 h-3.5 ${status === "connecting" ? "animate-spin" : ""}`} />
      <div className="flex items-center gap-1.5">
        <span className="text-[12px] font-medium">{c.label}</span>
        {status === "connected" && lastUpdate && (
          <span className="text-[10px] text-muted-foreground">· {moment(lastUpdate).fromNow()}</span>
        )}
      </div>
    </div>
  );
}