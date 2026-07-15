import React, { createContext, useContext, useState, useCallback } from "react";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");

  const speak = useCallback((text, lang = "en", speed = 0.9) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    setCurrentText(text);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find best voice for language
    const voiceCode = lang === "en" ? "en-US" : `${lang}-IN`;
    const prefix = voiceCode.split("-")[0];
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang === voiceCode) || voices.find((v) => v.lang.startsWith(prefix));
    
    if (voice) utterance.voice = voice;
    utterance.lang = voiceCode;
    utterance.rate = lang !== "en" ? Math.max(0.75, speed - 0.05) : speed;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentText("");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentText("");
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentText("");
    }
  }, []);

  return (
    <VoiceContext.Provider value={{ speak, stop, isSpeaking, currentText }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}