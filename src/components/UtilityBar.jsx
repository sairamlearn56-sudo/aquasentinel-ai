import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Sun, Moon, BellRing, Settings2, UserRound, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function UtilityBar({ transparent = false }) {
  const { lang, setLang, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const btnClass = "w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50";

  return (
    <div className={`flex items-center gap-1 ${transparent ? "" : "glass-strong rounded-2xl px-1.5 py-1.5 shadow-lg border border-border/50"}`}>
      {/* Language */}
      <div className="relative" ref={langRef}>
        <button onClick={() => setLangOpen(!langOpen)} className={btnClass} title="Language">
          <Globe2 className="w-[18px] h-[18px]" />
        </button>
        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl border border-border/50 shadow-xl overflow-hidden z-50"
            >
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-1.5">Language</p>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                      lang === l.code ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">{l.nativeLabel}</p>
                      <p className="text-xs text-muted-foreground">{l.label}</p>
                    </div>
                    {lang === l.code && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border/50" />

      {/* Theme Toggle */}
      <button onClick={toggleTheme} className={btnClass} title="Toggle theme">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <Sun className="w-[18px] h-[18px] text-warning" /> : <Moon className="w-[18px] h-[18px] text-primary" />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Notifications */}
      <button onClick={() => navigate("/settings/notifications")} className={btnClass} title="Notifications">
        <BellRing className="w-[18px] h-[18px]" />
      </button>

      {/* Settings */}
      <button onClick={() => navigate("/settings")} className={btnClass} title="Settings">
        <Settings2 className="w-[18px] h-[18px]" />
      </button>

      {/* Profile */}
      <button onClick={() => navigate("/profile")} className={btnClass} title="Profile">
        <UserRound className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}