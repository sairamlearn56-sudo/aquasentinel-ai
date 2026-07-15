import React from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSelector({ compact = false }) {
  const { lang, setLang, languages } = useLanguage();

  if (compact) {
    return (
      <div className="relative">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="appearance-none bg-muted/50 hover:bg-muted border border-border rounded-xl pl-9 pr-8 py-2 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeLabel}
            </option>
          ))}
        </select>
        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
            lang === l.code
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/30 hover:bg-muted/50"
          }`}
        >
          <div className="text-left">
            <p className="text-sm font-semibold">{l.nativeLabel}</p>
            <p className="text-xs text-muted-foreground">{l.label}</p>
          </div>
          {lang === l.code && <Check className="w-4 h-4 text-primary" />}
        </button>
      ))}
    </div>
  );
}