import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Cpu, BrainCircuit, FileText } from "lucide-react";

const STEPS = [
  { message: "Analyzing Water Quality...", icon: Droplets },
  { message: "Processing Sensor Data...", icon: Cpu },
  { message: "Predicting Disease Risk...", icon: BrainCircuit },
  { message: "Generating AI Report...", icon: FileText },
];

export default function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* Animated orb */}
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {React.createElement(STEPS[currentStep].icon, { className: "w-8 h-8 text-primary" })}
            </motion.div>
          </div>
        </div>

        {/* Current message */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <h2 className="text-lg font-heading font-semibold text-foreground">
            {STEPS[currentStep].message}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Please wait while AI processes your data</p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx <= currentStep ? "w-8 bg-primary" : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 mt-6">
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}