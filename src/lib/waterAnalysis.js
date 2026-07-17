// Water Quality Analysis Engine for AquaSentinel AI
// Simulates IoT sensor readings and computes health scores, disease risks, and AI narrative

// Safe ranges based on WHO drinking water guidelines
export const SAFE_RANGES = {
  ph: { min: 6.5, max: 8.5, unit: "" },
  tds: { min: 0, max: 500, unit: "ppm" },
  temperature: { min: 15, max: 30, unit: "°C" },
  turbidity: { min: 0, max: 5, unit: "NTU" },
};

// Generate simulated sensor data (realistic IoT readings)
export function generateSensorData() {
  // Randomly bias toward different scenarios for variety
  const scenario = Math.random();
  let ph, tds, temperature, turbidity;

  if (scenario < 0.35) {
    // Safe scenario
    ph = 6.8 + Math.random() * 1.4;
    tds = 80 + Math.random() * 300;
    temperature = 18 + Math.random() * 8;
    turbidity = 0.5 + Math.random() * 3.5;
  } else if (scenario < 0.7) {
    // Moderate scenario
    ph = 5.8 + Math.random() * 0.6 + Math.random() * 1.2;
    tds = 450 + Math.random() * 350;
    temperature = 28 + Math.random() * 6;
    turbidity = 4.5 + Math.random() * 5;
  } else {
    // Danger scenario
    ph = 4.5 + Math.random() * 1.2 + Math.random() * 0.8;
    tds = 850 + Math.random() * 600;
    temperature = 32 + Math.random() * 8;
    turbidity = 10 + Math.random() * 15;
  }

  return {
    ph: Math.round(ph * 100) / 100,
    tds: Math.round(tds),
    temperature: Math.round(temperature * 10) / 10,
    turbidity: Math.round(turbidity * 100) / 100,
  };
}

// Classify a single parameter's safety
export function classifyParameter(name, value) {
  const range = SAFE_RANGES[name];
  if (!range) return "safe";
  
  if (name === "ph") {
    if (value >= 6.5 && value <= 8.5) return "safe";
    if ((value >= 5.5 && value < 6.5) || (value > 8.5 && value <= 9.5)) return "moderate";
    return "danger";
  }
  if (value >= range.min && value <= range.max) return "safe";
  const rangeSize = range.max - range.min;
  if (value > range.max && value <= range.max + rangeSize * 0.5) return "moderate";
  if (value < range.min && value >= range.min - rangeSize * 0.5) return "moderate";
  return "danger";
}

// Compute overall health score (0-100)
export function computeHealthScore(data) {
  const params = ["ph", "tds", "temperature", "turbidity"];
  let totalScore = 0;

  params.forEach((param) => {
    const value = data[param];
    const range = SAFE_RANGES[param];
    const status = classifyParameter(param, value);

    if (status === "safe") {
      totalScore += 25;
    } else if (status === "moderate") {
      totalScore += 12;
    } else {
      totalScore += 3;
    }
  });

  return Math.round(totalScore);
}

// Determine overall risk level
export function computeRiskLevel(score) {
  if (score >= 70) return "safe";
  if (score >= 40) return "moderate";
  return "danger";
}

// Compute disease risk percentages based on water parameters
export function computeDiseaseRisks(data, familyMember = "adult") {
  const phStatus = classifyParameter("ph", data.ph);
  const tdsStatus = classifyParameter("tds", data.tds);
  const turbStatus = classifyParameter("turbidity", data.turbidity);
  const tempStatus = classifyParameter("temperature", data.temperature);

  // Base risk factors from parameters
  const contaminationLevel =
    (turbStatus === "danger" ? 3 : turbStatus === "moderate" ? 1.5 : 0) +
    (tdsStatus === "danger" ? 2.5 : tdsStatus === "moderate" ? 1.2 : 0) +
    (phStatus === "danger" ? 2 : phStatus === "moderate" ? 1 : 0) +
    (tempStatus === "danger" ? 1.5 : tempStatus === "moderate" ? 0.8 : 0);

  // Family member vulnerability multiplier
  const vulnerability = {
    infant: 1.8,
    child: 1.5,
    adult: 1.0,
    elderly: 1.4,
    pregnant_woman: 1.6,
  };
  const vulnMult = vulnerability[familyMember] || 1.0;

  // Disease-specific risk weights
  const risks = {
    cholera: Math.min(95, Math.round((contaminationLevel * 12 + (turbStatus === "danger" ? 20 : 0)) * vulnMult)),
    typhoid: Math.min(95, Math.round((contaminationLevel * 10 + (tdsStatus === "danger" ? 18 : 0)) * vulnMult)),
    diarrhea: Math.min(95, Math.round((contaminationLevel * 14 + (turbStatus !== "safe" ? 12 : 0)) * vulnMult)),
    dysentery: Math.min(95, Math.round((contaminationLevel * 11 + (phStatus !== "safe" ? 14 : 0)) * vulnMult)),
    hepatitisA: Math.min(95, Math.round((contaminationLevel * 8 + (turbStatus === "danger" && tdsStatus === "danger" ? 16 : 0)) * vulnMult)),
  };

  // If water is safe, reduce all risks
  if (contaminationLevel === 0) {
    Object.keys(risks).forEach((k) => {
      risks[k] = Math.max(1, Math.round(risks[k] * 0.05));
    });
  }

  return risks;
}

