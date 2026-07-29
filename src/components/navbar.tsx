import React from "react";
import Link from "next/link";
import { Moon, Send, ExternalLink, Code2 } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blood-border/60 bg-blood-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo on Left */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-crimson-500/50 rounded-lg px-1.5 py-1 -ml-1.5 transition-all"
        >
          <div className="relative w-8 h-8 rounded-full bg-crimson-950 border border-crimson-600/50 flex items-center justify-center shadow-[0_0_15px_rgba(230,25,56,0.35)] group-hover:border-crimson-500 group-hover:shadow-[0_0_22px_rgba(230,25,56,0.6)] transition-all duration-300">
            <Moon className="w-4 h-4 text-crimson-500 fill-crimson-600/30 group-hover:text-crimson-400 transition-colors" />
            <div className="absolute inset-0 rounded-full bg-crimson-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-crimson-400 transition-colors">
              Crimson <span className="text-crimson-500">Blood Moon</span>
            </span>
            <span className="text-[10px] text-blood-muted -mt-0.5 hidden sm:inline">
              URL Shortener
            </span>
          </div>
        </Link>

        {/* Telegram & Docs buttons on Top-Right */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-blood-charcoal/60 hover:bg-blood-surface border border-blood-border hover:border-blood-borderLight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-crimson-500/40"
          >
            <Code2 className="w-3.5 h-3.5 text-crimson-500" />
            <span>API Docs</span>
          </Link>

          <a
            href="https://t.me/yorifederation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-blood-surface/50 hover:bg-crimson-950/60 border border-blood-border hover:border-crimson-700/50 transition-all duration-200 shadow-sm hover:shadow-crimson-sm focus:outline-none focus:ring-2 focus:ring-crimson-500/40"
            aria-label="Telegram Channel (opens in a new tab)"
          >
            <Send className="w-3.5 h-3.5 text-crimson-500" />
            <span>Channel</span>
            <ExternalLink className="w-3 h-3 text-blood-muted sm:inline hidden" />
          </a>

          <a
            href="https://t.me/yorichiiprime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-blood-surface/50 hover:bg-crimson-950/60 border border-blood-border hover:border-crimson-700/50 transition-all duration-200 shadow-sm hover:shadow-crimson-sm focus:outline-none focus:ring-2 focus:ring-crimson-500/40"
            aria-label="Telegram Profile (opens in a new tab)"
          >
            <Send className="w-3.5 h-3.5 text-crimson-500" />
            <span>Profile</span>
            <ExternalLink className="w-3 h-3 text-blood-muted sm:inline hidden" />
          </a>
        </nav>
      </div>
    </header>
  );
}
