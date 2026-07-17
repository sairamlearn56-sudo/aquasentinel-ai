import React, { useState, useEffect, useMemo } from "react";
import { FileText, Download, FileSpreadsheet, Printer, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";

const REPORT_TYPES = [
  { key: "daily", label: "Daily Report", desc: "Today's water quality summary" },
  { key: "weekly", label: "Weekly Report", desc: "Past 7 days overview" },
  { key: "monthly", label: "Monthly Report", desc: "Past 30 days analysis" },
  { key: "annual", label: "Annual Report", desc: "Full year review" },
];

export default function Reports() {
  const [scans, setScans] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [healthReports, setHealthReports] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [s, a, h, sen] = await Promise.all([
        base44.entities.Scan.list("-created_date", 500),
        base44.entities.Alert.list("-created_date", 200),
        base44.entities.CommunityHealthReport.list("-created_date", 200),
        base44.entities.Sensor.list("-created_date", 100),
      ]);
      setScans(s || []);
      setAlerts(a || []);
      setHealthReports(h || []);
      setSensors(sen || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const getReportData = (type) => {
    const days = type === "daily" ? 1 : type === "weekly" ? 7 : type === "monthly" ? 30 : 365;
    const cutoff = Date.now() - days * 86400000;
    const periodScans = scans.filter((s) => new Date(s.created_date) >= cutoff);
    const periodAlerts = alerts.filter((a) => new Date(a.created_date) >= cutoff);
    const periodHealth = healthReports.filter((h) => new Date(h.created_date || h.report_date) >= cutoff);

    const avgScore = periodScans.length ? Math.round(periodScans.reduce((a, s) => a + (s.health_score || 0), 0) / periodScans.length) : 0;
    const safeCount = periodScans.filter((s) => s.risk_level === "safe").length;
    const dangerCount = periodScans.filter((s) => s.risk_level === "danger").length;
    const totalAffected = periodHealth.reduce((a, h) => a + (h.people_affected || 0), 0);
    const onlineSensors = sensors.filter((s) => s.status === "online").length;
    const activeAlerts = periodAlerts.filter((a) => a.status === "active").length;

    return {
      type: REPORT_TYPES.find((r) => r.key === type)?.label,
      period: `${new Date(Date.now() - days * 86400000).toLocaleDateString()} – ${new Date().toLocaleDateString()}`,
      generatedAt: new Date().toLocaleString(),
      summary: {
        totalScans: periodScans.length,
        avgScore,
        safeCount,
        dangerCount,
        safePercentage: periodScans.length ? Math.round((safeCount / periodScans.length) * 100) : 0,
        totalAlerts: periodAlerts.length,
        activeAlerts,
        totalHealthReports: periodHealth.length,
        totalAffected,
        onlineSensors,
        totalSensors: sensors.length,
      },
      diseaseSummary: {
        fever: periodHealth.reduce((a, h) => a + (h.fever_cases || 0), 0),
        diarrhea: periodHealth.reduce((a, h) => a + (h.diarrhea_cases || 0), 0),
        cholera: periodHealth.reduce((a, h) => a + (h.cholera_suspected || 0), 0),
        typhoid: periodHealth.reduce((a, h) => a + (h.typhoid_suspected || 0), 0),
        hepatitis: periodHealth.reduce((a, h) => a + (h.hepatitis_suspected || 0), 0),
      },
    };
  };

  const generateReport = (type) => {
    setGenerating(true);
    setTimeout(() => {
      setActiveReport(getReportData(type));
      setGenerating(false);
    }, 500);
  };

  const exportCSV = () => {
    if (!activeReport) return;
    const rows = [
      ["AquaSentinel AI Report", activeReport.type],
      ["Period", activeReport.period],
      ["Generated", activeReport.generatedAt],
      [],
      ["Summary", ""],
      ["Total Scans", activeReport.summary.totalScans],
      ["Average Score", activeReport.summary.avgScore],
      ["Safe Scans", activeReport.summary.safeCount],
      ["Danger Scans", activeReport.summary.dangerCount],
      ["Safe Percentage", `${activeReport.summary.safePercentage}%`],
      ["Total Alerts", activeReport.summary.totalAlerts],
      ["Active Alerts", activeReport.summary.activeAlerts],
      ["Health Reports", activeReport.summary.totalHealthReports],
      ["People Affected", activeReport.summary.totalAffected],
      ["Online Sensors", `${activeReport.summary.onlineSensors}/${activeReport.summary.totalSensors}`],
      [],
      ["Disease Summary", ""],
      ["Fever Cases", activeReport.diseaseSummary.fever],
      ["Diarrhea Cases", activeReport.diseaseSummary.diarrhea],
      ["Cholera Suspected", activeReport.diseaseSummary.cholera],
      ["Typhoid Suspected", activeReport.diseaseSummary.typhoid],
      ["Hepatitis Suspected", activeReport.diseaseSummary.hepatitis],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `aquasentinel_${activeReport.type.toLowerCase().replace(/\s/g, "_")}_report.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  if (loading) return <div className="p-8"><LoadingState text="Loading report data..." /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader title="Reports" subtitle="Generate comprehensive water quality and health reports" icon={FileText} />

      {/* Report type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {REPORT_TYPES.map((r) => (
          <button key={r.key} onClick={() => generateReport(r.key)} disabled={generating} className="premium-card p-5 text-left hover:border-primary/30 transition-colors disabled:opacity-50">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-heading font-semibold mb-1">{r.label}</h3>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Report preview */}
      {activeReport && (
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <h2 className="text-lg font-heading font-bold">{activeReport.type}</h2>
              <p className="text-xs text-muted-foreground">{activeReport.period}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
              </button>
              <button onClick={printReport} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <ReportStat label="Total Scans" value={activeReport.summary.totalScans} />
            <ReportStat label="Avg Score" value={`${activeReport.summary.avgScore}/100`} />
            <ReportStat label="Safe Water" value={`${activeReport.summary.safePercentage}%`} />
            <ReportStat label="Active Alerts" value={activeReport.summary.activeAlerts} />
            <ReportStat label="People Affected" value={activeReport.summary.totalAffected} />
            <ReportStat label="Health Reports" value={activeReport.summary.totalHealthReports} />
            <ReportStat label="Online Sensors" value={`${activeReport.summary.onlineSensors}/${activeReport.summary.totalSensors}`} />
            <ReportStat label="Danger Scans" value={activeReport.summary.dangerCount} />
          </div>

          {/* Disease summary */}
          <div className="mb-6">
            <h3 className="text-sm font-heading font-semibold mb-3">Disease Risk Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <DiseaseStat label="Fever" value={activeReport.diseaseSummary.fever} color="text-warning" />
              <DiseaseStat label="Diarrhea" value={activeReport.diseaseSummary.diarrhea} color="text-danger" />
              <DiseaseStat label="Cholera" value={activeReport.diseaseSummary.cholera} color="text-danger" />
              <DiseaseStat label="Typhoid" value={activeReport.diseaseSummary.typhoid} color="text-warning" />
              <DiseaseStat label="Hepatitis" value={activeReport.diseaseSummary.hepatitis} color="text-orange" />
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-right">Generated on {activeReport.generatedAt}</div>
        </div>
      )}
    </div>
  );
}

function ReportStat({ label, value }) {
  return <div className="bg-muted/20 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-0.5">{label}</p><p className="text-lg font-heading font-bold tabular-nums">{value}</p></div>;
}
function DiseaseStat({ label, value, color }) {
  return <div className="bg-muted/20 rounded-lg p-3 text-center"><p className={`text-2xl font-heading font-bold tabular-nums ${color}`}>{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>;
}