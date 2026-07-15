import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogOut, Settings, Bell, Globe } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import TiltCard from "@/components/TiltCard";

export default function Profile() {
  const { user, logout, isGuest } = useAuth();
  const navigate = useNavigate();

  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "G";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <TiltCard className="premium-card p-6" intensity={3}>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-white text-2xl font-heading font-semibold">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-heading font-bold">{user?.full_name || "Guest User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "Not signed in"}</p>
              {isGuest && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                  Guest Mode
                </span>
              )}
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {isGuest && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="premium-card p-5 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-sm">Sign in to save your data</h3>
              <p className="text-xs text-muted-foreground mt-1">Create an account to save scans, access history, and get personalized alerts.</p>
              <button onClick={() => navigate("/register")} className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
                Create Account
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="space-y-3">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wide">Account</h3>
        {[
          { icon: Settings, label: "App Settings", to: "/settings", color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { icon: Globe, label: "Language & Region", to: "/settings", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: Bell, label: "Notifications", to: "/settings", color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} onClick={() => navigate(item.to)} className="w-full flex items-center gap-3 p-4 premium-card hover:border-purple-500/25 text-left">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium flex-1">{item.label}</span>
            </button>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 p-4 premium-card text-rose-400 hover:border-rose-500/25 transition-all font-medium text-sm">
          <LogOut className="w-5 h-5" />
          {isGuest ? "Exit Guest Mode" : "Log Out"}
        </button>
      </motion.div>
    </div>
  );
}