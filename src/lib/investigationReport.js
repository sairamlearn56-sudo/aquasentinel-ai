import { classifyParameter } from "@/lib/waterAnalysis";

// =====================================================
// AI Water Investigation Report Generator (Bullet Format)
// Returns concise bullet points for each section
// =====================================================

export function generateInvestigationReport(scan) {
  const data = {
    ph: scan.ph,
    tds: scan.tds,
    temperature: scan.temperature,
    turbidity: scan.turbidity,
  };

  const riskLevel = scan.risk_level;
  const healthScore = scan.health_score;
  const familyMember = scan.family_member || "adult";
  const locationName = scan.water_source_name || scan.location_name || "your area";

  const phStatus = classifyParameter("ph", data.ph);
  const tdsStatus = classifyParameter("tds", data.tds);
  const turbStatus = classifyParameter("turbidity", data.turbidity);
  const tempStatus = classifyParameter("temperature", data.temperature);
  const s = { phStatus, tdsStatus, turbStatus, tempStatus };

  return {
    overallStatus: {
      score: healthScore,
      riskLevel,
      aiConfidence: calculateConfidence(data),
    },
    scanInfo: {
      dateTime: scan.created_date,
      waterSource: scan.water_source_name || "Not specified",
      locationName: scan.location_name || "Not specified",
      familyMember,
    },
    whatHappened: generateWhatHappened(data, riskLevel, s),
    whyHappened: generateWhyHappened(data, s),
    insideWater: generateInsideWater(data, s),
    healthImpact: generateHealthImpact(riskLevel, familyMember, scan.disease_risks || {}),
    recommendedActions: generateActions(data, riskLevel, s),
    ifIgnored: generateIfIgnored(riskLevel, scan.disease_risks || {}),
    aiSuggestions: generateAiSuggestions(data, riskLevel, s),
  };
}

function calculateConfidence(data) {
  const statuses = [
    classifyParameter("ph", data.ph),
    classifyParameter("tds", data.tds),
    classifyParameter("turbidity", data.turbidity),
    classifyParameter("temperature", data.temperature),
  ];
  if (statuses.every((s) => s === "safe")) return 96;
  if (statuses.some((s) => s === "danger")) return 94;
  return 88;
}

function statusLabel(status) {
  return status === "safe" ? "safe" : status === "moderate" ? "slightly off" : "critical";
}

// ===== What Happened? =====
function generateWhatHappened(data, riskLevel, s) {
  const bullets = [];
  bullets.push(`pH is ${data.ph} — ${statusLabel(s.phStatus)} (safe range: 6.5–8.5)`);
  bullets.push(`TDS is ${data.tds} ppm — ${statusLabel(s.tdsStatus)} (safe limit: 500 ppm)`);
  bullets.push(`Turbidity is ${data.turbidity} NTU — ${s.turbStatus === "safe" ? "water is clear" : "water appears cloudy"}`);
  bullets.push(`Temperature is ${data.temperature}°C — ${s.tempStatus === "safe" ? "normal" : "elevated"}`);

  if (riskLevel === "safe") {
    bullets.push("All parameters are within WHO safe drinking water limits");
  } else if (riskLevel === "moderate") {
    bullets.push("Some parameters exceed safe limits — treatment recommended before drinking");
  } else {
    bullets.push("Multiple parameters are dangerously high — do not drink without proper treatment");
  }
  return bullets;
}

// ===== Why Did This Happen? =====
function generateWhyHappened(data, s) {
  const causes = [];

  if (s.tdsStatus !== "safe") {
    causes.push("Groundwater contamination or excessive dissolved minerals from natural deposits");
    causes.push("Possible industrial discharge or agricultural runoff entering the supply");
  }
  if (s.turbStatus !== "safe") {
    causes.push("Sewage leakage or suspended particles from corroded pipelines");
    causes.push("Heavy rainfall washing soil and organic matter into the water source");
  }
  if (s.phStatus !== "safe") {
    causes.push(
      data.ph < 6.5
        ? "Acidic water — likely from acid rain, industrial emissions, or pipe corrosion"
        : "Alkaline water — likely from natural mineral deposits or excessive treatment chemicals"
    );
  }
  if (s.tempStatus !== "safe") {
    causes.push("Stagnant water in uncovered or poorly insulated storage tanks");
  }

  if (causes.length === 0) {
    causes.push("All parameters are within safe limits — no contamination detected");
    causes.push("Water source appears well-maintained and properly managed");
  }
  return causes.slice(0, 5);
}

// ===== What's Happening Inside the Water? =====
function generateInsideWater(data, s) {
  const points = [];

  if (s.tdsStatus !== "safe") {
    points.push(`High TDS means dissolved salts, metals, and organic compounds are present at ${data.tds} ppm`);
    points.push("These dissolved solids can affect taste, cause scale buildup, and may include heavy metals");
  } else {
    points.push(`TDS at ${data.tds} ppm indicates balanced mineral content — no excess contaminants`);
  }

  if (s.turbStatus !== "safe") {
    points.push(`Turbidity at ${data.turbidity} NTU means suspended particles (clay, silt, microorganisms) are visible`);
    points.push("Suspended particles shield bacteria and viruses from disinfection, making water biologically unsafe");
  } else {
    points.push("Low turbidity means water is visually clear and pathogens are less likely to be hidden");
  }

  if (s.phStatus !== "safe") {
    if (data.ph < 6.5) {
      points.push("Acidic water accelerates pipe corrosion, leaching lead, copper, and zinc into the supply");
    } else {
      points.push("Alkaline water can cause mineral scale buildup and reduce disinfection effectiveness");
    }
  } else {
    points.push("Balanced pH prevents pipe corrosion and is gentle on the digestive system");
  }

  if (s.tempStatus !== "safe") {
    points.push(`Warm water at ${data.temperature}°C accelerates bacterial growth and reduces dissolved oxygen`);
  }

  return points.slice(0, 5);
}

