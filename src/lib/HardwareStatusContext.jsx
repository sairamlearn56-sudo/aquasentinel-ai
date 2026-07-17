import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { generateSensorData } from "@/lib/waterAnalysis";

const HardwareStatusContext = createContext(null);

const STALE_TIMEOUT = 15000; // 15s without data → disconnected
const CHECK_INTERVAL = 5000; // Check every 5s
const RECONNECT_DELAY = 10000; // Auto-retry after 10s
const SIM_INTERVAL = 2000; // Simulated data every 2s

export function HardwareStatusProvider({ children }) {
  const [status, setStatus] = useState("waiting"); // waiting | connected | disconnected
  const [waterData, setWaterData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const firebaseDbRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const lastDataTimeRef = useRef(null);
  const demoModeRef = useRef(false);

  useEffect(() => { demoModeRef.current = demoMode; }, [demoMode]);

  // Set up / re-setup Firebase listener (skipped in demo mode)
  useEffect(() => {
    if (demoMode) return;
    let cancelled = false;

    async function setup() {
      try {
        const response = await base44.functions.invoke("getFirebaseConfig", {});
        if (cancelled) return;
        const { databaseURL } = response.data;
        if (!databaseURL) {
          setStatus("disconnected");
          return;
        }

        const cleanURL = databaseURL.replace(/^(https?:\/\/[^/]+).*$/, "$1");
        if (!firebaseDbRef.current) {
          const app = getApps().length ? getApp() : initializeApp({ databaseURL: cleanURL });
          firebaseDbRef.current = getDatabase(app);
        }

        if (unsubscribeRef.current) unsubscribeRef.current();

        const waterRef = ref(firebaseDbRef.current, "waterData");
        unsubscribeRef.current = onValue(
          waterRef,
          (snapshot) => {
            const raw = snapshot.val();
            if (raw) {
              setWaterData({
                ph: Number(raw.ph ?? raw.pH ?? raw.PH),
                tds: Number(raw.tds ?? raw.TDS),
                temperature: Number(raw.temperature ?? raw.temp ?? raw.Temperature),
                turbidity: Number(raw.turbidity ?? raw.Turbidity ?? raw.ntu ?? raw.NTU),
                timestamp: raw.timestamp ?? raw.time ?? raw.Timestamp,
              });
              setStatus("connected");
              setLastUpdate(new Date());
              lastDataTimeRef.current = Date.now();
            }
          },
          (err) => {
            console.error("Firebase listener error:", err);
            setStatus("disconnected");
          }
        );
      } catch (e) {
        console.error("Firebase init error:", e);
        if (!cancelled) setStatus("disconnected");
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
  }, [retryTrigger, demoMode]);

  // Demo mode — generate simulated sensor data
  useEffect(() => {
    if (!demoMode) return;

    const pushSim = () => {
      const data = generateSensorData();
      setWaterData(data);
      setStatus("connected");
      setLastUpdate(new Date());
      lastDataTimeRef.current = Date.now();
    };

    pushSim(); // immediate
    const interval = setInterval(pushSim, SIM_INTERVAL);
    return () => clearInterval(interval);
  }, [demoMode]);

  // Stale check — mark disconnected if no data for STALE_TIMEOUT (skipped in demo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (demoModeRef.current) return;
      if (lastDataTimeRef.current) {
        const elapsed = Date.now() - lastDataTimeRef.current;
        if (elapsed > STALE_TIMEOUT) {
          setStatus((prev) => (prev === "connected" ? "disconnected" : prev));
        }
      }
    }, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Auto-retry when disconnected (skipped in demo)
  useEffect(() => {
    if (status === "disconnected" && !demoMode) {
      const timer = setTimeout(() => setRetryTrigger((c) => c + 1), RECONNECT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [status, demoMode]);

  const retry = () => {
    setStatus("waiting");
    lastDataTimeRef.current = null;
    setRetryTrigger((c) => c + 1);
  };

  const toggleDemoMode = () => {
    setDemoMode((prev) => {
      const next = !prev;
      if (!next) {
        // Exiting demo mode — reset and reconnect to Firebase
        setStatus("waiting");
        lastDataTimeRef.current = null;
        setWaterData(null);
        setRetryTrigger((c) => c + 1);
      }
      return next;
    });
  };

  return (
    <HardwareStatusContext.Provider value={{ status, waterData, lastUpdate, retry, demoMode, toggleDemoMode }}>
      {children}
    </HardwareStatusContext.Provider>
  );
}

export function useHardwareStatus() {
  const ctx = useContext(HardwareStatusContext);
  if (!ctx) throw new Error("useHardwareStatus must be used within HardwareStatusProvider");
  return ctx;
}