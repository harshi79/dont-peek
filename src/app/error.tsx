"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-blood-black text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blood-moon-radial rounded-full pointer-events-none blur-3xl opacity-50" />

      <div className="relative z-10 max-w-md w-full bg-blood-surface/85 backdrop-blur-md border border-blood-border rounded-2xl p-8 text-center shadow-crimson-md">
        <div className="w-16 h-16 rounded-full bg-crimson-950/80 border border-crimson-700/50 flex items-center justify-center mx-auto mb-6 shadow-crimson-glow">
          <AlertTriangle className="w-8 h-8 text-crimson-500" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-3">
          Something Went Wrong
        </h1>

        <p className="text-sm text-blood-muted mb-8 leading-relaxed">
          An unexpected error occurred. Please try again or return to the main
          website.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-crimson-700 hover:bg-crimson-600 border border-crimson-500/30 shadow-crimson-sm transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-gray-300 bg-blood-charcoal hover:bg-blood-surface border border-blood-border hover:text-white transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
