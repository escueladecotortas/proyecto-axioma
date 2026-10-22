// Archivo: src/components/telemetry/SyncTeleprompter.tsx
'use client';

import React from 'react';
import { Mic, Radio } from 'lucide-react';

interface SyncTeleprompterProps {
  isRecording: boolean;
  audioEnergy: number; // 0.0 a 1.0
  phraseIndex?: number;
}

const PHRASES = [
  "Registro la tensión en mi voz. No busco el silencio pasivo; reclamo el control de mi umbral de alerta.",
  "Mi sistema reticular procesa la carga. Desactivo la hipervigilancia y sostengo la frecuencia ejecutiva."
];

export const SyncTeleprompter: React.FC<SyncTeleprompterProps> = ({
  isRecording,
  audioEnergy,
  phraseIndex = 0,
}) => {
  const currentPhrase = PHRASES[phraseIndex % PHRASES.length];
  const words = currentPhrase.split(' ');

  // Iluminación progresiva de palabras basada en nivel espectral
  const activeWordCount = isRecording
    ? Math.min(words.length, Math.floor(audioEnergy * words.length * 2.2) + 2)
    : 0;

  return (
    <section className="w-full max-w-lg mx-auto px-6 py-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3 text-[11px] font-mono tracking-widest uppercase">
        {isRecording ? (
          <span className="flex items-center gap-1.5 text-rose-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Calibración Microacústica Activa
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-neutral-400">
            <Mic className="w-3.5 h-3.5" />
            Lectura Requerida en Voz Alta
          </span>
        )}
      </div>

      <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md shadow-2xl">
        <p className="text-base sm:text-lg font-medium leading-relaxed tracking-tight text-center">
          {words.map((word, i) => {
            const isLit = isRecording && i <= activeWordCount;
            return (
              <span
                key={i}
                className={`transition-colors duration-150 inline-block mr-1.5 ${
                  isLit
                    ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.6)]'
                    : 'text-neutral-500'
                }`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      <p className="text-[11px] text-neutral-400 font-mono mt-3 text-center">
        Pronuncie la frase a volumen constante manteniendo el dispositivo a 20 cm.
      </p>
    </section>
  );
};

export default SyncTeleprompter;
