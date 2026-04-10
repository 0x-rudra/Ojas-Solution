"use client";

import { Menu, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/user-context";

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  // Simple title mapper
  const getPageTitle = () => {
    const path = pathname === "/" ? "Home" : pathname.split("/")[1];
    if (path === "Home") return "Home";
    if (path === "community") return "Ojas Circle";
    if (path === "ai") return "Ojas AI";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="absolute top-0 w-full z-40 glass border-b border-border/50 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} className="text-white" />
        </button>
        <h1 className="font-bold text-lg md:text-xl text-white tracking-wide">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {user ? (
          <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border/50 hover:bg-aqua/10 text-text-secondary hover:text-aqua transition-colors">
            <UserCircle2 size={20} />
          </Link>
        ) : (
          <Link href="/login" className="flex items-center justify-center px-4 h-10 rounded-full bg-aqua hover:bg-aqua-light text-ink-black font-bold transition-all text-sm shadow-[0_0_15px_rgba(244,160,36,0.2)]">
            Login / Sign Up
          </Link>
        )}
      </div>
    </header>
  );
}
