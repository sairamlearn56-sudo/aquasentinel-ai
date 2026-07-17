import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const HardwareStatusContext = createContext(null);

const STALE_TIMEOUT = 30000; // 30s without data → disconnected
const CHECK_INTERVAL = 5000;
const RECONNECT_DELAY = 10000;
const TIMESTAMP_MAX_AGE = 300000; // 5 min — generous to handle clock drift

function validateSensorData(raw) {
  if (!raw) return { valid: false, reason: "No data received" };

  const ph = Number(raw.ph ?? raw.pH ?? raw.PH);
  const tds = Number(raw.tds ?? raw.TDS);
  const temp = Number(raw.temperature ?? raw.temp ?? raw.Temperature);
  const turb = Number(raw.turbidity ?? raw.Turbidity ?? raw.ntu ?? raw.NTU);

  const sensors = [
    { field: "pH", value: ph, min: -2, max: 16 },
    { field: "Temperature", value: temp, min: -50, max: 200 },
    { field: "TDS", value: tds, min: -100, max: 10000 },
    { field: "Turbidity", value: turb, min: -100, max: 5000 },
  ];

  // At least 1 of the 4 core sensors must have a valid numeric value
  const validSensors = sensors.filter((s) => !isNaN(s.value));
  if (validSensors.length === 0) {
    return { valid: false, reason: "No valid sensor values in packet" };
  }

  // Only reject truly impossible values
  for (const s of sensors) {
    if (isNaN(s.value)) continue;
    if (s.value < s.min || s.value > s.max) {
      return { valid: false, reason: `${s.field} (${s.value}) out of physical range` };
    }
  }

  // Water level — optional
  const waterLevel = raw.water_level ?? raw.waterLevel ?? raw.wlevel;
  if (waterLevel !== undefined && waterLevel !== null && waterLevel !== "") {
    const wl = Number(waterLevel);
    if (!isNaN(wl) && (wl < -100 || wl > 1000)) {
      return { valid: false, reason: "Water Level out of physical range" };
    }
  }

  return {
    valid: true,
    data: {
      ph: isNaN(ph) ? null : ph,
      tds: isNaN(tds) ? null : tds,
      temperature: isNaN(temp) ? null : temp,
      turbidity: isNaN(turb) ? null : turb,
      ...(waterLevel !== undefined && waterLevel !== null && waterLevel !== "" && !isNaN(Number(waterLevel))
        ? { water_level: Number(waterLevel) }
        : {}),
    },
  };
}

function isTimestampRecent(timestamp) {
  if (!timestamp) return true; // No timestamp → assume fresh
  let ts = typeof timestamp === "number" ? timestamp : Date.parse(timestamp);
  if (isNaN(ts)) return true;
  // Handle epoch seconds (10 digits) vs milliseconds (13 digits)
  if (ts < 1e12) ts = ts * 1000;
  return Date.now() - ts < TIMESTAMP_MAX_AGE;
}

export function HardwareStatusProvider({ children }) {
  const [status, setStatus] = useState("connecting");
  const [waterData, setWaterData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState("connecting");
  const [validationError, setValidationError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const firebaseDbRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const lastDataTimeRef = useRef(null);
  const connectingStartRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    connectingStartRef.current = Date.now();

    async function setup() {
      try {
        const response = await base44.functions.invoke("getFirebaseConfig", {});
        if (cancelled) return;
        const { databaseURL } = response.data;
        if (!databaseURL) {
          console.error("[HardwareStatus] No databaseURL in response");
          setStatus("disconnected");
          setFirebaseStatus("error");
          return;
        }

        const cleanURL = databaseURL.replace(/^(https?:\/\/[^/]+).*$/, "$1");
        if (!firebaseDbRef.current) {
          const app = getApps().length ? getApp() : initializeApp({ databaseURL: cleanURL });
          firebaseDbRef.current = getDatabase(app);
        }

        if (unsubscribeRef.current) unsubscribeRef.current();

        setFirebaseStatus("connected");
        const waterRef = ref(firebaseDbRef.current, "waterData");
        unsubscribeRef.current = onValue(
          waterRef,
          (snapshot) => {
            if (cancelled) return;
            const raw = snapshot.val();
            lastDataTimeRef.current = Date.now();

            if (!raw) return; // Path exists but no data yet

            const validation = validateSensorData(raw);
            if (!validation.valid) {
              console.warn("[HardwareStatus] Validation failed:", validation.reason, raw);
              setValidationError(validation.reason);
              setStatus((prev) => (prev === "connected" ? "connecting" : prev));
              return;
            }

            const timestamp = raw.timestamp ?? raw.time ?? raw.Timestamp;
            if (!isTimestampRecent(timestamp)) {
              console.warn("[HardwareStatus] Timestamp stale:", timestamp);
              setValidationError("Sensor timestamp is stale");
              setStatus((prev) => (prev === "connected" ? "connecting" : prev));
              return;
            }

            // All checks passed
            setWaterData({ ...validation.data, timestamp: timestamp || Date.now() });
            setStatus("connected");
            setLastUpdate(new Date());
            setValidationError(null);
            setDeviceId(raw.device_id ?? raw.deviceId ?? raw.chip_id ?? "ESP32");
          },
          (err) => {
            console.error("[HardwareStatus] Firebase listener error:", err);
            setFirebaseStatus("error");
            setStatus("disconnected");
          }
        );
      } catch (e) {
        console.error("[HardwareStatus] Setup error:", e);
        if (!cancelled) {
          setStatus("disconnected");
          setFirebaseStatus("error");
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [retryTrigger]);

  // Stale check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (lastDataTimeRef.current) {
        if (now - lastDataTimeRef.current > STALE_TIMEOUT) {
          setStatus((prev) => (prev === "connected" || prev === "connecting" ? "disconnected" : prev));
        }
      } else if (connectingStartRef.current) {
        if (now - connectingStartRef.current > STALE_TIMEOUT) {
          setStatus((prev) => (prev === "connecting" ? "disconnected" : prev));
        }
      }
    }, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Auto-retry when disconnected
  useEffect(() => {
    if (status === "disconnected") {
      const timer = setTimeout(() => {
        setStatus("connecting");
        connectingStartRef.current = Date.now();
        setRetryTrigger((c) => c + 1);
      }, RECONNECT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const retry = () => {
    setStatus("connecting");
    connectingStartRef.current = Date.now();
    lastDataTimeRef.current = null;
    setRetryTrigger((c) => c + 1);
  };

  return (
    <HardwareStatusContext.Provider value={{ status, waterData, lastUpdate, deviceId, firebaseStatus, validationError, retry }}>
      {children}
    </HardwareStatusContext.Provider>
  );
}

export function useHardwareStatus() {
  const ctx = useContext(HardwareStatusContext);
  if (!ctx) throw new Error("useHardwareStatus must be used within HardwareStatusProvider");
  return ctx;
}