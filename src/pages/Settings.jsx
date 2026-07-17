import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound, ShieldCheck, Languages, BellRing, Settings2, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/PageHeader";

const SETTING_ITEMS = [
  { icon: UserRound, label: "Personal Information", desc: "Manage your personal details and profile photo", to: "/settings/personal", gradient: "from-blue-500 to-cyan-500" },
  { icon: ShieldCheck, label: "Account & Privacy", desc: "Email, password, and account security", to: "/settings/account", gradient: "from-purple-500 to-violet-600" },
  { icon: Languages, label: "Language & Region", desc: "Set your preferred language and timezone", to: "/settings/language", gradient: "from-emerald-500 to-teal-600" },
  { icon: BellRing, label: "Notifications", desc: "Manage alerts and voice guidance", to: "/settings/notifications", gradient: "from-amber-500 to-orange-600" },
  { icon: Settings2, label: "App Settings", desc: "Theme, display, and app preferences", to: "/settings/app", gradient: "from-indigo-500 to-purple-600" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { logout, isGuest } = useAuth();

  return (
    <PageHeader title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-3xl mx-auto space-y-4">
        {SETTING_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => navigate(item.to)}
              className="w-full premium-card p-5 flex items-center gap-4 hover:border-primary/20 transition-all group text-left"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-medium">{item.label}</h2>
                <p className="text-[13px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.button>
          );
        })}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => logout()}
          className="w-full premium-card p-5 flex items-center gap-4 hover:border-rose-500/20 transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <LogOut className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-medium text-rose-500">{isGuest ? "Exit Guest Mode" : "Log Out"}</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Sign out of your account</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </motion.button>
      </div>
    </PageHeader>
  );
}