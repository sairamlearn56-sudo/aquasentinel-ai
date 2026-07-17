import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout";

export default function LanguageSettings() {
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
      icon={Globe2}
      iconColor="text-emerald-400"
      iconBg="bg-emerald-500/10"
      title="Language & Region"
      description="Choose your preferred language"
      onSave={handleSave}
      saving={saving}
      saved={saved}
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="premium-card p-6">
        <LanguageSelector />
      </motion.div>
    </SettingsPageLayout>
  );
}