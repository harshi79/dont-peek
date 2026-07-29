import Link from "next/link";
import { Moon, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blood-black text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Blood Moon Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blood-moon-radial rounded-full pointer-events-none blur-3xl opacity-60" />

      <div className="relative z-10 max-w-md w-full bg-blood-surface/85 backdrop-blur-md border border-blood-border rounded-2xl p-8 text-center shadow-crimson-md">
        <div className="w-16 h-16 rounded-full bg-crimson-950/80 border border-crimson-700/50 flex items-center justify-center mx-auto mb-6 shadow-crimson-glow">
          <Moon className="w-8 h-8 text-crimson-500 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-950/90 border border-crimson-700/40 text-crimson-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Error 404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
          Link Not Found
        </h1>

        <p className="text-sm text-blood-muted mb-8 leading-relaxed">
          The short code you requested does not exist in our database or may have
          been removed. Please verify the link or create a new short URL.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 border border-crimson-500/30 shadow-crimson-sm transition-all duration-200 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
