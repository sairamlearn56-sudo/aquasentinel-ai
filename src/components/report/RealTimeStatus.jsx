import React from "react";
import { motion } from "framer-motion";
import { Cpu, Wifi, Clock, Activity, Database } from "lucide-react";
import moment from "moment";

export default function RealTimeStatus({ scans }) {
  const latest = scans[0];

  // Derive sensor status from actual scan data
  const sensorKeys = ["ph", "tds", "temperature", "turbidity"];
  const sensorsOnline = latest
    ? sensorKeys.filter((s) => latest[s] != null && latest[s] >= 0).length
    : 0;

  const items = [
    { icon: Activity, label: "AI Status", value: latest ? "Active" : "Idle", color: latest ? "text-safe" : "text-muted-foreground", dot: !!latest },
    { icon: Database, label: "Reports", value: scans.length, color: "text-violet-400" },
    { icon: Wifi, label: "Sensors Online", value: `${sensorsOnline}/4`, color: sensorsOnline > 0 ? "text-safe" : "text-muted-foreground" },
    { icon: Clock, label: "Last Analysis", value: latest ? moment(latest.created_date).fromNow() : "No data", color: "text-muted-foreground" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="premium-card p-4 flex items-center gap-4 flex-wrap"
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-center gap-2 flex-1 min-w-[120px]">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
              <div className="flex items-center gap-1.5">
                {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />}
                <p className="text-sm font-bold truncate">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}