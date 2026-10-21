// Archivo: src/components/telemetry/DramaticLatency.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";

const LOG_STEPS = [
  "Inicializando compuerta de sincronización neurovisceral...",
  "Extrayendo perturbación de Jitter acústico y micro-tensión laríngea...",
  "Calculando densidad espectral de alta frecuencia cardíaca (HF-HRV)...",
  "Sintetizando vectores de dispersión frente a cohorte normativa (N=10,000)...",
  "Detectando fractura dialéctica entre solvencia ejecutiva y drenaje alostático...",
  "Generando matriz de tensión bioconductual e Índice Global de Coherencia...",
];

export const DramaticLatency: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(5);
  const finalizeComputation = useTelemetryStore((s) => s.finalizeComputation);

  useEffect(() => {
    const intervalTime = 1300; // ~8 segundos total
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOG_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => finalizeComputation(), 800);
          return prev;
        }
      });
      setProgress((p) => Math.min(100, p + 16));
    }, intervalTime);

    return () => clearInterval(timer);
  }, [finalizeComputation]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-[#050505] border border-[#1f2937] rounded-xl text-neutral-200 font-mono shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#1f2937] mb-6">
        <span className="text-xs uppercase tracking-widest text-[#00F2FE] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
          Procesamiento de Biometría Táctica
        </span>
        <span className="text-xs text-neutral-500">CANON-BIO v11.1</span>
      </div>

      <div className="space-y-3 mb-6 min-h-[160px]">
        {LOG_STEPS.slice(0, currentStepIndex + 1).map((log, idx) => (
          <div
            key={idx}
            className={`text-xs transition-opacity duration-300 flex items-start gap-2 ${
              idx === currentStepIndex ? "text-[#00F2FE]" : "text-neutral-500"
            }`}
          >
            <span className="text-neutral-600 select-none">[{idx + 1}/6]</span>
            <span>{log}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>SÍNTESIS ALGORÍTMICA</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00F2FE] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
