import { classifyParameter, SAFE_RANGES } from "@/lib/waterAnalysis";

// =====================================================
// AI Water Investigation Report Generator
// Translates raw sensor data into a human-friendly report
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
  const statuses = { phStatus, tdsStatus, turbStatus, tempStatus };

  return {
    overallStatus: {
      score: healthScore,
      riskLevel,
      aiConfidence: calculateConfidence(data),
      conclusion: generateConclusion(riskLevel, healthScore),
    },
    scanInfo: {
      dateTime: scan.created_date,
      waterSource: scan.water_source_name || "Not specified",
      locationName: scan.location_name || "Not specified",
      latitude: scan.latitude,
      longitude: scan.longitude,
      familyMember,
    },
    whatHappened: generateWhatHappened(data, riskLevel, statuses),
    whyHappened: generateWhyHappened(data, statuses),
    insideWater: generateInsideWater(data, statuses),
    healthImpact: generateHealthImpact(riskLevel, familyMember, scan.disease_risks || {}),
    recommendedActions: generateActions(scan, riskLevel, statuses),
    ifIgnored: generateIfIgnored(riskLevel, scan.disease_risks || {}),
    locationAnalysis: generateLocationAnalysis(locationName, data, statuses),
    improvementPrediction: generatePrediction(riskLevel, healthScore, statuses),
  };
}

// ===== AI Confidence =====
function calculateConfidence(data) {
  const statuses = [
    classifyParameter("ph", data.ph),
    classifyParameter("tds", data.tds),
    classifyParameter("turbidity", data.turbidity),
    classifyParameter("temperature", data.temperature),
  ];
  const allSafe = statuses.every((s) => s === "safe");
  const anyDanger = statuses.some((s) => s === "danger");
  if (allSafe) return 96;
  if (anyDanger) return 94;
  return 88;
}

// ===== One-line conclusion =====
function generateConclusion(riskLevel, score) {
  if (riskLevel === "safe")
    return `Water is SAFE with a health score of ${score}/100 — all parameters within WHO limits.`;
  if (riskLevel === "moderate")
    return `Water needs ATTENTION with a health score of ${score}/100 — treatment recommended before drinking.`;
  return `Water is UNSAFE with a health score of ${score}/100 — do not drink without proper treatment.`;
}

// ===== Section 3: What Happened? =====
function generateWhatHappened(data, riskLevel, s) {
  if (riskLevel === "safe") {
    return `Your water scan completed successfully. All four key parameters — pH (${data.ph}), TDS (${data.tds} ppm), turbidity (${data.turbidity} NTU), and temperature (${data.temperature}°C) — are within the safe drinking water limits set by the World Health Organization (WHO). The water is clean, balanced, and safe for drinking and household use.`;
  }

  const issues = [];
  if (s.phStatus !== "safe") issues.push(`pH is ${data.ph} (safe: 6.5–8.5)`);
  if (s.tdsStatus !== "safe") issues.push(`TDS is ${data.tds} ppm (safe: 0–500 ppm)`);
  if (s.turbStatus !== "safe") issues.push(`turbidity is ${data.turbidity} NTU (safe: 0–5 NTU)`);
  if (s.tempStatus !== "safe") issues.push(`temperature is ${data.temperature}°C (safe: 15–30°C)`);

  const severity = riskLevel === "moderate" ? "requires caution" : "is unsafe for drinking";
  const action = riskLevel === "moderate" ? "Treatment is recommended" : "Treatment is required urgently";

  return `Your water scan detected ${issues.length} parameter${issues.length > 1 ? "s" : ""} outside the safe range: ${issues.join(", ")}. Based on these readings, the water ${severity}. ${action} before consumption. The remaining parameters are within acceptable limits.`;
}