// Disease information database
export const DISEASE_INFO = {
  cholera: {
    symptoms: "Severe watery diarrhea, vomiting, rapid dehydration, muscle cramps, dry mucous membranes, low blood pressure.",
    transmission: "Contaminated water and food. The bacteria Vibrio cholerae spreads through fecal contamination of water sources.",
    prevention: "Drink boiled or treated water, wash hands frequently, cook food thoroughly, avoid raw seafood, use proper sanitation.",
    treatment: "Oral rehydration solution (ORS), intravenous fluids in severe cases, antibiotics (azithromycin/doxycycline) in severe cases.",
    recovery: "With prompt treatment, recovery occurs in 3-7 days. Rehydration is critical. Seek medical help immediately if symptoms appear.",
  },
  typhoid: {
    symptoms: "Prolonged high fever (up to 104°F), weakness, stomach pain, headache, loss of appetite, rash of flat rose-colored spots.",
    transmission: "Contaminated water and food. Salmonella Typhi bacteria spread through fecal-oral route from infected individuals.",
    prevention: "Vaccination, safe drinking water, proper handwashing, avoid raw fruits and vegetables in endemic areas, cook food thoroughly.",
    treatment: "Antibiotics (ceftriaxone, azithromycin). Supportive care with fluids and fever management. Hospitalization may be needed.",
    recovery: "With treatment, improvement in 2-4 days, full recovery in 2-4 weeks. Some become carriers — follow-up testing important.",
  },
  diarrhea: {
    symptoms: "Frequent loose or watery stools, abdominal cramps, bloating, nausea, urgency to use bathroom, possible fever.",
    transmission: "Contaminated water, food, or surfaces. Viral, bacterial, or parasitic infections from unsafe water and poor hygiene.",
    prevention: "Safe drinking water, handwashing, proper food handling, good sanitation, avoid contaminated water sources.",
    treatment: "Oral rehydration salts (ORS), zinc supplements, probiotics. Antibiotics only for bacterial causes. Maintain fluid intake.",
    recovery: "Typically resolves in 2-3 days with proper hydration. Seek medical help if blood in stool, high fever, or dehydration signs.",
  },
  dysentery: {
    symptoms: "Bloody or mucoid diarrhea, severe abdominal pain, fever, nausea, frequent urge to pass stool, weight loss.",
    transmission: "Contaminated water and food. Caused by Shigella bacteria or Entamoeba histolytica parasite through fecal-oral route.",
    prevention: "Safe water, proper sanitation, handwashing, avoid contaminated food, fly control, proper waste disposal.",
    treatment: "Antibiotics for bacterial dysentery (ciprofloxacin, azithromycin). Antiparasitic medication for amoebic dysentery. ORS for hydration.",
    recovery: "Improvement in 2-4 days with treatment. Full recovery in 1-2 weeks. Severe cases may require hospitalization.",
  },
  hepatitisA: {
    symptoms: "Jaundice (yellowing of skin/eyes), fatigue, abdominal pain, loss of appetite, nausea, fever, dark urine, joint pain.",
    transmission: "Contaminated water and food. Hepatitis A virus spreads through fecal-oral route, especially in areas with poor sanitation.",
    prevention: "Hepatitis A vaccine, safe drinking water, proper handwashing, avoid raw shellfish, good personal hygiene.",
    treatment: "No specific treatment. Supportive care: rest, hydration, avoid alcohol and hepatotoxic drugs. Most recover naturally.",
    recovery: "Recovery in 2-6 weeks. Some have prolonged illness lasting months. Liver function monitoring recommended. Immunity develops after infection.",
  },
};

