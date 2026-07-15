import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe, Activity, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LandingLogo from "@/components/landing/LandingLogo";
import HeroIllustration from "@/components/illustrations/HeroIllustration";

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Deep gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-teal/5" />

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal/8 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-aqua/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "0.8s" }} />
      </div>

      {/* Expanding ripple circles */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/8"
            style={{ width: 200, height: 200 }}
            animate={{ scale: [1, 7], opacity: [0.3, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float-up"
            style={{
              left: `${(i * 6.7) % 100}%`,
              bottom: "0",
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${10 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
          <div className="relative">
            <LandingLogo />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-6 gradient-text"
        >
          AquaSentinel AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-secondary font-semibold mt-4"
        >
          Your AI Health Guardian for Safe Water
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm sm:text-base text-muted-foreground mt-4 max-w-xl leading-relaxed"
        >
          Real-time water quality monitoring powered by AI. AquaSentinel AI analyzes your water
          with IoT sensors, detects disease risks for every family member, and provides personalized
          health guidance — all in your language.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate("/monitor")}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-teal text-white font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-glow-pulse overflow-hidden"
          >
            {/* Ripple shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Activity className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{t("startMonitoring")}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-xs sm:text-sm"
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

      {/* Hero illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-10 w-full max-w-lg"
      >
        <HeroIllustration />
      </motion.div>

      {/* Animated wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 -z-5 pointer-events-none">
        <svg viewBox="0 0 1440 100" className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(194, 100%, 50%)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(194, 100%, 50%)" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,50 C320,80 640,20 960,50 C1280,80 1440,30 1440,30 L1440,100 L0,100 Z"
            fill="url(#waveGrad)"
            animate={{
              d: [
                "M0,50 C320,80 640,20 960,50 C1280,80 1440,30 1440,30 L1440,100 L0,100 Z",
                "M0,40 C320,20 640,70 960,40 C1280,10 1440,60 1440,60 L1440,100 L0,100 Z",
                "M0,50 C320,80 640,20 960,50 C1280,80 1440,30 1440,30 L1440,100 L0,100 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
}