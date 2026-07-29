import React from "react";
import Link from "next/link";
import { Moon, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-blood-border/50 bg-blood-black/90 py-8 px-4 sm:px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blood-muted">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-crimson-600" />
          <span>
            Crimson Blood Moon — Lightweight Production URL Shortener
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/docs"
            className="hover:text-white transition-colors focus:outline-none focus:underline"
          >
            API Documentation
          </Link>
          <a
            href="https://t.me/yorifederation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors focus:outline-none focus:underline"
          >
            <Send className="w-3 h-3 text-crimson-600" />
            <span>Channel</span>
          </a>
          <a
            href="https://t.me/yorichiiprime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors focus:outline-none focus:underline"
          >
            <Send className="w-3 h-3 text-crimson-600" />
            <span>Profile</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
