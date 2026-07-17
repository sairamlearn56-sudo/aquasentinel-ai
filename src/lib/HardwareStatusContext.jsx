import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import { base44 } from "@/api/base44Client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const HardwareStatusContext = createContext(null);

const STALE_TIMEOUT = 15000; // 15s without data → disconnected
const CHECK_INTERVAL = 5000; // Check every 5s
const RECONNECT_DELAY = 10000; // Auto-retry after 10s

export function HardwareStatusProvider({ children }) {
  const [status, setStatus] = useState("waiting"); // waiting | connected | disconnected
  const [waterData, setWaterData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const firebaseDbRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const lastDataTimeRef = useRef(null);

  // Set up / re-setup Firebase listener
  useEffect(() => {
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
  }, [retryTrigger]);

  // Stale check — mark disconnected if no data for STALE_TIMEOUT
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastDataTimeRef.current) {
        const elapsed = Date.now() - lastDataTimeRef.current;
        if (elapsed > STALE_TIMEOUT) {
          setStatus((prev) => (prev === "connected" ? "disconnected" : prev));
        }
      }
    }, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Auto-retry when disconnected
  useEffect(() => {
    if (status === "disconnected") {
      const timer = setTimeout(() => setRetryTrigger((c) => c + 1), RECONNECT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const retry = () => {
    setStatus("waiting");
    lastDataTimeRef.current = null;
    setRetryTrigger((c) => c + 1);
  };

  return (
    <HardwareStatusContext.Provider value={{ status, waterData, lastUpdate, retry }}>
      {children}
    </HardwareStatusContext.Provider>
  );
}

export function useHardwareStatus() {
  const ctx = useContext(HardwareStatusContext);
  if (!ctx) throw new Error("useHardwareStatus must be used within HardwareStatusProvider");
  return ctx;
}