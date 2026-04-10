"use client";

import { use, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Users, Mic, PhoneOff, Settings, ShieldAlert, Heart, MoreVertical, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/user-context";

// We copy the mockRooms here to match what the community grid shows
const mockRooms = [
  { id: "r1", title: "NoFap Support 90-Day Challenge", participants: 142, active: true, tag: "Addiction", color: "text-aqua", bg: "bg-aqua/10", border: "border-aqua/30" },
  { id: "r2", title: "PCOD Sisters & Natural Relief", participants: 86, active: true, tag: "Women's Health", color: "text-alert-white", bg: "bg-alert-white/10", border: "border-alert-white/30" },
  { id: "r3", title: "Vata Balancing Group", participants: 45, active: false, tag: "Ayurveda", color: "text-silver", bg: "bg-silver/10", border: "border-silver/30" },
  { id: "r4", title: "Anxiety & Exam Stress Vent", participants: 234, active: true, tag: "Mental Health", color: "text-pure-white", bg: "bg-pure-white/10", border: "border-pure-white/30" },
  { id: "r5", title: "Meditation Daily Check-ins", participants: 67, active: true, tag: "Mindfulness", color: "text-aqua", bg: "bg-aqua/10", border: "border-aqua/30" },
  { id: "r6", title: "Recovering from Breakups", participants: 189, active: true, tag: "Relationships", color: "text-pure-white", bg: "bg-pure-white/10", border: "border-pure-white/30" }
];

interface ChatMessage {
  id: string;
  text: string;
  isMe: boolean;
  avatar: string;
  time: string;
}

const mockMessages: ChatMessage[] = [
  { id: "1", text: "Hey everyone. I'm feeling really anxious about relapsing today...", isMe: false, avatar: "🦁", time: "10:02 AM" },
  { id: "2", text: "I hear you, brother. The first 14 days are the hardest.", isMe: false, avatar: "🌿", time: "10:04 AM" },
  { id: "3", text: "Whenever I get an urge I just try to step outside immediately. Changing environment works wonders.", isMe: false, avatar: "🛡️", time: "10:05 AM" }
];

const mockVoices = [
  { id: "v1", avatar: "🧘", speaking: true, volume: 1.0 },
  { id: "v2", avatar: "🌿", speaking: false, volume: 0.2 },
  { id: "v3", avatar: "🌊", speaking: true, volume: 0.6 },
  { id: "v4", avatar: "🦁", speaking: false, volume: 0.1 },
  { id: "v5", avatar: "🦅", speaking: false, volume: 0.1 }
];

export default function RoomPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const roomId = params.id;
  const { user } = useUser();
  
  const room = mockRooms.find(r => r.id === roomId) || mockRooms[0];
  
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isMe: true,
      avatar: user?.avatar || "🪷",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    
    // Simulate someone responding
    if (messages.length % 2 !== 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "bot",
          text: "Stay strong! You've got this. We're all in this journey together.",
          isMe: false,
          avatar: "🌊",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className={`absolute top-0 right-0 w-[40%] h-[40%] ${room.bg} rounded-full blur-[100px] pointer-events-none`} />

      {/* Header */}
      <header className="glass shrink-0 border-b border-white/10 px-4 py-3 sm:px-6 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/community" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-text-secondary hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl truncate text-white">{room.title}</h1>
              {room.active && (
                <div className="w-2 h-2 rounded-full bg-alert-white auto-pulse shrink-0 shadow-[0_0_8px_rgba(255,90,90,0.8)]" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${room.color} bg-white/5`}>
                {room.tag}
              </span>
              <span className="flex items-center gap-1"><Users size={12}/> {room.participants} Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-text-secondary hover:text-white hover:bg-white/10">
            <Heart size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-text-secondary hover:text-white hover:bg-white/10">
            <MoreVertical size={20} />
          </Button>
        </div>
      </header>

      {/* Main Chat Area Split */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Voice Stage (Top on mobile, side on desktop) */}
        <div className="md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/20 shrink-0 flex flex-col h-auto md:h-full overflow-y-auto">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Voice Stage</h2>
            <div className="text-xs px-2 py-1 bg-white/5 text-text-secondary rounded-full flex items-center gap-1.5">
              <Mic size={12} className={room.color} /> Live
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-4 md:grid-cols-3 gap-4">
            {mockVoices.map((v) => (
              <div key={v.id} className="flex flex-col items-center gap-2">
                <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-obsidian border flex items-center justify-center text-xl md:text-2xl z-10 transition-colors ${v.speaking ? room.border + " shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "border-white/10"}`}>
                  {v.avatar}
                  {v.speaking && (
                    <>
                      <div className={`absolute inset-0 rounded-full ${room.bg} animate-ping opacity-75`} style={{ animationDuration: '1.5s' }} />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 hidden md:flex gap-2">
            <Button className="flex-1 bg-white/10 text-white hover:bg-white/20">
              <Mic size={16} className="mr-2" /> Request Mic
            </Button>
            <Button variant="destructive" size="icon">
              <PhoneOff size={16} />
            </Button>
          </div>
        </div>

        {/* Text Chat Feed */}
        <div className="flex-1 flex flex-col min-h-0 bg-transparent">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 scrollbar-hide">
            <div className="text-center mb-6">
              <span className="text-xs text-text-muted bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Today</span>
            </div>
            
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-3 w-full ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-sm mt-1">
                      {msg.avatar}
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-1 max-w-[80%] ${msg.isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs text-text-muted">{msg.time}</span>
                    </div>
                    <div className={`p-3.5 sm:p-4 rounded-2xl text-[15px] leading-relaxed relative ${msg.isMe ? `bg-white text-black rounded-tr-sm` : `bg-white/10 border border-white/5 text-white rounded-tl-sm`}`}>
                      {msg.text}
                    </div>
                  </div>

                  {msg.isMe && (
                    <div className="w-8 h-8 rounded-full bg-aqua/20 border border-aqua/40 flex items-center justify-center shrink-0 text-sm mt-1">
                      {msg.avatar}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 sm:p-6 bg-background/80 backdrop-blur-xl border-t border-white/10 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-end max-w-4xl mx-auto relative">
              <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 sm:h-12 w-10 sm:w-12 rounded-full text-text-muted hover:text-white bg-white/5 mb-0.5">
                <ShieldAlert size={18} />
              </Button>
              
              <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl sm:rounded-3xl p-1 pr-1.5 flex items-end focus-within:border-aqua/50 focus-within:ring-1 focus-within:ring-aqua/30 transition-all">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Share anonymously..." 
                  className="border-0 bg-transparent min-h-12 text-white placeholder:text-text-muted px-4 py-3 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button 
                  type="submit" 
                  disabled={!inputValue.trim()}
                  className={`h-10 sm:h-12 w-10 sm:w-12 rounded-full shrink-0 mb-1 sm:mb-0 transition-all ${inputValue.trim() ? "bg-white text-black hover:bg-gray-200" : "bg-white/10 text-white/30"}`}
                >
                  <Send size={18} className={inputValue.trim() ? "translate-x-0.5" : ""} />
                </Button>
              </div>
            </form>
            <div className="text-center mt-3 hidden sm:block">
              <p className="text-[10px] text-text-muted tracking-wide flex items-center justify-center gap-1.5 uppercase font-bold">
                <Lock size={10} /> Sessions are untraceable and auto-deleted
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
