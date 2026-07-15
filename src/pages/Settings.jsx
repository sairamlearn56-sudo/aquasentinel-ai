import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Globe, Volume2, Gauge, Bell, Users, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import LanguageSelector from "@/components/LanguageSelector";
import FamilyMemberSelector from "@/components/FamilyMemberSelector";

export default function Settings() {
  const { t, lang, setLang, prefs, updatePrefs } = useLanguage();
  const { speak } = useVoice();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localPrefs, setLocalPrefs] = useState({
    voice_enabled: prefs?.voice_enabled ?? true,
    voice_speed: prefs?.voice_speed ?? 0.9,
    notifications_enabled: prefs?.notifications_enabled ?? true,
    default_family_member: prefs?.default_family_member ?? "adult",
  });

  const handleSave = async () => {
    setSaving(true);
    await updatePrefs(localPrefs);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestVoice = () => {
    speak(t("voiceSafe"), lang, localPrefs.voice_speed);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold">{t("settingsTitle")}</h1>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="premium-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("language")}</h2>
        </div>
        <LanguageSelector />
      </motion.div>

      {/* Voice Guidance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="premium-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("voiceGuidance")}</h2>
        </div>

        {/* Voice toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 mb-4">
          <span className="text-sm font-medium">{t("voiceGuidance")}</span>
          <button
            onClick={() => setLocalPrefs((p) => ({ ...p, voice_enabled: !p.voice_enabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${localPrefs.voice_enabled ? "bg-primary" : "bg-muted-foreground/30"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                localPrefs.voice_enabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Voice speed */}
        <div className="p-4 rounded-xl bg-muted/20 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              {t("voiceSpeed")}
            </span>
            <span className="text-sm text-cyan-400 font-semibold">{localPrefs.voice_speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={localPrefs.voice_speed}
            onChange={(e) => setLocalPrefs((p) => ({ ...p, voice_speed: parseFloat(e.target.value) }))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Test voice */}
        <button
          onClick={handleTestVoice}
          className="w-full py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-medium text-sm hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Test Voice
        </button>
      </motion.div>

      {/* Default Family Member */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="premium-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("defaultFamilyMember")}</h2>
        </div>
        <FamilyMemberSelector
          value={localPrefs.default_family_member}
          onChange={(val) => setLocalPrefs((p) => ({ ...p, default_family_member: val }))}
        />
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="premium-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("notifications")}</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
          <span className="text-sm font-medium">{t("notifications")}</span>
          <button
            onClick={() => setLocalPrefs((p) => ({ ...p, notifications_enabled: !p.notifications_enabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${localPrefs.notifications_enabled ? "bg-warning" : "bg-muted-foreground/30"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                localPrefs.notifications_enabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex justify-end gap-3"
      >
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-400 font-medium animate-fade-in">
            <Check className="w-4 h-4" />
            {t("saved")}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          {t("save")}
        </button>
      </motion.div>
    </div>
  );
}