import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, MapPin, Calendar, Clock, Mail, Phone, Building2, Briefcase, Globe, FileText, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import PageHeader from "@/components/PageHeader";
import moment from "moment";

function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-2.5 p-3.5 rounded-xl glass border border-border/50">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-[15px] font-medium truncate">{value || "Not set"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, isGuest } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "G";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const langDisplay = { en: "English", hi: "हिन्दी", te: "తెలుగు", ta: "தமிழ்", kn: "ಕನ್ನಡ", mr: "मराठी", bn: "বাংলা" }[lang] || "English";

  return (
    <PageHeader title="Profile" subtitle="View your account information">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="premium-card p-6">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden flex-shrink-0">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt={user?.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[22px] font-bold">{user?.full_name || "Guest User"}</h2>
                  {isGuest && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-medium">Guest</span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium capitalize">{user?.role || "user"}</span>
                </div>
                <p className="text-[14px] text-muted-foreground mt-1">@{user?.username || "username"}</p>
                <p className="text-[14px] text-muted-foreground">{user?.email || "Not signed in"}</p>
              </div>
              {!isGuest && (
                <button
                  onClick={() => navigate("/settings/personal")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-medium hover:shadow-lg transition-all"
                >
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {isGuest && (
          <div className="premium-card p-5 border-cyan-500/20">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[15px] font-medium">Sign in to save your data</h3>
                <p className="text-[13px] text-muted-foreground mt-1">Create an account to save scans, access history, and get personalized alerts.</p>
                <button onClick={() => navigate("/register")} className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[13px] font-medium hover:shadow-lg transition-all">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="premium-card p-6">
            <h3 className="text-[18px] font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoField label="Phone Number" value={user?.phone} icon={Phone} />
              <InfoField label="Email Address" value={user?.email} icon={Mail} />
              <InfoField label="Organization" value={user?.organization} icon={Building2} />
              <InfoField label="Department" value={user?.department} icon={Briefcase} />
              <InfoField label="Designation" value={user?.designation} icon={Briefcase} />
              <InfoField label="Country" value={user?.country} icon={Globe} />
              <InfoField label="State" value={user?.state} icon={MapPin} />
              <InfoField label="City" value={user?.city} icon={MapPin} />
              <InfoField label="Time Zone" value={timezone} icon={Clock} />
              <InfoField label="Preferred Language" value={langDisplay} icon={Globe} />
            </div>
            {user?.bio && (
              <div className="mt-3 p-3.5 rounded-xl glass border border-border/50">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Bio</p>
                <p className="text-[15px] leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Information (Read-Only) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="premium-card p-6">
            <h3 className="text-[18px] font-medium mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoField label="User ID" value={user?.id?.slice(0, 12) + "..."} icon={FileText} />
              <InfoField label="Account Status" value="Active" icon={ShieldCheck} />
              <InfoField label="Email Verification" value="Verified" icon={Mail} />
              <InfoField label="Role" value={(user?.role || "user").charAt(0).toUpperCase() + (user?.role || "user").slice(1)} icon={Briefcase} />
              <InfoField label="Account Created" value={user?.created_date ? moment(user.created_date).format("ll") : "N/A"} icon={Calendar} />
              <InfoField label="Last Login" value="Recently" icon={Clock} />
            </div>
          </div>
        </motion.div>
      </div>
    </PageHeader>
  );
}