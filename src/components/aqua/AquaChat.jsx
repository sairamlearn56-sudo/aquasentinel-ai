import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Loader2, Square } from "lucide-react";
import { useAqua } from "@/lib/AquaContext";
import { useLanguage } from "@/lib/LanguageContext";
import { getAquaMessage, getAquaSuggestions } from "@/lib/aquaMessages";

export default function AquaChat({ onClose }) {
  const {
    messages,
    askQuestion,
    thinking,
    mood,
    isSpeaking,
    isLoading,
    lang,
    stopSpeaking,
    startListening,
    stopListening,
  } = useAqua();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestions = getAquaSuggestions(lang);
  const placeholder = getAquaMessage(lang, "chatPlaceholder");
  const greeting = getAquaMessage(lang, "greeting");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = (text) => {
    const q = text || input;
    if (!q.trim() || thinking) return;
    setInput("");
    askQuestion(q);
  };

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      stopListening();
      return;
    }
    // Stop any ongoing speech before listening
    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "en" ? "en-IN" : `${lang}-IN`;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      stopListening();
      handleSend(transcript);
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

  const showStopBar = isSpeaking || isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.92 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-28 left-4 lg:left-72 z-50 w-[calc(100vw-2rem)] max-w-sm"
    >
      <div className="glass-strong rounded-3xl shadow-2xl border border-border/50 overflow-hidden flex flex-col" style={{ maxHeight: "70vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-aqua/5">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-aqua flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2 C12 2, 5 9, 5 15 C5 18.866, 8.134 22, 12 22 C15.866 22, 19 18.866, 19 15 C19 9, 12 2, 12 2 Z" />
              </svg>
              {(isSpeaking || isLoading) && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white"
                  animate={{ scale: [1, 1.15], opacity: [0.6, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Aqua</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {thinking ? "Thinking..." : isLoading ? "Generating voice..." : isSpeaking ? "Speaking..." : listening ? "Listening..." : "AI Health Guide"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 min-h-[200px]">
          {messages.length === 0 ? (
            <div className="space-y-4">
              {/* Greeting bubble */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <p className="text-sm text-foreground leading-relaxed">{greeting}</p>
                  </div>
                </div>
              </div>
              {/* Suggested questions */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">{getAquaMessage(lang, "suggestedTitle")}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/40 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{getAquaMessage(lang, "thinking")}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Stop Speaking bar */}
        <AnimatePresence>
          {showStopBar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/50"
            >
              <button
                onClick={stopSpeaking}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-danger/10 text-danger hover:bg-danger/15 transition-colors text-sm font-medium"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                {isLoading ? "Generating voice..." : "Stop Speaking"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-3 border-t border-border/50 bg-background/50">
          <div className="flex items-center gap-2">
            {/* Ask button */}
            <button
              onClick={toggleMic}
              disabled={thinking}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm font-medium transition-all disabled:opacity-40 ${
                listening
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <Mic className={`w-4 h-4 ${listening ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">{listening ? "Listening" : "Ask"}</span>
            </button>
            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={listening ? getAquaMessage(lang, "listening") : placeholder}
              disabled={thinking || listening}
              className="flex-1 min-w-0 bg-muted/30 rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30 transition-colors disabled:opacity-50"
            />
            {/* Send button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || thinking}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-aqua text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}