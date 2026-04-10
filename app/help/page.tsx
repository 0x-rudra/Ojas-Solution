"use client";

import { motion } from "framer-motion";
import { HelpCircle, Mail, MessageCircle, LifeBuoy, ArrowRight, Heart, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
  const faqs = [
    {
      question: "Is Ojas Circle completely anonymous?",
      answer: "Absolutely. We collect ZERO personally identifiable information (PII). There is no complex sign-up requiring your phone number or email, and we do not log IPs. What happens in the Circle, stays in the Circle."
    },
    {
      question: "Who (or what) answers my questions?",
      answer: "When you interact with the Ojas AI Consultant, you are speaking to an advanced AI model trained on extensive Ayurvedic texts, modern medical knowledge, and psychological first aid. In Live Rooms, you converse with fellow anonymous members navigating similar journeys."
    },
    {
      question: "Can the AI replace my actual doctor?",
      answer: "No. While our AI is highly capable of providing guidance, preliminary symptom checking, and emotional support, it cannot replace professional medical diagnosis or treatment. Always consult a certified healthcare provider for serious conditions."
    },
    {
      question: "What happens to my data and chat history?",
      answer: "Your chat history with the AI is ephemeral. We adhere stringently to DPDP compliance. We do not store your chat logs to train commercial models, ensuring complete confidentiality."
    },
    {
      question: "How do I report inappropriate behavior in Community Rooms?",
      answer: "Every message and user node in the community rooms features a 'Report' button. Our automated moderation immediately hides heavily flagged content and removes bad actors to keep the space safe."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-white w-full pb-24 md:pb-0">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aqua/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pure-white/20 rounded-full blur-[120px] animate-float" />
      
      {/* Decorative Dot Matrix layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 pt-32 relative z-10 flex flex-col">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 w-full"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-aqua/30 bg-aqua/10 text-aqua mb-8 font-medium">
            <LifeBuoy size={16} className="animate-spin-slow" />
            Support & Resources
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            How can we <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-aqua via-aqua-light to-silver italic pr-2">
              help you?
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-light leading-relaxed">
            Find answers to common questions about anonymity, AI consultation, and navigating Ojas Circle safely.
          </p>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full mb-24 glass-card p-6 md:p-10 relative overflow-hidden group hover:border-aqua/30 transition-colors duration-500"
        >
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
            <ShieldQuestion className="text-aqua" size={28} />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50 py-2">
                <AccordionTrigger className="text-lg font-medium hover:text-aqua transition-colors text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary text-base leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact/Support Channels Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-24"
        >
          <div className="glass-card p-8 group hover:border-silver/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 bg-silver/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="text-silver" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Email Support</h3>
            <p className="text-text-secondary mb-6 line-clamp-2">
              Have a technical issue or suggestions? Reach out directly via email. We typically respond within 24 hours.
            </p>
            <a href="mailto:support@ojascircle.com" className="inline-flex items-center gap-2 text-silver font-bold group-hover:gap-3 transition-all">
              Write to us <ArrowRight size={16} />
            </a>
          </div>

          <div className="glass-card p-8 group hover:border-aqua/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 bg-aqua/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="text-aqua" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Community Forum</h3>
            <p className="text-text-secondary mb-6 line-clamp-2">
              Join the anonymous feedback room to suggest features and discuss platform updates with other users.
            </p>
            <Link href="/community" className="inline-flex items-center gap-2 text-aqua font-bold group-hover:gap-3 transition-all">
              Join discussion <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Emergency Helplines Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full glass-card border-aqua/30 bg-gradient-to-r from-aqua/10 to-transparent p-8 md:p-12 mb-32 flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(244,160,36,0.1)] rounded-2xl"
        >
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
              <Heart className="text-aqua" fill="currentColor" /> Need immediate crisis help?
            </h2>
            <p className="text-text-secondary max-w-md">
              If you are feeling overwhelmed, having severe anxiety, or thoughts of self-harm, professional human support is available 24/7.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <a href="tel:14416" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold flex items-center justify-center gap-3 transition-colors text-white">
              📞 Tele-MANAS (14416)
            </a>
            <a href="tel:9152987821" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold flex items-center justify-center gap-3 transition-colors text-white">
              💬 iCALL (9152987821)
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
