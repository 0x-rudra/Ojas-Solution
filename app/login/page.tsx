"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Lock, Key, Shield, Copy, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/lib/user-context";

export default function AuthPage() {
  const router = useRouter();
  const { initializeUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [backupCodeInput, setBackupCodeInput] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);

  // States for Signup
  const [generatedBackupCode, setGeneratedBackupCode] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateBackupCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      // Simulate Signup
      console.log("Signing up with:", username, password);
      const code = generateBackupCode();
      setGeneratedBackupCode(code);
      initializeUser(username, "🪷");
      setIsSignedUp(true);
    } else {
      // Simulate Login
      if (useBackupCode) {
        console.log("Logging in with Backup Code:", username, backupCodeInput);
      } else {
        console.log("Logging in with:", username, password);
      }
      initializeUser(username, "🪷");
      router.push("/feed");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBackupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-aqua/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-pure-white/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-aqua/10 border border-aqua/30 text-aqua mb-4 hover:scale-105 transition-transform">
              <Shield size={24} />
            </div>
          </Link>
          <h1 className="text-3xl font-black mb-2">
            {isSignedUp ? "Your Sanctuary Awaits" : (isLogin ? "Welcome Back" : "Create Identity")}
          </h1>
          <p className="text-text-secondary text-sm">
            {isSignedUp 
              ? "100% Anonymous. Secure your backup code." 
              : "Zero PII. Maximum privacy. Complete anonymity."}
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            {isSignedUp ? (
              <motion.div
                key="signup-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Identity Created</h3>
                  <p className="text-text-secondary text-sm mb-6">
                    Because we don't connect your account to an email or phone, this <strong className="text-white">Backup Code</strong> is your ONLY way to recover your account if you forget your password.
                  </p>
                </div>

                <div className="w-full bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col items-center gap-3 relative group">
                  <span className="text-2xl font-mono tracking-[0.2em] font-bold text-aqua">
                    {generatedBackupCode}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    {copied ? <CheckCircle2 size={16} className="mr-2 text-green-400" /> : <Copy size={16} className="mr-2" />}
                    {copied ? "Copied to Clipboard" : "Copy Backup Code"}
                  </Button>
                </div>

                <div className="w-full pt-4 border-t border-white/10">
                  <Link href="/feed">
                    <Button className="w-full bg-aqua hover:bg-aqua-light text-ink-black font-bold h-12 text-md rounded-full shadow-[0_0_20px_rgba(244,160,36,0.2)]">
                      Enter Ojas Circle <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleAuth}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-text-secondary">Anonymous Username</Label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <Input 
                      id="username" 
                      placeholder="e.g. shadow_healer" 
                      className="pl-10 h-12 bg-black/40 border-white/10 focus-visible:ring-aqua/50 text-white placeholder:text-text-muted"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {isLogin && useBackupCode ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="backupCode" className="text-text-secondary">Backup Recovery Code</Label>
                      <button 
                        type="button" 
                        onClick={() => setUseBackupCode(false)}
                        className="text-xs text-aqua hover:underline"
                      >
                        Use Password Instead
                      </button>
                    </div>
                    <div className="relative">
                      <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <Input 
                        id="backupCode" 
                        placeholder="XXXX-XXXX-XXXX" 
                        className="pl-10 h-12 bg-black/40 border-white/10 focus-visible:ring-aqua/50 text-white uppercase font-mono placeholder:normal-case"
                        value={backupCodeInput}
                        onChange={(e) => setBackupCodeInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-text-secondary">Password</Label>
                      {isLogin && (
                        <button 
                          type="button" 
                          onClick={() => setUseBackupCode(true)}
                          className="text-xs text-text-muted hover:text-white transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10 h-12 bg-black/40 border-white/10 focus-visible:ring-aqua/50 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold rounded-xl mt-6 transition-all duration-300">
                  {isLogin ? "Access Community" : "Create Anonymous Identity"}
                </Button>

                <div className="text-center mt-6 text-sm text-text-secondary">
                  {isLogin ? "Don't have an identity yet?" : "Already have an identity?"}
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setUseBackupCode(false);
                    }}
                    className="ml-2 font-semibold text-white hover:text-aqua transition-colors underline decoration-white/30 underline-offset-4"
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
