import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const VoiceContext = createContext(null);

// Language → BCP-47 locale (Indian variants for native pronunciation)
const LOCALE_MAP = {
  en: "en-IN", // Indian English
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  bn: "bn-IN",
};

// Voice name patterns that indicate male voices across platforms
const MALE_PATTERNS = [
  /male/i,
  /ravi|karthik|arjun|pratham|hemanth|daniel|thomas|james|alex|david|mark|oliver|george|fred|aaron|jorge|inigo/i,
];

const FEMALE_PATTERNS = [
  /female/i,
  /samantha|victoria|karen|tessa|fiona|meera|heera|kalpana|laila|sara|susan|allison|ava|zira|ananya|swara/i,
];

function getLocale(lang) {
  return LOCALE_MAP[lang] || "en-IN";
}

function isMaleVoice(name) {
  return MALE_PATTERNS.some((p) => p.test(name));
}

function isFemaleVoice(name) {
  return FEMALE_PATTERNS.some((p) => p.test(name));
}

// Pick the best available voice: prefer male, prefer native locale
function pickBestVoice(lang, voices) {
  if (!voices || !voices.length) return null;
  const locale = getLocale(lang);
  const prefix = locale.split("-")[0];

  const exactMatches = voices.filter((v) => v.lang === locale);
  const prefixMatches = voices.filter((v) => v.lang.startsWith(prefix));
  const langVoices = exactMatches.length ? exactMatches : prefixMatches;

  if (!langVoices.length) return null;

  // Prefer male voices
  const maleVoices = langVoices.filter((v) => isMaleVoice(v.name || ""));
  if (maleVoices.length) {
    const googleMale = maleVoices.find((v) => /google/i.test(v.name || ""));
    return googleMale || maleVoices[0];
  }

  // Prefer non-female (potentially neutral/male) voices
  const nonFemale = langVoices.filter((v) => !isFemaleVoice(v.name || ""));
  if (nonFemale.length) {
    const google = nonFemale.find((v) => /google/i.test(v.name || ""));
    return google || nonFemale[0];
  }

  // Fallback: prefer Google voice, else first match
  const google = langVoices.find((v) => /google/i.test(v.name || ""));
  return google || langVoices[0];
}

export function VoiceProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [voices, setVoices] = useState([]);

  // Load voices (some browsers load asynchronously via voiceschanged event)
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const speak = useCallback(
    (text, lang = "en", speed = 0.9) => {
      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      setCurrentText(text);
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);

      // Pick best voice for this language (prefer male, native locale)
      const currentVoices = voices.length ? voices : window.speechSynthesis.getVoices();
      const voice = pickBestVoice(lang, currentVoices);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = getLocale(lang);
      }

      // Natural speech parameters — calm, warm, not too fast
      const isRegional = lang !== "en";
      utterance.rate = isRegional ? Math.min(0.85, speed) : Math.min(0.9, speed);
      utterance.pitch = 0.92; // Slightly lower for warm, confident male tone
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
    },
    [voices]
  );

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