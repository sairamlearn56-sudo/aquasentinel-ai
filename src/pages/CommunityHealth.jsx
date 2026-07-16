import React, { useState, useEffect, useMemo } from "react";
import { HeartPulse, Plus, Search, TrendingUp, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import TableEmptyState from "@/components/shared/TableEmptyState";

const DISEASE_FIELDS = [
  { key: "fever_cases", label: "Fever", color: "hsl(43 96% 56%)" },
  { key: "diarrhea_cases", label: "Diarrhea", color: "hsl(0 91% 71%)" },
  { key: "vomiting_cases", label: "Vomiting", color: "hsl(24 82% 55%)" },
  { key: "skin_infection_cases", label: "Skin Infection", color: "hsl(252 58% 65%)" },
  { key: "cholera_suspected", label: "Cholera", color: "hsl(173 66% 50%)" },
  { key: "typhoid_suspected", label: "Typhoid", color: "hsl(199 92% 60%)" },
  { key: "hepatitis_suspected", label: "Hepatitis", color: "hsl(158 64% 52%)" },
];

const PIE_COLORS = ["hsl(43 96% 56%)", "hsl(0 91% 71%)", "hsl(24 82% 55%)", "hsl(252 58% 65%)", "hsl(173 66% 50%)", "hsl(199 92% 60%)", "hsl(158 64% 52%)"];

export default function CommunityHealth() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ village: "", health_worker_name: "", people_affected: 0, fever_cases: 0, diarrhea_cases: 0, vomiting_cases: 0, skin_infection_cases: 0, cholera_suspected: 0, typhoid_suspected: 0, hepatitis_suspected: 0, notes: "", report_date: new Date().toISOString().slice(0, 10) });

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.CommunityHealthReport.list("-created_date", 100);
      setReports(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const submitReport = async () => {
    if (!form.village.trim()) return;
    try {
      await base44.entities.CommunityHealthReport.create(form);
      setForm({ village: "", health_worker_name: "", people_affected: 0, fever_cases: 0, diarrhea_cases: 0, vomiting_cases: 0, skin_infection_cases: 0, cholera_suspected: 0, typhoid_suspected: 0, hepatitis_suspected: 0, notes: "", report_date: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      loadReports();
    } catch (e) { console.error(e); }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return reports;
    const q = search.toLowerCase();
    return reports.filter((r) => (r.village || "").toLowerCase().includes(q) || (r.health_worker_name || "").toLowerCase().includes(q));
  }, [reports, search]);

  const stats = useMemo(() => {
    return reports.reduce((acc, r) => {
      acc.total += r.people_affected || 0;
      DISEASE_FIELDS.forEach((f) => { acc[f.key] = (acc[f.key] || 0) + (r[f.key] || 0); });
      return acc;
    }, { total: 0 });
  }, [reports]);

  const pieData = DISEASE_FIELDS.map((f) => ({ name: f.label, value: stats[f.key] || 0 })).filter((d) => d.value > 0);

  const trendData = useMemo(() => {
    const byDate = {};
    reports.forEach((r) => {
      const d = r.report_date || new Date(r.created_date).toISOString().slice(0, 10);
      if (!byDate[d]) byDate[d] = { date: d, total: 0 };
      byDate[d].total += r.people_affected || 0;
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [reports]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Community Health"
        subtitle="Track disease outbreaks and community health trends across villages"
        icon={HeartPulse}
        actions={
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> New Report
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Affected" value={stats.total} icon={Users} color="text-primary" />
        <StatCard label="Total Reports" value={reports.length} icon={Activity} color="text-blue" />
        <StatCard label="Cholera Suspected" value={stats.cholera_suspected || 0} icon={HeartPulse} color="text-danger" />
        <StatCard label="Typhoid Suspected" value={stats.typhoid_suspected || 0} icon={TrendingUp} color="text-warning" />
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden mb-6">
          <div className="premium-card p-5">
            <h3 className="text-sm font-heading font-semibold mb-4">Submit Health Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input label="Village" value={form.village} onChange={(v) => setForm({ ...form, village: v })} />
              <Input label="Health Worker" value={form.health_worker_name} onChange={(v) => setForm({ ...form, health_worker_name: v })} />
              <Input label="Report Date" type="date" value={form.report_date} onChange={(v) => setForm({ ...form, report_date: v })} />
              <Input label="People Affected" type="number" value={form.people_affected} onChange={(v) => setForm({ ...form, people_affected: Number(v) })} />
              {DISEASE_FIELDS.map((f) => (
                <Input key={f.key} label={f.label} type="number" value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: Number(v) })} />
              ))}
            </div>
            <textarea placeholder="Notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full mt-3 bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none" rows={2} />
            <div className="flex gap-2 mt-3">
              <button onClick={submitReport} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Submit Report</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="premium-card p-5">
          <h3 className="text-sm font-heading font-semibold mb-4">Disease Distribution</h3>
          {pieData.length === 0 ? <TableEmptyState title="No data" description="Submit reports to see distribution" /> : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.name}: ${e.value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(221 40% 13%)", border: "1px solid hsl(219 37% 21%)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="premium-card p-5">
          <h3 className="text-sm font-heading font-semibold mb-4">People Affected Trend</h3>
          {trendData.length === 0 ? <TableEmptyState title="No data" description="Submit reports to see trends" /> : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(219 37% 21%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215 20% 65%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 65%)" }} />
                <Tooltip contentStyle={{ background: "hsl(221 40% 13%)", border: "1px solid hsl(219 37% 21%)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="total" stroke="hsl(173 66% 50%)" strokeWidth={2} dot={{ fill: "hsl(173 66% 50%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Disease bar chart */}
      <div className="premium-card p-5 mb-6">
        <h3 className="text-sm font-heading font-semibold mb-4">Cases by Disease Type</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={DISEASE_FIELDS.map((f) => ({ name: f.label, value: stats[f.key] || 0 }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(219 37% 21%)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215 20% 65%)" }} interval={0} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 65%)" }} />
            <Tooltip contentStyle={{ background: "hsl(221 40% 13%)", border: "1px solid hsl(219 37% 21%)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {DISEASE_FIELDS.map((f, i) => <Cell key={i} fill={f.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reports list */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search village..." className="bg-muted/30 rounded-lg pl-9 pr-3 py-1.5 text-sm border border-transparent focus:border-primary/30 outline-none w-full" />
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        {loading ? <LoadingState text="Loading reports..." /> : filtered.length === 0 ? <TableEmptyState title="No reports" description="Submit a health report to get started." icon={HeartPulse} /> : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Village</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Worker</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Affected</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Fever</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Diarrhea</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Cholera</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Typhoid</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{r.village}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.health_worker_name || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.report_date || new Date(r.created_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{r.people_affected || 0}</td>
                    <td className="px-4 py-3 tabular-nums text-warning">{r.fever_cases || 0}</td>
                    <td className="px-4 py-3 tabular-nums text-danger">{r.diarrhea_cases || 0}</td>
                    <td className="px-4 py-3 tabular-nums text-danger">{r.cholera_suspected || 0}</td>
                    <td className="px-4 py-3 tabular-nums text-warning">{r.typhoid_suspected || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="premium-card p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className={`text-2xl font-heading font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none" />
    </div>
  );
}