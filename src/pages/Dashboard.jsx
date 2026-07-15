import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe, Activity } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LandingLogo from "@/components/landing/LandingLogo";
import HeroIllustration from "@/components/illustrations/HeroIllustration";

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Warm blue gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/40 via-background to-primary/5" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-aqua/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      {/* Ripple circles */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-aqua/10"
            style={{ width: 200, height: 200 }}
            animate={{ scale: [1, 6], opacity: [0.3, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
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
        >
          <LandingLogo />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-6 bg-gradient-to-r from-primary via-aqua to-teal bg-clip-text text-transparent"
        >
          AquaSentinel AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground mt-4 font-medium"
        >
          Your AI Health Guardian for Safe Water
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm sm:text-base text-muted-foreground/80 mt-4 max-w-xl leading-relaxed"
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
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-aqua text-white font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <Activity className="w-5 h-5" />
            {t("startMonitoring")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-xs sm:text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-safe" />
            WHO Standards
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary" />
            7 Languages
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-aqua" />
            AI-Powered Analysis
          </span>
        </motion.div>
      </div>

      {/* Family illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-10 w-full max-w-lg"
      >
        <HeroIllustration />
      </motion.div>
    </div>
  );
}