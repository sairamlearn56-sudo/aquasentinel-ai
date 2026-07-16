import { useState, useEffect, useRef, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

let firebaseDb = null;

export function useWaterData() {
  const [waterData, setWaterData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const initRef = useRef(false);
  const lastUpdatedRef = useRef(null);

  useEffect(() => {
    let unsubscribe = null;

    async function init() {
      if (initRef.current) return;
      initRef.current = true;

      try {
        const response = await base44.functions.invoke("getFirebaseConfig", {});
        const { databaseURL } = response.data;

        if (!databaseURL) {
          console.error("Firebase database URL not configured");
          return;
        }

        const cleanURL = databaseURL.replace(/^(https?:\/\/[^/]+).*$/, "$1");

        if (!firebaseDb) {
          const app = getApps().length ? getApp() : initializeApp({ databaseURL: cleanURL });
          firebaseDb = getDatabase(app);
        }

        const waterRef = ref(firebaseDb, "waterData");
        unsubscribe = onValue(
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
              setIsConnected(true);
              lastUpdatedRef.current = Date.now();
              setLastUpdated(Date.now());
            } else {
              setIsConnected(false);
            }
          },
          (err) => {
            console.error("Firebase listener error:", err);
            setIsConnected(false);
          }
        );
      } catch (e) {
        console.error("Firebase init error:", e);
        setIsConnected(false);
      }
    }

    init();

    // Connection loss detection — if no data for 10s, mark disconnected
    const lossInterval = setInterval(() => {
      if (lastUpdatedRef.current && Date.now() - lastUpdatedRef.current > 10000) {
        setIsConnected(false);
      }
    }, 5000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(lossInterval);
    };
  }, []);

  const sensorStatus = useMemo(() => {
    if (!waterData) return { ph: false, tds: false, turbidity: false, temperature: false };
    return {
      ph: waterData.ph != null && !isNaN(waterData.ph),
      tds: waterData.tds != null && !isNaN(waterData.tds),
      turbidity: waterData.turbidity != null && !isNaN(waterData.turbidity),
      temperature: waterData.temperature != null && !isNaN(waterData.temperature),
    };
  }, [waterData]);

  const allSensorsConnected = sensorStatus.ph && sensorStatus.tds && sensorStatus.turbidity && sensorStatus.temperature;

  return { waterData, isConnected, sensorStatus, allSensorsConnected, lastUpdated };
}