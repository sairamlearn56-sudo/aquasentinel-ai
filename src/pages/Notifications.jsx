import React, { useState, useEffect, useMemo } from "react";
import { Bell, Search, Trash2, CheckCheck, Mail, Droplets, CloudRain, Waves, Activity, AlertOctagon, Info, BellOff } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import TableEmptyState from "@/components/shared/TableEmptyState";

const TYPE_CONFIG = {
  water_unsafe: { label: "Water Unsafe", icon: Droplets, color: "text-danger", bg: "bg-danger/10" },
  disease_risk: { label: "Disease Risk", icon: Activity, color: "text-orange", bg: "bg-orange/10" },
  sensor_offline: { label: "Sensor Offline", icon: BellOff, color: "text-warning", bg: "bg-warning/10" },
  sensor_failure: { label: "Sensor Failure", icon: AlertOctagon, color: "text-danger", bg: "bg-danger/10" },
  rain_alert: { label: "Rain Alert", icon: CloudRain, color: "text-blue", bg: "bg-blue/10" },
  flood_warning: { label: "Flood Warning", icon: Waves, color: "text-danger", bg: "bg-danger/10" },
  community_health_alert: { label: "Community Health", icon: Activity, color: "text-purple", bg: "bg-purple/10" },
  system_update: { label: "System Update", icon: Info, color: "text-blue", bg: "bg-blue/10" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-muted-foreground", bg: "bg-muted/20" },
  medium: { label: "Medium", color: "text-blue", bg: "bg-blue/10" },
  high: { label: "High", color: "text-warning", bg: "bg-warning/10" },
  critical: { label: "Critical", color: "text-danger", bg: "bg-danger/10" },
};

const FILTER_TYPES = [
  { key: "all", label: "All" },
  { key: "water_unsafe", label: "Water Unsafe" },
  { key: "disease_risk", label: "Disease Risk" },
  { key: "sensor_offline", label: "Sensor Offline" },
  { key: "rain_alert", label: "Rain Alert" },
  { key: "flood_warning", label: "Flood Warning" },
  { key: "community_health_alert", label: "Community Health" },
  { key: "system_update", label: "System Update" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.AppNotification.list("-created_date", 100);
      setNotifications(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filtered = useMemo(() => {
    let result = [...notifications];
    if (filter !== "all") result = result.filter((n) => n.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((n) => (n.title || "").toLowerCase().includes(q) || (n.message || "").toLowerCase().includes(q));
    }
    return result;
  }, [notifications, filter, search]);

  const markAsRead = async (id) => {
    try {
      await base44.entities.AppNotification.update(id, { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) { console.error(e); }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      await base44.entities.AppNotification.bulkUpdate(unread.map((n) => ({ id: n.id, read: true })));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) { console.error(e); }
  };

  const deleteNotification = async (id) => {
    try {
      await base44.entities.AppNotification.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread of ${notifications.length} total`}
        icon={Bell}
        actions={
          unreadCount > 0 && (
            <button onClick={markAllRead} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {FILTER_TYPES.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.key ? "bg-primary/15 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-muted/30 rounded-lg pl-9 pr-3 py-1.5 text-sm border border-transparent focus:border-primary/30 outline-none w-full sm:w-56" />
        </div>
      </div>

      {/* List */}
      {loading ? <LoadingState text="Loading notifications..." /> : filtered.length === 0 ? (
        <div className="premium-card"><TableEmptyState title="No notifications" description="You're all caught up!" icon={Bell} /></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.system_update;
            const pc = PRIORITY_CONFIG[n.priority] || PRIORITY_CONFIG.medium;
            const TypeIcon = tc.icon;
            return (
              <div key={n.id} className={`premium-card p-4 flex items-start gap-3 ${!n.read ? "border-l-2 border-l-primary" : ""}`}>
                <div className={`w-9 h-9 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0`}>
                  <TypeIcon className={`w-4 h-4 ${tc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${pc.bg} ${pc.color}`}>{pc.label}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/70">{new Date(n.created_date).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.read && <button onClick={() => markAsRead(n.id)} className="w-7 h-7 rounded-lg hover:bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-primary" title="Mark as read"><Mail className="w-3.5 h-3.5" /></button>}
                  <button onClick={() => deleteNotification(n.id)} className="w-7 h-7 rounded-lg hover:bg-danger/10 flex items-center justify-center text-muted-foreground hover:text-danger" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}