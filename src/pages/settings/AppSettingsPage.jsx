import React from "react";
import { motion } from "framer-motion";
import { Settings2, Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import PageHeader from "@/components/PageHeader";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <PageHeader title="App Settings" subtitle="Theme, display, and app preferences">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Theme Selection */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-indigo-500" />
              <h3 className="text-[18px] font-medium">Appearance</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  theme === "light" ? "bg-primary/10 border-primary/30" : "glass border-border hover:border-primary/20"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-3">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <p className="text-[15px] font-medium">Light</p>
                <p className="text-[12px] text-muted-foreground">Clean and bright</p>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  theme === "dark" ? "bg-primary/10 border-primary/30" : "glass border-border hover:border-primary/20"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[15px] font-medium">Dark</p>
                <p className="text-[12px] text-muted-foreground">Easy on the eyes</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-blue-500" />
              <h3 className="text-[18px] font-medium">Quick Toggle</h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
              <div>
                <p className="text-[15px] font-medium">Theme Mode</p>
                <p className="text-[13px] text-muted-foreground capitalize">{theme} mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      </div>
    </PageHeader>
  );
}