// Generate doctor-like AI narrative explanation
export function generateAIAnalysis(data, riskLevel, diseaseRisks, familyMember) {
  const narratives = [];

  // pH analysis
  const phStatus = classifyParameter("ph", data.ph);
  if (phStatus === "safe") {
    narratives.push(`The pH level is ${data.ph}, which is within the safe range of 6.5–8.5. The water is neither too acidic nor too alkaline.`);
  } else if (phStatus === "moderate") {
    narratives.push(data.ph < 6.5
      ? `The pH level is ${data.ph}, which is slightly acidic. While not immediately dangerous, acidic water can leach metals from pipes over time.`
      : `The pH level is ${data.ph}, which is slightly alkaline. This is a minor deviation from the ideal range.`);
  } else {
    narratives.push(data.ph < 5.5
      ? `The pH level is ${data.ph}, which is dangerously acidic. This can cause digestive irritation and may leach heavy metals from plumbing.`
      : `The pH level is ${data.ph}, which is dangerously alkaline. This can cause skin and digestive irritation.`);
  }

  // TDS analysis
  const tdsStatus = classifyParameter("tds", data.tds);
  if (tdsStatus === "safe") {
    narratives.push(`TDS (Total Dissolved Solids) is ${data.tds} ppm, well within safe limits. The mineral content is balanced and appropriate for consumption.`);
  } else if (tdsStatus === "moderate") {
    narratives.push(`TDS is ${data.tds} ppm, which is above the recommended limit of 500 ppm. This indicates elevated mineral and potentially harmful dissolved substances.`);
  } else {
    narratives.push(`TDS is ${data.tds} ppm, which is dangerously high. This suggests significant contamination with dissolved solids, which may include heavy metals, salts, or organic compounds.`);
  }

  // Turbidity analysis
  const turbStatus = classifyParameter("turbidity", data.turbidity);
  if (turbStatus === "safe") {
    narratives.push(`Turbidity is ${data.turbidity} NTU, indicating clear water free of suspended particles. The water appears clean and transparent.`);
  } else if (turbStatus === "moderate") {
    narratives.push(`Turbidity is ${data.turbidity} NTU, which is above safe limits. This indicates suspended contaminants that may harbor bacteria and viruses.`);
  } else {
    narratives.push(`Turbidity is ${data.turbidity} NTU, which is dangerously high. Suspended particles can shield pathogens from disinfection and indicate serious contamination.`);
  }

  // Temperature analysis
  const tempStatus = classifyParameter("temperature", data.temperature);
  if (tempStatus === "safe") {
    narratives.push(`Water temperature is ${data.temperature}°C, which is normal and within the ideal range for drinking water.`);
  } else if (tempStatus === "moderate") {
    narratives.push(`Water temperature is ${data.temperature}°C, which is slightly elevated. Warmer water can promote bacterial growth if contamination is present.`);
  } else {
    narratives.push(`Water temperature is ${data.temperature}°C, which is high. Elevated temperatures accelerate bacterial proliferation and reduce water safety.`);
  }

  // Overall assessment
  if (riskLevel === "safe") {
    narratives.push("Overall, the water quality is SAFE for drinking and household use. All key parameters are within acceptable ranges.");
  } else if (riskLevel === "moderate") {
    narratives.push("Overall, the water quality requires CAUTION. Some parameters are outside safe limits. Treatment before consumption is strongly recommended.");
  } else {
    narratives.push("Overall, the water quality is UNSAFE. Multiple parameters exceed safe limits. Do not consume this water without proper treatment.");
  }

  // Family member specific note
  if (familyMember === "infant") {
    narratives.push("⚠️ Special Note: Infants are extremely vulnerable to water-borne diseases. Extra caution is advised — always use boiled and cooled water for infant feeding.");
  } else if (familyMember === "pregnant_woman") {
    narratives.push("⚠️ Special Note: Pregnant women are at higher risk from contaminated water. Please take extra precautions to ensure water safety.");
  } else if (familyMember === "elderly") {
    narratives.push("⚠️ Special Note: Elderly individuals may have weaker immune systems. Please ensure water is properly treated before consumption.");
  } else if (familyMember === "child") {
    narratives.push("⚠️ Special Note: Children are more susceptible to water-borne illnesses. Please take appropriate precautions.");
  }

  return narratives.join("\n\n");
}