// ===== Section 4: Why Did This Happen? =====
function generateWhyHappened(data, s) {
  const causes = [];

  if (s.tdsStatus !== "safe") {
    causes.push(
      data.tds > 500
        ? "Groundwater contamination or excessive dissolved minerals (calcium, magnesium, salts, and potentially heavy metals) from natural geological deposits or industrial discharge"
        : "Borderline mineral content that may indicate early-stage contamination"
    );
  }
  if (s.turbStatus !== "safe") {
    causes.push(
      "Suspended particles in the water, likely from sewage leakage, agricultural runoff, heavy rainfall washing soil into the supply, corroded pipelines, or stagnant water in storage tanks"
    );
  }
  if (s.phStatus !== "safe") {
    if (data.ph < 6.5) {
      causes.push(
        "Acidic water, possibly caused by acid rain, industrial discharge, naturally acidic groundwater, or corrosion in metal pipes leaching heavy metals"
      );
    } else {
      causes.push(
        "Alkaline water, possibly caused by natural mineral deposits (limestone, calcium carbonate), excessive treatment chemicals, or industrial alkaline discharge"
      );
    }
  }
  if (s.tempStatus !== "safe") {
    causes.push(
      "Elevated water temperature, suggesting stagnant water in uncovered or poorly insulated storage tanks, solar heating, or proximity to industrial thermal discharge"
    );
  }

  if (causes.length === 0) {
    return "All parameters are within safe limits. The water source appears well-maintained and free from contamination. No corrective action is needed.";
  }

  return `Based on the abnormal sensor readings, the most likely causes are:\n\n${causes
    .map((c, i) => `${i + 1}. ${c}`)
    .join("\n")}`;
}

// ===== Section 5: What Is Happening Inside the Water? =====
function generateInsideWater(data, s) {
  const points = [];

  if (s.tdsStatus !== "safe") {
    points.push(
      `TDS (Total Dissolved Solids) at ${data.tds} ppm means the water contains high levels of dissolved substances — including inorganic salts (chlorides, sulfates, bicarbonates of calcium, magnesium, sodium, and potassium), organic matter, and potentially heavy metals. These dissolved solids alter the water's chemical composition and can affect taste, cause scale buildup, and introduce harmful substances.`
    );
  } else {
    points.push(
      `TDS at ${data.tds} ppm indicates a balanced mineral content. The water has a healthy level of dissolved minerals without excess contaminants.`
    );
  }

  if (s.turbStatus !== "safe") {
    points.push(
      `Turbidity at ${data.turbidity} NTU means the water contains visible suspended particles — clay, silt, organic matter, microorganisms, or pollutants. High turbidity scatters light, making water appear cloudy. More importantly, suspended particles can shield bacteria and viruses from disinfection, making the water biologically unsafe.`
    );
  } else {
    points.push(
      `Turbidity at ${data.turbidity} NTU indicates clear water. Suspended particle levels are low, meaning the water is visually clean and pathogens are less likely to be shielded from treatment.`
    );
  }

  if (s.phStatus !== "safe") {
    if (data.ph < 6.5) {
      points.push(
        `pH at ${data.ph} means the water is acidic. Acidic water accelerates corrosion of metal pipes, leaching lead, copper, and zinc into the water supply. Acidic water can also cause digestive irritation and disrupt the body's natural pH balance when consumed regularly.`
      );
    } else {
      points.push(
        `pH at ${data.ph} means the water is alkaline. While mildly alkaline water is generally harmless, excessively alkaline water can cause skin irritation, reduce disinfection effectiveness, and leave mineral deposits (scale) in pipes and appliances.`
      );
    }
  } else {
    points.push(
      `pH at ${data.ph} means the water is chemically balanced — neither too acidic nor too alkaline. This prevents pipe corrosion and ensures the water is gentle on the digestive system.`
    );
  }

  if (s.tempStatus !== "safe") {
    points.push(
      `Temperature at ${data.temperature}°C is elevated. Warm water accelerates bacterial and microbial growth, reduces dissolved oxygen levels, and can make chemical contaminants more reactive. Bacteria like E. coli and Vibrio cholerae multiply rapidly in warm, stagnant water.`
    );
  } else {
    points.push(
      `Temperature at ${data.temperature}°C is within the ideal range. Cooler water inhibits bacterial growth and maintains higher dissolved oxygen levels, contributing to better water quality.`
    );
  }

  return points.join("\n\n");
}

