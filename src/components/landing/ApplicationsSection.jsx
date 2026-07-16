import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Waves, Mountain, Wind, Database, Sun, Sprout, Factory, ChevronRight, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS = [
  {
    icon: Fish,
    title: "Aquarium Monitoring",
    color: "text-blue",
    bg: "bg-blue/10",
    border: "hover:border-blue/30",
    desc: "Monitor aquarium water quality with real-time pH, temperature, and clarity tracking.",
    features: ["AI recommendations for fish health", "Water change alerts", "Ammonia & nitrate tracking"],
  },
  {
    icon: Waves,
    title: "Fish Farming (Aquaculture)",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/30",
    desc: "Pond monitoring with predictive fish health analytics and water quality alerts.",
    features: ["Pond monitoring", "Fish health prediction", "Water quality alerts"],
  },
  {
    icon: Mountain,
    title: "Lake Monitoring",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "hover:border-secondary/30",
    desc: "Pollution detection and real-time water quality tracking for lakes and reservoirs.",
    features: ["Pollution detection", "Real-time water quality", "AI contamination prediction"],
  },
  {
    icon: Wind,
    title: "River Monitoring",
    color: "text-safe",
    bg: "bg-safe/10",
    border: "hover:border-safe/30",
    desc: "Industrial pollution monitoring with sewage contamination alerts and trend analysis.",
    features: ["Industrial pollution monitoring", "Sewage contamination alerts", "Water quality trends"],
  },
  {
    icon: Database,
    title: "Drinking Water Tanks",
    color: "text-purple",
    bg: "bg-purple/10",
    border: "hover:border-purple/30",
    desc: "Safe drinking water monitoring with community alerts and quality history tracking.",
    features: ["Safe drinking water monitoring", "Community alerts", "Water quality history"],
  },
  {
    icon: Sun,
    title: "Swimming Pools",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "hover:border-warning/30",
    desc: "Pool water cleanliness monitoring with maintenance reminders and safety status.",
    features: ["Water cleanliness", "Maintenance reminders", "Safety status"],
  },
  {
    icon: Sprout,
    title: "Agriculture",
    color: "text-safe",
    bg: "bg-safe/10",
    border: "hover:border-safe/30",
    desc: "Irrigation water quality with crop suitability recommendations and usage insights.",
    features: ["Irrigation water quality", "Crop suitability recommendations", "Water usage insights"],
  },
  {
    icon: Factory,
    title: "Water Treatment Plants",
    color: "text-orange",
    bg: "bg-orange/10",
    border: "hover:border-orange/30",
    desc: "Raw vs treated water monitoring with treatment efficiency and AI recommendations.",
    features: ["Raw vs treated water monitoring", "Treatment efficiency", "AI recommendations"],
  },
];

export default function ApplicationsSection() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-heading font-bold">Applications</h2>
        <p className="text-muted-foreground mt-2">AquaSentinel AI works across every water environment</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {APPLICATIONS.map((app, i) => {
          const Icon = app.icon;
          return (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className={`premium-card p-5 group ${app.border} h-full flex flex-col`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${app.bg}`}>
                  <Icon className={`w-6 h-6 ${app.color}`} />
                </div>
                <h3 className="font-heading font-bold text-sm mb-2">{app.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{app.desc}</p>
                <button
                  onClick={() => setSelected(app)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all"
                >
                  Learn More <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Learn More Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected.bg}`}>
                    <selected.icon className={`w-6 h-6 ${selected.color}`} />
                  </div>
                  <h3 className="text-lg font-heading font-bold">{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-muted/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selected.desc}</p>
              <div className="space-y-2 mb-6">
                {selected.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${selected.color.replace("text-", "bg-")}`} />
                    {f}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                AquaSentinel AI connects to IoT sensors in your {selected.title.toLowerCase()} system, analyzes water quality in real-time, and provides AI-powered recommendations to keep your water safe and healthy.
              </p>
              <button
                onClick={() => { setSelected(null); navigate("/monitor"); }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Start Monitoring <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}