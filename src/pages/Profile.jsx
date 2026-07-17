import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound, LogOut, Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function Profile() {
  const { user, logout, isGuest } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);

  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "G";

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ full_name: name });
      window.location.reload();
    } catch (e) {
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <UserRound className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your account information</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="premium-card p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-heading font-bold shadow-xl shadow-cyan-500/30 mb-4">
            {initials}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/25 to-transparent" />
          </div>

          {editing ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-heading font-bold text-center bg-transparent border-b-2 border-cyan-500 outline-none px-2"
                autoFocus
              />
              <button onClick={handleSaveName} disabled={saving} className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setEditing(false); setName(user?.full_name || ""); }} className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h2 className="text-xl font-heading font-bold mb-1">{user?.full_name || "Guest User"}</h2>
          )}

          <p className="text-sm text-muted-foreground">{user?.email || "Not signed in"}</p>

          {isGuest && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
              Guest Mode
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-muted/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">User Role</p>
            <p className="text-sm font-semibold capitalize">{user?.role || "user"}</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Workspace</p>
            <p className="text-sm font-semibold">AquaSentinel AI</p>
          </div>
        </div>

        {!editing && !isGuest && (
          <button
            onClick={() => setEditing(true)}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl glass border border-border hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-sm font-medium"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </motion.div>

      {isGuest && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="premium-card p-5 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <UserRound className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-sm">Sign in to save your data</h3>
              <p className="text-xs text-muted-foreground mt-1">Create an account to save scans, access history, and get personalized alerts.</p>
              <button onClick={() => navigate("/register")} className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Create Account
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Log Out */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 p-4 premium-card text-rose-400 hover:border-rose-500/25 hover:bg-rose-500/5 transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          {isGuest ? "Exit Guest Mode" : "Log Out"}
        </button>
      </motion.div>
    </div>
  );
}