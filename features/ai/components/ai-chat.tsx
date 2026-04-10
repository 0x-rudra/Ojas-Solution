"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "initial-greeting",
  role: "assistant",
  content: "Hello! I am Ojas AI, your secure wellness companion. Your secrets are completely safe with me. What's on your mind today?",
};

export function AiChat() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("guide");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false); // true while waiting for first token
  const [error, setError] = useState<Error | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateMode = (m: string) => setMode(m);

  // Custom streaming send — mode is embedded directly in every request
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsStreaming(true);
    setIsWaiting(true);  // show dots animation immediately
    setError(null);

    const assistantId = (Date.now() + 1).toString();

    try {
      abortRef.current = new AbortController();

      const apiMessages = allMessages.map(m => ({
        id: m.id,
        role: m.role,
        parts: [{ type: "text", text: m.content }],
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, mode }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) throw new Error("API request failed");

      // Add the empty assistant placeholder only AFTER we confirm the response started
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);
      setIsWaiting(false); // first token arriving — hide dots, show streaming text

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Plain text stream — just decode and append each chunk directly
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m)
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err as Error);
        setMessages(prev => prev.filter(m => m.id !== assistantId));
      }
    } finally {
      setIsStreaming(false);
      setIsWaiting(false);
    }
  }, [messages, mode, isStreaming]);

  const handleFormSubmit = () => {
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const isInitialState = messages.length === 1;
  const suggestedQueries = [
    "What are natural Ayurvedic remedies for severe period cramps?",
    "How do I manage performance anxiety safely?",
    "How to maintain hormonal balance during PCOD?",
    "How to handle strong urges during NoFap recovery?"
  ];

  const getGlowColors = () => {
    if (mode === "healer") return "bg-blue-600/40";
    if (mode === "guardian") return "bg-purple-600/40";
    return "bg-emerald-600/40";
  };

  const getSecondaryGlow = () => {
    if (mode === "healer") return "bg-cyan-500/20";
    if (mode === "guardian") return "bg-fuchsia-500/20";
    return "bg-teal-500/20";
  };

  const getPageBackground = () => {
    if (mode === "healer") return "bg-blue-950/60";
    if (mode === "guardian") return "bg-purple-950/60";
    return "bg-emerald-950/60";
  };

  return (
    <div className="flex flex-col h-full min-h-[85vh] w-full relative bg-ink-black overflow-hidden transition-colors duration-1000">

      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none z-0 transition-colors duration-1000">
        <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-overlay ${getPageBackground()}`} />
        <div className={`absolute top-[10%] left-[20%] w-125 h-125 rounded-full blur-[140px] animate-pulse-glow transition-colors duration-700 ${getGlowColors()}`} />
        <div className={`absolute bottom-[20%] right-[10%] w-150 h-150 rounded-full blur-[150px] animate-float transition-colors duration-700 ${getSecondaryGlow()}`} style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Mode Selection Menu (Symmetrical Right Side) */}
      <div className="w-full md:w-auto relative md:absolute md:right-6 lg:right-12 xl:right-16 md:top-1/2 md:-translate-y-1/2 flex justify-center md:flex-col gap-4 p-4 md:p-0 z-40 border-b md:border-none border-white/10 bg-black/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none transition-all duration-500">
         {/* Guide Button */}
         <div className="relative group">
            <button
              onClick={() => updateMode("guide")}
              className={`flex justify-center items-center gap-2 max-w-[140px] px-5 py-3 rounded-2xl text-sm font-bold border transition-all duration-300 backdrop-blur-md ${mode === "guide" ? "bg-gradient-to-r from-emerald-600/60 to-teal-500/60 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              🌿 Guide
            </button>
            <div className="absolute right-0 md:right-full top-full md:top-1/2 mt-2 md:mt-0 md:mr-4 md:-translate-y-1/2 w-64 p-4 rounded-2xl bg-ink-black/95 backdrop-blur-xl border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl flex flex-col gap-1.5">
              <span className="font-semibold text-emerald-400 text-sm">Your friendly Ayurvedic companion for everyday concerns.</span>
              <span className="text-gray-300">Gives blunt, practical, and natural solutions to build daily energy and confidence.</span>
              <span className="text-gray-300 font-medium">Perfect when you want simple, actionable advice without judgment.</span>
            </div>
         </div>

         {/* Healer Button */}
         <div className="relative group">
            <button
              onClick={() => updateMode("healer")}
              className={`flex justify-center items-center gap-2 max-w-[140px] px-5 py-3 rounded-2xl text-sm font-bold border transition-all duration-300 backdrop-blur-md ${mode === "healer" ? "bg-gradient-to-r from-blue-600/60 to-cyan-500/60 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              ⚕️ Healer
            </button>
            <div className="absolute right-0 md:right-full top-full md:top-1/2 mt-2 md:mt-0 md:mr-4 md:-translate-y-1/2 w-64 p-4 rounded-2xl bg-ink-black/95 backdrop-blur-xl border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl flex flex-col gap-1.5">
              <span className="font-semibold text-blue-400 text-sm">Steps in when things get deeper and more serious.</span>
              <span className="text-gray-300">Delivers detailed clinical insights combined with powerful Ayurvedic wisdom.</span>
              <span className="text-gray-300 font-medium">Helps you understand the root cause and guides you toward real healing.</span>
            </div>
         </div>

         {/* Guardian Button */}
         <div className="relative group">
            <button
              onClick={() => updateMode("guardian")}
              className={`flex justify-center items-center gap-2 max-w-[140px] px-5 py-3 rounded-2xl text-sm font-bold border transition-all duration-300 backdrop-blur-md ${mode === "guardian" ? "bg-gradient-to-r from-purple-600/60 to-fuchsia-500/60 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              🛡️ Guardian
            </button>
            <div className="absolute right-0 md:right-full top-full md:top-1/2 mt-2 md:mt-0 md:mr-4 md:-translate-y-1/2 w-64 p-4 rounded-2xl bg-ink-black/95 backdrop-blur-xl border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl flex flex-col gap-1.5">
              <span className="font-semibold text-purple-400 text-sm">Your protector in sensitive or high-risk situations.</span>
              <span className="text-gray-300">Carefully analyzes and refers you to the right real doctors with clear next steps.</span>
              <span className="text-gray-300 font-medium">Ensures your safety while maintaining complete privacy and care.</span>
            </div>
         </div>
      </div>

      {/* Main Chat Area Wrapped in a thin bordered rectangle */}
      <div className="flex-1 w-full max-w-4xl mx-auto md:my-6 relative z-10 flex flex-col overflow-hidden border border-white/15 md:rounded-[2rem] bg-black/20 backdrop-blur-md shadow-2xl">
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8">

          {/* Header Alert */}
          <div className="mb-8 mx-auto flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-white/10 border border-warning-white/20 rounded-full text-xs font-medium text-warning-white shadow-sm backdrop-blur-md">
               <AlertTriangle size={14} />
               Ojas AI is educational. For clinical distress, call 14416.
            </div>
          </div>

          {/* Scrollable Thread */}
          <div className="flex flex-col gap-8 pb-4">

          {isInitialState && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center mt-auto mb-16 h-[50vh]"
            >
              <div className="w-20 h-20 bg-linear-to-br from-pure-white/30 to-pure-white/5 border border-pure-white/40 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(108,122,224,0.15)] relative group">
                 <div className="absolute inset-0 bg-pure-white/20 blur-xl rounded-3xl group-hover:bg-pure-white/40 transition-colors" />
                 <Bot size={40} className="text-pure-white relative z-10 drop-shadow-[0_0_8px_rgba(108,122,224,0.8)]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight relative z-10">How can I help you <span className={mode === "healer" ? "text-blue-400" : mode === "guardian" ? "text-purple-400" : "text-emerald-400"}>heal</span> today?</h1>
              <p className="text-text-secondary text-lg font-light max-w-lg mb-12 relative z-10">I am Ojas AI, your secure sanctuary for mental and physical wellness. Everything you say is private.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4 relative z-10">
                 {suggestedQueries.map((q, i) => (
                   <motion.button
                     key={i}
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
                     onClick={() => sendMessage(q)}
                     className="text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pure-white/40 hover:bg-white/10 transition-all text-sm font-medium text-text-secondary hover:text-white"
                   >
                     {q}
                   </motion.button>
                 ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {!isInitialState && messages.map((msg, i) => {
              if (i === 0) return null;
              return <ChatMessage key={msg.id} msg={msg} />;
            })}

            {/* Loading dots — shown while waiting for first token */}
            {isWaiting && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-4 w-full">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-pure-white/20 flex items-center justify-center mt-1 border border-pure-white/30 shadow-[0_0_10px_rgba(108,122,224,0.2)]">
                    <Bot size={16} className="text-pure-white animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 h-10 px-4">
                    <span className="w-2 h-2 rounded-full bg-pure-white/60 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-pure-white/60 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-pure-white/60 animate-bounce [animation-delay:0.3s]" />
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        <div className="p-4 md:px-8 pb-6 border-t border-white/5 bg-black/20">
          <ChatInput
            input={input}
            setInput={setInput}
            isLoading={isStreaming}
            error={error}
            handleSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
}
