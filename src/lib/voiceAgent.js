// AquaVoice AI — Multilingual voice guidance system
// Uses browser Speech Synthesis API for instant, multilingual, comforting voice

import { LANGUAGES } from "./i18n";

// Map our language codes to BCP-47 voice codes
function getVoiceCode(lang) {
  const langConfig = LANGUAGES.find((l) => l.code === lang);
  return langConfig?.voiceCode || "en-US";
}

// Find the best available voice for a language
function pickBestVoice(voiceCode) {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Try exact match first
  let voice = voices.find((v) => v.lang === voiceCode);
  if (voice) return voice;

  // Try language prefix match (e.g., "hi" matches "hi-IN")
  const prefix = voiceCode.split("-")[0];
  voice = voices.find((v) => v.lang.startsWith(prefix));
  if (voice) return voice;

  // Fallback to default
  return voices[0];
}

// Speak text in the specified language
export function speak(text, lang = "en", speed = 0.9) {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voiceCode = getVoiceCode(lang);
  const voice = pickBestVoice(voiceCode);

  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = voiceCode;
  utterance.rate = speed;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Slightly slower for comfort, slightly higher pitch for warmth
  if (lang !== "en") {
    utterance.rate = Math.max(0.7, speed - 0.05);
  }

  window.speechSynthesis.speak(utterance);
}

// Stop any ongoing speech
export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Check if speech synthesis is available
export function isVoiceSupported() {
  return "speechSynthesis" in window;
}

// Preload voices (some browsers need this)
export function preloadVoices() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
}