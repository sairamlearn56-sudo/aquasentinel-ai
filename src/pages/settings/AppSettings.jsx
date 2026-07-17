import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Volume2, Gauge, Users } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import FamilyMemberSelector from "@/components/FamilyMemberSelector";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout";

export default function AppSettings() {
  const { t, lang, prefs, updatePrefs } = useLanguage();
  const { speak } = useVoice();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localPrefs, setLocalPrefs] = useState({
    voice_enabled: prefs?.voice_enabled ?? true,
    voice_speed: prefs?.voice_speed ?? 0.9,
    default_family_member: prefs?.default_family_member ?? "adult",
    notifications_enabled: prefs?.notifications_enabled ?? true,
    language: prefs?.language ?? "en",
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
    <SettingsPageLayout
      icon={Settings2}
      iconColor="text-indigo-400"
      iconBg="bg-indigo-500/10"
      title="App Settings"
      description="Voice guidance and default preferences"
      onSave={handleSave}
      saving={saving}
      saved={saved}
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="premium-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("voiceGuidance")}</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
          <span className="text-sm font-medium">{t("voiceGuidance")}</span>
          <button onClick={() => setLocalPrefs((p) => ({ ...p, voice_enabled: !p.voice_enabled }))} className={`relative w-12 h-6 rounded-full transition-colors ${localPrefs.voice_enabled ? "bg-cyan-500" : "bg-muted-foreground/30"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${localPrefs.voice_enabled ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
        <div className="p-4 rounded-2xl bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium flex items-center gap-2"><Gauge className="w-4 h-4" />{t("voiceSpeed")}</span>
            <span className="text-sm text-cyan-400 font-semibold">{localPrefs.voice_speed.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.5" max="1.5" step="0.1" value={localPrefs.voice_speed} onChange={(e) => setLocalPrefs((p) => ({ ...p, voice_speed: parseFloat(e.target.value) }))} className="w-full accent-cyan-500" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Slow</span><span>Normal</span><span>Fast</span></div>
        </div>
        <button onClick={handleTestVoice} className="w-full py-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 font-medium text-sm hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4" />Test Voice
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="premium-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("defaultFamilyMember")}</h2>
        </div>
        <FamilyMemberSelector value={localPrefs.default_family_member} onChange={(val) => setLocalPrefs((p) => ({ ...p, default_family_member: val }))} />
      </motion.div>
    </SettingsPageLayout>
  );
}