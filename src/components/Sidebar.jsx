import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Radio, BrainCircuit, TrendingUp, MapPin, Settings, Droplets } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function Sidebar() {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/monitor", icon: Radio, label: t("liveMonitor") },
    { to: "/analysis", icon: BrainCircuit, label: t("aiAnalysis") },
    { to: "/history", icon: TrendingUp, label: t("history") },
    { to: "/map", icon: MapPin, label: t("communityMap") },
    { to: "/settings", icon: Settings, label: t("settings") },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col glass-strong border-r border-border z-40">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-lg shadow-primary/30 animate-glow-pulse">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">AquaSentinel</h1>
              <p className="text-xs text-primary font-semibold tracking-wide">AI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,194,255,0.08)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "drop-shadow-[0_0_6px_rgba(0,194,255,0.5)]" : ""}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-3">
            <LanguageSelector compact />
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="relative w-2 h-2 rounded-full bg-safe">
              <div className="absolute inset-0 rounded-full bg-safe animate-ping opacity-75" />
            </div>
            <span className="text-xs text-muted-foreground">ESP32 Sensor Ready</span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-md shadow-primary/20">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">AquaSentinel AI</span>
          </div>
          <LanguageSelector compact />
        </div>
        {/* Mobile nav */}
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
                    : "text-muted-foreground hover:bg-white/5"
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