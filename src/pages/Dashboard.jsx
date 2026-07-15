import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import WaterDrop3D from "@/components/WaterDrop3D";
import FeatureGrid from "@/components/landing/FeatureGrid";
import WhyAquaSentinel from "@/components/landing/WhyAquaSentinel";
import WorkflowSection from "@/components/landing/WorkflowSection";
import HeroAquaCard from "@/components/landing/HeroAquaCard";
import StatsRow from "@/components/landing/StatsRow";
import WhyDifferent from "@/components/landing/WhyDifferent";

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative pb-16">
      {/* ===== Hero Section — Two Column ===== */}
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center px-4 py-10 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-teal/5" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto w-full z-10">
          {/* Left: Droplet + Text + CTAs */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 blur-3xl bg-primary/15 rounded-full" />
              <div className="relative">
                <WaterDrop3D size={140} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
                <Sparkles className="w-3 h-3" /> AI Powered
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-text"
            >
              AquaSentinel AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-secondary font-semibold mt-3"
            >
              Your AI Water Health Guardian
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md leading-relaxed"
            >
              Protecting families from water-borne diseases using AI, IoT sensors, and an
              intelligent multilingual voice assistant.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <button
                onClick={() => navigate("/monitor")}
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-teal text-white font-semibold text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-glow-pulse overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <Activity className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t("startMonitoring")}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/analysis")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass border border-primary/20 text-foreground font-semibold hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mt-6 text-xs"
            >
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-safe" /> WHO Standards
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-muted-foreground">
                <Globe className="w-3.5 h-3.5 text-primary" /> 7 Languages
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-secondary" /> AI-Powered
              </span>
            </motion.div>
          </div>

          {/* Right: Aqua Character Card */}
          <HeroAquaCard />
        </div>

        {/* Animated wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 100" className="w-full h-auto" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(194, 100%, 50%)" stopOpacity="0.03" />
                <stop offset="100%" stopColor="hsl(194, 100%, 50%)" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,50 C320,80 640,20 960,50 C1280,80 1440,30 1440,30 L1440,100 L0,100 Z"
              fill="url(#waveGrad)"
              animate={{
                d: [
                  "M0,50 C320,80 640,20 960,50 C1280,80 1440,30 1440,30 L1440,100 L0,100 Z",
                  "M0,40 C320,20 640,70 960,40 C1280,10 1440,60 1440,60 L1440,100 L0,100 Z",
                  "M0,50 C320,80 640,20 960,50 C1280,80 1440,30 1444,30 L1440,100 L0,100 Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>

      {/* ===== Feature Grid ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground mt-2">Everything you need to keep your family safe</p>
        </motion.div>
        <FeatureGrid />
      </section>

      {/* ===== Lower Section: Why + How (side by side) ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Why AquaSentinel + Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold">Why AquaSentinel?</h2>
              <p className="text-muted-foreground text-sm mt-1">Built to make a real difference</p>
            </motion.div>
            <WhyAquaSentinel />
            <div className="mt-6">
              <StatsRow />
            </div>
          </div>

          {/* Right: How It Works */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold">How AquaSentinel AI Works</h2>
              <p className="text-muted-foreground text-sm mt-1">From water sample to safety in seconds</p>
            </motion.div>
            <div className="glass rounded-3xl p-6 border border-border">
              <WorkflowSection />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why Different ===== */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Why AquaSentinel is Different</h2>
          <p className="text-muted-foreground mt-2">Six pillars that set us apart</p>
        </motion.div>
        <WhyDifferent />
      </section>
    </div>
  );
}