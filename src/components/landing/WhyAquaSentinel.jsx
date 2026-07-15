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
    borderClass: "hover:border-blue-500/30",
  },
  {
    icon: HeartPulse,
    title: "Prevents Diseases",
    desc: "Early detection of 6+ water-borne diseases with actionable health recommendations you can act on immediately.",
    iconClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "hover:border-emerald-500/30",
  },
  {
    icon: Users,
    title: "Helps Rural Communities",
    desc: "Designed for areas with limited access to clean water information and healthcare resources.",
    iconClass: "text-purple-400",
    bgClass: "bg-purple-500/10",
    borderClass: "hover:border-purple-500/30",
  },
  {
    icon: Zap,
    title: "Instant AI Analysis",
    desc: "From water sample to health report in seconds — no waiting, no lab visits, no complicated steps.",
    iconClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "hover:border-amber-500/30",
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
            className={`premium-card p-6 ${c.borderClass}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${c.bgClass}`}>
              <Icon className={`w-6 h-6 ${c.iconClass}`} />
            </div>
            <h3 className="font-heading font-bold text-base mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}