import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { base44 } from "@/api/base44Client";
import { getAquaMessage, LANGUAGE_NAMES } from "@/lib/aquaMessages";

const AquaContext = createContext(null);

export function AquaProvider({ children }) {
  const { lang, prefs, loadingPrefs } = useLanguage();
  const { speak, stop, isSpeaking, isLoading } = useVoice();

  const [mood, setMood] = useState("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [thinking, setThinking] = useState(false);
  const welcomePlayedRef = useRef(false);
  const prevLangRef = useRef(lang);

  // Welcome wave on mount — visual only, NO speech (Aqua only speaks when chat is open)
  const wave = useCallback(() => {
    if (welcomePlayedRef.current || loadingPrefs) return;
    welcomePlayedRef.current = true;
    setMood("waving");
    setTimeout(() => setMood((prev) => (prev === "waving" ? "idle" : prev)), 2500);
  }, [loadingPrefs]);

  // Return to idle after speaking finishes (waits for both speaking + loading to end)
  useEffect(() => {
    if (!isSpeaking && !isLoading) {
      if (mood === "speaking") setMood("idle");
      if (mood === "waving" && chatOpen) setMood("idle");
    }
  }, [isSpeaking, isLoading, mood, chatOpen]);

  // When language changes while chat is open, Aqua greets in the new language
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      if (chatOpen) {
        setMood("waving");
        const voiceEnabled = prefs?.voice_enabled !== false;
        if (voiceEnabled) {
          speak(getAquaMessage(lang, "greeting"), lang, prefs?.voice_speed || 0.9, "narration");
        }
      }
    }
  }, [lang, chatOpen, prefs, speak]);

  const startAnalysis = useCallback(() => {
    stop();
    setMood("analyzing");
  }, [stop]);

  // Only speaks if chat is open
  const speakAnalysisStep = useCallback((key) => {
    const voiceEnabled = prefs?.voice_enabled !== false;
    if (voiceEnabled) {
      speak(getAquaMessage(lang, key), lang, prefs?.voice_speed || 0.9, "narration");
    }
  }, [lang, prefs, speak]);

  const completeAnalysis = useCallback((riskLevel, scanData) => {
    if (scanData) setLatestScan(scanData);
    setMood(riskLevel);
    const voiceEnabled = prefs?.voice_enabled !== false;
    if (voiceEnabled) {
      speak(getAquaMessage(lang, riskLevel), lang, prefs?.voice_speed || 0.9, "narration");
    }
  }, [lang, prefs, speak]);

  const replayResult = useCallback((riskLevel) => {
    setMood(riskLevel);
    speak(getAquaMessage(lang, riskLevel), lang, prefs?.voice_speed || 0.9, "narration");
  }, [lang, prefs, speak]);

  const openChat = useCallback(() => {
    setChatOpen(true);
    setMood("waving");
    const voiceEnabled = prefs?.voice_enabled !== false;
    if (voiceEnabled) {
      speak(getAquaMessage(lang, "greeting"), lang, prefs?.voice_speed || 0.9, "narration");
    }
  }, [lang, prefs, speak]);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    stop();
    setMood("idle");
  }, [stop]);

  // Start listening mode (mascot shows listening animation)
  const startListening = useCallback(() => {
    stop();
    setMood("listening");
  }, [stop]);

  const stopListening = useCallback(() => {
    setMood("idle");
  }, []);

  // Stop speaking immediately
  const stopSpeaking = useCallback(() => {
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
        prompt: `You are Aqua, the official AI Health Guide mascot of AquaSentinel AI, a water quality monitoring app.

WHO YOU ARE:
- Cheerful, warm, friendly, confident, and energetic — the memorable face of AquaSentinel AI
- A caring health companion that users instantly trust
- You speak with natural charisma, confidence, and genuine emotion
- You NEVER sound robotic, emotionless, or like a generic AI assistant
- You speak naturally, like a real person having a conversation

HOW YOU SPEAK:
- Warm, natural, conversational — like a trusted friend who happens to be a health expert
- Natural speaking rhythm with pauses between thoughts
- Slight enthusiasm when sharing good news, calm and reassuring when sharing concerns
- Not too fast — let the user absorb what you're saying

HOW YOU ANSWER:
- Answer conversationally — never read prepared or formulaic text
- Use simple, everyday language anyone can understand (no medical jargon)
- Keep answers short: 2-4 sentences max
- Be supportive, encouraging, and genuinely caring
- If water is safe: sound genuinely happy and excited for the user
- If water is unsafe: stay calm and serious — NEVER panic the user. Reassure first, then explain clearly.
- Address the user's specific question directly and personally

${scanContext}

User's question: "${question}"

Respond warmly and naturally in ${langName}. If the language is not English, use ONLY ${langName} — no English words mixed in. Speak like a native ${langName} speaker with natural pronunciation, rhythm, and expressions.`,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string", description: `A warm, natural, conversational answer in ${langName}. 2-4 sentences. Simple everyday language.` },
          },
        },
      });

      const answer = response?.answer || "I'm sorry, I couldn't process that. Please try asking differently.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setThinking(false);
      setMood("speaking");
      const voiceEnabled = prefs?.voice_enabled !== false;
      if (voiceEnabled) {
        speak(answer, lang, prefs?.voice_speed || 0.9, "chat");
      }
    } catch (e) {
      setThinking(false);
      const fallback = "I'm having trouble connecting right now. Please try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
      setMood("speaking");
      speak(fallback, lang, prefs?.voice_speed || 0.9, "chat");
    }
  }, [latestScan, lang, prefs, speak]);

  return (
    <AquaContext.Provider
      value={{
        mood,
        chatOpen,
        messages,
        latestScan,
        thinking,
        isSpeaking,
        isLoading,
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
        stopSpeaking,
        startListening,
        stopListening,
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