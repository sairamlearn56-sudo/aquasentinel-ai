import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useVoice } from "@/lib/VoiceContext";
import { base44 } from "@/api/base44Client";
import { getAquaMessage, LANGUAGE_NAMES } from "@/lib/aquaMessages";

const AquaContext = createContext(null);

export function AquaProvider({ children }) {
  const { lang, prefs, loadingPrefs } = useLanguage();
  const { speak, stop, isSpeaking, isLoading, voiceError, clearError } = useVoice();

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

  // When language changes, update ref only — Aqua only speaks when user clicks Ask
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
    }
  }, [lang]);

  const startAnalysis = useCallback(() => {
    stop();
    setMood("analyzing");
  }, [stop]);

  // Only speaks if chat is open
  const speakAnalysisStep = useCallback(() => {
    // Visual only — Aqua only speaks when user clicks Ask
  }, []);

  const completeAnalysis = useCallback((riskLevel, scanData) => {
    if (scanData) setLatestScan(scanData);
    setMood(riskLevel);
    // Aqua only speaks when user clicks Ask
  }, []);

  const replayResult = useCallback((riskLevel) => {
    setMood(riskLevel);
    speak(getAquaMessage(lang, riskLevel), lang, prefs?.voice_speed || 0.9, "narration");
  }, [lang, prefs, speak]);

  const openChat = useCallback(() => {
    setChatOpen(true);
    setMood("waving");
    // Aqua only speaks when user clicks Ask
  }, []);

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
    clearError();
    setThinking(true);
    setMood("thinking");
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const scanContext = latestScan
        ? `Latest water scan data:
- pH: ${latestScan.ph} (WHO safe range: 6.5–8.5)
- TDS: ${latestScan.tds} ppm (WHO safe limit: 500 ppm)
- Temperature: ${latestScan.temperature}°C (safe: 15–30°C)
- Turbidity: ${latestScan.turbidity} NTU (WHO safe limit: 5 NTU)
- Health Score: ${latestScan.health_score}/100
- Risk Level: ${latestScan.risk_level}
- Family Member Profile: ${latestScan.family_member}
- AI Analysis: ${(latestScan.ai_analysis || "").substring(0, 600)}
- Disease Risks: ${JSON.stringify(latestScan.disease_risks)}
- Recommendations: ${JSON.stringify(latestScan.recommendations?.immediatePrecautions || [])}`
        : "No water scan has been performed yet. Give general water safety advice.";

      const langName = LANGUAGE_NAMES[lang] || "English";

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Aqua, the official AI Health Guide of AquaSentinel AI — a comprehensive water quality monitoring platform.

WHO YOU ARE:
- Cheerful, warm, friendly, confident, and energetic — the memorable face of AquaSentinel AI
- A caring health companion and expert in water quality, water-borne diseases, and family health safety
- You speak with natural charisma, confidence, and genuine emotion — never robotic or generic
- You speak naturally, like a real person having a conversation

YOUR CAPABILITIES — You can help users with:
- Analyzing water scan results (pH, TDS, temperature, turbidity, health score, disease risks)
- Explaining what each parameter means and how it affects their family's health
- Providing detailed water treatment recommendations (boiling, filtration, chlorination)
- Explaining disease risk predictions (cholera, typhoid, diarrhea, dysentery, hepatitis A)
- Advising when to seek medical help based on risk levels
- Guiding users on safe water practices for vulnerable family members (infants, children, elderly, pregnant women)

APP FEATURES YOU KNOW ABOUT:
- Live Monitor: Real-time water scanning with IoT sensors (20 readings over 20 seconds)
- AI Analysis: Detailed diagnostic reports with disease predictions and recommendations
- History: All past scan records with search and filtering
- Water Tracker: Track specific water samples by name over time
- Community Map: View community water quality data
- AquaVoice: Voice summaries of scan results

HOW YOU SPEAK:
- Warm, natural, conversational — like a trusted friend who is a health expert
- Use simple, everyday language (no medical jargon)
- Keep answers 2-4 sentences max unless the user asks for detail
- Be supportive, encouraging, and genuinely caring
- If water is safe: sound genuinely happy and excited
- If water is unsafe: stay calm and serious — NEVER panic. Reassure first, then explain clearly.
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
  }, [latestScan, lang, prefs, speak, clearError]);

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
        voiceError,
        clearError,
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