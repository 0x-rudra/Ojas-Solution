"use client";

import { motion } from "framer-motion";
import { Users, Lock, ArrowRight, ShieldCheck, Flame, Search } from "lucide-react";
import Link from "next/link";

const mockRooms = [
  { id: "r1", title: "NoFap Support 90-Day Challenge", participants: 142, active: true, tag: "Addiction", color: "text-aqua", bg: "bg-aqua/10", border: "border-aqua/30" },
  { id: "r2", title: "PCOD Sisters & Natural Relief", participants: 86, active: true, tag: "Women's Health", color: "text-alert-white", bg: "bg-alert-white/10", border: "border-alert-white/30" },
  { id: "r3", title: "Vata Balancing Group", participants: 45, active: false, tag: "Ayurveda", color: "text-silver", bg: "bg-silver/10", border: "border-silver/30" },
  { id: "r4", title: "Anxiety & Exam Stress Vent", participants: 234, active: true, tag: "Mental Health", color: "text-pure-white", bg: "bg-pure-white/10", border: "border-pure-white/30" },
  { id: "r5", title: "Meditation Daily Check-ins", participants: 67, active: true, tag: "Mindfulness", color: "text-aqua", bg: "bg-aqua/10", border: "border-aqua/30" },
  { id: "r6", title: "Recovering from Breakups", participants: 189, active: true, tag: "Relationships", color: "text-pure-white", bg: "bg-pure-white/10", border: "border-pure-white/30" }
];

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
      <div className="flex gap-8 relative items-start flex-col">
        
        {/* Dynamic Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6 md:p-8 border-aqua/20 border-b relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-aqua/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="w-full md:w-auto relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3 tracking-tight">
              Live Rooms <Flame className="text-aqua animate-pulse" size={28} />
            </h1>
            <p className="text-text-secondary">Join an active anonymous voice or chat room to heal together.</p>
          </div>
          
          <div className="relative w-full md:w-auto shrink-0 z-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-text-muted" />
            </div>
            <input 
              type="text" 
              placeholder="Search active rooms..." 
              className="w-full md:w-80 bg-obsidian/80 border border-border/50 text-sm text-white rounded-full pl-11 pr-4 py-3 focus:outline-none focus:border-pure-white/50 transition-colors shadow-inner placeholder:text-text-muted/50"
            />
          </div>
        </motion.div>

        {/* DPDP Authority Strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex w-full items-center justify-center -mt-4 mb-2 gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-silver px-5 py-2.5 bg-silver/5 border border-silver/20 rounded-full mx-auto md:w-fit backdrop-blur-md shadow-sm z-20">
          <ShieldCheck size={16} /> End-to-End Encrypted & Anonymous
        </motion.div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
          {mockRooms.map((room, i) => (
            <Link href={`/community/${room.id}`} key={room.id} className="block h-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 border flex flex-col justify-between group cursor-pointer hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-1 ${room.border} hover:bg-white/5 relative overflow-hidden h-full`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${room.bg} rounded-full blur-[40px] opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-widest border border-white/10 ${room.color} bg-white/5`}>
                      {room.tag}
                    </span>
                    {room.active && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-alert-white animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-alert-white" /> LIVE
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-aqua transition-colors pr-4">{room.title}</h3>
                  
                  <div className="flex items-center gap-2 text-text-muted text-sm mt-4">
                    <Users size={16} /> 
                    <span className="font-bold text-white/90">{room.participants}</span> active healers
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/30 flex justify-between items-center relative z-10">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-obsidian border border-border/50 flex flex-col items-center justify-center text-[10px] shadow-sm z-30">🦁</div>
                    <div className="w-8 h-8 rounded-full bg-obsidian border border-border/50 flex flex-col items-center justify-center text-[10px] shadow-sm z-20">🌿</div>
                    <div className="w-8 h-8 rounded-full bg-obsidian border border-border/50 flex flex-col items-center justify-center text-[10px] shadow-sm z-10">🛡️</div>
                  </div>
                  <button className={`flex items-center gap-2 font-bold text-sm ${room.color} group-hover:scale-105 transition-transform`}>
                    Join Room <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
