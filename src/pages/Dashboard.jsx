import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Globe, Sparkles, Droplets, BrainCircuit } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import WaterDrop3D from "@/components/WaterDrop3D";
import AnimatedCounter from "@/components/AnimatedCounter";
import FeatureGrid from "@/components/landing/FeatureGrid";
import WhyAquaSentinel from "@/components/landing/WhyAquaSentinel";
import WorkflowSection from "@/components/landing/WorkflowSection";

const stats = [
  { value: 12540, suffix: "+", label: "Families Protected", icon: ShieldCheck, color: "text-emerald-400" },
  { value: 85320, suffix: "+", label: "Water Scans", icon: Droplets, color: "text-cyan-400" },
  { value: 3245, suffix: "+", label: "Diseases Predicted", icon: BrainCircuit, color: "text-purple-400" },
  { value: 8, suffix: "+", label: "Languages Supported", icon: Globe, color: "text-blue-400" },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
    <div className="relative pb-32">
      {/* ===== Hero Section ===== */}
      <div className="relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/8 via-transparent to-purple-500/8" />

        {/* Soft gradient orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl animate-mesh-drift" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-mesh-drift" style={{ animationDelay: "5s" }} />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl animate-mesh-drift" style={{ animationDelay: "10s" }} />
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-emerald-500/6 rounded-full blur-3xl animate-mesh-drift" style={{ animationDelay: "7s" }} />
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto z-10">
          {/* 3D Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full" />
            <div className="relative">
              <WaterDrop3D size={160} />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-cyan-500/20 mb-6 mt-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">AI-Powered Water Health Platform</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight gradient-text"
          >
            AquaSentinel AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-xl sm:text-2xl text-secondary font-heading font-semibold mt-4"
          >
            Your AI Water Health Guardian
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-sm sm:text-base text-muted-foreground mt-4 max-w-xl leading-relaxed"
          >
            Protecting families from water-borne diseases using AI, IoT sensors, and an
            intelligent multilingual voice assistant.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={(e) => { createRipple(e); navigate("/monitor"); }}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-heading font-semibold text-base sm:text-lg shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden animate-glow-pulse"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Activity className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t("startMonitoring")}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={(e) => { createRipple(e); navigate("/analysis"); }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-cyan-500/20 text-foreground font-medium hover:bg-cyan-500/5 hover:border-cyan-500/40 transition-all duration-300"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              WHO Standards
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-muted-foreground">
              <Globe className="w-4 h-4 text-cyan-400" />
              7 Languages
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-muted-foreground">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI-Powered Analysis
            </span>
          </motion.div>
        </div>
      </div>

      {/* ===== Stats Section with Animated Counters ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="premium-card p-6 text-center"
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <p className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== Feature Cards ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">Powerful Features</h2>
          <p className="text-muted-foreground mt-2">Everything you need to keep your family safe</p>
        </motion.div>
        <FeatureGrid />
      </section>

      {/* ===== Why AquaSentinel ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">Why AquaSentinel?</h2>
          <p className="text-muted-foreground mt-2">Built to make a real difference</p>
        </motion.div>
        <WhyAquaSentinel />
      </section>

      {/* ===== Workflow ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-2">From water sample to safety in seconds</p>
        </motion.div>
        <WorkflowSection />
      </section>
    </div>
  );
}