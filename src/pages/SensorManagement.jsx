import React, { useState, useEffect } from "react";
import { Cpu, Plus, Search, Battery, Wifi, RefreshCw, Power, Settings2, Trash2, X, Wrench, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import TableEmptyState from "@/components/shared/TableEmptyState";

const STATUS_CONFIG = {
  online: { label: "Online", color: "text-safe", bg: "bg-safe/10", border: "border-safe/20", dot: "bg-safe" },
  warning: { label: "Warning", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", dot: "bg-warning" },
  offline: { label: "Offline", color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", dot: "bg-danger" },
};

const SENSOR_TYPES = [
  { key: "ph", label: "pH Sensor" },
  { key: "tds", label: "TDS Sensor" },
  { key: "turbidity", label: "Turbidity Sensor" },
  { key: "temperature", label: "Temperature Sensor" },
  { key: "multiparameter", label: "Multi-Parameter" },
];

const EMPTY_FORM = { sensor_id: "", sensor_name: "", sensor_type: "multiparameter", status: "online", battery_level: 100, signal_strength: 100, village: "", installation_date: new Date().toISOString().slice(0, 10), calibration_date: new Date().toISOString().slice(0, 10), firmware_version: "v2.1.0", enabled: true };

export default function SensorManagement() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logSensor, setLogSensor] = useState(null);

  useEffect(() => { loadSensors(); }, []);

  const loadSensors = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.Sensor.list("-created_date", 100);
      setSensors(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openAddForm = () => { setEditingSensor(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEditForm = (sensor) => { setEditingSensor(sensor); setForm({ ...sensor }); setShowForm(true); };

  const saveSensor = async () => {
    if (!form.sensor_id.trim() || !form.sensor_name.trim()) return;
    try {
      if (editingSensor) {
        await base44.entities.Sensor.update(editingSensor.id, form);
      } else {
        await base44.entities.Sensor.create(form);
      }
      setShowForm(false);
      loadSensors();
    } catch (e) { console.error(e); }
  };

  const deleteSensor = async (id) => {
    try {
      await base44.entities.Sensor.delete(id);
      setSensors((prev) => prev.filter((s) => s.id !== id));
    } catch (e) { console.error(e); }
  };

  const toggleSensor = async (sensor) => {
    try {
      await base44.entities.Sensor.update(sensor.id, { enabled: !sensor.enabled });
      setSensors((prev) => prev.map((s) => (s.id === sensor.id ? { ...s, enabled: !s.enabled } : s)));
    } catch (e) { console.error(e); }
  };

  const restartSensor = async (sensor) => {
    try {
      await base44.entities.Sensor.update(sensor.id, { status: "online", last_updated: new Date().toISOString() });
      setSensors((prev) => prev.map((s) => (s.id === sensor.id ? { ...s, status: "online" } : s)));
    } catch (e) { console.error(e); }
  };

  const calibrateSensor = async (sensor) => {
    try {
      await base44.entities.Sensor.update(sensor.id, { calibration_date: new Date().toISOString().slice(0, 10) });
      setSensors((prev) => prev.map((s) => (s.id === sensor.id ? { ...s, calibration_date: new Date().toISOString().slice(0, 10) } : s)));
    } catch (e) { console.error(e); }
  };

  const filtered = sensors.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (s.sensor_id || "").toLowerCase().includes(q) || (s.sensor_name || "").toLowerCase().includes(q) || (s.village || "").toLowerCase().includes(q);
  });

  const stats = {
    total: sensors.length,
    online: sensors.filter((s) => s.status === "online").length,
    warning: sensors.filter((s) => s.status === "warning").length,
    offline: sensors.filter((s) => s.status === "offline").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Sensor Management"
        subtitle="Monitor, configure, and maintain all water quality sensors"
        icon={Cpu}
        actions={
          <button onClick={openAddForm} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Sensor
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Sensors" value={stats.total} color="text-primary" />
        <StatCard label="Online" value={stats.online} color="text-safe" />
        <StatCard label="Warning" value={stats.warning} color="text-warning" />
        <StatCard label="Offline" value={stats.offline} color="text-danger" />
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sensors..." className="bg-muted/30 rounded-lg pl-9 pr-3 py-1.5 text-sm border border-transparent focus:border-primary/30 outline-none w-full" />
      </div>

      <div className="premium-card overflow-hidden">
        {loading ? <LoadingState text="Loading sensors..." /> : filtered.length === 0 ? <TableEmptyState title="No sensors" description="Add a sensor to get started." icon={Cpu} /> : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Sensor ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Village</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Battery</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Signal</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Firmware</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const sc = STATUS_CONFIG[s.status] || STATUS_CONFIG.online;
                  return (
                    <tr key={s.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{s.sensor_id}</td>
                      <td className="px-4 py-3 font-medium">{s.sensor_name}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{s.sensor_type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.village || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color} ${sc.border} border`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3"><BatteryBar level={s.battery_level} /></td>
                      <td className="px-4 py-3"><SignalBar level={s.signal_strength} /></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{s.firmware_version}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <ActionButton icon={Settings2} onClick={() => openEditForm(s)} title="Edit" />
                          <ActionButton icon={Wrench} onClick={() => calibrateSensor(s)} title="Calibrate" />
                          <ActionButton icon={RefreshCw} onClick={() => restartSensor(s)} title="Restart" />
                          <ActionButton icon={Power} onClick={() => toggleSensor(s)} title={s.enabled ? "Disable" : "Enable"} active={s.enabled} />
                          <ActionButton icon={Activity} onClick={() => setLogSensor(s)} title="Maintenance Log" />
                          <ActionButton icon={Trash2} onClick={() => deleteSensor(s.id)} title="Delete" danger />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-heading font-semibold">{editingSensor ? "Edit Sensor" : "Add Sensor"}</h3>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg hover:bg-muted/40 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Sensor ID" value={form.sensor_id} onChange={(v) => setForm({ ...form, sensor_id: v })} required />
                <Input label="Sensor Name" value={form.sensor_name} onChange={(v) => setForm({ ...form, sensor_name: v })} required />
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <select value={form.sensor_type} onChange={(e) => setForm({ ...form, sensor_type: e.target.value })} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none">
                    {SENSOR_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none">
                    <option value="online">Online</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <Input label="Village" value={form.village} onChange={(v) => setForm({ ...form, village: v })} />
                <Input label="Firmware Version" value={form.firmware_version} onChange={(v) => setForm({ ...form, firmware_version: v })} />
                <Input label="Battery Level" type="number" value={form.battery_level} onChange={(v) => setForm({ ...form, battery_level: Number(v) })} />
                <Input label="Signal Strength" type="number" value={form.signal_strength} onChange={(v) => setForm({ ...form, signal_strength: Number(v) })} />
                <Input label="Installation Date" type="date" value={form.installation_date} onChange={(v) => setForm({ ...form, installation_date: v })} />
                <Input label="Calibration Date" type="date" value={form.calibration_date} onChange={(v) => setForm({ ...form, calibration_date: v })} />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveSensor} disabled={!form.sensor_id.trim() || !form.sensor_name.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40">{editingSensor ? "Update" : "Add"} Sensor</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maintenance Log Modal */}
      <AnimatePresence>
        {logSensor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setLogSensor(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-heading font-semibold">Maintenance Log</h3>
                <button onClick={() => setLogSensor(null)} className="w-7 h-7 rounded-lg hover:bg-muted/40 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <Detail label="Sensor" value={`${logSensor.sensor_name} (${logSensor.sensor_id})`} />
                <Detail label="Type" value={logSensor.sensor_type} />
                <Detail label="Village" value={logSensor.village || "—"} />
                <Detail label="Status" value={STATUS_CONFIG[logSensor.status]?.label} />
                <Detail label="Battery" value={`${logSensor.battery_level}%`} />
                <Detail label="Signal" value={`${logSensor.signal_strength}%`} />
                <Detail label="Firmware" value={logSensor.firmware_version} />
                <Detail label="Installed" value={logSensor.installation_date} />
                <Detail label="Last Calibrated" value={logSensor.calibration_date} />
                <Detail label="Enabled" value={logSensor.enabled ? "Yes" : "No"} />
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
function Input({ label, value, onChange, type = "text", required }) {
  return <div><label className="text-xs text-muted-foreground mb-1 block">{label}{required && <span className="text-danger"> *</span>}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/30 outline-none" /></div>;
}
function Detail({ label, value }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="font-medium text-right capitalize">{value}</span></div>;
}
function BatteryBar({ level }) {
  const color = level > 50 ? "text-safe" : level > 20 ? "text-warning" : "text-danger";
  const bg = level > 50 ? "bg-safe" : level > 20 ? "bg-warning" : "bg-danger";
  return <div className="flex items-center gap-1.5"><Battery className={`w-3.5 h-3.5 ${color}`} /><div className="w-12 h-1.5 rounded-full bg-muted/40 overflow-hidden"><div className={`h-full ${bg}`} style={{ width: `${level}%` }} /></div><span className={`text-xs tabular-nums ${color}`}>{level}%</span></div>;
}
function SignalBar({ level }) {
  const color = level > 50 ? "text-safe" : level > 20 ? "text-warning" : "text-danger";
  return <div className="flex items-center gap-1.5"><Wifi className={`w-3.5 h-3.5 ${color}`} /><span className={`text-xs tabular-nums ${color}`}>{level}%</span></div>;
}
function ActionButton({ icon: Icon, onClick, title, danger, active }) {
  return <button onClick={onClick} title={title} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${danger ? "hover:bg-danger/10 text-muted-foreground hover:text-danger" : active ? "text-safe hover:bg-safe/10" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}><Icon className="w-3.5 h-3.5" /></button>;
}