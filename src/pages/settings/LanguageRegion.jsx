import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Globe, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import PageHeader from "@/components/PageHeader";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

export default function LanguageRegion() {
  const { lang, setLang, prefs, updatePrefs } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedLang, setSelectedLang] = useState(lang || "en");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const handleSave = async () => {
    setSaving(true);
    try {
      setLang(selectedLang);
      await updatePrefs({ language: selectedLang });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {}
    setSaving(false);
  };

  return (
    <PageHeader title="Language & Region" subtitle="Set your preferred language and timezone">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Language Selection */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-emerald-500" />
              <h3 className="text-[18px] font-medium">Preferred Language</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedLang === l.code
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "glass border-border hover:border-primary/20"
                  }`}
                >
                  <p className="text-[15px] font-medium">{l.native}</p>
                  <p className="text-[12px] text-muted-foreground">{l.label}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Time Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-[18px] font-medium">Time Zone</h3>
            </div>
            <div className="p-4 rounded-xl glass border border-border">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">Detected Time Zone</p>
              <p className="text-[15px] font-medium">{timezone}</p>
              <p className="text-[12px] text-muted-foreground mt-1">Time zone is detected automatically based on your device settings.</p>
            </div>
          </div>
        </motion.div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[14px] text-safe font-medium animate-fade-in">
              <Check className="w-4 h-4" /> Settings saved successfully.
            </span>
          )}
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </PageHeader>
  );
}