import React from "react";

export function BloodMoonBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1100px] h-[600px] bg-blood-moon-radial opacity-70 blur-3xl" />

      {/* Subtle Moon Eclipse Graphic */}
      <div className="absolute top-[80px] sm:top-[100px] left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border border-crimson-600/15 bg-gradient-to-b from-crimson-900/10 via-transparent to-transparent opacity-60 flex items-center justify-center">
        {/* Inner Dark Moon Core */}
        <div className="w-[330px] h-[330px] sm:w-[440px] sm:h-[440px] rounded-full bg-blood-black/90 border border-crimson-700/20 shadow-[inset_0_0_80px_rgba(184,20,50,0.25)]" />
      </div>

      {/* Subtle Ambient Red Glow Accent around the Edge */}
      <div className="absolute top-[160px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-crimson-600/15 rounded-full blur-3xl opacity-50" />

      {/* Noise/Texture Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3a131b0a_1px,transparent_1px),linear-gradient(to_bottom,#3a131b0a_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
    </div>
  );
}
