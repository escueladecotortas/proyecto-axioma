// Archivo: src/components/VoiceCalibrationScene.jsx
"use client";

import { Mic, ShieldCheck, ArrowRight } from "lucide-react";
import StarfieldCanvas from "./StarfieldCanvas";

export default function VoiceCalibrationScene() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#030305] px-6 py-8 select-none animate-cinematic-text">
      <StarfieldCanvas />

      {/* Header sutil */}
      <header className="relative z-10 flex w-full max-w-5xl items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-[#E2B872] shadow-[0_0_10px_#E2B872]" />
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#F5F5F7]/80">
            AXIOMA // OBSERVATORIO
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#E2B872]/20 bg-[#0A0B0E]/70 px-3 py-1 text-[10px] font-mono text-[#E2B872]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#E2B872]" />
          <span>Biometría Certificada</span>
        </div>
      </header>

      {/* Núcleo central de calibración vocal */}
      <main className="relative z-10 my-auto flex w-full max-w-2xl flex-col items-center text-center px-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0A0B0E] px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase text-[#00F2FE]">
          FASE II // CALIBRACIÓN VOCAL
        </div>

        <h1 className="mb-3 text-3xl sm:text-5xl font-light tracking-tight text-[#F5F5F7]">
          Resonancia Neurovisceral
        </h1>

        <p className="mb-10 max-w-md text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
          Tu huella dactilar ha quedado fijada en el observatorio. Procedé a modular tu tono fundamental para completar la bio-alineación.
        </p>

        {/* Visualizador de ondas en standby */}
        <div className="relative mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-[#00F2FE]/30 bg-[#0A0B0E] shadow-[0_0_30px_rgba(0,242,254,0.15)]">
          <div className="absolute inset-0 rounded-full border border-[#00F2FE]/20 animate-ping opacity-40" />
          <Mic className="h-10 w-10 text-[#00F2FE]" />
        </div>

        <button
          onClick={() => {}}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#E2B872]/40 bg-[#0A0B0E] px-7 py-3.5 text-xs font-mono tracking-widest uppercase text-[#F5F5F7] shadow-[0_0_25px_rgba(226,184,114,0.15)] hover:border-[#E2B872] hover:shadow-[0_0_35px_rgba(226,184,114,0.3)] transition-all cursor-pointer"
        >
          <span>Activar Micrófono</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#E2B872]" />
        </button>
      </main>

      {/* Footer minimalista */}
      <footer className="relative z-10 flex w-full max-w-5xl items-center justify-between border-t border-white/5 pt-4 text-[10px] font-mono text-[#8E8E93]">
        <span>AXIOMA // SESIÓN CALIBRADA</span>
        <span>ENLACE COHERENTE :3010</span>
      </footer>
    </div>
  );
}
