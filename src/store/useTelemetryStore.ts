// Archivo: src/store/useTelemetryStore.ts
import { create } from "zustand";
import { AudioTelemetryResult } from "@/lib/telemetry/audioMetrics";
import { OpticalTelemetryResult } from "@/lib/telemetry/opticalMetrics";

export type TelemetryStage = 
  | "IDLE" 
  | "VOCAL_CAPTURE" 
  | "OPTICAL_CAPTURE" 
  | "DRAMATIC_COMPUTATION" 
  | "COMPLETED";

interface TelemetryState {
  stage: TelemetryStage;
  audioMetrics: AudioTelemetryResult | null;
  opticalMetrics: OpticalTelemetryResult | null;
  computedIgc: number | null;
  tactileCoherence: number | null;
  setStage: (stage: TelemetryStage) => void;
  setAudioMetrics: (metrics: AudioTelemetryResult) => void;
  setOpticalMetrics: (metrics: OpticalTelemetryResult) => void;
  setMetric: (name: string, value: number) => void;
  finalizeComputation: () => void;
  resetTelemetry: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  stage: "IDLE",
  audioMetrics: null,
  opticalMetrics: null,
  computedIgc: null,
  tactileCoherence: null,

  setStage: (stage) => set({ stage }),
  setAudioMetrics: (audioMetrics) => set({ audioMetrics }),
  setOpticalMetrics: (opticalMetrics) => set({ opticalMetrics }),
  setMetric: (name, value) => {
    if (name === "tactileCoherence") {
      set({ tactileCoherence: value });
    }
  },

  finalizeComputation: () => {
    const { audioMetrics, opticalMetrics } = get();
    const hrvPart = opticalMetrics?.hfHrvScore ?? 50;
    const voiceStability = 100 - (audioMetrics ? (audioMetrics.jitterPct + audioMetrics.shimmerPct) * 8 : 40);
    const rawIgc = Math.round(hrvPart * 0.55 + Math.max(20, voiceStability) * 0.45);
    const computedIgc = Math.min(98, Math.max(30, rawIgc));

    set({ computedIgc, stage: "COMPLETED" });
  },

  resetTelemetry: () => set({
    stage: "IDLE",
    audioMetrics: null,
    opticalMetrics: null,
    computedIgc: null,
    tactileCoherence: null,
  }),
}));
