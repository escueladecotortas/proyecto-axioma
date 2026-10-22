// Archivo: src/components/verdict/TacticalVerdict.tsx
'use client';

import React, { useMemo } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { computeDualParadox } from '../../lib/telemetry/paradoxEngine';
import { PoincarePlot } from './PoincarePlot';
import { ShieldAlert, ArrowRight, Activity } from 'lucide-react';

interface TacticalVerdictProps {
  onProceedToPaywall?: () => void;
  onUnlockDossier?: () => void;
}

export const TacticalVerdict: React.FC<TacticalVerdictProps> = ({
  onProceedToPaywall,
  onUnlockDossier,
}) => {
  const { jitterPercent, tactileCoherence, hnrDb } = useTelemetryStore();
  const handleProceed = onProceedToPaywall || onUnlockDossier || (() => {});

  const verdict = useMemo(() => {
    return computeDualParadox(jitterPercent, tactileCoherence, hnrDb);
  }, [jitterPercent, tactileCoherence, hnrDb]);

  return (
    <main className="w-full min-h-[100dvh] bg-neutral-950 text-neutral-100 px-4 py-8 flex flex-col items-center justify-between">
      {/* Encabezado Forense */}
      <header className="w-full max-w-md text-center space-y-1 mb-4">
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
          <Activity className="w-3.5 h-3.5" />
          Expediente Biométrico // {verdict.forensicHash}
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-100">
          Dictamen de Bio-Alineación
        </h1>
      </header>

      {/* Contenido Central: Gráfico de Fase y Paradoja */}
      <section className="w-full max-w-md space-y-4">
        <PoincarePlot jitterPercent={jitterPercent} tactileCoherence={tactileCoherence} />

        {/* 70% Validación de Solvencia */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">
            Solvencia Ejecutiva // Percentil {verdict.percentiles.coherencePercentile}%
          </span>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
            {verdict.executiveStrength}
          </p>
        </div>

        {/* 30% Fricción Quirúrgica */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-sm">
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-rose-400 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Punto Ciego Autonómico // Ratio {verdict.percentiles.sympatheticRatio}
          </span>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {verdict.frictionBlindspot}
          </p>
        </div>
      </section>

      {/* Footer y Transición a Paywall */}
      <footer className="w-full max-w-md mt-6">
        <button
          onClick={handleProceed}
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
        >
          <span>Desbloquear Dossier Forense Completo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </main>
  );
};

export default TacticalVerdict;
