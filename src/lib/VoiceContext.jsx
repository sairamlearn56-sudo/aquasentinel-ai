import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const audioRef = useRef(null);

  const speak = useCallback(async (text, lang = "en", speed = 0.9) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setCurrentText(text);
    setIsLoading(true);

    try {
      const response = await base44.functions.invoke("elevenLabsTTS", {
        text,
        language: lang,
        speed,
      });

      setIsLoading(false);

      if (response.data?.error) {
        console.error("ElevenLabs TTS error:", response.data.error);
        setCurrentText("");
        return;
      }

      const { audio, content_type } = response.data;

      // Convert base64 audio to a playable Blob
      const byteCharacters = atob(audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: content_type || "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);

      const audioEl = new Audio(audioUrl);
      audioRef.current = audioEl;

      audioEl.onended = () => {
        setIsSpeaking(false);
        setCurrentText("");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audioEl.onerror = () => {
        setIsSpeaking(false);
        setCurrentText("");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      setIsSpeaking(true);
      await audioEl.play();
    } catch (error) {
      console.error("ElevenLabs TTS failed:", error);
      setIsLoading(false);
      setIsSpeaking(false);
      setCurrentText("");
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
    setCurrentText("");
  }, []);

  return (
    <VoiceContext.Provider value={{ speak, stop, isSpeaking, isLoading, currentText }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}