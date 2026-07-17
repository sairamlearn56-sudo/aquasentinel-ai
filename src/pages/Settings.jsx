import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings2, Globe2, BellRing, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Settings() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const sections = [
    {
      icon: Settings2,
      title: "App Settings",
      description: "Voice guidance, speech rate, and default family member",
      to: "/settings/app",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Globe2,
      title: "Language & Region",
      description: "Choose your preferred language for the app and voice",
      to: "/settings/language",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: BellRing,
      title: "Notifications",
      description: "Manage alert and notification preferences",
      to: "/settings/notifications",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Settings2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{t("settingsTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
              onClick={() => navigate(section.to)}
              className="w-full premium-card p-5 flex items-center gap-4 hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-[0.99] transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-2xl ${section.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-sm">{section.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}