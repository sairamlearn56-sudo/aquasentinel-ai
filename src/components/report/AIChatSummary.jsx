import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { classifyParameter } from "@/lib/waterAnalysis";

export default function AIChatSummary({ scans }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (loading) return;
    setLoading(true);
    setExplanation(null);
    try {
      const latest = scans[0];
      const avgScore = scans.length > 0 ? Math.round(scans.reduce((s, x) => s + x.health_score, 0) / scans.length) : 0;
      const risks = typeof latest?.disease_risks === "string" ? JSON.parse(latest.disease_risks) : latest?.disease_risks || {};
      const topDisease = Object.entries(risks).sort(([, a], [, b]) => b - a)[0];

      const prompt = `You are AquaSentinel AI, a water quality analysis assistant for governments, hospitals, and water authorities. Based on the following water quality data, provide a clear, plain-language explanation of the current situation, key risks, and recommended actions. Keep it to 3-4 sentences.

Latest scan:
- Health Score: ${latest?.health_score}/100
- Risk Level: ${latest?.risk_level}
- pH: ${latest?.ph}
- TDS: ${latest?.tds} ppm
- Temperature: ${latest?.temperature}°C
- Turbidity: ${latest?.turbidity} NTU
- Top disease risk: ${topDisease ? topDisease[0] : "N/A"} (${topDisease ? topDisease[1] : 0}%)

Summary:
- Total reports: ${scans.length}
- Average health score: ${avgScore}
- Safe reports: ${scans.filter(s => s.risk_level === "safe").length}
- Unsafe reports: ${scans.filter(s => s.risk_level === "danger").length}`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            explanation: { type: "string" },
          },
        },
      });
      setExplanation(res.explanation || res);
    } catch (e) {
      setExplanation("Unable to generate AI explanation at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="premium-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Chat Summary</h2>
          <p className="text-xs text-muted-foreground">Ask AI to explain this analysis in plain language</p>
        </div>
      </div>

      <button
        onClick={handleExplain}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? "AI is analyzing..." : "Explain this analysis"}
      </button>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
            <div className="space-y-2">
              <div className="h-3 rounded-full skeleton w-3/4" />
              <div className="h-3 rounded-full skeleton w-full" />
              <div className="h-3 rounded-full skeleton w-5/6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {explanation && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/8 to-blue-500/5 border border-cyan-500/15 relative">
              <button
                onClick={() => setExplanation(null)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-foreground/80 pr-6">{explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}