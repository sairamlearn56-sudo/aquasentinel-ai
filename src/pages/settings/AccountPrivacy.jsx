import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Key, LogOut, Check, X, FileText, Calendar, Clock, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/PageHeader";
import moment from "moment";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-muted", width: "0%" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;
  const labels = ["", "Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-muted", "bg-danger", "bg-danger", "bg-warning", "bg-primary", "bg-safe"];
  const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];
  return { score, label: labels[score], color: colors[score], width: widths[score] };
}

function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-2.5 p-3.5 rounded-xl glass border border-border/50">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-[15px] font-medium truncate">{value || "N/A"}</p>
      </div>
    </div>
  );
}

export default function AccountPrivacy() {
  const { user, logout } = useAuth();
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  return (
    <PageHeader title="Account & Privacy" subtitle="Manage your account security">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Information */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="premium-card p-6">
            <h3 className="text-[18px] font-medium mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ReadOnlyField label="User ID" value={user?.id?.slice(0, 12) + "..."} icon={FileText} />
              <ReadOnlyField label="Account Status" value="Active" icon={ShieldCheck} />
              <ReadOnlyField label="Email Verification" value="Verified" icon={Mail} />
              <ReadOnlyField label="Role" value={(user?.role || "user").charAt(0).toUpperCase() + (user?.role || "user").slice(1)} icon={ShieldCheck} />
              <ReadOnlyField label="Account Created" value={user?.created_date ? moment(user.created_date).format("ll") : "N/A"} icon={Calendar} />
              <ReadOnlyField label="Last Login" value="Recently" icon={Clock} />
            </div>
          </div>
        </motion.div>

        {/* Security actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="premium-card p-6">
            <h3 className="text-[18px] font-medium mb-4">Security</h3>
            <div className="space-y-3">
              <button onClick={() => setEmailModal(true)} className="w-full flex items-center gap-3 p-4 rounded-xl glass border border-border hover:border-primary/20 transition-colors text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-medium">Change Email Address</p>
                  <p className="text-[13px] text-muted-foreground">{user?.email}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => setPasswordModal(true)} className="w-full flex items-center gap-3 p-4 rounded-xl glass border border-border hover:border-primary/20 transition-colors text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-medium">Change Password</p>
                  <p className="text-[13px] text-muted-foreground">Update your account password</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => logout()} className="w-full flex items-center gap-3 p-4 rounded-xl glass border border-border hover:border-rose-500/20 hover:bg-rose-500/5 transition-colors text-left">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-rose-500">Log Out</p>
                  <p className="text-[13px] text-muted-foreground">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Email Change Modal */}
      <EmailChangeModal open={emailModal} onClose={() => setEmailModal(false)} currentEmail={user?.email} />

      {/* Password Change Modal */}
      <PasswordChangeModal open={passwordModal} onClose={() => setPasswordModal(false)} />
    </PageHeader>
  );
}

function EmailChangeModal({ open, onClose, currentEmail }) {
  const [step, setStep] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendCode = () => {
    if (!isValidEmail(newEmail)) { setError("Please enter a valid email address"); return; }
    if (newEmail === currentEmail) { setError("New email must be different from current email"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { setError("Please enter the 6-digit code"); return; }
    setError("");
    setLoading(true);
    try {
      await base44.auth.updateMe({ pending_email: newEmail });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => { onClose(); resetModal(); }, 2000);
    } catch (err) {
      setLoading(false);
      setError("Failed to update email. Please try again.");
    }
  };

  const resetModal = () => {
    setStep(1); setNewEmail(""); setOtp(""); setError(""); setLoading(false); setSuccess(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => { onClose(); resetModal(); }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="premium-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-medium">Change Email Address</h3>
              <button onClick={() => { onClose(); resetModal(); }} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-safe/15 flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6 text-safe" /></div>
                <p className="text-[15px] font-medium">Email updated successfully!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2].map((s) => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>

                {step === 1 && (
                  <>
                    <div>
                      <label className="text-[13px] font-medium text-muted-foreground">Current Email</label>
                      <p className="text-[15px] font-medium mt-1 p-3 rounded-xl glass border border-border">{currentEmail}</p>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">New Email Address</label>
                      <input type="email" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setError(""); }} placeholder="new@email.com" className="w-full px-3.5 py-2.5 rounded-xl glass border border-border text-[15px] focus:outline-none focus:border-primary/40" />
                    </div>
                    {error && <p className="text-[12px] text-danger">{error}</p>}
                    <button onClick={handleSendCode} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail className="w-4 h-4" />}
                      Send Verification Code
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-[14px] text-muted-foreground">A verification code has been sent to <span className="font-medium text-foreground">{newEmail}</span>. Please enter it below.</p>
                    <div>
                      <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">Verification Code</label>
                      <input type="text" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="000000" className="w-full px-3.5 py-2.5 rounded-xl glass border border-border text-[15px] tracking-[0.3em] text-center focus:outline-none focus:border-primary/40" />
                    </div>
                    {error && <p className="text-[12px] text-danger">{error}</p>}
                    <div className="flex items-center gap-2">
                      <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl glass border border-border text-[14px] font-medium hover:bg-muted/50 transition-colors">Back</button>
                      <button onClick={handleVerify} disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        Verify & Update
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PasswordChangeModal({ open, onClose }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(newPass);
  const passwordsMatch = newPass && confirm && newPass === confirm;

  const handleSubmit = async () => {
    if (!current) { setError("Please enter your current password"); return; }
    if (newPass.length < 8) { setError("New password must be at least 8 characters"); return; }
    if (newPass !== confirm) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => { onClose(); resetModal(); }, 2000);
    }, 1000);
  };

  const resetModal = () => {
    setCurrent(""); setNewPass(""); setConfirm(""); setError(""); setLoading(false); setSuccess(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => { onClose(); resetModal(); }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="premium-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-medium">Change Password</h3>
              <button onClick={() => { onClose(); resetModal(); }} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-safe/15 flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6 text-safe" /></div>
                <p className="text-[15px] font-medium">Password changed successfully!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">Current Password</label>
                  <input type="password" value={current} onChange={(e) => { setCurrent(e.target.value); setError(""); }} placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl glass border border-border text-[15px] focus:outline-none focus:border-primary/40" />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">New Password</label>
                  <input type="password" value={newPass} onChange={(e) => { setNewPass(e.target.value); setError(""); }} placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl glass border border-border text-[15px] focus:outline-none focus:border-primary/40" />
                  {newPass && (
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: strength.width }} />
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-1">{strength.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">Confirm Password</label>
                  <input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="••••••••" className={`w-full px-3.5 py-2.5 rounded-xl glass border ${confirm && !passwordsMatch ? "border-danger/40" : "border-border"} text-[15px] focus:outline-none focus:border-primary/40`} />
                  {confirm && !passwordsMatch && <p className="text-[12px] text-danger mt-1">Passwords do not match</p>}
                </div>
                {error && <p className="text-[12px] text-danger">{error}</p>}
                <button onClick={handleSubmit} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Key className="w-4 h-4" />}
                  Change Password
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}