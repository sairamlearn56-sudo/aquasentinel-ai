import React from "react";
import { Baby, Smile, User, Users, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const MEMBERS = [
  { key: "infant", icon: Baby, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { key: "child", icon: Smile, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { key: "adult", icon: User, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30" },
  { key: "elderly", icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { key: "pregnant_woman", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
];

export default function FamilyMemberSelector({ value, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {MEMBERS.map((m) => {
        const Icon = m.icon;
        const isActive = value === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
              isActive
                ? "border-primary bg-primary/5 scale-105 shadow-md shadow-primary/10"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.bg} ${m.color} transition-transform ${isActive ? "scale-110" : ""}`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className={`text-xs font-medium text-center ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              {t(m.key)}
            </span>
          </button>
        );
      })}
    </div>
  );
}