import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, MessageCircle } from "lucide-react";
import { useAqua } from "@/lib/AquaContext";
import { useLanguage } from "@/lib/LanguageContext";
import AquaMascot from "@/components/aqua/AquaMascot";
import AquaChat from "@/components/aqua/AquaChat";

export default function AquaContainer() {
  const {
    mood,
    chatOpen,
    openChat,
    closeChat,
    wave,
    askQuestion,
    startListening,
    stopListening,
    stopSpeaking,
    thinking,
    isSpeaking,
    isLoading,
    lang,
  } = useAqua();

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => wave(), 800);
    return () => clearTimeout(timer);
  }, [wave]);

  const handleAskClick = () => {
    // If listening → stop
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    // If speaking → stop
    if (isSpeaking || isLoading) {
      stopSpeaking();
      return;
    }
    if (thinking) return;

    // Start listening
    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      openChat();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "en" ? "en-IN" : `${lang}-IN`;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      stopListening();
      askQuestion(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
      stopListening();
    };
    recognition.onend = () => {
      setListening(false);
      stopListening();
    };

    recognitionRef.current = recognition;
    setListening(true);
    startListening();
    recognition.start();
  };

  const showStop = listening || isSpeaking || isLoading;

  return (
    <>
      {/* Mascot + Ask/Stop button — always visible, bottom-left */}
      <div className="fixed bottom-3 left-3 lg:left-72 z-40 pointer-events-auto flex items-end gap-3">
        <AquaMascot mood={mood} onClick={chatOpen ? closeChat : openChat} />

        {/* Ask / Stop button */}
        <div className="mb-3 flex flex-col gap-2">
          <button
            onClick={handleAskClick}
            disabled={thinking}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              showStop
                ? "bg-danger text-white shadow-lg shadow-danger/30 hover:bg-danger/90"
                : "bg-gradient-to-r from-primary to-teal text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 animate-glow-pulse"
            }`}
          >
            {thinking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : showStop ? (
              <Square className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span>{thinking ? "Thinking" : showStop ? "Stop" : "Ask"}</span>
          </button>

          {/* Chat toggle — small icon button */}
          <button
            onClick={chatOpen ? closeChat : openChat}
            className="self-start flex items-center justify-center w-9 h-9 rounded-full glass border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            title="Open chat"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat window — optional */}
      <AnimatePresence>
        {chatOpen && <AquaChat onClose={closeChat} />}
      </AnimatePresence>
    </>
  );
}