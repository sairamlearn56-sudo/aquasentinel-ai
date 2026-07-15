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
      className="premium-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="font-heading font-semibold text-lg">Water Quality Trend</h2>
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <defs>
              <linearGradient id="trendLineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(189 94% 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(189 94% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={30} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
                backdropFilter: "blur(20px)",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(189 94% 50%)"
              strokeWidth={3}
              dot={{ fill: "hsl(189 94% 50%)", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
              activeDot={{ r: 6, fill: "hsl(217 91% 60%)" }}
              fill="url(#trendLineGrad)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}