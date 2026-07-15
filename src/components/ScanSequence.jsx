import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Radio } from "lucide-react";

export default function ScanSequence({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const proceed = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setTimeout(() => setCurrentStep((prev) => prev + 1), 200);
    } else {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setTimeout(() => onComplete(), 500);
    }
  }, [currentStep, steps.length, onComplete]);

  useEffect(() => {
    const duration = currentStep === 0 ? 1000 : currentStep === steps.length - 1 ? 600 : 800;
    const timer = setTimeout(proceed, duration);
    return () => clearTimeout(timer);
  }, [currentStep, proceed, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[500px]">
      {/* Central animated sensor visual */}
      <div className="relative w-40 h-40 mb-10">
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            style={{
              animation: `ripple 3s ease-out infinite`,
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}
        {/* Center circle */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-aqua/10 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Radio className="w-10 h-10 text-primary animate-pulse" />
        </motion.div>
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/50" />
        </div>
      </div>

      {/* Step list */}
      <div className="w-full max-w-md space-y-2">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isCurrent
                  ? "bg-primary/10 border border-primary/20 scale-[1.02]"
                  : isCompleted
                  ? "opacity-50"
                  : "opacity-30"
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-safe" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isCurrent ? "text-primary" : isCompleted ? "text-muted-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mt-8">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-aqua rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {currentStep + 1} / {steps.length}
        </p>
      </div>
    </div>
  );
}