import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center glass border border-border hover:border-primary/30 transition-all"
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border hover:border-primary/30 transition-all text-sm font-medium"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-warning" />
          ) : (
            <Moon className="w-4 h-4 text-primary" />
          )}
        </motion.div>
      </AnimatePresence>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}