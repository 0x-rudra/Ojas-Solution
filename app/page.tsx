"use client";

import { useState, useEffect } from "react";
import { AnonymousOnboarding } from "@/components/auth/anonymous-onboarding";
import { ShieldCheck, Leaf, BrainCircuit, MessageSquare, Activity, Shield, ArrowRight, Lock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

const TypewriterText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (started && index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [index, started, text]);

  return (
    <span className={`inline-block relative ${className}`}>
      {displayedText}
      <span className={`absolute -right-4 md:-right-8 text-aqua ${index === text.length ? "animate-pulse" : "opacity-100"} ${index === text.length && delay > 0 ? "hidden" : ""}`}>_</span>
    </span>
  );
};

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { scrollYProgress } = useScroll();
  const yElement = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    if (user) {
      router.push("/feed");
    }
  }, [user, router]);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background relative overflow-x-hidden text-white w-full selection:bg-aqua selection:text-ink-black scroll-smooth">
      {/* Antigravity Dynamic Background Wrapper */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-50"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aqua/20 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-pure-white/20 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-silver/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Decorative Dot Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* --- PAGE 1: HERO & STATS --- */}
      <div className="w-full h-screen flex-shrink-0 snap-start flex flex-col justify-center relative">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-4 pb-10 md:pt-8 md:pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full z-10 flex flex-col items-start justify-center gap-8">
        
        {/* Typography & Inline Art */}
        <div className="w-full relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-aqua/30 bg-aqua/10 text-aqua mb-8 font-medium text-sm tracking-wide shadow-[0_0_15px_rgba(244,160,36,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-aqua animate-ping" />
            Zero Data Collection. 100% Anonymity.
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight md:leading-[1.1] min-h-[140px] sm:min-h-[150px] md:min-h-[220px]">
            <TypewriterText text="BREAK THE SILENCE." delay={300} /> <br />
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-4 md:mt-4">
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 2.0 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-aqua via-aqua-light to-silver italic pr-4"
              >
                HEAL ANONYMOUSLY.
              </motion.span>
              
              {/* Inline Abstract 3D Hero Art */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1.5, delay: 2.5 }}
                className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shrink-0 ml-2"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-aqua/20 to-silver/20 rounded-full blur-[20px] animate-pulse-glow" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-white/20 rounded-full border-dashed" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-1 border border-aqua/40 rounded-full border-t-aqua border-r-transparent" />
                <Shield className="text-aqua w-6 h-6 md:w-10 md:h-10 absolute drop-shadow-[0_0_15px_rgba(244,160,36,0.8)]" strokeWidth={2} />
                
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-3 -left-3 md:-top-2 md:-left-2 w-6 h-6 md:w-8 md:h-8 bg-pure-white/20 backdrop-blur-md border border-pure-white/40 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(46,204,113,0.3)]"><BrainCircuit className="text-pure-white w-3 h-3 xl:w-4 xl:h-4"/></motion.div>
                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-3 -right-3 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-silver/20 backdrop-blur-md border border-silver/40 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(46,204,113,0.3)]"><Leaf className="text-silver w-3 h-3 xl:w-4 xl:h-4"/></motion.div>
              </motion.div>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.2 }}
            className="mt-8 md:mt-12 text-lg md:text-2xl text-text-secondary max-w-2xl font-light leading-relaxed"
          >
            India's first completely private safe space for mental health, sexual wellness, and Ayurvedic guidance. <strong className="text-white font-medium">Your identity stays hidden. Your healing starts now.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 3.6 }}
            className="mt-16 md:mt-20 flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center relative z-40"
          >
            <div className="relative group w-full sm:w-auto">
              <button
                onClick={() => setShowOnboarding(true)}
                className="relative flex items-center justify-center px-8 py-5 md:py-4 font-bold text-ink-black bg-aqua rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(244,160,36,0.3)] hover:shadow-[0_0_60px_rgba(244,160,36,0.6)] w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg w-full">
                  Enter Anonymously <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </button>
              
              {/* How it Works Tooltip */}
              <div className="absolute top-[120%] sm:top-auto sm:bottom-[120%] left-1/2 w-64 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 z-50 transform group-hover:translate-y-2 sm:group-hover:-translate-y-2">
                <div className="bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col gap-2.5 relative">
                  <div className="hidden sm:block absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-obsidian/95" />
                  <div className="sm:hidden block absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-obsidian/95" />
                  <p className="text-xs text-white/90 flex items-center gap-2 font-medium"><Lock size={14} className="text-aqua shrink-0"/> 1. No names or emails required</p>
                  <p className="text-xs text-white/90 flex items-center gap-2 font-medium"><ShieldCheck size={14} className="text-silver shrink-0"/> 2. Data stored locally</p>
                  <p className="text-xs text-white/90 flex items-center gap-2 font-medium"><Leaf size={14} className="text-pure-white shrink-0"/> 3. Freedom to heal safely</p>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="group relative inline-flex items-center justify-center px-8 py-5 md:py-4 font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all w-full sm:w-auto"
            >
              Our Mission
              <span className="absolute -bottom-10 left-1/2 w-max -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Learn why we exist
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>

      {/* --- PAGE 2: LIVE PREVIEW & TIP OF THE DAY --- */}
      <div className="w-full min-h-screen flex-shrink-0 snap-start flex flex-col justify-center relative py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-6 md:gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-2xl"
          >
            <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight mb-3 text-white">See healing in <span className="text-aqua">real-time.</span></h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">Watch how the anonymous community and our Ojas AI Consultant work together to guide you without anyone ever knowing who you are.</p>
          </motion.div>

          <div className="relative w-full max-w-3xl px-2">
            {/* Live Preview Video Laptop Placeholder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative w-full aspect-video mx-auto rounded-xl bg-white/5 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            >
              {/* macOS Browser Header */}
              <div className="w-full h-6 sm:h-8 bg-black/60 backdrop-blur-md flex items-center px-3 gap-1.5 absolute top-0 left-0 right-0 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
                <div className="mx-6 flex-1 h-4 bg-white/10 rounded overflow-hidden flex items-center justify-center">
                  <span className="text-[9px] text-white/30 tracking-widest font-mono">ojas.app/anonymity</span>
                </div>
              </div>
              
              {/* The user's MP4 goes here */}
              <video 
                src="/preview.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover bg-black relative z-10 pt-6 sm:pt-8"
              />
            </motion.div>

            {/* Overlapping Tip of the Day Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 md:absolute md:-right-4 md:-bottom-6 lg:-right-8 glass-card p-4 md:p-5 relative overflow-hidden group border border-white/10 hover:border-silver/40 transition-colors w-full md:w-[300px] shadow-xl z-30 backgrop-blur-2xl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-silver/10 rounded-full blur-[30px] group-hover:scale-125 transition-transform duration-700" />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-silver/20 flex items-center justify-center shrink-0">
                  <Leaf className="text-silver w-4 h-4" />
                </div>
                <h4 className="font-bold text-white tracking-widest uppercase text-[10px]">Trending Insight</h4>
              </div>
              <p className="text-sm text-white/90 italic font-light leading-snug relative z-10">
                "Warm milk infused with a pinch of nutmeg before bed can drastically calm your Vata dosha, reducing late-night anxiety."
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- PAGE 3: ECOSYSTEM & CTA --- */}
      <div className="w-full min-h-screen flex-shrink-0 snap-start flex flex-col justify-center relative py-12">
        {/* --- FEATURES BENTO GRID --- */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 pt-8 pb-12 px-6 max-w-7xl mx-auto w-full"
        >
          <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">A Complete Healing Ecosystem</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Everything you need to recover, connect, and grow—built securely into a single platform without ever asking for your real name.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 glass-card p-10 relative overflow-hidden group hover:border-aqua/30 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-aqua/10 rounded-full blur-[60px] group-hover:bg-aqua/20 transition-all duration-500" />
            <div className="w-14 h-14 bg-aqua/10 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit className="text-aqua" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Ojas AI Consultant</h3>
            <p className="text-text-secondary leading-relaxed max-w-md mb-8">
              A private, 24/7 AI guide specifically trained on modern psychological therapy and ancient Ayurvedic wisdom. Your chats are processed locally and completely untraced.
            </p>
            <div className="p-4 bg-obsidian border border-border/50 rounded-xl relative z-10 w-full max-w-md">
               <div className="flex gap-3 items-start">
                 <div className="w-8 h-8 rounded-full bg-aqua/20 flex items-center justify-center text-aqua shrink-0"><BrainCircuit size={16} /></div>
                 <p className="text-sm text-white/90">"I noticed you're feeling anxious tonight. Taking Ashwagandha root with warm milk might help ground your nervous system. Would you like to talk about why you're stressed?"</p>
               </div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-10 relative overflow-hidden group hover:border-pure-white/30 transition-colors">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pure-white/10 rounded-full blur-[50px] group-hover:bg-pure-white/20 transition-all duration-500" />
            <div className="w-14 h-14 bg-pure-white/10 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="text-pure-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Anonymous Feed</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              Post your intrusive thoughts, relapses, or wins without fear. The community responds with empathy, never judgment.
            </p>
            <div className="absolute -bottom-8 -right-8 opacity-20 group-hover:opacity-40 transition-opacity">
               <MessageSquare size={120} />
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-10 relative overflow-hidden group hover:border-silver/30 transition-colors">
            <div className="absolute top-0 right-0 w-48 h-48 bg-silver/10 rounded-full blur-[50px] group-hover:bg-silver/20 transition-all duration-500" />
            <div className="w-14 h-14 bg-silver/10 rounded-2xl flex items-center justify-center mb-6">
              <Leaf className="text-silver" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Ayurvedic Advice</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              Automated AI summaries attach native Indian holistic remedies (diet, herbs, routines) directly beneath community posts.
            </p>
            <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:opacity-40 transition-opacity">
               <Leaf size={120} />
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-10 relative overflow-hidden group hover:border-aqua/30 transition-colors">
            <div className="w-14 h-14 bg-aqua/10 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="text-aqua" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Gamified Streaks & Profiles</h3>
            <p className="text-text-secondary leading-relaxed max-w-md mb-8">
              Stay motivated by tracking your NoFap or mental wellness challenges. Earn anonymous profile badges and map your long-term progress entirely on your local device.
            </p>
            <div className="flex items-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-12 bg-white/20 rounded-t-sm" />
              <div className="w-8 h-20 bg-white/40 rounded-t-sm" />
              <div className="w-8 h-24 bg-aqua/60 rounded-t-sm" />
              <div className="w-8 h-32 bg-aqua rounded-t-sm" />
              <div className="w-8 h-28 bg-aqua rounded-t-sm" />
            </div>
          </motion.div>

          </div>
        </motion.section>

        {/* --- BOTTOM CTA --- */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-20 pb-16 text-center px-6"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to heal?</h2>
        <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">Skip the email. Skip the password. Just click below and enter your private sanctuary.</p>
        <button
          onClick={() => setShowOnboarding(true)}
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-ink-black bg-aqua rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(244,160,36,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2 text-xl tracking-wide uppercase">
            Start Your Journey <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        </motion.section>
      </div>

      <AnonymousOnboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
}
