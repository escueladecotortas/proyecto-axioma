// Archivo: src/components/telemetry/TacticalVerdict.tsx
"use client";

import React from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";

interface TacticalVerdictProps {
  onUnlockDossier: () => void;
}

export const TacticalVerdict: React.FC<TacticalVerdictProps> = ({ onUnlockDossier }) => {
  const { computedIgc, audioMetrics, opticalMetrics } = useTelemetryStore();
  const igc = computedIgc ?? 62;
  const stressLevel = 100 - (opticalMetrics?.hfHrvScore ?? 45);
  const voiceTension = audioMetrics?.jitterPct ?? 2.8;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#050505] border border-neutral-800 rounded-xl text-neutral-200 font-mono shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
          <span className="text-xs uppercase tracking-widest text-[#00F2FE]">
            Diagnóstico de Coherencia Personal
          </span>
        </div>
        <span className="text-xs text-neutral-500">CANON v11.1</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
            Claridad y Enfoque
          </span>
          <span className="text-3xl font-bold text-[#00F2FE]">{igc} / 100</span>
          <span className="text-[10px] text-neutral-500 mt-1">Nivel General</span>
        </div>
        <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
            Nivel de Sobrecarga
          </span>
          <span className="text-3xl font-bold text-[#FFB300]">{stressLevel}%</span>
          <span className="text-[10px] text-neutral-500 mt-1">Alerta Activa</span>
        </div>
        <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
            Tensión en la Voz
          </span>
          <span className="text-3xl font-bold text-neutral-100">{voiceTension}%</span>
          <span className="text-[10px] text-neutral-500 mt-1">Carga Neuromotora</span>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border-l-3 border-[#00F2FE] p-4 text-xs leading-relaxed space-y-4 rounded-r-lg">
        <div>
          <h4 className="text-sm font-semibold text-[#00F2FE] mb-1">Tu Mayor Fortaleza:</h4>
          <p className="text-neutral-300">
            Sos el pilar operativo de tu entorno. Tenés una capacidad extraordinaria para absorber
            presión, resolver problemas críticos y mantener la calma hacia afuera cuando los demás se desbordan.
          </p>
        </div>
        <div className="pt-2 border-t border-neutral-800/60">
          <h4 className="text-sm font-semibold text-[#FFB300] mb-1">Tu Punto Ciego:</h4>
          <p className="text-neutral-300">
            Tu cuerpo está pagando el costo: vivís en un estado de alerta silenciosa permanente. Sentís
            que si aflojás o soltás el control un día, todo se desmorona a tu alrededor. Eso hace que tu
            mente no descanse nunca de verdad.
          </p>
        </div>
      </div>

      <button
        onClick={onUnlockDossier}
        className="w-full py-3.5 bg-gradient-to-r from-[#00F2FE] to-[#0284c7] text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-lg hover:opacity-95 transition-all shadow-lg cursor-pointer"
      >
        Ver Mi Expediente Completo y Plan de 7 Días
      </button>
    </div>
  );
};

export default TacticalVerdict;