// ===== Section 6: Health Impact =====
function generateHealthImpact(riskLevel, familyMember, diseaseRisks) {
  const vuln = {
    infant: {
      label: "Infants",
      level: "Extremely High",
      note: "Infants have developing immune systems and low body weight. Even minor contamination can cause severe dehydration, electrolyte imbalance, and life-threatening conditions. Always use sterilized, boiled and cooled water for formula preparation.",
    },
    child: {
      label: "Young Children",
      level: "High",
      note: "Children are more susceptible due to smaller body size and developing immunity. Contaminated water can cause growth-affecting illnesses and recurrent infections.",
    },
    elderly: {
      label: "Elderly Individuals",
      level: "High",
      note: "Older adults often have weakened immune systems and may take medications that increase vulnerability. Dehydration from water-borne illness can be particularly dangerous.",
    },
    pregnant_woman: {
      label: "Pregnant Women",
      level: "Very High",
      note: "Contaminated water poses risks to both mother and baby. Water-borne infections can lead to complications including dehydration, premature labor, and fetal distress.",
    },
    adult: {
      label: "Healthy Adults",
      level: "Moderate",
      note: "Healthy adults have stronger immune systems but are still at risk from heavily contaminated water, especially with prolonged exposure.",
    },
  };

  const v = vuln[familyMember] || vuln.adult;

  // Top disease risks
  const topRisks = Object.entries(diseaseRisks)
    .filter(([, r]) => r > 15)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  let diseaseText = "";
  if (riskLevel === "safe") {
    diseaseText =
      "With all parameters within safe limits, the risk of water-borne diseases is very low. The water is safe for all family members.";
  } else if (topRisks.length > 0) {
    diseaseText = `The sensor readings indicate elevated risk for: ${topRisks
      .map(([d, r]) => `${d.replace(/_/g, " ")} (${r}% risk)`)
      .join(", ")}. These diseases are caused by bacteria, viruses, or parasites that thrive in contaminated water.`;
  } else {
    diseaseText =
      "While some parameters are outside safe limits, the disease risk remains moderate. Prolonged use of this water could still lead to gastrointestinal issues over time.";
  }

  return {
    vulnerableGroup: v.label,
    vulnerabilityLevel: v.level,
    specialNote: v.note,
    diseaseText,
    riskLevel,
  };
}

// ===== Section 7: Recommended Actions =====
function generateActions(scan, riskLevel, s) {
  const actions = [];

  if (riskLevel === "safe") {
    actions.push({ action: "Continue Regular Monitoring", detail: "Test water every 1–2 weeks to ensure consistent quality." });
    actions.push({ action: "Store Properly", detail: "Keep water in clean, covered containers away from direct sunlight." });
    actions.push({ action: "Maintain Plumbing", detail: "Periodically inspect pipes and storage tanks for buildup or corrosion." });
    return actions;
  }

  // Boiling
  const boilTime = riskLevel === "danger" ? "at least 3 minutes" : "at least 1 minute";
  actions.push({
    action: "Boil Water",
    detail: `Bring water to a rolling boil for ${boilTime}, then cool before use. This kills most bacteria, viruses, and parasites.`,
  });

  // RO filtration
  if (s.tdsStatus !== "safe") {
    actions.push({
      action: "Install RO Filtration",
      detail: `A Reverse Osmosis system can reduce TDS from ${scan.tds} ppm to under 50 ppm, removing dissolved salts, heavy metals, and chemical contaminants.`,
    });
  }

  // UV treatment
  if (s.turbStatus !== "safe" || riskLevel === "danger") {
    actions.push({
      action: "UV Water Purifier",
      detail: "Install a UV purifier to neutralize bacteria, viruses, and cysts that may be shielded by suspended particles.",
    });
  }

  // Chlorination
  if (riskLevel === "danger") {
    actions.push({
      action: "Chlorination",
      detail: "Use chlorine tablets (1 tablet per 1 liter of water, wait 30 minutes) as an emergency disinfection method.",
    });
  }

  // Tank cleaning
  if (s.turbStatus !== "safe" || s.tempStatus !== "safe") {
    actions.push({
      action: "Clean Storage Tank",
      detail: "Inspect and clean your water storage tank. Stagnant water in dirty tanks is a breeding ground for bacteria.",
    });
  }

  // Pipeline repair
  if (s.phStatus !== "safe" && scan.ph < 6.5) {
    actions.push({
      action: "Repair / Replace Pipelines",
      detail: "Acidic water corrodes metal pipes. Inspect plumbing for corrosion and consider replacing with PVC or HDPE pipes.",
    });
  }

  // Retest
  actions.push({
    action: "Retest After Treatment",
    detail: "After implementing treatment, perform a new scan to verify that water quality has improved to safe levels.",
  });

  return actions;
}

