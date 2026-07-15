import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, HeartPulse, Users, Zap } from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    title: "Protects Families",
    desc: "Every family member — from infants to elderly — gets personalized safety assessments based on their vulnerability.",
    iconClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    icon: HeartPulse,
    title: "Prevents Diseases",
    desc: "Early detection of 6+ water-borne diseases with actionable health recommendations you can act on immediately.",
    iconClass: "text-safe",
    bgClass: "bg-safe/10",
    borderClass: "border-safe/20 hover:border-safe/40",
  },
  {
    icon: Users,
    title: "Helps Rural Communities",
    desc: "Designed for areas with limited access to clean water information and healthcare resources.",
    iconClass: "text-violet-400",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/20 hover:border-violet-500/40",
  },
  {
    icon: Zap,
    title: "Instant AI Analysis",
    desc: "From water sample to health report in seconds — no waiting, no lab visits, no complicated steps.",
    iconClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20 hover:border-warning/40",
  },
];

export default function WhyAquaSentinel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`glass rounded-[20px] p-6 border-2 transition-all duration-300 hover:-translate-y-1 ${c.borderClass}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${c.bgClass}`}>
              <Icon className={`w-6 h-6 ${c.iconClass}`} />
            </div>
            <h3 className="font-bold text-base mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}