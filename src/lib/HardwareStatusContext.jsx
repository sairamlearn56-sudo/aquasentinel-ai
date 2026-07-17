import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const HardwareStatusContext = createContext(null);

const STALE_TIMEOUT = 10000; // 10s without data → disconnected
const CHECK_INTERVAL = 3000; // Check every 3s
const RECONNECT_DELAY = 10000; // Auto-retry after 10s
const TIMESTAMP_MAX_AGE = 60000; // 60s — sensor timestamp must be recent

function validateSensorData(raw) {
  if (!raw) return { valid: false, reason: "No data received" };

  const ph = Number(raw.ph ?? raw.pH ?? raw.PH);
  const tds = Number(raw.tds ?? raw.TDS);
  const temp = Number(raw.temperature ?? raw.temp ?? raw.Temperature);
  const turb = Number(raw.turbidity ?? raw.Turbidity ?? raw.ntu ?? raw.NTU);

  const checks = [
    { field: "pH", value: ph, min: 0, max: 14 },
    { field: "Temperature", value: temp, min: -10, max: 100 },
    { field: "TDS", value: tds, min: 0, max: 5000 },
    { field: "Turbidity", value: turb, min: 0, max: 1000 },
  ];

  for (const c of checks) {
    if (isNaN(c.value)) return { valid: false, reason: `${c.field} is missing or invalid` };
    if (c.value < c.min || c.value > c.max) return { valid: false, reason: `${c.field} (${c.value}) out of valid range` };
  }

  // Water level — optional but validate if present
  const waterLevel = raw.water_level ?? raw.waterLevel ?? raw.wlevel;
  if (waterLevel !== undefined && waterLevel !== null && waterLevel !== "") {
    const wl = Number(waterLevel);
    if (isNaN(wl) || wl < 0 || wl > 100) return { valid: false, reason: "Water Level is invalid" };
  }

  return {
    valid: true,
    data: {
      ph, tds, temperature: temp, turbidity: turb,
      ...(waterLevel !== undefined && waterLevel !== null && waterLevel !== "" ? { water_level: Number(waterLevel) } : {}),
    },
  };
}

function isTimestampRecent(timestamp) {
  if (!timestamp) return true; // No timestamp → assume fresh (just received via onValue)
  const ts = typeof timestamp === "number" ? timestamp : Date.parse(timestamp);
  if (isNaN(ts)) return true;
  return Date.now() - ts < TIMESTAMP_MAX_AGE;
}

export function HardwareStatusProvider({ children }) {
  const [status, setStatus] = useState("connecting"); // connecting | connected | disconnected
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

  // Set up / re-setup Firebase listener
  useEffect(() => {
    let cancelled = false;
    connectingStartRef.current = Date.now();

    async function setup() {
      try {
        const response = await base44.functions.invoke("getFirebaseConfig", {});
        if (cancelled) return;
        const { databaseURL } = response.data;
        if (!databaseURL) {
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
            lastDataTimeRef.current = Date.now(); // Any Firebase event = data activity

            if (!raw) return; // Path exists but no data yet

            // Validate sensor data
            const validation = validateSensorData(raw);
            if (!validation.valid) {
              setValidationError(validation.reason);
              setStatus((prev) => (prev === "connected" ? "connecting" : prev));
              return;
            }

            // Check timestamp freshness
            const timestamp = raw.timestamp ?? raw.time ?? raw.Timestamp;
            if (!isTimestampRecent(timestamp)) {
              setValidationError("Sensor timestamp is stale");
              setStatus((prev) => (prev === "connected" ? "connecting" : prev));
              return;
            }

            // ALL checks passed — mark connected
            setWaterData({ ...validation.data, timestamp: timestamp || Date.now() });
            setStatus("connected");
            setLastUpdate(new Date());
            setValidationError(null);
            setDeviceId(raw.device_id ?? raw.deviceId ?? raw.chip_id ?? "ESP32");
          },
          (err) => {
            console.error("Firebase listener error:", err);
            setFirebaseStatus("error");
            setStatus("disconnected");
          }
        );
      } catch (e) {
        console.error("Firebase init error:", e);
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

  // Stale check — mark disconnected if no data for STALE_TIMEOUT
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