// ===== Section 8: What Happens If Ignored? =====
function generateIfIgnored(riskLevel, diseaseRisks) {
  if (riskLevel === "safe") {
    return "No immediate risk. However, water quality can change over time due to seasonal variations, pipeline aging, or environmental factors. Continue regular monitoring to catch any changes early.";
  }

  const topDiseases = Object.entries(diseaseRisks)
    .filter(([, r]) => r > 20)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const diseaseNames = topDiseases.map(([d]) => d.replace(/_/g, " ")).join(", ");

  if (riskLevel === "moderate") {
    return `If this water continues to be used without treatment, family members may develop gastrointestinal infections over time. ${diseaseNames ? `The risk of ${diseaseNames} is elevated. ` : ""}Children, elderly, and pregnant women are especially vulnerable. Long-term consumption may lead to chronic health issues, mineral buildup in the body, and recurring digestive problems. The situation may worsen if contamination sources are not addressed.`;
  }

  return `If this water is consumed without proper treatment, serious health consequences are likely. ${diseaseNames ? `The risk of ${diseaseNames} is dangerously high. ` : ""}Outbreaks of water-borne diseases can occur within 24–72 hours of exposure. Symptoms may include severe diarrhea, vomiting, high fever, dehydration, and in extreme cases, organ failure. Infants and elderly family members are at risk of life-threatening dehydration. Chronic exposure can also cause long-term organ damage, especially to the liver and kidneys. Immediate action is essential.`;
}

// ===== Section 9: Location-Based AI Analysis =====
function generateLocationAnalysis(locationName, data, s) {
  const factors = [];

  if (s.tdsStatus !== "safe") {
    factors.push("high TDS levels may be associated with hard groundwater, aging pipelines, or nearby industrial activity");
  }
  if (s.turbStatus !== "safe") {
    factors.push("elevated turbidity may indicate nearby sewage leakage, construction runoff, or agricultural activity in the surrounding area");
  }
  if (s.phStatus !== "safe" && data.ph < 6.5) {
    factors.push("acidic pH may point to acid rain, industrial emissions, or natural geological conditions in this region");
  }
  if (s.tempStatus !== "safe") {
    factors.push("high water temperature may suggest stagnant storage or uncovered tanks common in this area");
  }

  if (factors.length === 0) {
    return `Location: ${locationName}. The water quality in this area is currently within safe limits. The local water infrastructure and environmental conditions appear to be supporting good water quality. Continue regular monitoring to detect any seasonal or environmental changes.`;
  }

  return `Location: ${locationName}. Based on the sensor readings, the ${factors.join("; ")}. Residents in this area should be aware of these potential local contamination sources and take appropriate water treatment measures. Community-level actions such as pipeline maintenance, tank cleaning, and pollution control can significantly improve water quality for everyone in the vicinity.`;
}

// ===== Section 10: AI Improvement Prediction =====
function generatePrediction(riskLevel, score, s) {
  if (riskLevel === "safe") {
    return {
      text: "Water quality is already excellent. With continued regular monitoring and basic maintenance, the water is expected to remain safe. No significant treatment is needed — maintain current practices.",
      predictedScore: score,
      predictedRisk: "Safe",
      contaminationReduction: "0%",
      treatments: [
        "Continue regular monitoring every 1–2 weeks",
        "Maintain clean storage tanks and plumbing",
      ],
    };
  }

  const predictedScore = Math.min(95, score + 40);
  const predictedRisk = predictedScore >= 70 ? "Safe" : predictedScore >= 40 ? "Moderate" : "Danger";
  const reduction = Math.round((1 - predictedScore / 100) * 100);

  const treatments = [];
  if (s.tdsStatus !== "safe")
    treatments.push("RO filtration can reduce TDS by 90–95%, bringing it well within safe limits");
  if (s.turbStatus !== "safe")
    treatments.push("Filtration + boiling can reduce turbidity by 85–95%, removing suspended particles");
  if (s.phStatus !== "safe")
    treatments.push("pH neutralization or blending can adjust pH to the safe 6.5–8.5 range");
  if (s.tempStatus !== "safe")
    treatments.push("Proper covered storage can normalize water temperature");
  treatments.push("UV purification can eliminate 99.9% of remaining microorganisms");

  return {
    text: `With proper treatment, the water quality is expected to improve significantly. The health score could rise from ${score} to approximately ${predictedScore}/100, changing the overall risk status from ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} to ${predictedRisk}. Contamination levels are expected to reduce by approximately ${100 - reduction}%.`,
    predictedScore,
    predictedRisk,
    contaminationReduction: `${100 - reduction}%`,
    treatments,
  };
}