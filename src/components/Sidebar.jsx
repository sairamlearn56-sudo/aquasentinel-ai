import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Radio, BrainCircuit, TrendingUp, MapPin, Settings, Droplets, User, LogOut, Waves } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";

export default function Sidebar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t("dashboard"), accent: "text-cyan-500" },
    { to: "/monitor", icon: Radio, label: t("liveMonitor"), accent: "text-blue-500" },
    { to: "/analysis", icon: BrainCircuit, label: t("aiAnalysis"), accent: "text-violet-500" },
    { to: "/history", icon: TrendingUp, label: t("history"), accent: "text-teal-500" },
    { to: "/tracker", icon: Waves, label: "Water Tracker", accent: "text-cyan-500" },
    { to: "/map", icon: MapPin, label: t("communityMap"), accent: "text-emerald-500" },
    { to: "/settings", icon: Settings, label: t("settings"), accent: "text-indigo-500" },
    { to: "/profile", icon: User, label: "Profile", accent: "text-primary" },
  ];

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col glass-strong border-r border-border z-40">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-cyan-500 to-teal flex items-center justify-center shadow-lg shadow-primary/30">
              <Droplets className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/25 to-transparent" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">AquaSentinel</h1>
              <p className="text-xs text-primary font-semibold tracking-wide">AI</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? item.accent : ""}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/30">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase() || "G"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || "Guest"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
            <button onClick={() => logout()} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors flex-shrink-0" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <LanguageSelector compact />
            <ThemeToggle compact />
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="relative w-2 h-2 rounded-full bg-safe">
              <div className="absolute inset-0 rounded-full bg-safe animate-ping opacity-75" />
            </div>
            <span className="text-xs text-muted-foreground">ESP32 Sensor Ready</span>
          </div>
        </div>
      </aside>

      {/* ===== Mobile Top Bar ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-md shadow-primary/20">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">AquaSentinel AI</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <ThemeToggle compact />
          </div>
        </div>
        <nav className="flex items-center gap-1 px-2 pb-2 overflow-x-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}