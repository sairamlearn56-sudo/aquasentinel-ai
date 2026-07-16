import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Globe, Sparkles, Droplets, BrainCircuit } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import WaterDrop3D from "@/components/WaterDrop3D";
import FeatureGrid from "@/components/landing/FeatureGrid";
import WhyAquaSentinel from "@/components/landing/WhyAquaSentinel";
import WorkflowSection from "@/components/landing/WorkflowSection";
import { base44 } from "@/api/base44Client";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import AIInsights from "@/components/dashboard/AIInsights";
import ApplicationsSection from "@/components/landing/ApplicationsSection";

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [latestScan, setLatestScan] = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const data = await base44.entities.Scan.list("-created_date", 1);
        if (data && data.length > 0) setLatestScan(data[0]);
      } catch (e) {}
    }
    fetchLatest();
  }, []);

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
        {/* Static subtle background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

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
            <div className="relative rounded-full glass-strong border border-border p-5">
              <WaterDrop3D size={110} />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-cyan-500/20 mb-6 mt-4"
          >
            <span className="w-2 h-2 rounded-full bg-safe" />
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
            className="text-base sm:text-lg text-muted-foreground font-heading font-medium mt-4"
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
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Activity className="w-4 h-4" />
              {t("startMonitoring")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { createRipple(e); navigate("/analysis"); }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-colors"
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

      {/* ===== Dashboard Overview Widgets ===== */}
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <DashboardWidgets scan={latestScan} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <AIRecommendations scan={latestScan} />
          <AIInsights scan={latestScan} />
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

      {/* ===== Applications ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <ApplicationsSection />
      </section>
    </div>
  );
}