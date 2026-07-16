import React, { useState, useEffect, useMemo } from "react";
import { Megaphone, Plus, Search, MapPin, Camera, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import TableEmptyState from "@/components/shared/TableEmptyState";

const PROBLEM_TYPES = [
  { key: "dirty_water", label: "Dirty Water", color: "text-warning" },
  { key: "bad_smell", label: "Bad Smell", color: "text-orange" },
  { key: "dead_fish", label: "Dead Fish", color: "text-danger" },
  { key: "flooding", label: "Flooding", color: "text-blue" },
  { key: "sewage_leak", label: "Sewage Leak", color: "text-danger" },
  { key: "broken_pipeline", label: "Broken Pipeline", color: "text-warning" },
  { key: "other", label: "Other", color: "text-muted-foreground" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-warning", bg: "bg-warning/10" },
  under_review: { label: "Under Review", color: "text-blue", bg: "bg-blue/10" },
  resolved: { label: "Resolved", color: "text-safe", bg: "bg-safe/10" },
};

const EMPTY_FORM = { name: "", mobile_number: "", village: "", location: "", problem_type: "dirty_water", description: "", photo_url: "", gps_latitude: null, gps_longitude: null };

export default function CommunityReporting() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.CommunityReport.list("-created_date", 100);
      setReports(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const captureGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({ ...prev, gps_latitude: pos.coords.latitude, gps_longitude: pos.coords.longitude }));
    }, () => {}, { enableHighAccuracy: true });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((prev) => ({ ...prev, [field]: file_url }));
    } catch (err) { console.error("Upload failed:", err); }
  };

  const submitReport = async () => {
    if (!form.village.trim() || !form.description.trim()) return;
    try {
      setSubmitting(true);
      await base44.entities.CommunityReport.create(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadReports();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return reports;
    const q = search.toLowerCase();
    return reports.filter((r) => (r.village || "").toLowerCase().includes(q) || (r.name || "").toLowerCase().includes(q));
  }, [reports, search]);

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    review: reports.filter((r) => r.status === "under_review").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  }), [reports]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Community Reporting"
        subtitle="Citizens can report water quality issues in their area"
        icon={Megaphone}
        actions={
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> New Report
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Reports" value={stats.total} color="text-primary" />
        <StatCard label="Pending" value={stats.pending} color="text-warning" />
        <StatCard label="Under Review" value={stats.review} color="text-blue" />
        <StatCard label="Resolved" value={stats.resolved} color="text-safe" />
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-heading font-semibold">Report an Issue</h3>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg hover:bg-muted/40 flex items-center justify-center"><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Input label="Name (optional)" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Input label="Mobile (optional)" value={form.mobile_number} onChange={(v) => setForm({ ...form, mobile_number: v })} />
                <Input label="Village" value={form.village} onChange={(v) => setForm({ ...form, village: v })} required />
                <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Problem Type</label>
                  <select value={form.problem_type} onChange={(e) => setForm({ ...form, problem_type: e.target.value })} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none">
                    {PROBLEM_TYPES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">GPS Location</label>
                  <button onClick={captureGPS} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 text-sm border border-transparent hover:border-primary/30">
                    <MapPin className="w-3.5 h-3.5" />
                    {form.gps_latitude ? `${form.gps_latitude.toFixed(3)}, ${form.gps_longitude.toFixed(3)}` : "Capture Location"}
                  </button>
                </div>
              </div>
              <textarea placeholder="Describe the problem..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-3 bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none" rows={3} />
              <div className="flex flex-wrap gap-3 mt-3">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 text-sm cursor-pointer hover:bg-muted/50">
                  <Camera className="w-3.5 h-3.5" /> Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "photo_url")} />
                </label>
                {form.photo_url && <span className="text-xs text-safe self-center">✓ Photo uploaded</span>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={submitReport} disabled={submitting || !form.village.trim() || !form.description.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40">Submit Report</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search village or name..." className="bg-muted/30 rounded-lg pl-9 pr-3 py-1.5 text-sm border border-transparent focus:border-primary/30 outline-none w-full" />
        </div>
      </div>

      {loading ? <LoadingState text="Loading reports..." /> : filtered.length === 0 ? <div className="premium-card"><TableEmptyState title="No reports" description="No community reports have been submitted yet." icon={Megaphone} /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const pt = PROBLEM_TYPES.find((p) => p.key === r.problem_type) || PROBLEM_TYPES[0];
            const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
            return (
              <div key={r.id} className="premium-card p-4 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setSelectedReport(r)}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`text-xs font-medium ${pt.color}`}>{pt.label}</span>
                    <p className="text-sm font-medium mt-0.5">{r.village}</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{r.description}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/70">
                  <span>{r.name || "Anonymous"}</span>
                  <span>{new Date(r.created_date).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-heading font-semibold">Report Details</h3>
                <button onClick={() => setSelectedReport(null)} className="w-7 h-7 rounded-lg hover:bg-muted/40 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <Detail label="Village" value={selectedReport.village} />
                <Detail label="Problem Type" value={PROBLEM_TYPES.find((p) => p.key === selectedReport.problem_type)?.label || selectedReport.problem_type} />
                <Detail label="Reporter" value={selectedReport.name || "Anonymous"} />
                <Detail label="Mobile" value={selectedReport.mobile_number || "—"} />
                <Detail label="Location" value={selectedReport.location || "—"} />
                <Detail label="GPS" value={selectedReport.gps_latitude ? `${selectedReport.gps_latitude}, ${selectedReport.gps_longitude}` : "—"} />
                <Detail label="Status" value={STATUS_CONFIG[selectedReport.status]?.label || selectedReport.status} />
                <Detail label="Date" value={new Date(selectedReport.created_date).toLocaleString()} />
                <div><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm">{selectedReport.description}</p></div>
                {selectedReport.admin_comments && <div><p className="text-xs text-muted-foreground mb-1">Admin Comments</p><p className="text-sm text-primary">{selectedReport.admin_comments}</p></div>}
                {selectedReport.photo_url && <div><p className="text-xs text-muted-foreground mb-1">Photo</p><img src={selectedReport.photo_url} alt="Report" className="rounded-lg max-h-48" /></div>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return <div className="premium-card p-4"><p className="text-xs text-muted-foreground mb-1">{label}</p><p className={`text-2xl font-heading font-bold tabular-nums ${color}`}>{value}</p></div>;
}
function Input({ label, value, onChange, required }) {
  return <div><label className="text-xs text-muted-foreground mb-1 block">{label}{required && <span className="text-danger"> *</span>}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none" /></div>;
}
function Detail({ label, value }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="font-medium text-right">{value}</span></div>;
}