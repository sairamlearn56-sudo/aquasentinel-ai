import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import AquaMascot from "@/components/aqua/AquaMascot";
import { useAqua } from "@/lib/AquaContext";

export default function HeroAquaCard() {
  const { openChat } = useAqua();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-teal/10 blur-3xl rounded-full" />

      <div className="relative glass-strong rounded-3xl p-6 sm:p-8 border border-primary/15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal/5 pointer-events-none" />

        <div className="relative flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">Talk to Aqua</span>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>

        <div className="relative flex items-center justify-center py-6">
          <div className="scale-125 sm:scale-150">
            <AquaMascot mood="waving" onClick={openChat} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative glass rounded-2xl px-5 py-4 mb-4 border border-primary/10"
        >
          <p className="text-sm text-foreground text-center leading-relaxed">
            Hello! 👋 I'm Aqua, your AI Health Guide. How can I help you today?
          </p>
        </motion.div>

        <button
          onClick={openChat}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-teal text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Ask Aqua
        </button>
      </div>
    </motion.div>
  );
}