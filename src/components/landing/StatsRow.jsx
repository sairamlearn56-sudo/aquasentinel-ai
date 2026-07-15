import React from "react";
import { motion } from "framer-motion";
import { Users, Droplet, Activity, Languages } from "lucide-react";

const stats = [
  { icon: Users, value: "12,540+", label: "Families Protected", color: "text-primary" },
  { icon: Droplet, value: "85,320+", label: "Water Scans", color: "text-teal" },
  { icon: Activity, value: "3,245+", label: "Diseases Predicted", color: "text-violet-400" },
  { icon: Languages, value: "8+", label: "Languages Supported", color: "text-warning" },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-2xl p-4 text-center border border-border"
          >
            <Icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}