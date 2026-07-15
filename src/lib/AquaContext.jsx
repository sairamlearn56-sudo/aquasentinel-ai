import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { base44 } from "@/api/base44Client";
import { getAquaMessage, LANGUAGE_NAMES } from "@/lib/aquaMessages";

const AquaContext = createContext(null);

export function AquaProvider({ children }) {
  const { lang, prefs, loadingPrefs } = useLanguage();
  const { speak, stop, isSpeaking } = useVoice();

  const [mood, setMood] = useState("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [thinking, setThinking] = useState(false);
  const welcomePlayedRef = useRef(false);

  // Welcome — called by AquaContainer on mount (only when authenticated)
  const wave = useCallback(() => {
    if (welcomePlayedRef.current || loadingPrefs) return;
    welcomePlayedRef.current = true;
    const voiceEnabled = prefs?.voice_enabled !== false;
    if (voiceEnabled) {
      setMood("waving");
      speak(getAquaMessage(lang, "welcome"), lang, prefs?.voice_speed || 0.9);
    }
  }, [loadingPrefs, prefs, lang, speak]);

  // Return to idle after speaking (for waving mood)
  useEffect(() => {
    if (!isSpeaking && mood === "waving") {
      setMood("idle");
    }
  }, [isSpeaking, mood]);

  const speakWithMood = useCallback((text, speakMood, afterMood) => {
    setMood(speakMood);
    speak(text, lang, prefs?.voice_speed || 0.9);
    // afterMood is set by the isSpeaking watcher or manually
  }, [lang, prefs, speak]);

  const startAnalysis = useCallback(() => {
    stop();
    setMood("analyzing");
  }, [stop]);

  const speakAnalysisStep = useCallback((key) => {
    speak(getAquaMessage(lang, key), lang, prefs?.voice_speed || 0.9);
  }, [lang, prefs, speak]);

  const completeAnalysis = useCallback((riskLevel, scanData) => {
    if (scanData) setLatestScan(scanData);
    setMood(riskLevel);
    const voiceEnabled = prefs?.voice_enabled !== false;
    if (voiceEnabled) {
      speak(getAquaMessage(lang, riskLevel), lang, prefs?.voice_speed || 0.9);
    }
  }, [lang, prefs, speak]);

  const replayResult = useCallback((riskLevel) => {
    setMood(riskLevel);
    speak(getAquaMessage(lang, riskLevel), lang, prefs?.voice_speed || 0.9);
  }, [lang, prefs, speak]);

  const openChat = useCallback(() => {
    setChatOpen(true);
    setMood("idle");
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    stop();
    setMood("idle");
  }, [stop]);

  const askQuestion = useCallback(async (question) => {
    if (!question.trim()) return;
    setThinking(true);
    setMood("thinking");
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const scanContext = latestScan
        ? `Latest water scan data: pH ${latestScan.ph}, TDS ${latestScan.tds} ppm, temperature ${latestScan.temperature}°C, turbidity ${latestScan.turbidity} NTU, health score ${latestScan.health_score}/100, risk level: ${latestScan.risk_level}. Family member profile: ${latestScan.family_member}.`
        : "No water scan has been performed yet. Give general water safety advice.";

      const langName = LANGUAGE_NAMES[lang] || "English";

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Aqua, a friendly AI Health Guide for the AquaSentinel AI water quality monitoring app. Your personality is warm, caring, and supportive — like a friendly village health worker and a trusted healthcare companion. You explain water quality in simple, non-technical language that anyone can understand. Never use technical jargon. Keep answers short (2-4 sentences). Always be supportive and encouraging.

IMPORTANT: You must respond in ${langName} language only.

${scanContext}

User's question: "${question}"

Answer warmly and simply in ${langName}. Do not use English if the language is not English.`,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string", description: `A warm, simple, non-technical answer in ${langName}` },
          },
        },
      });

      const answer = response?.answer || "I'm sorry, I couldn't process that. Please try asking differently.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setThinking(false);
      setMood("speaking");
      const voiceEnabled = prefs?.voice_enabled !== false;
      if (voiceEnabled) {
        speak(answer, lang, prefs?.voice_speed || 0.9);
      }
    } catch (e) {
      setThinking(false);
      const fallback = "I'm having trouble connecting right now. Please try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
      setMood("speaking");
      speak(fallback, lang, prefs?.voice_speed || 0.9);
    }
  }, [latestScan, lang, prefs, speak]);

  // Return to idle after speaking in chat context
  useEffect(() => {
    if (!isSpeaking && mood === "speaking") {
      setMood(chatOpen ? "idle" : "idle");
    }
  }, [isSpeaking, mood, chatOpen]);

  return (
    <AquaContext.Provider
      value={{
        mood,
        chatOpen,
        messages,
        latestScan,
        thinking,
        isSpeaking,
        lang,
        wave,
        startAnalysis,
        speakAnalysisStep,
        completeAnalysis,
        replayResult,
        openChat,
        closeChat,
        askQuestion,
        setLatestScan,
        setMood,
        stop,
      }}
    >
      {children}
    </AquaContext.Provider>
  );
}

export function useAqua() {
  const ctx = useContext(AquaContext);
  if (!ctx) throw new Error("useAqua must be used within AquaProvider");
  return ctx;
}