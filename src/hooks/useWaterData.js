import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

let firebaseDb = null;

export function useWaterData() {
  const [waterData, setWaterData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const initRef = useRef(false);

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

        // Strip any path from the URL — Firebase expects just the origin
        const cleanURL = databaseURL.replace(/^(https?:\/\/[^/]+).*$/, "$1");

        // Initialize Firebase (reuse existing app if already created)
        if (!firebaseDb) {
          const app = getApps().length ? getApp() : initializeApp({ databaseURL: cleanURL });
          firebaseDb = getDatabase(app);
        }

        // Listen to /waterData for real-time updates
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { waterData, isConnected };
}