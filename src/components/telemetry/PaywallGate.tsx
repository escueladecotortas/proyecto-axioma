// Archivo: src/components/telemetry/PaywallGate.tsx
"use client";

import React, { useState } from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { downloadDossierReport } from "@/lib/telemetry/dossierGenerator";

interface PaywallGateProps {
  onBackToVerdict: () => void;
}

export const PaywallGate: React.FC<PaywallGateProps> = ({ onBackToVerdict }) => {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const { computedIgc, audioMetrics, opticalMetrics } = useTelemetryStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      // Descarga automática inmediata
      downloadDossierReport(email, computedIgc ?? 62, audioMetrics, opticalMetrics);
    }, 1000);
  };

  const handleManualDownload = () => {
    downloadDossierReport(email || "operador@axioma.core", computedIgc ?? 62, audioMetrics, opticalMetrics);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-[#050505] border border-neutral-800 rounded-xl text-neutral-200 font-mono shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <span className="text-xs uppercase tracking-widest text-[#00F2FE]">
          Expediente Personal // Descarga Inmediata
        </span>
        <button
          onClick={onBackToVerdict}
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
        >
          [VOLVER]
        </button>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-neutral-100">
              Obtené tu Dossier de Coherencia y Plan de 7 Días
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ingresá tu correo para descargar el informe completo con el desglose de tu tensión y las
              acciones prácticas día por día para desactivar el estado de alerta.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase">
              Tu Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              className="w-full px-3 py-2.5 bg-[#0c0c0c] border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#00F2FE] hover:bg-[#38bdf8] text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? "Generando Expediente..." : "Descargar Mi Dossier Ahora"}
          </button>
        </form>
      ) : (
        <div className="p-6 bg-[#0c0c0c] border border-[#00F2FE]/40 rounded-lg text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] mx-auto flex items-center justify-center font-bold">
            ✓
          </div>
          <h4 className="text-sm font-bold text-neutral-100">¡Tu Dossier se generó con éxito!</h4>
          <p className="text-xs text-neutral-400">
            El archivo fue generado para <strong>{email}</strong>. Si tu navegador no inició la descarga automáticamente, tocala acá:
          </p>

          <button
            onClick={handleManualDownload}
            className="w-full py-3 bg-[#00F2FE] hover:bg-[#38bdf8] text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer shadow-lg"
          >
            📥 Descargar Dossier (Archivo Directo)
          </button>
        </div>
      )}
    </div>
  );
};

export default PaywallGate;
