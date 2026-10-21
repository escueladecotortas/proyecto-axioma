// Archivo: src/components/PrologueHeader.jsx
"use client";

import { Volume2, VolumeX, Radio } from "lucide-react";

export default function PrologueHeader({ isMuted, onToggleMute }) {
  return (
    <header className="relative z-10 flex w-full max-w-5xl items-center justify-between border-b border-white/5 pb-4">
      <div className="flex items-center gap-2.5">
        <div className="h-2 w-2 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
        <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#F5F5F7]/80">
          AXIOMA // OBSERVATORIO
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0A0B0E]/60 text-[#8E8E93] hover:text-[#F5F5F7] transition-colors cursor-pointer"
          title={isMuted ? "Activar audio" : "Silenciar audio"}
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-[#E2B872]" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#00F2FE]/20 bg-[#0A0B0E]/70 px-3 py-1 text-[10px] font-mono text-[#00F2FE]">
          <Radio className="h-3 w-3 animate-pulse text-[#00F2FE]" />
          <span>432Hz · Sintonía Activa</span>
        </div>
      </div>
    </header>
  );
}
