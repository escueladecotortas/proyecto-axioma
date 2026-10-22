// Archivo: src/components/telemetry/PaywallGate.tsx
'use client';

import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { generateForensicDossierPDF } from '../../lib/telemetry/dossierGenerator';
import { Download, FileCheck2, Loader2, Sparkles, ArrowLeft } from 'lucide-react';

interface PaywallGateProps {
  onBackToVerdict?: () => void;
}

export const PaywallGate: React.FC<PaywallGateProps> = ({ onBackToVerdict }) => {
  const [isCompiling, setIsCompiling] = useState(false);
  const t = useTelemetryStore();

  const handleDownloadDossier = async () => {
    try {
      setIsCompiling(true);
      const pdfBlob = await generateForensicDossierPDF({
        jitterPercent: t.jitterPercent,
        shimmerPercent: t.shimmerPercent,
        hnrDb: t.hnrDb,
        f0Median: t.f0Median,
        tactileCoherence: t.tactileCoherence,
        vocalStability: t.vocalStability,
      });

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AXIOMA_DOSSIER_FORENSE_${Date.now().toString().slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al compilar el PDF forense:", err);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <main className="w-full min-h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-4 py-8 relative">
      {onBackToVerdict && (
        <button onClick={onBackToVerdict} className="absolute top-6 left-6 text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 font-mono cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Dictamen</span>
        </button>
      )}

      <div className="w-full max-w-md p-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <FileCheck2 className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Acceso Autorizado // v12.0</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">Dossier Forense Completo</h2>
          <p className="text-xs text-neutral-400 font-mono">Documento vectorial A4 estructurado con Hash SHA-256 y protocolo de 7 días.</p>
        </div>

        <div className="text-left p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] font-mono text-neutral-300 space-y-1">
          <p className="flex items-center gap-1.5 text-emerald-400"><Sparkles className="w-3.5 h-3.5" /> Expediente Clínico de 3 Secciones</p>
          <p>• Carátula y Hash Criptográfico Forense</p>
          <p>• Topografía Microacústica & Varianza Autonómica</p>
          <p>• Protocolo Cronobiológico de Descompresión Diaria</p>
        </div>

        <button onClick={handleDownloadDossier} disabled={isCompiling} className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 text-neutral-950 font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer">
          {isCompiling ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Compilando Expediente PDF...</span></>
          ) : (
            <><Download className="w-4 h-4" /><span>Descargar Expediente PDF Oficial</span></>
          )}
        </button>
      </div>
    </main>
  );
};

export default PaywallGate;
