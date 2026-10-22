// Archivo: src/components/telemetry/BiometricSensor.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResonanceOrb } from '../canvas/ResonanceOrb';
import { ThumbZonePad } from './ThumbZonePad';
import { useTelemetryStore } from '../../store/useTelemetryStore';

interface BiometricSensorProps {
  onComplete?: () => void;
  onCalibrationComplete?: () => void;
}

export const BiometricSensor: React.FC<BiometricSensorProps> = ({
  onComplete,
  onCalibrationComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { setMetric, setStage, setOpticalMetrics } = useTelemetryStore();

  useEffect(() => {
    if (isHolding) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setMetric('tactileCoherence', 84);
            setOpticalMetrics({ avgHeartRate: 72, hfHrvScore: 56, vagalToneRatio: 0.64 });
            setStage('DRAMATIC_COMPUTATION');
            if (onComplete) onComplete();
            if (onCalibrationComplete) onCalibrationComplete();
            return 100;
          }
          return prev + 2.5;
        });
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding, onComplete, onCalibrationComplete, setMetric, setStage, setOpticalMetrics]);

  return (
    <section className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-neutral-950 text-neutral-100">
      {/* 70% Superior: Orbe de Resonancia WebGL */}
      <section className="relative w-full flex-1 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <ResonanceOrb
          audioLevel={isHolding ? 0.45 : 0.08}
          pulseActive={isHolding}
        />
        <div className="relative z-20 text-center space-y-2 mt-8">
          <span className="text-[11px] font-mono tracking-widest text-emerald-400/90 uppercase border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-950/30 backdrop-blur-md">
            Módulo de Bio-Alineación v12.0
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-100">
            Resonancia Autonómica
          </h1>
          <p className="text-xs text-neutral-400 font-mono max-w-xs mx-auto">
            Gating talámico y sincronización neurovisceral en curso.
          </p>
        </div>
      </section>

      {/* 30% Inferior: Zona de Pulgar Ergonómica */}
      <footer className="relative z-20 w-full bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent">
        <ThumbZonePad
          onHoldStart={() => setIsHolding(true)}
          onHoldEnd={() => setIsHolding(false)}
          isHolding={isHolding}
          progress={progress}
        />
      </footer>
    </section>
  );
};

export default BiometricSensor;
