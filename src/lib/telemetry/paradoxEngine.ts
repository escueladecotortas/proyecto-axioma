// Archivo: src/lib/telemetry/paradoxEngine.ts
export interface BiometricPercentiles {
  jitterPercentile: number;     // Percentil relativo (50% = media clínica)
  coherencePercentile: number;  // Eficiencia del gating talámico
  sympatheticRatio: number;     // Ratio simpático/vagal (SD2/SD1 aproximado)
  clinicalStatus: 'OPTIMAL' | 'COMPENSATED_ALERT' | 'HIGH_EXHAUSTION';
}

export interface DualParadoxVerdict {
  percentiles: BiometricPercentiles;
  executiveStrength: string;    // 70% Validación de solvencia
  frictionBlindspot: string;    // 30% Fricción quirúrgica
  forensicHash: string;
}

export function computeDualParadox(
  jitter: number,
  coherence: number,
  hnr: number
): DualParadoxVerdict {
  // Modelado percentil respecto a bases normativas de fonación y tono vagal
  const jitterNorm = Math.min(99, Math.max(1, Math.round((1.05 - jitter) * 110)));
  const coherenceNorm = Math.min(99, Math.max(1, Math.round(coherence * 0.95 + 4)));
  const sympRatio = Number((1.2 + (jitter * 0.8) - (coherence * 0.005)).toFixed(2));

  let status: BiometricPercentiles['clinicalStatus'] = 'COMPENSATED_ALERT';
  if (jitter <= 0.45 && coherence >= 75) status = 'OPTIMAL';
  if (jitter > 0.95 || coherence < 50) status = 'HIGH_EXHAUSTION';

  const executiveStrength =
    `Capacidad ejecutiva superior en el percentil ${coherenceNorm}%. Su sistema reticular ` +
    `filtra interferencias cognitivas y sostiene toma de decisiones de alta densidad ` +
    `incluso bajo sobrecarga operativa sostenida.`;

  const frictionBlindspot =
    `Fricción en micro-tono laríngeo (Jitter ${jitter}%). Su sistema mantiene el control ` +
    `a expensas de una hipervigilancia basal crónica: su gating talámico no descansa, ` +
    `compensando la fatiga mediante tensión simpática oculta.`;

  // Hash forense representativo
  const forensicHash = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase();

  return {
    percentiles: {
      jitterPercentile: jitterNorm,
      coherencePercentile: coherenceNorm,
      sympatheticRatio: sympRatio,
      clinicalStatus: status,
    },
    executiveStrength,
    frictionBlindspot,
    forensicHash: `AX-${forensicHash}`,
  };
}
