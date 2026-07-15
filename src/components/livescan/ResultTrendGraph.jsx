import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ResultTrendGraph({ currentScore }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchScans() {
      try {
        const scans = await base44.entities.Scan.list("-created_date", 10);
        const chartData = [...scans].reverse().map((scan, idx) => ({
          name: `S${idx + 1}`,
          score: scan.health_score,
        }));
        chartData.push({ name: "Now", score: currentScore });
        setData(chartData);
      } catch (e) {
        setData([{ name: "Now", score: currentScore }]);
      }
    }
    fetchScans();
  }, [currentScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Water Quality Trend</h2>
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(213 35% 22%)" />
            <XAxis dataKey="name" stroke="hsl(213 27% 84%)" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="hsl(213 27% 84%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(219 42% 11%)",
                border: "1px solid hsl(213 35% 22%)",
                borderRadius: "12px",
                color: "hsl(210 40% 98%)",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(194 100% 50%)"
              strokeWidth={3}
              dot={{ fill: "hsl(194 100% 50%)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}