import { useState, useEffect, useRef } from "react";

// Generates a single fake "mud water" reading with unique values each call
function generateMudWaterReading(counter) {
  const seed = counter * 1.7 + Math.random();
  return {
    ph: Math.round((4.2 + ((seed * 0.13) % 2.0)) * 100) / 100,        // 4.2–6.2 acidic
    tds: Math.round(820 + ((seed * 37) % 780) + Math.random() * 50),   // 820–1600 ppm
    temperature: Math.round((28.5 + ((seed * 0.4) % 7) + Math.random() * 0.5) * 10) / 10, // 28.5–35.5°C
    turbidity: Math.round((15 + ((seed * 2.3) % 40) + Math.random() * 3) * 100) / 100,   // 15–55 NTU
    timestamp: Date.now(),
  };
}

export function useWaterData() {
  const [waterData, setWaterData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const counterRef = useRef(0);

  useEffect(() => {
    // Simulate sensor connection delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      counterRef.current += 1;
      setWaterData(generateMudWaterReading(counterRef.current));
    }, 800);

    // Generate a new unique muddy-water reading every 1.2s
    const interval = setInterval(() => {
      counterRef.current += 1;
      setWaterData(generateMudWaterReading(counterRef.current));
    }, 1200);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, []);

  return { waterData, isConnected };
}