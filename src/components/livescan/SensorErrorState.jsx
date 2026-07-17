import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SensorErrorState({ errors, onNewScan }) {
  const errorEntries = Object.entries(errors || {});

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="premium-card p-8 border-2 border-rose-500/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Sensor Error</h1>
            <p className="text-sm text-muted-foreground">Invalid readings detected — analysis cannot proceed</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {errorEntries.map(([sensor, message]) => (
            <div key={sensor} className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold capitalize">{sensor}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-6">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Please check sensor connections and repeat the scan. AI analysis requires valid sensor readings for all parameters.
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Repeat Scan
        </button>
      </motion.div>
    </div>
  );
}