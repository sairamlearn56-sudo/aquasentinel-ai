import { classifyParameter } from "@/lib/waterAnalysis";
import { jsPDF } from "jspdf";
import moment from "moment";

export function formatSensorValue(type, value) {
  if (value === null || value === undefined || value < 0) return "N/A";
  if (type === "tds" || type === "turbidity") return Math.round(value);
  if (type === "temperature" || type === "ph") return Math.round(value * 10) / 10;
  return value;
}

export function parseDiseaseRisks(diseaseRisks) {
  if (!diseaseRisks) return null;
  try {
    return typeof diseaseRisks === "string" ? JSON.parse(diseaseRisks) : diseaseRisks;
  } catch (e) {
    return null;
  }
}

export function getTopDisease(diseaseRisks) {
  const risks = parseDiseaseRisks(diseaseRisks);
  if (!risks || Object.keys(risks).length === 0) return null;
  const [key, value] = Object.entries(risks).sort(([, a], [, b]) => b - a)[0];
  const name = key === "hepatitisA" ? "Hepatitis A" : key.charAt(0).toUpperCase() + key.slice(1);
  return { name, risk: value };
}

export function validateSensor(type, value, sensorStatus) {
  if (sensorStatus === "disconnected") {
    return { valid: false, status: "offline", label: "Sensor Offline" };
  }
  if (value === null || value === undefined || value === -1 || value < 0) {
    return { valid: false, status: "invalid", label: "Invalid Sensor Reading" };
  }
  if (type === "ph" && (value < 0 || value > 14)) {
    return { valid: false, status: "error", label: "Sensor Error" };
  }
  if (type === "temperature" && (value < 0 || value > 60)) {
    return { valid: false, status: "calibration", label: "Calibration Required" };
  }
  if (type === "tds" && value > 5000) {
    return { valid: false, status: "calibration", label: "Calibration Required" };
  }
  const paramStatus = classifyParameter(type, value);
  if (paramStatus === "safe") return { valid: true, status: "normal", label: "Normal" };
  if (paramStatus === "moderate") return { valid: true, status: "elevated", label: "Elevated" };
  return { valid: true, status: "critical", label: "Critical" };
}

export function normalizeRecommendations(recs) {
  if (!recs) return null;
  if (Array.isArray(recs)) {
    return {
      immediatePrecautions: recs[0] ? recs[0].split("; ").filter(Boolean) : [],
      waterTreatment: recs[1] ? recs[1].split("; ").filter(Boolean) : [],
      whenToVisitDoctor: recs[2] || "",
      emergencyAdvice: recs[3] || "",
    };
  }
  return recs;
}

export function getSummaryStats(scans) {
  if (scans.length === 0) return null;
  const total = scans.length;
  const completed = scans.filter((s) => s.ai_analysis && s.ai_analysis.trim()).length;
  const pending = total - completed;
  const avgScore = total > 0 ? Math.round(scans.reduce((sum, s) => sum + (s.health_score || 0), 0) / total) : 0;
  const unsafe = scans.filter((s) => s.risk_level === "danger").length;
  const latestDate = scans[0]?.created_date;

  const mid = Math.ceil(total / 2);
  const older = scans.slice(mid);
  const prevTotal = older.length;
  const prevCompleted = older.filter((s) => s.ai_analysis && s.ai_analysis.trim()).length;
  const prevAvgScore = older.length > 0 ? Math.round(older.reduce((sum, s) => sum + (s.health_score || 0), 0) / older.length) : 0;
  const prevUnsafe = older.filter((s) => s.risk_level === "danger").length;

  const hasPrev = prevTotal > 0;

  return {
    total: { current: total, previous: hasPrev ? prevTotal : null, diff: hasPrev ? total - prevTotal : null },
    completed: { current: completed, previous: hasPrev ? prevCompleted : null, diff: hasPrev ? completed - prevCompleted : null },
    pending: { current: pending, previous: hasPrev ? prevTotal - prevCompleted : null, diff: hasPrev ? pending - (prevTotal - prevCompleted) : null },
    avgScore: { current: avgScore, previous: hasPrev ? prevAvgScore : null, diff: hasPrev ? avgScore - prevAvgScore : null },
    unsafe: { current: unsafe, previous: hasPrev ? prevUnsafe : null, diff: hasPrev ? unsafe - prevUnsafe : null },
    latestDate,
  };
}

export function filterByTimeRange(scans, range) {
  if (range === "all") return scans;
  const days = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 }[range];
  if (!days) return scans;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return scans.filter((s) => new Date(s.created_date).getTime() >= cutoff);
}

export function getInferenceTime(scan) {
  if (!scan?.created_date || !scan?.updated_date) return null;
  const created = new Date(scan.created_date).getTime();
  const updated = new Date(scan.updated_date).getTime();
  const diff = updated - created;
  if (diff < 1000) return null;
  if (diff < 60000) return `${Math.round(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.round(diff / 60000)}m`;
  return `${Math.round(diff / 3600000)}h`;
}

export function downloadScanPDF(scan) {
  const doc = new jsPDF();
  const margin = 20;
  let y = 25;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 107, 180);
  doc.text("AquaSentinel", margin, y);
  y += 10;
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Water Quality Diagnostic Report", margin, y);
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);
  y += 12;

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Report Details", margin, y); y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`Sample Name: ${scan.sample_name || "Untitled"}`, margin, y); y += 6;
  doc.text(`Date: ${moment(scan.created_date).format("lll")}`, margin, y); y += 6;
  doc.text(`Scan ID: ${scan.id?.slice(-8) || "N/A"}`, margin, y); y += 6;
  if (scan.water_source_name) { doc.text(`Water Source: ${scan.water_source_name}`, margin, y); y += 6; }
  if (scan.location_name) { doc.text(`Location: ${scan.location_name}`, margin, y); y += 6; }
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.text(`Health Score: ${scan.health_score}/100`, margin, y); y += 6;
  doc.text(`Risk Level: ${scan.risk_level.toUpperCase()}`, margin, y); y += 6;
  const aiConfidence = scan.ai_confidence != null ? scan.ai_confidence : null;
  doc.text(`AI Confidence: ${aiConfidence != null ? aiConfidence + "%" : "Unavailable"}`, margin, y); y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Sensor Readings", margin, y); y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`pH: ${formatSensorValue("ph", scan.ph)}`, margin, y); y += 6;
  doc.text(`TDS: ${formatSensorValue("tds", scan.tds)} ppm`, margin, y); y += 6;
  doc.text(`Temperature: ${formatSensorValue("temperature", scan.temperature)} C`, margin, y); y += 6;
  doc.text(`Turbidity: ${formatSensorValue("turbidity", scan.turbidity)} NTU`, margin, y); y += 10;

  const risks = parseDiseaseRisks(scan.disease_risks);
  if (risks && Object.keys(risks).length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Disease Risk Assessment", margin, y); y += 7;
    doc.setFont("helvetica", "normal");
    Object.entries(risks).sort(([, a], [, b]) => b - a).forEach(([disease, risk]) => {
      const name = disease === "hepatitisA" ? "Hepatitis A" : disease.charAt(0).toUpperCase() + disease.slice(1);
      doc.text(`${name}: ${risk}%`, margin, y);
      y += 6;
    });
  }

  doc.save(`aquasentinel-${scan.id?.slice(-8) || "report"}.pdf`);
}