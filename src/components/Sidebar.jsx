import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Radio, BrainCircuit, TrendingUp, MapPin, Settings, Droplets, User, LogOut, Waves, BarChart3, Megaphone, FileText, ClipboardList } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";

export default function Sidebar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/monitor", icon: Radio, label: t("liveMonitor") },
    { to: "/analysis", icon: BrainCircuit, label: t("aiAnalysis") },
    { to: "/history", icon: TrendingUp, label: t("history") },
    { to: "/tracker", icon: Waves, label: "Water Tracker" },
    { to: "/map", icon: MapPin, label: t("communityMap") },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/notifications", icon: Megaphone, label: "Notifications" },
    { to: "/community-reporting", icon: FileText, label: "Community Reports" },
    { to: "/reports", icon: ClipboardList, label: "Reports" },
    { to: "/settings", icon: Settings, label: t("settings") },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* ===== Desktop Floating Glass Sidebar ===== */}
      <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-60 flex-col glass-strong z-40 overflow-hidden">
        {/* Logo */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm leading-tight tracking-tight">AquaSentinel</h1>
              <p className="text-[10px] text-cyan-500 font-semibold tracking-widest uppercase">AI Healthcare</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                <span className={isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer — Profile + Controls */}
        <div className="p-3 border-t border-border/50 space-y-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-muted/25">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-heading font-semibold flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase() || "G"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.full_name || "Guest"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
            <button onClick={() => logout()} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 px-1">
            <LanguageSelector compact />
            <NotificationBell compact />
            <ThemeToggle compact />
          </div>
        </div>
      </aside>

      {/* ===== Mobile Top Bar ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Droplets className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm tracking-tight">AquaSentinel AI</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <NotificationBell compact />
            <ThemeToggle compact />
          </div>
        </div>
        <nav className="flex items-center gap-1 px-2 pb-2 overflow-x-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-primary/10 text-primary border border-primary/15" : "text-muted-foreground hover:bg-muted/50"
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