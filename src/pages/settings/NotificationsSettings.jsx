import React, { useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Volume2, Gauge, Check, Users } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import FamilyMemberSelector from "@/components/FamilyMemberSelector";
import PageHeader from "@/components/PageHeader";

export default function NotificationsSettings() {
  const { t, lang, prefs, updatePrefs } = useLanguage();
  const { speak } = useVoice();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState({
    voice_enabled: prefs?.voice_enabled ?? true,
    voice_speed: prefs?.voice_speed ?? 0.9,
    notifications_enabled: prefs?.notifications_enabled ?? true,
    default_family_member: prefs?.default_family_member ?? "adult",
  });

  const set = (key) => (val) => setLocal((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await updatePrefs(local);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestVoice = () => speak(t("voiceSafe"), lang, local.voice_speed);

  const Toggle = ({ checked, onChange, color }) => (
    <button onClick={() => onChange(!checked)} className={`relative w-12 h-6 rounded-full transition-colors ${checked ? color : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <PageHeader title="Notifications" subtitle="Manage alerts and voice guidance">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="w-5 h-5 text-amber-500" />
              <h3 className="text-[18px] font-medium">Push Notifications</h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
              <span className="text-[15px] font-medium">Enable notifications</span>
              <Toggle checked={local.notifications_enabled} onChange={set("notifications_enabled")} color="bg-amber-500" />
            </div>
          </div>
        </motion.div>

        {/* Voice Guidance */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-cyan-500" />
              <h3 className="text-[18px] font-medium">Voice Guidance</h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 mb-4">
              <span className="text-[15px] font-medium">{t("voiceGuidance")}</span>
              <Toggle checked={local.voice_enabled} onChange={set("voice_enabled")} color="bg-cyan-500" />
            </div>
            <div className="p-4 rounded-xl bg-muted/20 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-medium flex items-center gap-2"><Gauge className="w-4 h-4" />{t("voiceSpeed")}</span>
                <span className="text-[15px] text-cyan-500 font-semibold">{local.voice_speed.toFixed(1)}x</span>
              </div>
              <input type="range" min="0.5" max="1.5" step="0.1" value={local.voice_speed} onChange={(e) => set("voice_speed")(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
              <div className="flex justify-between text-[12px] text-muted-foreground mt-1"><span>Slow</span><span>Normal</span><span>Fast</span></div>
            </div>
            <button onClick={handleTestVoice} disabled={!local.voice_enabled} className="w-full py-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 font-medium text-[14px] hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <Volume2 className="w-4 h-4" /> Test Voice
            </button>
          </div>
        </motion.div>

        {/* Default Family Member */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              <h3 className="text-[18px] font-medium">{t("defaultFamilyMember")}</h3>
            </div>
            <FamilyMemberSelector value={local.default_family_member} onChange={set("default_family_member")} />
          </div>
        </motion.div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[14px] text-safe font-medium animate-fade-in">
              <Check className="w-4 h-4" /> Settings saved successfully.
            </span>
          )}
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </PageHeader>
  );
}