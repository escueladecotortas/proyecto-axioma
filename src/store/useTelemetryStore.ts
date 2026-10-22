// Archivo: src/store/useTelemetryStore.ts
import { create } from 'zustand';
import { AudioTelemetryResult } from '@/lib/telemetry/audioMetrics';

export interface TelemetryState {
  tactileCoherence: number;
  jitterPercent: number;
  shimmerPercent: number;
  hnrDb: number;
  f0Median: number;
  vocalStability: number;
  phase: 'PROLOGUE' | 'CALIBRATION' | 'SENSOR' | 'DRAMATIC_COMPUTATION' | 'VERDICT' | 'PAYWALL';
  stage: 'IDLE' | 'VOCAL_CAPTURE' | 'OPTICAL_CAPTURE' | 'DRAMATIC_COMPUTATION' | 'COMPLETED';
  computedIgc: number | null;
  audioMetrics: AudioTelemetryResult | null;
  opticalMetrics: { avgHeartRate: number; hfHrvScore: number; vagalToneRatio: number } | null;

  setMetric: (key: string, value: number) => void;
  setAcousticResults: (results: { jitterPercent: number; shimmerPercent: number; hnrDb: number; f0Median: number; vocalStability: number }) => void;
  setPhase: (phase: TelemetryState['phase']) => void;
  setStage: (stage: TelemetryState['stage']) => void;
  setAudioMetrics: (metrics: AudioTelemetryResult) => void;
  setOpticalMetrics: (metrics: NonNullable<TelemetryState['opticalMetrics']>) => void;
  finalizeComputation: () => void;
  resetTelemetry: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  tactileCoherence: 84,
  jitterPercent: 0.48,
  shimmerPercent: 2.35,
  hnrDb: 19.2,
  f0Median: 132,
  vocalStability: 78,
  phase: 'PROLOGUE',
  stage: 'IDLE',
  computedIgc: null,
  audioMetrics: { jitterPct: 0.48, shimmerPct: 2.35, hnrDb: 19.2, fundamentalFreq: 132, rms: 0.05 },
  opticalMetrics: { avgHeartRate: 72, hfHrvScore: 56, vagalToneRatio: 0.64 },

  setMetric: (key, value) => set((s) => ({ ...s, [key]: value })),
  setAcousticResults: (res) => set((s) => ({
    ...s, ...res,
    audioMetrics: { jitterPct: res.jitterPercent, shimmerPct: res.shimmerPercent, hnrDb: res.hnrDb, fundamentalFreq: res.f0Median, rms: 0.05 },
  })),
  setPhase: (phase) => set({ phase }),
  setStage: (stage) => set({ stage }),
  setAudioMetrics: (audioMetrics) => set({ audioMetrics }),
  setOpticalMetrics: (opticalMetrics) => set({ opticalMetrics }),
  finalizeComputation: () => {
    const { opticalMetrics, jitterPercent, shimmerPercent } = get();
    const hrv = opticalMetrics?.hfHrvScore ?? 54;
    const stability = 100 - (jitterPercent * 15 + shimmerPercent * 5);
    const computedIgc = Math.min(98, Math.max(30, Math.round(hrv * 0.55 + Math.max(20, stability) * 0.45)));
    set({ computedIgc, stage: 'COMPLETED', phase: 'VERDICT' });
  },
  resetTelemetry: () => set({
    tactileCoherence: 84, jitterPercent: 0.48, shimmerPercent: 2.35, hnrDb: 19.2, f0Median: 132, vocalStability: 78,
    phase: 'PROLOGUE', stage: 'IDLE', computedIgc: null,
  }),
}));
