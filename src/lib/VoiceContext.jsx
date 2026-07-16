import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const LOCALE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  bn: "bn-IN",
};

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [voiceError, setVoiceError] = useState(null);
  const audioRef = useRef(null);
  const lastSpeakParams = useRef(null);

  // Initialize a persistent Audio element and unlock it on first user interaction.
  // Reusing the same element is critical for iOS Safari autoplay policy.
  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audioRef.current = new Audio();
    }

    const unlock = () => {
      if (!audioRef.current) return;
      // Play a near-silent clip to unlock the persistent audio element
      audioRef.current.src =
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
      audioRef.current.volume = 0;
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 1;
        })
        .catch(() => {});
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, []);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    cleanupAudio();
    setIsSpeaking(false);
    setIsLoading(false);
    setCurrentText("");
    setVoiceError(null);
  }, [cleanupAudio]);

  // Play an audio URL using the persistent Audio element.
  // Handles autoplay rejection by surfacing a "Tap to enable audio" prompt.
  const playAudioUrl = useCallback(async (audioUrl) => {
    const audioEl = audioRef.current || new Audio();
    audioRef.current = audioEl;

    audioEl.src = audioUrl;
    audioEl.volume = 1;
    audioEl.currentTime = 0;

    audioEl.onended = () => {
      setIsSpeaking(false);
      setCurrentText("");
      if (audioUrl.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    };

    audioEl.onerror = () => {
      console.error("[AquaVoice] Audio playback error:", audioEl.error?.code);
      setIsSpeaking(false);
      setIsLoading(false);
      setCurrentText("");
      setVoiceError("Audio playback failed. Please try again.");
      if (audioUrl.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    };

    setIsLoading(false);
    setIsSpeaking(true);
    setVoiceError(null);

    try {
      await audioEl.play();
    } catch (playError) {
      if (playError?.name === "NotAllowedError") {
        console.warn("[AquaVoice] Autoplay blocked by browser — user gesture required");
        setIsSpeaking(false);
        setVoiceError("Tap to enable audio");
        // Keep the audio element intact so retry() can call play() within the gesture
      } else {
        console.error("[AquaVoice] play() error:", playError?.message);
        setIsSpeaking(false);
        setVoiceError("Playback error. Please try again.");
        if (audioUrl.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
      }
    }
  }, []);

  // Last-resort fallback: browser Speech Synthesis API
  const playBrowserTTS = useCallback((text, lang, speed) => {
    if (!("speechSynthesis" in window)) {
      throw new Error("Browser TTS not supported");
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_MAP[lang] || "en-IN";
    utterance.rate = Math.min(speed || 0.9, 1.0);
    utterance.pitch = 0.92;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentText("");
    };
    utterance.onerror = (e) => {
      console.error("[AquaVoice] Browser TTS error:", e?.error);
      setIsSpeaking(false);
      setIsLoading(false);
      setCurrentText("");
      setVoiceError("Browser voice playback failed.");
    };

    setIsLoading(false);
    setIsSpeaking(true);
    setVoiceError(null);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text, lang = "en", speed = 0.9, mode = "chat") => {
      // Stop any currently playing audio
      cleanupAudio();

      setCurrentText(text);
      setIsLoading(true);
      setIsSpeaking(false);
      setVoiceError(null);
      lastSpeakParams.current = { text, lang, speed, mode };

      // === Attempt 1: ElevenLabs TTS (premium multilingual voice) ===
      try {
        const response = await base44.functions.invoke("elevenLabsTTS", {
          text,
          language: lang,
          speed,
          mode,
        });

        if (response.data?.audio) {
          const { audio, content_type } = response.data;
          // Convert base64 to Blob
          const byteCharacters = atob(audio);
          const byteArray = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: content_type || "audio/mpeg" });
          const audioUrl = URL.createObjectURL(blob);
          await playAudioUrl(audioUrl);
          return;
        }

        if (response.data?.error) {
          throw new Error(response.data.error);
        }
        throw new Error("ElevenLabs returned no audio");
      } catch (elevenError) {
        const elevenMsg =
          elevenError?.response?.data?.error || elevenError?.message || "Unknown error";
        console.warn("[AquaVoice] ElevenLabs TTS failed:", elevenMsg);

        // === Attempt 2: Base44 GenerateSpeech (built-in fallback) ===
        try {
          const result = await base44.integrations.Core.GenerateSpeech({
            text,
            voice: "river",
            language_code: lang,
          });

          if (result?.url) {
            console.log("[AquaVoice] GenerateSpeech succeeded — playing audio");
            await playAudioUrl(result.url);
            return;
          }
          throw new Error("GenerateSpeech returned no URL");
        } catch (genError) {
          console.warn("[AquaVoice] GenerateSpeech failed:", genError?.message || genError);

          // === Attempt 3: Browser Speech Synthesis (last resort) ===
          try {
            console.log("[AquaVoice] Falling back to browser TTS");
            playBrowserTTS(text, lang, speed);
            return;
          } catch (browserError) {
            console.error("[AquaVoice] All TTS methods failed");
            setIsLoading(false);
            setVoiceError("Voice unavailable. Please check your connection.");
          }
        }
      }
    },
    [cleanupAudio, playAudioUrl, playBrowserTTS]
  );

  // Retry voice playback — used when autoplay was blocked or an error occurred.
  // Called from a user gesture (badge click), so play() should succeed.
  const retry = useCallback(() => {
    setVoiceError(null);

    if (audioRef.current && audioRef.current.src) {
      // Retry blocked audio — user gesture is present so play() should work
      setIsSpeaking(true);
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch(() => {
          setVoiceError("Audio still blocked. Please check browser settings.");
          setIsSpeaking(false);
        });
    } else if (lastSpeakParams.current) {
      // No audio element — re-run the full speak pipeline
      const { text, lang, speed, mode } = lastSpeakParams.current;
      speak(text, lang, speed, mode);
    }
  }, [speak]);

  return (
    <VoiceContext.Provider
      value={{ speak, stop, retry, isSpeaking, isLoading, currentText, voiceError }}
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