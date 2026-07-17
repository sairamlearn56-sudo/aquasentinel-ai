import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X, RotateCcw, Upload, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/PageHeader";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => !phone || /^[+]?[\d\s\-()]{7,}$/.test(phone);

function FormField({ label, value, onChange, placeholder, type = "text", error }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl glass border ${error ? "border-danger/40" : "border-border"} text-[15px] focus:outline-none focus:border-primary/40 transition-colors`}
      />
      {error && <p className="text-[12px] text-danger mt-1">{error}</p>}
    </div>
  );
}

export default function PersonalInfo() {
  const { user, isGuest, checkUserAuth } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    phone: user?.phone || "",
    organization: user?.organization || "",
    department: user?.department || "",
    designation: user?.designation || "",
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
    bio: user?.bio || "",
  });
  const [originalForm] = useState(form);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const set = (key) => (val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name?.trim()) e.full_name = "Full name is required";
    if (form.username && form.username.length < 3) e.username = "Username must be at least 3 characters";
    if (form.phone && !isValidPhone(form.phone)) e.phone = "Invalid phone number format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await base44.auth.updateMe(form);
      await checkUserAuth();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors({ general: err.message || "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setForm(originalForm);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setErrors((p) => ({ ...p, photo: "Only PNG, JPG, JPEG formats are supported" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, photo: "Maximum file size is 5 MB" }));
      return;
    }
    setUploadingPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_photo_url: file_url });
      await checkUserAuth();
      setErrors((p) => ({ ...p, photo: undefined }));
    } catch (err) {
      setErrors((p) => ({ ...p, photo: "Failed to upload photo" }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await base44.auth.updateMe({ profile_photo_url: "" });
      await checkUserAuth();
    } catch (err) {}
  };

  const initials = form.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "G";

  return (
    <PageHeader title="Personal Information" subtitle="Update your personal details and profile photo">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Photo */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="premium-card p-6">
            <h3 className="text-[18px] font-medium mb-4">Profile Photo</h3>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
                  </div>
                )}
                {uploadingPhoto && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-medium hover:shadow-lg transition-all cursor-pointer">
                  {user?.profile_photo_url ? <Camera className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  {user?.profile_photo_url ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {user?.profile_photo_url && (
                  <button onClick={handleRemovePhoto} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border text-[14px] font-medium text-danger hover:bg-danger/10 transition-colors">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
            </div>
            {errors.photo && <p className="text-[12px] text-danger mt-2">{errors.photo}</p>}
            <p className="text-[12px] text-muted-foreground mt-2">PNG, JPG, or JPEG · Max 5 MB</p>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <div className="premium-card p-6">
            <h3 className="text-[18px] font-medium mb-4">Personal Details</h3>
            <div className="space-y-4">
              <FormField label="Full Name *" value={form.full_name} onChange={set("full_name")} placeholder="John Doe" error={errors.full_name} />
              <FormField label="Username" value={form.username} onChange={set("username")} placeholder="johndoe" error={errors.username} />
              <FormField label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" error={errors.phone} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Organization" value={form.organization} onChange={set("organization")} placeholder="Acme Corp" />
                <FormField label="Department" value={form.department} onChange={set("department")} placeholder="Engineering" />
              </div>
              <FormField label="Designation" value={form.designation} onChange={set("designation")} placeholder="Senior Engineer" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Country" value={form.country} onChange={set("country")} placeholder="India" />
                <FormField label="State" value={form.state} onChange={set("state")} placeholder="Karnataka" />
                <FormField label="City" value={form.city} onChange={set("city")} placeholder="Bangalore" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">Bio / About Me</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => set("bio")(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl glass border border-border text-[15px] focus:outline-none focus:border-primary/40 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[14px] text-safe font-medium animate-fade-in">
              <Check className="w-4 h-4" /> Profile updated successfully.
            </span>
          )}
          {errors.general && <span className="text-[14px] text-danger">{errors.general}</span>}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass border border-border text-[14px] font-medium hover:bg-muted/50 transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={handleSave} disabled={saving || isGuest} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </PageHeader>
  );
}