// Generate personalized recommendations
export function generateRecommendations(data, riskLevel, diseaseRisks, familyMember) {
  const recs = {
    immediatePrecautions: [],
    waterTreatment: [],
    whenToVisitDoctor: "",
    emergencyAdvice: "",
  };

  if (riskLevel === "safe") {
    recs.immediatePrecautions = [
      "Water is safe for drinking and cooking",
      "Continue regular monitoring to ensure consistent quality",
      "Store water in clean, covered containers",
    ];
    recs.waterTreatment = [
      "No treatment required — water is safe as-is",
      "Optional: Use a basic water filter for taste improvement",
    ];
    recs.whenToVisitDoctor = "No action needed. Continue regular monitoring every few days.";
    recs.emergencyAdvice = "No emergency action required. If anyone experiences digestive discomfort, monitor symptoms and stay hydrated.";
  } else if (riskLevel === "moderate") {
    recs.immediatePrecautions = [
      "Boil water for at least 1 minute before drinking (3 minutes at high altitudes)",
      "Use boiled or bottled water for cooking and preparing food",
      "Avoid drinking tap water directly",
      "Keep children and elderly away from untreated water",
    ];
    recs.waterTreatment = [
      "Boil water vigorously for 1-3 minutes, then cool before use",
      "Use chlorine tablets (1 tablet per 1 liter, wait 30 minutes)",
      "Install a RO or UV water purifier for long-term use",
      "Solar disinfection: Place clear bottles in direct sunlight for 6 hours",
    ];
    recs.whenToVisitDoctor = "If anyone develops diarrhea, fever, or stomach pain within 48 hours of exposure, consult a doctor immediately. Mention the water quality results.";
    recs.emergencyAdvice = "If severe symptoms occur (persistent vomiting, high fever, bloody stools, signs of dehydration), go to the nearest hospital immediately. Carry ORS packets for rehydration during travel.";
  } else {
    recs.immediatePrecautions = [
      "DO NOT drink this water under any circumstances",
      "Use only sealed bottled water or properly boiled water",
      "Do not use this water for cooking, brushing teeth, or washing food",
      "Keep all family members — especially children and elderly — away from this water",
      "Identify an alternative safe water source immediately",
    ];
    recs.waterTreatment = [
      "Boil water vigorously for at least 3 minutes minimum",
      "Use chlorine tablets or iodine tablets for chemical disinfection",
      "Use a certified RO + UV water purifier if available",
      "If no treatment option is available, use only sealed bottled water",
      "Consider installing a multi-stage filtration system urgently",
    ];
    recs.whenToVisitDoctor = "If anyone has consumed this water, monitor closely for symptoms. Seek medical attention at the first sign of diarrhea, fever, abdominal pain, or jaundice. Early treatment is critical.";
    recs.emergencyAdvice = "URGENT: If symptoms appear — severe diarrhea, persistent vomiting, high fever, dehydration, or jaundice — go to the nearest hospital EMERGENCY immediately. Inform medical staff about the contaminated water exposure. Begin ORS immediately for anyone with diarrhea.";
  }

  // Family member specific adjustments
  if (familyMember === "infant" && riskLevel !== "safe") {
    recs.immediatePrecautions.unshift("CRITICAL: Use only sterile, boiled and cooled water for infant formula preparation");
    recs.emergencyAdvice = "If an infant shows ANY signs of illness (refusing feeds, lethargy, fever, loose stools), rush to a pediatric emergency immediately. Infants dehydrate dangerously fast.";
  } else if (familyMember === "pregnant_woman" && riskLevel !== "safe") {
    recs.immediatePrecautions.unshift("CRITICAL: Pregnant women must not consume untreated water — risk to both mother and baby");
    recs.whenToVisitDoctor = "Pregnant women experiencing any symptoms should consult their obstetrician immediately. Do not delay.";
  }

  return recs;
}

// Full analysis pipeline — called after scan completes
export function analyzeWater(data, familyMember = "adult") {
  const healthScore = computeHealthScore(data);
  const riskLevel = computeRiskLevel(healthScore);
  const diseaseRisks = computeDiseaseRisks(data, familyMember);
  const aiAnalysis = generateAIAnalysis(data, riskLevel, diseaseRisks, familyMember);
  const recommendations = generateRecommendations(data, riskLevel, diseaseRisks, familyMember);

  return {
    ...data,
    health_score: healthScore,
    risk_level: riskLevel,
    disease_risks: diseaseRisks,
    ai_analysis: aiAnalysis,
    recommendations,
    family_member: familyMember,
  };
}