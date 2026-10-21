// Archivo: src/components/telemetry/TacticalVerdict.tsx
"use client";

import React from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";

interface TacticalVerdictProps {
  onUnlockDossier: () => void;
}

export const TacticalVerdict: React.FC<TacticalVerdictProps> = ({ onUnlockDossier }) => {
  const { computedIgc, audioMetrics, opticalMetrics } = useTelemetryStore();
  const igc = computedIgc ?? 58;
  const hrvScore = opticalMetrics?.hfHrvScore ?? 42;
  const jitterVal = audioMetrics?.jitterPct ?? 2.8;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#050505] border border-[#1f2937] rounded-xl text-neutral-200 font-mono shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
          <span className="text-xs uppercase tracking-widest text-[#00F2FE]">
            Dictamen de Biometría Forense
          </span>
        </div>
        <span className="text-xs text-neutral-500">ID: HASH-SHA256::CERT</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
            Índice Coherencia (IGC)
          </span>
          <span className="text-3xl font-bold text-[#00F2FE]">{igc} / 100</span>
          <span className="text-[10px] text-neutral-400 mt-1">Calibración Nominal</span>
        </div>
        <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
            Tono Vagal (HF-HRV)
          </span>
          <span className="text-3xl font-bold text-[#FFB300]">{hrvScore} / 100</span>
          <span className="text-[10px] text-neutral-400 mt-1">Dominancia Simpática</span>
        </div>
        <div className="bg-[#0c0c0c] border border-neutral-800 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
            Jitter Laríngeo
          </span>
          <span className="text-3xl font-bold text-neutral-100">{jitterVal}%</span>
          <span className="text-[10px] text-neutral-400 mt-1">Tensión Neuromotora</span>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border-l-2 border-[#00F2FE] p-4 text-xs leading-relaxed space-y-3">
        <p className="text-neutral-300">
          <strong className="text-neutral-100">[ANÁLISIS DE VECTOR 70%]:</strong> Su perfil
          expone una estructura ejecutiva de alta resiliencia y templanza estratégica. Ha operado
          como el pivote resolutivo indispensable en sus entornos de mayor fricción, sosteniendo
          compromisos bajo alta demanda cognitiva.
        </p>
        <p className="text-amber-200/90">
          <strong className="text-amber-400">[PUNTO CIEGO CRÍTICO 30%]:</strong> La telemetría
          revela que este rendimiento descansa sobre un subsidio simpático de emergencia continuo.
          Sostiene una hipervigilancia encubierta: su fisiología asume que desacelerar implicaría
          el colapso del control operativo, provocando una fuga alostática sostenida.
        </p>
      </div>

      <button
        onClick={onUnlockDossier}
        className="w-full py-3.5 bg-gradient-to-r from-[#00F2FE] to-[#0284c7] text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
      >
        Desbloquear Dossier Integral de Coherencia (18 Páginas)
      </button>
    </div>
  );
};
