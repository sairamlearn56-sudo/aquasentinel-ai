import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, LANGUAGES } from "@/lib/i18n";
import { base44 } from "@/api/base44Client";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [prefs, setPrefs] = useState(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  const t = useCallback((key) => {
    const tr = translations[lang] || translations.en;
    return tr[key] || translations.en[key] || key;
  }, [lang]);

  // Load user preferences on mount
  useEffect(() => {
    let cancelled = false;
    async function loadPrefs() {
      try {
        const result = await base44.entities.UserPreferences.list();
        if (!cancelled && result && result.length > 0) {
          const p = result[0];
          setPrefs(p);
          setLang(p.language || "en");
        }
      } catch (e) {
        // Use defaults
      } finally {
        if (!cancelled) setLoadingPrefs(false);
      }
    }
    loadPrefs();
    return () => { cancelled = true; };
  }, []);

  const changeLanguage = useCallback(async (newLang) => {
    setLang(newLang);
    try {
      if (prefs) {
        const updated = await base44.entities.UserPreferences.update(prefs.id, { language: newLang });
        setPrefs(updated);
      } else {
        const created = await base44.entities.UserPreferences.create({ language: newLang });
        setPrefs(created);
      }
    } catch (e) {
      // Silently fail — UI still updates
    }
  }, [prefs]);

  const updatePrefs = useCallback(async (data) => {
    try {
      let result;
      if (prefs) {
        result = await base44.entities.UserPreferences.update(prefs.id, data);
      } else {
        result = await base44.entities.UserPreferences.create({ language: lang, ...data });
      }
      setPrefs(result);
      return result;
    } catch (e) {
      return null;
    }
  }, [prefs, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t, prefs, updatePrefs, loadingPrefs, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}