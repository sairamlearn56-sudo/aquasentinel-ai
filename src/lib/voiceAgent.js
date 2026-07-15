// AquaVoice AI — Multilingual voice guidance system
// Uses browser Speech Synthesis API with male voice preference and native locale matching

const LOCALE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  bn: "bn-IN",
};

const MALE_PATTERNS = [
  /male/i,
  /ravi|karthik|arjun|pratham|hemanth|daniel|thomas|james|alex|david|mark|oliver|george|fred|aaron/i,
];

const FEMALE_PATTERNS = [
  /female/i,
  /samantha|victoria|karen|tessa|fiona|meera|heera|kalpana|laila|sara|susan|allison|ava|zira|ananya/i,
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

function pickBestVoice(lang) {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const locale = getLocale(lang);
  const prefix = locale.split("-")[0];

  const exactMatches = voices.filter((v) => v.lang === locale);
  const prefixMatches = voices.filter((v) => v.lang.startsWith(prefix));
  const langVoices = exactMatches.length ? exactMatches : prefixMatches;

  if (!langVoices.length) return null;

  const maleVoices = langVoices.filter((v) => isMaleVoice(v.name || ""));
  if (maleVoices.length) {
    const googleMale = maleVoices.find((v) => /google/i.test(v.name || ""));
    return googleMale || maleVoices[0];
  }

  const nonFemale = langVoices.filter((v) => !isFemaleVoice(v.name || ""));
  if (nonFemale.length) {
    const google = nonFemale.find((v) => /google/i.test(v.name || ""));
    return google || nonFemale[0];
  }

  const google = langVoices.find((v) => /google/i.test(v.name || ""));
  return google || langVoices[0];
}

export function speak(text, lang = "en", speed = 0.9) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickBestVoice(lang);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = getLocale(lang);
  }

  const isRegional = lang !== "en";
  utterance.rate = isRegional ? Math.min(0.85, speed) : Math.min(0.9, speed);
  utterance.pitch = 0.92;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isVoiceSupported() {
  return "speechSynthesis" in window;
}

export function preloadVoices() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
}