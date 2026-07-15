import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Droplets, Thermometer, Activity, FlaskConical } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";

// Sample community locations around a city center
const SAMPLE_LOCATIONS = [
  { name: "Riverside Colony", lat: 17.395, lng: 78.480, risk: "safe", score: 88, ph: 7.2, tds: 210, temp: 24, turb: 1.8 },
  { name: "Gandhi Nagar", lat: 17.382, lng: 78.499, risk: "moderate", score: 55, ph: 6.1, tds: 620, temp: 29, turb: 6.5 },
  { name: "Lake View Area", lat: 17.401, lng: 78.495, risk: "danger", score: 25, ph: 5.2, tds: 1150, temp: 34, turb: 14.2 },
  { name: "Green Park", lat: 17.388, lng: 78.475, risk: "safe", score: 82, ph: 7.5, tds: 180, temp: 22, turb: 2.1 },
  { name: "Old Town", lat: 17.375, lng: 78.490, risk: "moderate", score: 48, ph: 8.8, tds: 580, temp: 31, turb: 7.8 },
  { name: "Industrial Zone", lat: 17.410, lng: 78.510, risk: "danger", score: 18, ph: 4.8, tds: 1450, temp: 36, turb: 18.5 },
  { name: "Sunrise Colony", lat: 17.370, lng: 78.470, risk: "safe", score: 91, ph: 7.0, tds: 150, temp: 21, turb: 1.2 },
  { name: "Market Square", lat: 17.392, lng: 78.485, risk: "moderate", score: 52, ph: 6.0, tds: 650, temp: 28, turb: 5.9 },
];

export default function CommunityMap() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [userScans, setUserScans] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await base44.entities.Scan.list("-created_date", 5);
        setUserScans(results || []);
      } catch (e) {}
    }
    loadData();
  }, []);

  // Merge user scans with sample locations
  const allLocations = [
    ...SAMPLE_LOCATIONS,
    ...userScans
      .filter((s) => s.latitude && s.longitude)
      .map((s) => ({
        name: s.location_name || "Your Location",
        lat: s.latitude,
        lng: s.longitude,
        risk: s.risk_level,
        score: s.health_score,
        ph: s.ph,
        tds: s.tds,
        temp: s.temperature,
        turb: s.turbidity,
        isUserScan: true,
      })),
  ];

  // Normalize coordinates to map positions (0-100%)
  const lats = allLocations.map((l) => l.lat);
  const lngs = allLocations.map((l) => l.lng);
  const minLat = Math.min(...lats) - 0.01;
  const maxLat = Math.max(...lats) + 0.01;
  const minLng = Math.min(...lngs) - 0.01;
  const maxLng = Math.max(...lngs) + 0.01;

  const normalize = (val, min, max) => ((val - min) / (max - min)) * 80 + 10;

  const colorMap = {
    safe: "bg-safe",
    moderate: "bg-warning",
    danger: "bg-danger",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          {t("communityMapTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time water quality across your community
        </p>
      </motion.div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        <LegendItem color="bg-safe" label={t("safeZone")} />
        <LegendItem color="bg-warning" label={t("cautionZone")} />
        <LegendItem color="bg-danger" label={t("dangerZone")} />
      </div>

      {/* Stylized Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-3xl p-2 overflow-hidden relative"
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(195, 30%, 92%) 0%, hsl(185, 25%, 88%) 50%, hsl(175, 20%, 90%) 100%)",
            minHeight: "400px",
          }}
        >
          {/* Map grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(185, 40%, 40%)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Decorative roads */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 60 Q 50 40 100 70" fill="none" stroke="hsl(185, 30%, 70%)" strokeWidth="3" />
            <path d="M 20 0 Q 40 50 30 100" fill="none" stroke="hsl(185, 30%, 70%)" strokeWidth="2" />
            <path d="M 0 30 Q 60 50 100 35" fill="none" stroke="hsl(185, 30%, 70%)" strokeWidth="2" />
          </svg>

          {/* River */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 80 Q 30 75 50 78 T 100 72" fill="none" stroke="hsl(200, 60%, 60%)" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
          </svg>

          {/* Markers */}
          {allLocations.map((loc, idx) => {
            const x = normalize(loc.lng, minLng, maxLng);
            const y = 100 - normalize(loc.lat, minLat, maxLat);
            return (
              <button
                key={idx}
                onClick={() => setSelected(loc)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative">
                  {/* Pulse ring */}
                  <div className={`absolute inset-0 rounded-full ${colorMap[loc.risk]} opacity-30 animate-ping`} style={{ width: "24px", height: "24px" }} />
                  {/* Marker */}
                  <div className={`relative w-6 h-6 rounded-full ${colorMap[loc.risk]} border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform`}>
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap bg-white/80 backdrop-blur px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {loc.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Location Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">{selected.score}</span>
                <span className="text-xs text-muted-foreground">{t("score")}</span>
              </div>
              <RiskBadge level={selected.risk} label={t(selected.risk)} size="lg" />
            </div>

            <p className="text-xs text-muted-foreground mb-3">{t("latestReading")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ReadingCard icon={FlaskConical} label={t("pH")} value={selected.ph} />
              <ReadingCard icon={Droplets} label={t("tds")} value={`${selected.tds} ppm`} />
              <ReadingCard icon={Thermometer} label={t("temperature")} value={`${selected.temp}°C`} />
              <ReadingCard icon={Activity} label={t("turbidity")} value={`${selected.turb} NTU`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function ReadingCard({ icon: Icon, label, value }) {
  return (
    <div className="p-3 rounded-xl bg-muted/30">
      <Icon className="w-4 h-4 text-primary mb-1" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}