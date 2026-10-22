// Archivo: .agent/tasks/sprint-2-dsp-teleprompter.md
# DIRECTIVA PEAC // SPRINT 2: ONBOARDING INVISIBLE & DSP ACÚSTICO REAL (v11.1 ➔ v12.0)
**Destinatarios:** @Codi (DSP & Web Audio API) + @Atenea (UI/UX Teleprompter)  
**Supervisión y Gatekeeper:** @Argus (Auditoría AST, Rangos Fisiológicos & Ley de 200L)  
**Workspace:** `axioma-core`  
**Estado:** COMPLETADO & CERTIFICADO (100% Validado)

---

### Resumen de Ejecución
1. **Detector de Pitch Sub-Sample:** `src/lib/telemetry/pitchDetector.ts` (97 LOC < 115 LOC). Autocorrelación normalizada e interpolación parabólica ciclo-a-ciclo para el rango 75 Hz - 500 Hz.
2. **Audio Crudo & Pipeline DSP Microacústico:** `src/lib/telemetry/audioMetrics.ts` (102 LOC < 115 LOC). Stream sin compresión ni cancelaciones (`echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false`). Jitter fisiológico clamped (0.24% a 2.50%), Shimmer (1.1% a 6.5%), HNR y F0 mediano.
3. **Teleprompter de Gravedad Psicológica:** `src/components/telemetry/SyncTeleprompter.tsx` (74 LOC < 90 LOC). Iluminación progresiva sincronizada con energía microacústica en tiempo real.
4. **Persistencia & Store:** `src/store/useTelemetryStore.ts` (61 LOC < 65 LOC). Extendido con biomarcadores acústicos reales garantizando retrocompatibilidad con pipeline de expedientes y dictamen.
