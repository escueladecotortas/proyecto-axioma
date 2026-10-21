// Archivo: src/components/telemetry/PaywallGate.tsx
"use client";

import React, { useState } from "react";

interface PaywallGateProps {
  onBackToVerdict: () => void;
}

export const PaywallGate: React.FC<PaywallGateProps> = ({ onBackToVerdict }) => {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-[#050505] border border-[#1f2937] rounded-xl text-neutral-200 font-mono shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
        <span className="text-xs uppercase tracking-widest text-[#00F2FE]">
          Compuerta Web-to-App // Protocolo Transaccional
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
              Expediente Forense Completo & Protocolo de 7 Días
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Incluye matriz espectral detallada, firma de Poincaré, auditoría de entropía
              conductual y el cronograma de intervención neurovisceral.
            </p>
          </div>

          <div className="p-4 bg-[#0c0c0c] border border-neutral-800 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">Dossier Clínico Digital</span>
              <span className="text-neutral-100 font-bold">$14.99 USD</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-neutral-500">
              <span>Periodo de Prueba App Móvil</span>
              <span className="text-[#00F2FE]">7 DÍAS BONIFICADOS</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase">
              Dirección de Asignación Criptográfica
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operador@dominio.com"
              className="w-full px-3 py-2.5 bg-[#0c0c0c] border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#00F2FE] hover:bg-[#38bdf8] text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? "Vinculando Token Seguro..." : "Adquirir Dossier & Desbloquear App"}
          </button>
        </form>
      ) : (
        <div className="p-6 bg-[#0c0c0c] border border-[#00F2FE]/40 rounded-lg text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] mx-auto flex items-center justify-center font-bold">
            ✓
          </div>
          <h4 className="text-sm font-bold text-neutral-100">Credencial Asignada Exitosamente</h4>
          <p className="text-xs text-neutral-400">
            Se ha vinculado el expediente de telemetría a <strong>{email}</strong>. El token de
            acceso universal ya se encuentra habilitado para la aplicación nativa.
          </p>
          <a
            href="#app-download"
            className="inline-block px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Continuar hacia App Móvil (Deep Link)
          </a>
        </div>
      )}
    </div>
  );
};
