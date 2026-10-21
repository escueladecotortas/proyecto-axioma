// Archivo: src/components/BiometricSensor.jsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export function BiometricSensor({ onCalibrationComplete = null } = {}) {
  const canvasRef = useRef(null);
  const [isHolding, setIsHolding] = useState(false);
  const [warningText, setWarningText] = useState("");
  const holdStartTimeRef = useRef(null);
  const progressRef = useRef(0);
  const animFrameRef = useRef(null);
  const isCompletedRef = useRef(false);

  const startHold = useCallback(() => {
    if (isCompletedRef.current) return;
    setIsHolding(true);
    setWarningText("");
    holdStartTimeRef.current = performance.now() - (progressRef.current * 3500);
  }, []);

  const endHold = useCallback(() => {
    if (isCompletedRef.current) return;
    setIsHolding(false);
    holdStartTimeRef.current = null;
    if (progressRef.current > 0.05 && progressRef.current < 1) {
      setWarningText("Mantené el pulgar para completar la sintonización");
      setTimeout(() => setWarningText(""), 2800);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = 260;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;

    const render = (time) => {
      ctx.clearRect(0, 0, size, size);

      // Actualización de progreso (3.5 segundos requeridos)
      if (isHolding && !isCompletedRef.current && holdStartTimeRef.current) {
        const elapsed = time - holdStartTimeRef.current;
        progressRef.current = Math.min(1, elapsed / 3500);
        if (progressRef.current >= 1 && !isCompletedRef.current) {
          isCompletedRef.current = true;
          if (onCalibrationComplete) onCalibrationComplete();
          useTelemetryStore.getState().setStage("DRAMATIC_COMPUTATION");
        }
      } else if (!isHolding && progressRef.current > 0) {
        progressRef.current = Math.max(0, progressRef.current - 0.04);
      }

      const p = progressRef.current;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.003);

      // Color interpolado: Cian Cósmico (#00F2FE) a Acento Estelar (#E2B872)
      const r = Math.round(0 + p * (226 - 0));
      const g = Math.round(242 + p * (184 - 242));
      const b = Math.round(254 + p * (114 - 254));
      const activeColor = `rgb(${r}, ${g}, ${b})`;

      // 1. Halo difuso exterior
      const haloRadius = 75 + pulse * 6 + p * 25;
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, haloRadius);
      grad.addColorStop(0, isHolding ? `rgba(${r}, ${g}, ${b}, 0.25)` : "rgba(0, 242, 254, 0.08)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Anillos concéntricos dactilares con colapso hacia el centro
      const ringCount = 7;
      for (let i = 1; i <= ringCount; i++) {
        const baseRadius = i * 11;
        const collapseFactor = 1 - (p * 0.35);
        const ringRadius = Math.max(6, baseRadius * collapseFactor);
        const waveDistort = isHolding ? Math.sin(time * 0.008 + i) * (3 * p) : 0;

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius + waveDistort, 0, Math.PI * 2);
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 1.2 + (p * 0.8);
        ctx.globalAlpha = 0.2 + (p * 0.6) + (i === ringCount ? pulse * 0.2 : 0);
        ctx.shadowBlur = isHolding ? 10 * p : 4;
        ctx.shadowColor = activeColor;
        ctx.stroke();
      }

      // 3. Barra perimetral de progreso concéntrico
      const trackRadius = 105;
      ctx.beginPath();
      ctx.arc(cx, cy, trackRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245, 245, 247, 0.08)";
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();

      if (p > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, trackRadius, -Math.PI / 2, -Math.PI / 2 + p * (Math.PI * 2));
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = activeColor;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isHolding, onCalibrationComplete]);

  return (
    <div className="relative flex flex-col items-center select-none">
      <div
        className="relative flex items-center justify-center cursor-pointer touch-none"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={(e) => { e.preventDefault(); startHold(); }}
        onTouchEnd={(e) => { e.preventDefault(); endHold(); }}
        onTouchCancel={(e) => { e.preventDefault(); endHold(); }}
        role="button"
        tabIndex={0}
        aria-label="Sensor biométrico táctil"
      >
        <canvas ref={canvasRef} className="h-[260px] w-[260px]" />
        <div className="absolute pointer-events-none text-center">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#F5F5F7]/80">
            {isHolding ? "SINTONIZANDO..." : "MANTENER PULSADO"}
          </span>
        </div>
      </div>

      {/* Alerta de reseteo suave */}
      <div className="min-h-[24px] mt-3">
        {warningText && (
          <p className="font-mono text-xs text-[#E2B872] tracking-wider animate-cinematic-text text-center">
            {warningText}
          </p>
        )}
      </div>
    </div>
  );
}

export default BiometricSensor;
