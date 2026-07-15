import React from "react";
import { motion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function LiveScanSequence({
  progress,
  total = 20,
  isPaused,
  elapsedSeconds,
  onStop,
  onResume,
  onCancel,
}) {
  const percent = Math.min((progress / total) * 100, 100);
  const remainingSeconds = Math.max(0, total - progress);
  // Water fill: droplet SVG viewBox is 0 0 100 120; fill y goes from 120 (empty) to 5 (full)
  const waterY = 120 - (percent / 100) * 115;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[500px]">
      {/* ===== Premium Water Droplet Scanner ===== */}
      <div className="relative w-52 h-52 mb-8">
        {/* Outer rotating dashed ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle counter-rotating ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        {/* Pulsing ripple rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/15"
            style={{ animation: `ripple 3s ease-out infinite`, animationDelay: `${i * 1}s` }}
          />
        ))}

        {/* Droplet with water fill */}
        <div className="absolute inset-8 flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-full h-full" style={{ maxHeight: 140 }}>
            <defs>
              <clipPath id="dropletClip">
                <path d="M50 5 C50 5, 15 50, 15 75 C15 95, 30 110, 50 110 C70 110, 85 95, 85 75 C85 50, 50 5, 50 5 Z" />
              </clipPath>
              <linearGradient id="waterFill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="hsl(194 100% 50%)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="hsl(175 59% 55%)" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Water fill — rises with progress */}
            <g clipPath="url(#dropletClip)">
              <rect x="0" width="100" height="120" fill="url(#waterFill)" y={waterY} />
              {/* Wave surface */}
              <path
                d={`M0 ${waterY} Q25 ${waterY - 3}, 50 ${waterY} T100 ${waterY} L100 ${waterY + 4} L0 ${waterY + 4} Z`}
                fill="url(#waterFill)"
                opacity="0.8"
              />
            </g>

            {/* Droplet outline */}
            <path
              d="M50 5 C50 5, 15 50, 15 75 C15 95, 30 110, 50 110 C70 110, 85 95, 85 75 C85 50, 50 5, 50 5 Z"
              fill="none"
              stroke="hsl(194 100% 50%)"
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Scan beam (when actively scanning) */}
        {!isPaused && progress < total && (
          <div className="absolute inset-8 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}

        {/* Center reading counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-primary">{progress}</span>
          <span className="text-xs text-muted-foreground font-medium">/ {total}</span>
        </div>
      </div>

      {/* ===== Status text ===== */}
      <motion.div
        key={isPaused ? "paused" : "scanning"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className={`text-xl font-bold ${isPaused ? "text-warning" : "text-primary"}`}>
          {isPaused ? "Scan Paused" : "Scanning Water..."}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {isPaused
            ? "Press Resume to continue or Cancel to discard"
            : "Collecting sensor readings from ESP32"}
        </p>
      </motion.div>

      {/* ===== Progress bar ===== */}
      <div className="w-full max-w-md mb-4">
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ===== Time + counter info ===== */}
      <div className="flex items-center gap-4 sm:gap-6 mb-8 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Readings:</span>
          <span className="font-bold text-foreground">
            {progress}/{total}
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Elapsed:</span>
          <span className="font-bold text-foreground">{formatTime(elapsedSeconds)}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Remaining:</span>
          <span className="font-bold text-foreground">{formatTime(remainingSeconds)}</span>
        </div>
      </div>

      {/* ===== Controls ===== */}
      {isPaused ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={onResume}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Resume Monitoring
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel Scan
          </button>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onStop}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-danger text-white font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Pause className="w-4 h-4 fill-current" />
          Stop Monitoring
        </motion.button>
      )}
    </div>
  );
}