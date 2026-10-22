// Archivo: src/components/telemetry/ThumbZonePad.tsx
'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

interface ThumbZonePadProps {
  onHoldStart: () => void;
  onHoldEnd: () => void;
  isHolding: boolean;
  progress: number;
}

export const ThumbZonePad: React.FC<ThumbZonePadProps> = ({
  onHoldStart,
  onHoldEnd,
  isHolding,
  progress,
}) => {
  const [pulseWave, setPulseWave] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Fallback silencioso en entornos sin soporte háptico
      }
    }
    setPulseWave(true);
    onHoldStart();
  };

  const handlePointerUp = () => {
    setPulseWave(false);
    onHoldEnd();
  };

  return (
    <section className="w-full max-w-sm mx-auto px-4 pb-6 pt-2 select-none touch-none flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-[11px] tracking-widest text-emerald-400/80 uppercase font-mono mb-2">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          Acoplamiento Táctil
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-emerald-400 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative w-28 h-28 rounded-full border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          isHolding
            ? 'scale-95 border-emerald-400 bg-emerald-950/40 shadow-[0_0_30px_rgba(52,211,153,0.35)]'
            : 'border-neutral-700 bg-neutral-900/60 hover:border-neutral-500'
        }`}
      >
        <ShieldCheck className={`w-10 h-10 transition-colors ${isHolding ? 'text-emerald-400' : 'text-neutral-500'}`} />
        <span className="text-[10px] tracking-widest uppercase font-mono mt-1 text-neutral-400">
          {isHolding ? 'Muestreando' : 'Sostener'}
        </span>

        {pulseWave && (
          <span className="absolute inset-0 rounded-full border border-emerald-400/60 animate-ping pointer-events-none" />
        )}
      </button>

      <p className="text-[11px] text-neutral-400 text-center font-mono mt-3 max-w-[260px]">
        Presione con el pulgar para calibrar la varianza autonómica periférica.
      </p>
    </section>
  );
};

export default ThumbZonePad;
