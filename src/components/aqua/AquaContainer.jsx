import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, MessageCircle, Loader2, CheckCircle2, Brain, Volume2 } from "lucide-react";
import { useAqua } from "@/lib/AquaContext";
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
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    if (isSpeaking || isLoading) {
      stopSpeaking();
      return;
    }
    if (thinking) return;

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

  const showStop = listening || isSpeaking || isLoading || mood === "analyzing";
  const isGeneratingVoice = isLoading && !isSpeaking;

  // Determine state label + icon
  let stateLabel = "Ready";
  let StateIcon = CheckCircle2;
  let stateColor = "text-emerald-400";

  if (listening) {
    stateLabel = "Listening...";
    StateIcon = Mic;
    stateColor = "text-blue-400";
  } else if (thinking) {
    stateLabel = "Thinking...";
    StateIcon = Brain;
    stateColor = "text-cyan-400";
  } else if (isGeneratingVoice) {
    stateLabel = "Generating Voice...";
    StateIcon = Loader2;
    stateColor = "text-purple-400";
  } else if (isSpeaking) {
    stateLabel = "Speaking...";
    StateIcon = Volume2;
    stateColor = "text-cyan-400";
  }

  return (
    <>
      {/* Compact floating assistant panel — bottom-left, fixed */}
      <div className="fixed bottom-3 left-3 lg:left-72 z-40 pointer-events-auto flex flex-col items-center gap-1.5">
        {/* Aqua mascot */}
        <AquaMascot mood={mood} onClick={chatOpen ? closeChat : openChat} />

        {/* State indicator badge */}
        <motion.div
          key={stateLabel}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="px-2.5 py-1 rounded-full glass border border-border/40 text-[10px] font-medium text-muted-foreground flex items-center gap-1 whitespace-nowrap"
        >
          <StateIcon className={`w-2.5 h-2.5 ${stateColor} ${thinking || isGeneratingVoice ? "animate-spin" : ""}`} />
          {stateLabel}
        </motion.div>

        {/* Ask button — compact pill */}
        <button
          onClick={handleAskClick}
          disabled={thinking}
          className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden bg-gradient-to-r from-primary to-teal text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Mic className="w-3 h-3 relative z-10" />
          <span className="relative z-10">Ask</span>
        </button>

        {/* Stop button — only visible when active */}
        <AnimatePresence>
          {showStop && (
            <motion.button
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 2 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (listening) {
                  recognitionRef.current?.stop();
                } else {
                  stopSpeaking();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-danger/90 text-white shadow-md shadow-danger/20 hover:bg-danger hover:shadow-lg hover:shadow-danger/30 hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              Stop
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat toggle — small icon */}
        <button
          onClick={chatOpen ? closeChat : openChat}
          className="mt-0.5 w-7 h-7 rounded-full glass border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
          title="Open chat"
        >
          <MessageCircle className="w-3 h-3" />
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && <AquaChat onClose={closeChat} />}
      </AnimatePresence>
    </>
  );
}