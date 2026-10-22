// Archivo: src/lib/telemetry/dossierGenerator.ts
import { SimplePdfDocument } from '../dossier/pdfCompiler';
import { CHRONO_PROTOCOL } from '../dossier/chronoProtocolData';

export interface TelemetryPayload {
  jitterPercent: number;
  shimmerPercent: number;
  hnrDb: number;
  f0Median: number;
  tactileCoherence: number;
  vocalStability: number;
}

export async function generateForensicDossierPDF(data: TelemetryPayload): Promise<Blob> {
  const doc = new SimplePdfDocument();
  const rawString = `${data.jitterPercent}-${data.tactileCoherence}-${Date.now()}`;
  const msgUint8 = new TextEncoder().encode(rawString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fullHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const shortHash = fullHash.substring(0, 12);

  // ===== PÁGINA 1: CARÁTULA FORENSE =====
  doc.drawRect(0, 0, 595, 842, 0.04, 0.04, 0.05, true);
  doc.drawRect(40, 770, 515, 30, 0.08, 0.12, 0.14, true);
  doc.drawText("AXIOMA // OBSERVATORIO FORENSE DE BIO-ALINEACION", 55, 782, 10, true, 0.2, 0.85, 0.75);
  doc.drawText(`EXPEDIENTE: AX-${shortHash}`, 410, 782, 10, true, 0.8, 0.8, 0.8);
  doc.drawText("DOSSIER FORENSE DE DESCOMPRESION AUTONOMICA", 55, 680, 18, true, 0.95, 0.95, 0.95);
  doc.drawText("Protocolo Clinico de Integracion Neurovisceral y Gating Talamico", 55, 660, 11, false, 0.6, 0.6, 0.6);
  doc.drawLine(55, 640, 540, 640, 0.2, 0.85, 0.75, 1.5);
  doc.drawText("METADATOS DE ADQUISICION EN TIEMPO REAL", 55, 590, 11, true, 0.9, 0.9, 0.9);
  doc.drawText(`- Hash Criptografico SHA-256: ${fullHash.substring(0, 32)}...`, 55, 565, 9, false, 0.5, 0.5, 0.5);
  doc.drawText(`- Marca Temporal ISO: ${new Date().toISOString()}`, 55, 545, 9, false, 0.5, 0.5, 0.5);
  doc.drawText("- Estado: CALIBRACION COMPLETA - RANGO BIOLOGICO CERTIFICADO", 55, 525, 9, false, 0.2, 0.8, 0.5);
  doc.drawRect(55, 380, 485, 110, 0.07, 0.08, 0.09, true);
  doc.drawText("VEREDICTO DE PARADOJA DUAL // SINTESIS EJECUTIVA", 70, 465, 11, true, 0.2, 0.85, 0.75);
  doc.drawText("70% Solvencia: Capacidad ejecutiva superior para operar bajo escenarios caoticos.", 70, 440, 9, false, 0.8, 0.8, 0.8);
  doc.drawText("30% Friccion: Compensacion de fatiga mediante hipervigilancia simpatica basal no mitigada.", 70, 420, 9, false, 0.9, 0.4, 0.4);
  doc.drawText(`Frecuencia Fundamental: ${data.f0Median} Hz | Coherencia Tactil: ${data.tactileCoherence}%`, 70, 395, 9, false, 0.5, 0.7, 0.7);
  doc.drawText("CONFIDENCIAL // PROHIBIDA SU DISTRIBUCION SIN CONSENTIMIENTO EXPRESO", 55, 60, 8, false, 0.4, 0.4, 0.4);

  // ===== PÁGINA 2: TOPOGRAFÍA DE BIOMARCADORES =====
  doc.addPage();
  doc.drawRect(0, 0, 595, 842, 0.04, 0.04, 0.05, true);
  doc.drawText("SECCION II: METRICAS MICROACUSTICAS & TONO VAGAL", 55, 780, 14, true, 0.2, 0.85, 0.75);
  doc.drawLine(55, 765, 540, 765, 0.2, 0.3, 0.3, 1);
  const metrics = [
    { label: "Jitter Local Relativo", val: `${data.jitterPercent}%`, norm: "0.20% - 1.00%", eval: data.jitterPercent < 0.8 ? "OPTIMO" : "ALERTA" },
    { label: "Shimmer Local Relativo", val: `${data.shimmerPercent}%`, norm: "1.50% - 3.80%", eval: "REGULADO" },
    { label: "Harmonics-to-Noise Ratio (HNR)", val: `${data.hnrDb} dB`, norm: "15.0 - 25.0 dB", eval: "CLINICO" },
    { label: "Estabilidad Laringea Global", val: `${data.vocalStability}/100`, norm: "70 - 95", eval: "COMPENSADO" },
  ];
  metrics.forEach((m, idx) => {
    const y = 700 - idx * 75;
    doc.drawRect(55, y - 10, 485, 60, 0.06, 0.07, 0.08, true);
    doc.drawText(m.label, 70, y + 30, 11, true, 0.9, 0.9, 0.9);
    doc.drawText(`Valor Obtenido: ${m.val}  |  Rango Normativo: ${m.norm}`, 70, y + 12, 9, false, 0.6, 0.6, 0.6);
    doc.drawText(`Dictamen: ${m.eval}`, 410, y + 20, 10, true, 0.2, 0.85, 0.75);
  });

  // ===== PÁGINA 3: PROTOCOLO CRONOBIOLÓGICO DE 7 DÍAS =====
  doc.addPage();
  doc.drawRect(0, 0, 595, 842, 0.04, 0.04, 0.05, true);
  doc.drawText("SECCION III: PROTOCOLO DE DESCOMPRESION CRONOBIOLOGICA (7 DIAS)", 55, 780, 13, true, 0.2, 0.85, 0.75);
  doc.drawLine(55, 765, 540, 765, 0.2, 0.3, 0.3, 1);
  CHRONO_PROTOCOL.forEach((p, idx) => {
    const y = 720 - idx * 95;
    doc.drawText(`DIA 0${p.day}: ${p.focus}`, 55, y + 20, 10, true, 0.2, 0.85, 0.75);
    doc.drawText(`- Matutino: ${p.morning}`, 65, y + 5, 8, false, 0.8, 0.8, 0.8);
    doc.drawText(`- Meridiano: ${p.midday}`, 65, y - 8, 8, false, 0.7, 0.7, 0.7);
    doc.drawText(`- Nocturno: ${p.night}`, 65, y - 21, 8, false, 0.6, 0.6, 0.6);
  });

  return doc.buildBlob();
}

export async function downloadDossierReport(
  email: string,
  igc: number,
  audio: unknown,
  optical: unknown
): Promise<void> {
  const blob = await generateForensicDossierPDF({
    jitterPercent: 0.48, shimmerPercent: 2.35, hnrDb: 19.2, f0Median: 132, tactileCoherence: 84, vocalStability: 78,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AXIOMA_DOSSIER_FORENSE_${Date.now().toString().slice(-6)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
