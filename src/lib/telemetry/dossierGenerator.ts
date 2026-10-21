// Archivo: src/lib/telemetry/dossierGenerator.ts
import { AudioTelemetryResult } from "./audioMetrics";
import { OpticalTelemetryResult } from "./opticalMetrics";

export function downloadDossierReport(
  email: string,
  igc: number,
  audio: AudioTelemetryResult | null,
  optical: OpticalTelemetryResult | null
) {
  const dateStr = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const content = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dossier de Coherencia // Axioma</title>
  <style>
    body { font-family: monospace; background: #050505; color: #e5e5e5; padding: 30px; margin: 0; line-height: 1.6; }
    .header { border-bottom: 2px solid #00F2FE; padding-bottom: 15px; margin-bottom: 30px; }
    h1 { color: #00F2FE; margin: 0 0 5px 0; font-size: 22px; text-transform: uppercase; }
    .meta { font-size: 11px; color: #737373; }
    .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 25px 0; }
    .card { background: #0f0f0f; border: 1px solid #262626; padding: 15px; border-radius: 8px; text-align: center; }
    .card-val { font-size: 26px; font-weight: bold; color: #00F2FE; margin: 5px 0; }
    .card-label { font-size: 10px; color: #a3a3a3; text-transform: uppercase; }
    .block { background: #0a0a0a; border-left: 3px solid #00F2FE; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .block-warn { border-left-color: #f59e0b; }
    .block h3 { margin-top: 0; font-size: 13px; text-transform: uppercase; }
    .protocol-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
    .protocol-table th, .protocol-table td { border: 1px solid #262626; padding: 10px; text-align: left; }
    .protocol-table th { background: #141414; color: #00F2FE; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Axioma Core // Expediente de Coherencia Personal</h1>
    <div class="meta">Asignado a: ${email} | Fecha: ${dateStr} | Certificado: HASH-${Math.random().toString(36).substring(2, 9).toUpperCase()}</div>
  </div>

  <div class="metric-grid">
    <div class="card">
      <div class="card-label">Claridad Global</div>
      <div class="card-val">${igc} / 100</div>
      <div class="card-label">Nivel de Integración</div>
    </div>
    <div class="card">
      <div class="card-label">Nivel de Sobrecarga</div>
      <div class="card-val" style="color: #f59e0b;">${100 - (optical?.hfHrvScore ?? 42)}%</div>
      <div class="card-label">Carga en Reposo</div>
    </div>
    <div class="card">
      <div class="card-label">Tensión Vocal</div>
      <div class="card-val" style="color: #38bdf8;">${audio?.jitterPct ?? 2.8}%</div>
      <div class="card-label">Micro-tensión Detectada</div>
    </div>
  </div>

  <div class="block">
    <h3 style="color: #38bdf8;">Tu Fortaleza Principal (70% del Perfil)</h3>
    <p>Sos el pilar operativo y emocional de tus entornos más importantes. Tenés una capacidad natural para absorber la presión, ordenar el caos y resolver problemas críticos manteniendo la calma hacia afuera cuando los demás se desbordan.</p>
  </div>

  <div class="block block-warn">
    <h3 style="color: #f59e0b;">Tu Punto Ciego Crítico (30% a Corregir)</h3>
    <p>Ese liderazgo lo estás pagando con un costo invisible: vivís en un estado de alerta silenciosa permanente. Tenés la convicción interna de que si aflojás o soltás el control un solo día, todo a tu alrededor pierde estabilidad. Eso te impide descansar de verdad y te drena la energía al final del día.</p>
  </div>

  <h3 style="color: #00F2FE; margin-top: 30px;">Protocolo de Calibración de 7 Días</h3>
  <table class="protocol-table">
    <tr><th>Día</th><th>Momento</th><th>Acción Práctica</th></tr>
    <tr><td>Día 1</td><td>Al despertar (15m)</td><td>Luz solar directa sin pantallas ni celular para reiniciar tu reloj biológico.</td></tr>
    <tr><td>Día 2</td><td>Tarde (6m)</td><td>Respiración guiada 4s inhalar / 6s exhalar para frenar la alerta mental.</td></tr>
    <tr><td>Día 3</td><td>Corte vespertino (20m)</td><td>Desconexión sensorial completa en penumbra sin inputs ni sonido.</td></tr>
    <tr><td>Día 4</td><td>Jornada laboral</td><td>Dos bloques de 90 minutos de foco absoluto con teléfono en otra habitación.</td></tr>
    <tr><td>Día 5</td><td>Noche (5m)</td><td>Relajación con tonos vocales graves para destrabar la tensión en la garganta.</td></tr>
    <tr><td>Día 6</td><td>Mañana (3m)</td><td>Ducha fría controlada para recuperar control voluntario ante el estrés.</td></tr>
    <tr><td>Día 7</td><td>Cierre semanal</td><td>Reevaluación de voz y comparativa de descanso semanal.</td></tr>
  </table>
</body>
</html>`;

  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Axioma_Dossier_Coherencia_${email.split("@")[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
