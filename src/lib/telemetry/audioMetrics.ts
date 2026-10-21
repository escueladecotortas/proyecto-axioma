// Archivo: src/lib/telemetry/audioMetrics.ts
export interface AudioTelemetryResult {
  rms: number;
  fundamentalFreq: number;
  jitterPct: number;
  shimmerPct: number;
  hnrDb: number;
}

export function computeAudioMetrics(
  timeDomainBuffer: Float32Array,
  sampleRate: number
): AudioTelemetryResult {
  let sumSquares = 0;
  for (let i = 0; i < timeDomainBuffer.length; i++) {
    const val = timeDomainBuffer[i];
    sumSquares += val * val;
  }
  const rms = Math.sqrt(sumSquares / timeDomainBuffer.length);

  // Estimación de F0 mediante autocorrelación simplificada
  let bestPeriod = 0;
  const minPeriod = Math.floor(sampleRate / 400); // 400 Hz max
  const maxPeriod = Math.floor(sampleRate / 70);  // 70 Hz min

  let currentPeak = 0;
  for (let lag = minPeriod; lag < maxPeriod; lag++) {
    let corr = 0;
    for (let i = 0; i < timeDomainBuffer.length - lag; i++) {
      corr += timeDomainBuffer[i] * timeDomainBuffer[i + lag];
    }
    if (corr > currentPeak) {
      currentPeak = corr;
      bestPeriod = lag;
    }
  }

  const fundamentalFreq = bestPeriod > 0 ? sampleRate / bestPeriod : 120.0;

  // Derivación de micro-perturbaciones (Jitter y Shimmer aproximados)
  let periodDeltaSum = 0;
  let ampDeltaSum = 0;
  let cycleCount = 0;
  const step = bestPeriod > 0 ? bestPeriod : 100;

  for (let i = 0; i < timeDomainBuffer.length - step * 2; i += step) {
    const a1 = Math.abs(timeDomainBuffer[i]);
    const a2 = Math.abs(timeDomainBuffer[i + step]);
    ampDeltaSum += Math.abs(a1 - a2);
    periodDeltaSum += Math.abs(step - (step + (a1 - a2) * 2));
    cycleCount++;
  }

  const jitterPct = cycleCount > 0 ? Math.min(6.5, (periodDeltaSum / (cycleCount * step)) * 100) : 1.8;
  const shimmerPct = cycleCount > 0 ? Math.min(8.0, (ampDeltaSum / cycleCount) * 100) : 2.4;
  const hnrDb = rms > 0.01 ? Math.min(30, 20 * Math.log10(rms / (shimmerPct / 100 + 0.001))) : 18.5;

  return {
    rms: Number(rms.toFixed(4)),
    fundamentalFreq: Number(fundamentalFreq.toFixed(1)),
    jitterPct: Number(jitterPct.toFixed(2)),
    shimmerPct: Number(shimmerPct.toFixed(2)),
    hnrDb: Number(hnrDb.toFixed(1)),
  };
}
