import React, { useState } from "react";
import { motion } from "framer-motion";
import { BellRing } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout";

export default function NotificationsSettings() {
  const { t, prefs, updatePrefs } = useLanguage();
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

  return (
    <SettingsPageLayout
      icon={BellRing}
      iconColor="text-amber-400"
      iconBg="bg-amber-500/10"
      title="Notifications"
      description="Manage alert preferences"
      onSave={handleSave}
      saving={saving}
      saved={saved}
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="premium-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="font-heading font-semibold">{t("notifications")}</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
          <span className="text-sm font-medium">{t("notifications")}</span>
          <button onClick={() => setLocalPrefs((p) => ({ ...p, notifications_enabled: !p.notifications_enabled }))} className={`relative w-12 h-6 rounded-full transition-colors ${localPrefs.notifications_enabled ? "bg-amber-500" : "bg-muted-foreground/30"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${localPrefs.notifications_enabled ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </motion.div>
    </SettingsPageLayout>
  );
}