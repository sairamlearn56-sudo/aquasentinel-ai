import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Trash2, Copy, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";

const SUGGESTED_PROMPTS = [
  "Is this water safe to drink?",
  "Why is turbidity high?",
  "What diseases can occur from contaminated water?",
  "How can contamination be reduced?",
  "What should the community do?",
  "Explain the water quality score",
];

export default function AIHealthAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = async (question) => {
    const q = question || input;
    if (!q.trim() || thinking) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setThinking(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Aqua, a professional AI Health Assistant for the AquaSentinel AI water quality monitoring platform. You provide expert guidance on water safety, disease prevention, and public health.

Your expertise:
- Water quality analysis (pH, TDS, turbidity, temperature)
- Water-borne diseases (cholera, typhoid, diarrhea, hepatitis A, dysentery)
- Preventive measures and water treatment
- Government health recommendations (WHO standards)
- Explaining AI predictions and sensor values

Guidelines:
- Be professional, clear, and concise
- Use simple language that everyone can understand
- Provide actionable advice
- Reference WHO standards when relevant
- Structure longer responses with bullet points

User question: "${q}"

Provide a helpful, professional response.`,
        response_json_schema: { type: "object", properties: { answer: { type: "string" } } },
      });
      const answer = response?.answer || "I apologize, but I couldn't process your request. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setThinking(false);
    }
  };

  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <PageHeader
        title="AI Health Assistant"
        subtitle="Professional water safety guidance and disease prevention tips"
        icon={Bot}
        actions={
          messages.length > 0 && (
            <button onClick={clearChat} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 text-sm font-medium hover:bg-muted/50 border border-border">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )
        }
      />

      <div className="premium-card flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: 400 }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-base font-heading font-semibold mb-1">Ask Aqua AI</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">Your professional healthcare assistant for water safety, disease prevention, and AI prediction explanations.</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button key={i} onClick={() => ask(prompt)} className="text-xs px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-primary hover:bg-primary/10 transition-colors">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex items-start gap-2"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`group relative rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/40 rounded-tl-sm"}`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_li]:mb-1 [&_strong]:text-foreground">{msg.content}</ReactMarkdown>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                    {msg.role === "assistant" && (
                      <button onClick={() => copyMessage(msg.content, i)} className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Copy">
                        {copiedIdx === i ? <Check className="w-3 h-3 text-safe" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {thinking && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              </div>
              <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="Ask about water safety, diseases, predictions..."
              disabled={thinking}
              className="flex-1 bg-muted/30 rounded-xl px-4 py-2.5 text-sm border border-transparent focus:border-primary/30 outline-none disabled:opacity-50"
            />
            <button onClick={() => ask()} disabled={!input.trim() || thinking} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}