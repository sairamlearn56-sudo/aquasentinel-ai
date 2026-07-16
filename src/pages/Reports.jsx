import React, { useState, useEffect, useMemo } from "react";
import { ClipboardList, Download, FileText, Sparkles, TrendingUp, AlertCircle, Activity } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import TableEmptyState from "@/components/shared/TableEmptyState";
import RiskBadge from "@/components/RiskBadge";

export default function Reports() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => { loadScans(); }, []);

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.Scan.list("-created_date", 200);
      setScans(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const weeklyScans = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    return scans.filter((s) => new Date(s.created_date) >= cutoff);
  }, [scans]);

  const monthlyScans = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    return scans.filter((s) => new Date(s.created_date) >= cutoff);
  }, [scans]);

  const computeSummary = (list) => {
    if (list.length === 0) return { count: 0, avgScore: 0, safe: 0, moderate: 0, danger: 0, avgPh: 0, avgTds: 0 };
    const avg = (fn) => list.reduce((a, b) => a + fn(b), 0) / list.length;
    return {
      count: list.length,
      avgScore: Math.round(avg((s) => s.health_score || 0)),
      safe: list.filter((s) => s.risk_level === "safe").length,
      moderate: list.filter((s) => s.risk_level === "moderate").length,
      danger: list.filter((s) => s.risk_level === "danger").length,
      avgPh: (avg((s) => s.ph || 0)).toFixed(1),
      avgTds: Math.round(avg((s) => s.tds || 0)),
    };
  };

  const weekly = computeSummary(weeklyScans);
  const monthly = computeSummary(monthlyScans);

  const generateAISummary = async () => {
    setGeneratingAI(true);
    try {
      const recentScans = scans.slice(0, 20).map((s) => ({
        date: new Date(s.created_date).toLocaleDateString(),
        score: s.health_score,
        risk: s.risk_level,
        ph: s.ph,
        tds: s.tds,
        turbidity: s.turbidity,
        temperature: s.temperature,
      }));

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are AquaSentinel AI's report generator. Based on the following water quality scan data, generate a professional summary report.

Scan data (most recent 20 scans):
${JSON.stringify(recentScans, null, 2)}

Weekly summary: ${weekly.count} scans, avg score ${weekly.avgScore}, ${weekly.safe} safe, ${weekly.moderate} moderate, ${weekly.danger} danger.
Monthly summary: ${monthly.count} scans, avg score ${monthly.avgScore}, ${monthly.safe} safe, ${monthly.moderate} moderate, ${monthly.danger} danger.

Generate a concise professional report summary (3-4 paragraphs) covering:
1. Overall water quality assessment
2. Key findings and trends
3. Risk analysis
4. Recommendations

Use plain text, no markdown.`,
      });

      setAiSummary(response || "Unable to generate summary.");
    } catch (e) {
      setAiSummary("Unable to generate AI summary at this time.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Sample Name", "pH", "TDS", "Turbidity", "Temperature", "Health Score", "Risk Level"];
    const rows = scans.map((s) => [
      new Date(s.created_date).toLocaleString(),
      `"${s.sample_name || "Untitled"}"`,
      s.ph, s.tds, s.turbidity, s.temperature, s.health_score, s.risk_level,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "aquasentinel_report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => { window.print(); };

  if (loading) return <div className="p-8"><LoadingState text="Loading reports..." /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Reports"
        subtitle="Comprehensive water quality reports and summaries"
        icon={ClipboardList}
        actions={
          <>
            <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button onClick={exportPDF} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SummaryCard title="Weekly Summary" period="Last 7 Days" data={weekly} />
        <SummaryCard title="Monthly Summary" period="Last 30 Days" data={monthly} />
      </div>

      {/* AI Summary */}
      <div className="premium-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple" />
            </div>
            <h3 className="font-heading font-semibold text-base">AI-Generated Report Summary</h3>
          </div>
          <button
            onClick={generateAISummary}
            disabled={generatingAI || scans.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple text-white text-sm font-medium hover:opacity-90 disabled:opacity-40"
          >
            {generatingAI ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {aiSummary ? "Regenerate" : "Generate"}
          </button>
        </div>
        {aiSummary ? (
          <div className="text-sm text-foreground/75 leading-relaxed whitespace-pre-wrap">{aiSummary}</div>
        ) : (
          <p className="text-sm text-muted-foreground">Click "Generate" to create an AI-powered summary of your water quality data.</p>
        )}
      </div>

      {/* Recent Reports Table */}
      <div className="premium-card p-5">
        <h3 className="font-heading font-semibold text-base mb-4">Recent Reports</h3>
        {scans.length === 0 ? (
          <TableEmptyState title="No reports" description="No scan reports available yet." icon={ClipboardList} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Sample</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {scans.slice(0, 10).map((s) => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-2 text-xs text-muted-foreground">{new Date(s.created_date).toLocaleDateString()}</td>
                    <td className="py-2 text-xs font-medium">{s.sample_name || "Untitled"}</td>
                    <td className="py-2 text-xs font-bold">{s.health_score}/100</td>
                    <td className="py-2"><RiskBadge level={s.risk_level} size="sm" /></td>
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

function SummaryCard({ title, period, data }) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
        <span className="text-xs text-muted-foreground">{period}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Total Scans" value={data.count} color="text-primary" />
        <Stat label="Avg Score" value={data.avgScore} color="text-foreground" />
        <Stat label="Safe" value={data.safe} color="text-safe" />
        <Stat label="Moderate" value={data.moderate} color="text-warning" />
        <Stat label="Unsafe" value={data.danger} color="text-danger" />
        <Stat label="Avg pH" value={data.avgPh} color="text-blue" />
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl bg-muted/20 p-3">
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-lg font-heading font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}