"use client";

import { Send, Loader2, AlertTriangle } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  error?: Error | null;
  handleSubmit: () => void;
}

export function ChatInput({ input, setInput, isLoading, error, handleSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleSubmit();
    textareaRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="w-full relative">
        {error && <p className="absolute -top-10 left-4 text-warning-white text-xs font-bold bg-warning-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-warning-white/20 flex items-center gap-2"><AlertTriangle size={14} /> An error occurred securely connecting to AI.</p>}

        <form onSubmit={onSubmit} className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-pure-white/20 to-aqua/20 rounded-4xl blur-xl opacity-30 group-focus-within:opacity-80 transition duration-500" />
          <div className="relative flex items-end gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] p-2 shadow-2xl transition-all group-focus-within:border-white/20">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
              }}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Message Ojas AI..."
              className="flex-1 bg-transparent border-none text-white px-4 py-3 min-h-12.5 max-h-45 resize-none focus:outline-none placeholder:text-text-muted text-[16px] leading-relaxed scrollbar-hide mb-1 overflow-y-auto"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-12 h-12 mb-1 mr-1 rounded-2xl bg-white hover:bg-neutral-200 text-ink-black flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-white shadow-sm"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-text-muted mt-4 tracking-wide">Responses are AI-generated. Consult a real doctor for medical emergencies.</p>
      </div>
    </div>
  );
}
