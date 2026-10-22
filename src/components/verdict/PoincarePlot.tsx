// Archivo: src/components/verdict/PoincarePlot.tsx
'use client';

import React from 'react';

interface PoincarePlotProps {
  jitterPercent: number;
  tactileCoherence: number;
}

export const PoincarePlot: React.FC<PoincarePlotProps> = ({
  jitterPercent,
  tactileCoherence,
}) => {
  // Cálculo de ejes de dispersión: SD1 (vagal/transversal) y SD2 (simpático/longitudinal)
  const sd1 = Math.max(8, Math.min(24, Math.round(tactileCoherence * 0.22)));
  const sd2 = Math.max(16, Math.min(48, Math.round(jitterPercent * 32 + 12)));

  // Generación determinista de nube de retorno ciclo-a-ciclo
  const points = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const noise = Math.sin(i * 3.7) * 4;
    const x = 100 + (sd2 * 0.8 + noise) * Math.cos(angle) * 0.707 - (sd1 + noise) * Math.sin(angle) * 0.707;
    const y = 100 + (sd2 * 0.8 + noise) * Math.cos(angle) * 0.707 + (sd1 + noise) * Math.sin(angle) * 0.707;
    return { x: Math.round(x), y: Math.round(y) };
  });

  return (
    <div className="w-full flex flex-col items-center p-4 bg-neutral-900/60 rounded-2xl border border-neutral-800">
      <div className="w-full flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2">
        <span>Mapa de Retorno de Fase (Tn vs Tn+1)</span>
        <span className="text-emerald-400">SD1: {sd1}ms | SD2: {sd2}ms</span>
      </div>

      <svg viewBox="0 0 200 200" className="w-48 h-48 overflow-visible">
        {/* Retícula de fondo */}
        <line x1="20" y1="180" x2="180" y2="180" stroke="#262626" strokeWidth="1" />
        <line x1="20" y1="20" x2="20" y2="180" stroke="#262626" strokeWidth="1" />
        {/* Línea de identidad diagonal Tn = Tn+1 */}
        <line x1="20" y1="180" x2="180" y2="20" stroke="#404040" strokeDasharray="3 3" strokeWidth="1" />

        {/* Elipse de confianza de varianza autonómica */}
        <ellipse
          cx="100"
          cy="100"
          rx={sd2}
          ry={sd1}
          transform="rotate(-45 100 100)"
          fill="rgba(52, 211, 153, 0.08)"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Nube de puntos de dispersión */}
        {points.map((pt, idx) => (
          <circle key={idx} cx={pt.x} cy={pt.y} r="2.5" className="fill-emerald-400/90" />
        ))}
      </svg>

      <div className="w-full flex justify-between text-[9px] font-mono text-neutral-500 mt-2 px-2">
        <span>Modulación Vagal (SD1)</span>
        <span>Tono Simpático (SD2)</span>
      </div>
    </div>
  );
};

export default PoincarePlot;
