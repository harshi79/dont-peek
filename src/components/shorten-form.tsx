"use client";

import React, { useState, useEffect } from "react";
import {
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  ExternalLink,
  History,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { CopyButton } from "./copy-button";
import type { ShortenResult } from "@/types";

interface HistoryItem extends ShortenResult {
  id: string;
}

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load session history on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("bloodmoon_recent_links");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  // Save history to sessionStorage
  const updateHistory = (newItem: ShortenResult) => {
    const item: HistoryItem = {
      ...newItem,
      id: `${newItem.code}-${Date.now()}`,
    };

    setHistory((prev) => {
      // Remove any duplicate code entry so the newest is at the top
      const filtered = prev.filter((i) => i.code !== newItem.code);
      const updated = [item, ...filtered].slice(0, 10);
      try {
        sessionStorage.setItem("bloodmoon_recent_links", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    }
    );
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      sessionStorage.removeItem("bloodmoon_recent_links");
    } catch {
      // Ignore storage errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL to shorten");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred while shortening the URL");
      } else {
        setResult(data);
        updateHistory(data);
        setUrl(""); // Clear input field for the next URL
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center mb-8 sm:mb-10 w-full px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-950/80 border border-crimson-700/40 text-crimson-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-crimson-sm">
          <Sparkles className="w-3.5 h-3.5 text-crimson-500" />
          <span>Eclipsing Long Links in Shadow</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
          Shorten Links Under the{" "}
          <span className="bg-gradient-to-r from-crimson-400 via-crimson-500 to-crimson-700 bg-clip-text text-transparent">
            Blood Moon
          </span>
        </h1>

        <p className="text-sm sm:text-base text-blood-muted max-w-lg mx-auto leading-relaxed">
          Paste your long URL below to generate an instant, permanent short code
          stored securely in Neon PostgreSQL.
        </p>
      </div>

      {/* URL Input Form Card */}
      <div className="w-full bg-blood-surface/85 backdrop-blur-md border border-blood-border rounded-2xl p-4 sm:p-6 shadow-crimson-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="long-url" className="sr-only">
            Long URL to shorten
          </label>

          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blood-muted">
                <LinkIcon className="w-4 h-4 text-crimson-500/70" />
              </div>
              <input
                id="long-url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste your long URL here..."
                disabled={loading}
                className="w-full pl-10 pr-4 py-3.5 bg-blood-charcoal/90 border border-blood-border rounded-xl text-white placeholder-blood-muted text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-crimson-500/60 focus:border-crimson-500 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 border border-crimson-500/30 shadow-crimson-sm hover:shadow-crimson-glow transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-h-[46px]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <span>Shorten</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-blood-muted px-1 mt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-crimson-500" />
              <span>Unique codes verified by Neon DB UNIQUE constraint</span>
            </span>
            <span className="hidden sm:inline">Press Enter ↵ to submit</span>
          </div>
        </form>

        {/* Error State Box */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-crimson-950/80 border border-crimson-600/50 flex items-start gap-2.5 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-crimson-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Result Box */}
        {result && (
          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-blood-charcoal/90 border border-crimson-700/50 shadow-crimson-glow animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-crimson-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-crimson-500" />
                <span>
                  {result.existing
                    ? "Existing Short Link Retrieved"
                    : "Short Link Created"}
                </span>
              </div>
              <span className="text-[11px] text-blood-muted bg-blood-surface px-2.5 py-1 rounded-full border border-blood-border">
                /{result.code}
              </span>
            </div>

            {/* Generated Short URL and Copy Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-blood-black/60 border border-crimson-800/60 rounded-xl p-3 mb-3">
              <a
                href={result.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm sm:text-base text-white font-medium break-all hover:text-crimson-400 transition-colors flex items-center gap-1.5"
              >
                <span>{result.short_url}</span>
                <ExternalLink className="w-3.5 h-3.5 text-blood-muted shrink-0 inline" />
              </a>

              <CopyButton
                textToCopy={result.short_url}
                label="Copy Link"
                className="shrink-0"
              />
            </div>

            {/* Original Destination URL Preview */}
            <div className="flex items-start gap-2 text-xs text-blood-muted px-1">
              <span className="text-gray-400 font-medium shrink-0">
                Destination:
              </span>
              <span className="break-all text-gray-400 truncate max-w-md" title={result.url}>
                {result.url}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Session Recent Shortened Links */}
      {history.length > 0 && (
        <div className="w-full mt-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300">
              <History className="w-4 h-4 text-crimson-500" />
              <span>Recent Eclipsed Links (Session)</span>
            </div>
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-1 text-xs text-blood-muted hover:text-crimson-400 transition-colors focus:outline-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear list</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-blood-surface/60 hover:bg-blood-surface/90 border border-blood-border/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-200"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <a
                    href={item.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white font-medium hover:text-crimson-400 transition-colors truncate"
                  >
                    {item.short_url}
                  </a>
                  <span className="text-xs text-blood-muted truncate mt-0.5" title={item.url}>
                    → {item.url}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <CopyButton
                    textToCopy={item.short_url}
                    label="Copy"
                    className="!px-2.5 !py-1.5 text-xs"
                  />
                  <a
                    href={item.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-blood-charcoal border border-blood-border text-gray-300 hover:text-white hover:border-crimson-700/60 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
