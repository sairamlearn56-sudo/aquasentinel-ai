import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";

const VoiceContext = createContext(null);

const LOCALE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  bn: "bn-IN",
};

export function VoiceProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [voiceMode, setVoiceMode] = useState("");
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setIsSpeaking(false);
    setIsLoading(false);
    setCurrentText("");
    setVoiceMode("");
  }, [cleanup]);

  const speakBrowserTTS = useCallback((text, lang, speed) => {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Voice not supported on this device.");
      setIsLoading(false);
      return false;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_MAP[lang] || "en-IN";
    utterance.rate = Math.min(speed || 0.9, 0.95);
    utterance.pitch = 0.92;
    utterance.volume = 1.0;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      setIsSpeaking(false);
      setCurrentText("");
      setVoiceMode("");
      utteranceRef.current = null;
    };

    utterance.onend = finish;
    utterance.onerror = () => {
      finish();
      setVoiceError("Browser voice playback failed.");
    };

    utteranceRef.current = utterance;
    setIsLoading(false);
    setIsSpeaking(true);
    setVoiceMode("browser");
    window.speechSynthesis.speak(utterance);

    // Safety: if speech doesn't actually start within 3s, report failure
    fallbackTimerRef.current = setTimeout(() => {
      if (!finished && !window.speechSynthesis.speaking) {
        finish();
        setVoiceError("Voice playback could not start. Tap the chat to enable audio.");
      }
    }, 3000);

    return true;
  }, []);

  const speak = useCallback(async (text, lang = "en", speed = 0.9, mode = "chat") => {
    // Stop any currently playing audio
    cleanup();
    setVoiceError("");
    setCurrentText(text);
    setIsLoading(true);

    try {
      const response = await base44.functions.invoke("elevenLabsTTS", {
        text,
        language: lang,
        speed,
        mode,
      });

      // Check for error in response body (non-throwing error)
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      const { audio, content_type } = response.data;
      if (!audio) {
        throw new Error("No audio data received from voice service.");
      }

      // Convert base64 audio to a playable Blob
      const byteCharacters = atob(audio);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: content_type || "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);

      const audioEl = new Audio(audioUrl);
      audioRef.current = audioEl;

      audioEl.onended = () => {
        setIsSpeaking(false);
        setCurrentText("");
        setVoiceMode("");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audioEl.onerror = () => {
        setIsSpeaking(false);
        setCurrentText("");
        setVoiceMode("");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      setIsLoading(false);
      setIsSpeaking(true);
      setVoiceMode("elevenlabs");

      try {
        await audioEl.play();
      } catch (playErr) {
        if (playErr?.name === "NotAllowedError") {
          // Browser blocked autoplay — fall back to browser TTS
          console.warn("[AquaVoice] Autoplay blocked, falling back to browser TTS");
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          setIsSpeaking(false);
          setVoiceMode("");
          speakBrowserTTS(text, lang, speed);
          return;
        }
        throw playErr;
      }
    } catch (error) {
      console.error("[AquaVoice] ElevenLabs TTS failed:", error?.message || error);

      // Extract useful error message
      const backendError = error?.response?.data?.error || error?.message || "Voice generation failed.";
      console.error("[AquaVoice] Falling back to browser TTS. Reason:", backendError);

      // Fall back to browser SpeechSynthesis
      setIsLoading(false);
      const browserStarted = speakBrowserTTS(text, lang, speed);
      if (!browserStarted) {
        setVoiceError(backendError);
      }
    }
  }, [cleanup, speakBrowserTTS]);

  const clearError = useCallback(() => setVoiceError(""), []);

  React.useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <VoiceContext.Provider
      value={{ speak, stop, isSpeaking, isLoading, currentText, voiceError, clearError, voiceMode }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}