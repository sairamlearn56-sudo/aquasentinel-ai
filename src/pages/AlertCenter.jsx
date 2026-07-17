import React, { useState, useEffect, useMemo } from "react";
import { Bell, Search, CheckCircle2, AlertTriangle, ShieldAlert, ShieldX, Mail, MessageSquare, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import TableEmptyState from "@/components/shared/TableEmptyState";

const RISK_CONFIG = {
  safe: { label: "Safe", color: "text-safe", bg: "bg-safe/10", border: "border-safe/20", dot: "bg-safe", Icon: CheckCircle2 },
  warning: { label: "Warning", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", dot: "bg-warning", Icon: AlertTriangle },
  high_risk: { label: "High Risk", color: "text-orange", bg: "bg-orange/10", border: "border-orange/20", dot: "bg-orange", Icon: ShieldAlert },
  critical: { label: "Critical", color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", dot: "bg-danger", Icon: ShieldX },
};

const FILTERS = [
  { key: "all", label: "All Alerts" },
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "active", label: "Active" },
  { key: "resolved", label: "Resolved" },
];

export default function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.Alert.list("-created_date", 100);
      setAlerts(data || []);
    } catch (e) {
      console.error("Failed to load alerts:", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = [...alerts];
    const now = new Date();
    if (filter === "today") {
      result = result.filter((a) => new Date(a.created_date) >= new Date(now.setHours(0, 0, 0, 0)));
    } else if (filter === "7d") {
      result = result.filter((a) => new Date(a.created_date) >= new Date(Date.now() - 7 * 86400000));
    } else if (filter === "30d") {
      result = result.filter((a) => new Date(a.created_date) >= new Date(Date.now() - 30 * 86400000));
    } else if (filter === "active") {
      result = result.filter((a) => a.status === "active");
    } else if (filter === "resolved") {
      result = result.filter((a) => a.status === "resolved");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => (a.village || "").toLowerCase().includes(q) || (a.sensor_name || "").toLowerCase().includes(q));
    }
    return result;
  }, [alerts, filter, search]);

  const stats = useMemo(() => {
    const active = alerts.filter((a) => a.status === "active").length;
    const critical = alerts.filter((a) => a.risk_level === "critical").length;
    const resolved = alerts.filter((a) => a.status === "resolved").length;
    return { total: alerts.length, active, critical, resolved };
  }, [alerts]);

  const resolveAlert = async (id) => {
    try {
      await base44.entities.Alert.update(id, { status: "resolved" });
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)));
    } catch (e) {
      console.error("Failed to resolve alert:", e);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader title="Alert Center" subtitle="Real-time water quality alerts and notification delivery status" icon={Bell} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Alerts" value={stats.total} color="text-primary" />
        <StatCard label="Active" value={stats.active} color="text-warning" />
        <StatCard label="Critical" value={stats.critical} color="text-danger" />
        <StatCard label="Resolved" value={stats.resolved} color="text-safe" />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key ? "bg-primary/15 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location..."
            className="bg-muted/30 rounded-lg pl-9 pr-3 py-1.5 text-sm border border-transparent focus:border-primary/30 outline-none w-full sm:w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="premium-card overflow-hidden">
        {loading ? (
          <LoadingState text="Loading alerts..." />
        ) : filtered.length === 0 ? (
          <TableEmptyState title="No alerts found" description="No alerts match your current filters." icon={Bell} />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alert ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date & Time</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Village</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sensor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Score</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Level</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">SMS</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert) => {
                  const rc = RISK_CONFIG[alert.risk_level] || RISK_CONFIG.warning;
                  const RiskIcon = rc.Icon;
                  return (
                    <tr key={alert.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{alert.alert_id || alert.id?.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(alert.created_date).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{alert.village || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{alert.sensor_name || "—"}</td>
                      <td className="px-4 py-3"><span className="tabular-nums font-semibold">{alert.water_quality_score ?? "—"}</span></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${rc.bg} ${rc.color} ${rc.border} border`}>
                          <RiskIcon className="w-3 h-3" />
                          {rc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${alert.status === "active" ? "bg-warning/10 text-warning" : "bg-safe/10 text-safe"}`}>
                          {alert.status === "active" ? "Active" : "Resolved"}
                        </span>
                      </td>
                      <td className="px-4 py-3"><DeliveryBadge status={alert.sms_status} /></td>
                      <td className="px-4 py-3"><DeliveryBadge status={alert.email_status} /></td>
                      <td className="px-4 py-3">
                        {alert.status === "active" && (
                          <button onClick={() => resolveAlert(alert.id)} className="text-xs text-primary hover:underline font-medium">Resolve</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="premium-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-heading font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

function DeliveryBadge({ status }) {
  const config = {
    sent: { label: "Sent", color: "text-safe", bg: "bg-safe/10", Icon: CheckCircle2 },
    pending: { label: "Pending", color: "text-warning", bg: "bg-warning/10", Icon: Clock },
    failed: { label: "Failed", color: "text-danger", bg: "bg-danger/10", Icon: AlertTriangle },
    not_applicable: { label: "N/A", color: "text-muted-foreground", bg: "bg-muted/20", Icon: Mail },
  };
  const c = config[status] || config.pending;
  const Icon = c.Icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${c.bg} ${c.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
}