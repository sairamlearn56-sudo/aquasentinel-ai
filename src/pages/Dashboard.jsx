import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Globe, Sparkles, Droplets, BrainCircuit } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import WaterDrop3D from "@/components/WaterDrop3D";
import FeatureGrid from "@/components/landing/FeatureGrid";
import WhyAquaSentinel from "@/components/landing/WhyAquaSentinel";
import WorkflowSection from "@/components/landing/WorkflowSection";

const stats = [
  { value: "12,540+", label: "Families Protected", icon: ShieldCheck, color: "text-safe" },
  { value: "85,320+", label: "Water Scans", icon: Droplets, color: "text-primary" },
  { value: "3,245+", label: "Diseases Predicted", icon: BrainCircuit, color: "text-violet-500" },
  { value: "8+", label: "Languages Supported", icon: Globe, color: "text-teal-500" },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative pb-32">
      {/* ===== Hero Section ===== */}
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-teal/5" />

        {/* Soft gradient orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto z-10">
          {/* 3D Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
            <div className="relative">
              <WaterDrop3D size={160} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mt-6 gradient-text"
          >
            AquaSentinel AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-xl sm:text-2xl text-secondary font-semibold mt-4"
          >
            Your AI Water Health Guardian
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm sm:text-base text-muted-foreground mt-4 max-w-xl leading-relaxed"
          >
            Protecting families from water-borne diseases using AI, IoT sensors, and an
            intelligent multilingual voice assistant.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/monitor")}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-teal text-white font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-glow-pulse overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Activity className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t("startMonitoring")}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/analysis")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-primary/20 text-foreground font-semibold hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-safe" />
              WHO Standards
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-muted-foreground">
              <Globe className="w-4 h-4 text-primary" />
              7 Languages
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-muted-foreground">
              <Sparkles className="w-4 h-4 text-secondary" />
              AI-Powered Analysis
            </span>
          </motion.div>
        </div>
      </div>

      {/* ===== Stats Section ===== */}
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
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold">Powerful Features</h2>
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
          <h2 className="text-2xl sm:text-3xl font-bold">Why AquaSentinel?</h2>
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
          <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-2">From water sample to safety in seconds</p>
        </motion.div>
        <WorkflowSection />
      </section>
    </div>
  );
}