// ===== Health Impact =====
function generateHealthImpact(riskLevel, familyMember, diseaseRisks) {
  const vuln = {
    infant: { label: "Infants", level: "Extremely High" },
    child: { label: "Young Children", level: "High" },
    elderly: { label: "Elderly", level: "High" },
    pregnant_woman: { label: "Pregnant Women", level: "Very High" },
    adult: { label: "Healthy Adults", level: "Moderate" },
  };
  const v = vuln[familyMember] || vuln.adult;

  const effects = [];
  const topRisks = Object.entries(diseaseRisks)
    .filter(([, r]) => r > 15)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (riskLevel === "safe") {
    effects.push("No significant health risk — water is safe for all family members");
  } else {
    if (topRisks.length > 0) {
      effects.push(`Elevated risk of: ${topRisks.map(([d, r]) => `${d.replace(/_/g, " ")} (${r}%)`).join(", ")}`);
    }
    effects.push("Possible symptoms: diarrhea, vomiting, fever, stomach pain, dehydration");
    effects.push("Long-term exposure may cause chronic digestive and organ issues");
  }

  return {
    effects,
    atRisk: [`${v.label} are at ${v.level.toLowerCase()} risk`, "Immune-compromised individuals should avoid untreated water"],
  };
}

// ===== Recommended Actions =====
function generateActions(data, riskLevel, s) {
  const actions = [];

  if (riskLevel === "safe") {
    actions.push({ action: "Continue Regular Monitoring", detail: "Test every 1–2 weeks" });
    actions.push({ action: "Store Properly", detail: "Use clean, covered containers" });
    actions.push({ action: "Maintain Plumbing", detail: "Inspect tanks and pipes periodically" });
    return actions;
  }

  const boilTime = riskLevel === "danger" ? "3 minutes" : "1 minute";
  actions.push({ action: "Boil Water", detail: `Rolling boil for ${boilTime}, then cool` });

  if (s.tdsStatus !== "safe") {
    actions.push({ action: "RO Filtration", detail: `Reduces TDS from ${data.tds} to under 50 ppm` });
  }
  if (s.turbStatus !== "safe" || riskLevel === "danger") {
    actions.push({ action: "UV Purifier", detail: "Neutralizes 99.9% of bacteria and viruses" });
  }
  if (riskLevel === "danger") {
    actions.push({ action: "Chlorination", detail: "1 tablet per liter, wait 30 minutes" });
  }
  if (s.turbStatus !== "safe" || s.tempStatus !== "safe") {
    actions.push({ action: "Clean Storage Tank", detail: "Remove sediment and biofilm buildup" });
  }
  if (s.phStatus !== "safe" && data.ph < 6.5) {
    actions.push({ action: "Repair Pipelines", detail: "Replace corroded metal pipes with PVC/HDPE" });
  }
  actions.push({ action: "Retest After Treatment", detail: "Verify water is back to safe levels" });

  return actions.slice(0, 5);
}

// ===== If Ignored =====
function generateIfIgnored(riskLevel, diseaseRisks) {
  if (riskLevel === "safe") {
    return [
      "No immediate risk if water quality remains stable",
      "Quality may change due to seasonal or environmental factors — keep monitoring",
    ];
  }

  const topDiseases = Object.entries(diseaseRisks)
    .filter(([, r]) => r > 20)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  const bullets = [];

  if (topDiseases.length > 0) {
    bullets.push(`High risk of ${topDiseases.map(([d]) => d.replace(/_/g, " ")).join(" and ")} within 24–72 hours`);
  }
  bullets.push("Severe dehydration from diarrhea and vomiting — especially dangerous for children and elderly");
  bullets.push("Chronic exposure can cause long-term liver and kidney damage");
  if (riskLevel === "danger") {
    bullets.push("Life-threatening complications possible — seek emergency care if symptoms appear");
  }
  return bullets;
}

// ===== AI Suggestions =====
function generateAiSuggestions(data, riskLevel, s) {
  let bestTreatment = "";
  if (riskLevel === "safe") {
    bestTreatment = "No treatment needed — continue regular monitoring every 2 weeks";
  } else if (s.tdsStatus !== "safe" && s.turbStatus !== "safe") {
    bestTreatment = "Install a combined RO + UV filtration system for comprehensive purification";
  } else if (s.tdsStatus !== "safe") {
    bestTreatment = "RO (Reverse Osmosis) filtration to reduce dissolved solids and heavy metals";
  } else if (s.turbStatus !== "safe") {
    bestTreatment = "Boiling + UV purification to eliminate pathogens and remove particles";
  } else if (s.phStatus !== "safe") {
    bestTreatment = "pH neutralization filter + pipe inspection for corrosion";
  } else {
    bestTreatment = "Boil water for at least 1 minute before consumption";
  }

  const preventiveMeasures = [];
  if (riskLevel !== "safe") {
    preventiveMeasures.push("Clean water storage tank every 3–6 months");
    preventiveMeasures.push("Inspect and repair corroded or leaking pipelines");
    preventiveMeasures.push("Use covered, food-grade containers for water storage");
  } else {
    preventiveMeasures.push("Maintain clean, covered storage containers");
    preventiveMeasures.push("Keep plumbing and tanks in good condition");
  }

  const nextTest =
    riskLevel === "danger"
      ? "Retest within 24–48 hours after implementing treatment"
      : riskLevel === "moderate"
      ? "Retest within 1 week after treatment"
      : "Retest every 2 weeks for ongoing monitoring";

  return { bestTreatment, preventiveMeasures, nextTest };
}