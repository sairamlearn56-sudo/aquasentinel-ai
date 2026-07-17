import { useHardwareStatus } from "@/lib/HardwareStatusContext";

export function useWaterData() {
  const { waterData, status } = useHardwareStatus();
  return { waterData, isConnected: status === "connected" };
}