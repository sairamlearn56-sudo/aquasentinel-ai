import React from "react";
import { Volume2, Square } from "lucide-react";
import { useVoice } from "@/lib/VoiceContext";

export default function VoiceIndicator() {
  const { isSpeaking, currentText, stop } = useVoice();

  // Aqua panel now handles all speaking indicators (waveform, state badge, stop button)
  return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-scale">
      <div className="glass-strong rounded-2xl p-4 shadow-xl border border-primary/20 max-w-sm flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Volume2 className="w-5 h-5 text-primary animate-pulse-soft" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ripple" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-primary mb-0.5">AquaVoice AI</p>
          <p className="text-xs text-muted-foreground truncate">{currentText}</p>
        </div>
        <button
          onClick={stop}
          className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <Square className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}