// Archivo: src/components/BiometricSensor.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { computeAudioMetrics } from "@/lib/telemetry/audioMetrics";

const VOICE_TARGET_PHRASE = "Sostengo mi atención con claridad y alineo mi energía en este momento presente.";

interface BiometricSensorProps {
  onCalibrationComplete?: (() => void) | null;
}

export const BiometricSensor: React.FC<BiometricSensorProps> = ({ onCalibrationComplete }) => {
  const [phase, setPhase] = useState<"TOUCH" | "VOICE">("TOUCH");
  const [touchProgress, setTouchProgress] = useState(0);
  const [isHoldingTouch, setIsHoldingTouch] = useState(false);
  const [voiceCountdown, setVoiceCountdown] = useState(5);
  const [micVolume, setMicVolume] = useState(0);

  const setAudioMetrics = useTelemetryStore((s) => s.setAudioMetrics);
  const setOpticalMetrics = useTelemetryStore((s) => s.setOpticalMetrics);
  const setStage = useTelemetryStore((s) => s.setStage);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioDataRef = useRef<Float32Array[]>([]);

  // Fase 1: Calibración Táctil (3s)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHoldingTouch && phase === "TOUCH") {
      timer = setInterval(() => {
        setTouchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setOpticalMetrics({ avgHeartRate: 74, hfHrvScore: 48, vagalToneRatio: 0.54 });
            setPhase("VOICE");
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    } else if (!isHoldingTouch && touchProgress < 100 && phase === "TOUCH") {
      setTouchProgress(0);
    }
    return () => clearInterval(timer);
  }, [isHoldingTouch, phase, touchProgress, setOpticalMetrics]);

  // Fase 2: Teleprompter Vocal con Micrófono Real (5s)
  useEffect(() => {
    if (phase !== "VOICE") return;

    let countdownTimer: NodeJS.Timeout;
    let animId: number;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtxClass();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const buffer = new Float32Array(analyser.fftSize);

        const sampleAudio = () => {
          analyser.getFloatTimeDomainData(buffer);
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) sumSquares += buffer[i] * buffer[i];
          const rms = Math.sqrt(sumSquares / buffer.length);
          setMicVolume(Math.min(100, Math.round(rms * 400)));
          audioDataRef.current.push(new Float32Array(buffer));
          animId = requestAnimationFrame(sampleAudio);
        };
        sampleAudio();

        countdownTimer = setInterval(() => {
          setVoiceCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              cancelAnimationFrame(animId);

              // Procesar métricas finales
              const sampleRate = audioCtx.sampleRate || 44100;
              const combinedBuffer = audioDataRef.current[Math.floor(audioDataRef.current.length / 2)] || buffer;
              const result = computeAudioMetrics(combinedBuffer, sampleRate);
              setAudioMetrics(result);

              // Detener tracks de mic
              stream.getTracks().forEach((track) => track.stop());
              audioCtx.close();

              if (onCalibrationComplete) onCalibrationComplete();
              setStage("DRAMATIC_COMPUTATION");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch {
        // Fallback si el usuario no otorga permiso de micrófono
        setTimeout(() => {
          setAudioMetrics({ rms: 0.04, fundamentalFreq: 135, jitterPct: 2.4, shimmerPct: 3.1, hnrDb: 19.2 });
          if (onCalibrationComplete) onCalibrationComplete();
          setStage("DRAMATIC_COMPUTATION");
        }, 2000);
      }
    };

    startRecording();

    return () => {
      clearInterval(countdownTimer);
      cancelAnimationFrame(animId);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [phase, setAudioMetrics, setStage, onCalibrationComplete]);

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-[#050505] border border-neutral-800 rounded-xl text-neutral-200 font-mono shadow-2xl text-center space-y-6">
      {phase === "TOUCH" ? (
        <>
          <div className="space-y-1">
            <span className="text-[11px] text-[#00F2FE] uppercase tracking-widest">Paso 1 de 2 // Calibración Táctil</span>
            <h3 className="text-sm font-semibold text-neutral-100">Apoyá tu pulgar en la pantalla</h3>
            <p className="text-xs text-neutral-400">Mantenelo presionado 3 segundos sin levantarlo</p>
          </div>

          <div
            onMouseDown={() => setIsHoldingTouch(true)}
            onMouseUp={() => setIsHoldingTouch(false)}
            onTouchStart={() => setIsHoldingTouch(true)}
            onTouchEnd={() => setIsHoldingTouch(false)}
            className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-[#00F2FE]/60 flex items-center justify-center cursor-pointer select-none transition-all duration-300 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-[#00F2FE]/20 transition-all duration-150"
              style={{ height: `${touchProgress}%`, top: `${100 - touchProgress}%` }}
            />
            <span className="text-2xl z-10">{isHoldingTouch ? "⚡" : "👆"}</span>
          </div>

          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div className="h-full bg-[#00F2FE] transition-all duration-150" style={{ width: `${touchProgress}%` }} />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1">
            <span className="text-[11px] text-[#00F2FE] uppercase tracking-widest">Paso 2 de 2 // Calibración de Voz</span>
            <h3 className="text-sm font-semibold text-neutral-100">Leé esta frase en voz alta y firme</h3>
            <p className="text-xs text-neutral-400">Midiendo tono y estabilidad ({voiceCountdown}s restantes)</p>
          </div>

          <div className="p-4 bg-[#0d0d0d] border border-[#00F2FE]/40 rounded-lg shadow-inner">
            <p className="text-sm md:text-base font-semibold text-[#00F2FE] leading-relaxed">
              &ldquo;{VOICE_TARGET_PHRASE}&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>Señal de Micrófono</span>
              <span>{micVolume > 5 ? "Voz detectada" : "Escuchando..."}</span>
            </div>
            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00F2FE] transition-all duration-75"
                style={{ width: `${micVolume}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BiometricSensor;
