// Archivo: src/lib/telemetry/pitchDetector.ts
/**
 * Estimador de tono y períodos glóticos ciclo-a-ciclo con interpolación parabólica.
 * Rango vocal humano: 75 Hz (T ~ 13.3ms) a 500 Hz (T ~ 2.0ms).
 */

export interface GlottalCycle {
  periodSamples: number;
  periodSeconds: number;
  amplitude: number;
}

export function extractGlottalCycles(
  buffer: Float32Array,
  sampleRate: number
): GlottalCycle[] {
  const minPeriod = Math.floor(sampleRate / 500); // ~500 Hz
  const maxPeriod = Math.floor(sampleRate / 75);  // ~75 Hz
  const cycles: GlottalCycle[] = [];

  const windowSize = Math.min(buffer.length, 2048);
  let cursor = 0;

  while (cursor + maxPeriod * 2 < windowSize) {
    let bestLag = -1;
    let maxCorr = -1;

    // Autocorrelación normalizada en la ventana local
    for (let lag = minPeriod; lag <= maxPeriod; lag++) {
      let sum = 0;
      let energy1 = 0;
      let energy2 = 0;

      for (let i = 0; i < maxPeriod; i++) {
        const a = buffer[cursor + i];
        const b = buffer[cursor + i + lag];
        sum += a * b;
        energy1 += a * a;
        energy2 += b * b;
      }

      const norm = Math.sqrt(energy1 * energy2);
      const corr = norm > 0.0001 ? sum / norm : 0;

      if (corr > maxCorr) {
        maxCorr = corr;
        bestLag = lag;
      }
    }

    // Aceptamos ciclo si la autocorrelación supera umbral de periodicidad
    if (bestLag > minPeriod && bestLag < maxPeriod && maxCorr > 0.45) {
      // Interpolación parabólica para resolución sub-sample
      const s0 = getCorr(buffer, cursor, bestLag - 1, maxPeriod);
      const s1 = maxCorr;
      const s2 = getCorr(buffer, cursor, bestLag + 1, maxPeriod);

      const denominator = 2 * (2 * s1 - s0 - s2);
      const delta = denominator !== 0 ? (s2 - s0) / denominator : 0;
      const refinedLag = bestLag + Math.max(-0.5, Math.min(0.5, delta));

      // Medir amplitud pico en este ciclo
      let maxAmp = 0;
      for (let i = 0; i < bestLag; i++) {
        const val = Math.abs(buffer[cursor + i]);
        if (val > maxAmp) maxAmp = val;
      }

      cycles.push({
        periodSamples: refinedLag,
        periodSeconds: refinedLag / sampleRate,
        amplitude: maxAmp,
      });

      cursor += Math.round(bestLag);
    } else {
      cursor += minPeriod;
    }
  }

  return cycles;
}

function getCorr(buf: Float32Array, offset: number, lag: number, len: number): number {
  let sum = 0;
  let e1 = 0;
  let e2 = 0;
  for (let i = 0; i < len; i++) {
    const a = buf[offset + i];
    const b = buf[offset + i + lag];
    sum += a * b;
    e1 += a * a;
    e2 += b * b;
  }
  const norm = Math.sqrt(e1 * e2);
  return norm > 0.0001 ? sum / norm : 0;
}
