import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Calculator, BrainCircuit, Gauge, Sparkles, CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: 0, label: "Collecting Sensor Data", icon: Database, duration: 1000 },
  { id: 1, label: "Averaging Samples", icon: Calculator, duration: 1000 },
  { id: 2, label: "AI Disease Prediction", icon: BrainCircuit, duration: 1200 },
  { id: 3, label: "Calculating Water Health Score", icon: Gauge, duration: 1000 },
  { id: 4, label: "Preparing Aqua Advice", icon: Sparkles, duration: 1000 },
  { id: 5, label: "Analysis Complete", icon: CheckCircle2, duration: 800 },
];

export default function AIProcessingTimeline({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, STEPS[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[500px]">
      {/* ===== Central animated core ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-40 h-40 mb-10"
      >
        {/* Rotating rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-6 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center icon — swaps per step */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep < STEPS.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(STEPS[currentStep].icon, { className: "w-12 h-12 text-primary" })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== Title ===== */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-bold text-primary">
          {currentStep < STEPS.length ? STEPS[currentStep].label : "Analysis Complete"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">AI is processing your water sample data</p>
      </motion.div>

      {/* ===== Timeline steps ===== */}
      <div className="w-full max-w-md space-y-2.5">
        {STEPS.map((step, idx) => {
          const status = idx < currentStep ? "done" : idx === currentStep ? "active" : "pending";
          const StepIcon = step.icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: status === "pending" ? 0.35 : 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-2xl glass border transition-colors ${
                status === "active"
                  ? "border-primary/40 glow-primary"
                  : status === "done"
                  ? "border-safe/20"
                  : "border-border"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  status === "done"
                    ? "bg-safe/15 text-safe"
                    : status === "active"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted/20 text-muted-foreground"
                }`}
              >
                {status === "done" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-sm font-medium flex-1 ${
                  status === "pending" ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {step.label}
              </span>
              {status === "active" && (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
              {status === "done" && (
                <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}