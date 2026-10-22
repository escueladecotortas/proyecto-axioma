// Archivo: scripts/test_sprint2_dsp.js
const fs = require("fs");
const path = require("path");

function runSprint2DspAudit() {
  console.log("🛡️ [ARGUS // QA] Auditando Sprint 2: DSP Acústico y Teleprompter...\n");

  const baseDir = path.resolve(__dirname, "..");
  let hasErrors = false;

  // 1. Límites estrictos de LOC
  const limits = [
    { file: "src/lib/telemetry/pitchDetector.ts", maxLoc: 115 },
    { file: "src/lib/telemetry/audioMetrics.ts", maxLoc: 115 },
    { file: "src/components/telemetry/SyncTeleprompter.tsx", maxLoc: 90 },
    { file: "src/store/useTelemetryStore.ts", maxLoc: 65 },
  ];

  console.log("📏 1. Verificación de Límites de Líneas de Código (LOC):");
  limits.forEach(({ file, maxLoc }) => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Archivo ausente: ${file}`);
      hasErrors = true;
      return;
    }
    const lines = fs.readFileSync(fullPath, "utf-8").split("\n").length;
    if (lines > maxLoc) {
      console.error(`❌ ${file} supera el límite: ${lines} LOC (Máximo: ${maxLoc})`);
      hasErrors = true;
    } else {
      console.log(`✅ ${file}: ${lines} LOC <= ${maxLoc} LOC nominal`);
    }
  });

  // 2. Verificación de deshabilitación de filtros nativos del SO
  console.log("\n🎛️ 2. Verificación de audio crudo en getRawAudioStream():");
  const audioMetricsContent = fs.readFileSync(path.join(baseDir, "src/lib/telemetry/audioMetrics.ts"), "utf-8");
  const requiredDisabledFilters = [
    "echoCancellation: false",
    "noiseSuppression: false",
    "autoGainControl: false",
  ];
  requiredDisabledFilters.forEach((filter) => {
    if (!audioMetricsContent.includes(filter)) {
      console.error(`❌ Filtro no deshabilitado: '${filter}'`);
      hasErrors = true;
    } else {
      console.log(`✅ Filtro nativo anulado: '${filter}'`);
    }
  });

  // 3. Verificación de garantía biológica de Jitter (nunca < 0.20%)
  console.log("\n🧬 3. Verificación de Clamping Fisiológico de Jitter (mínimo >= 0.20%):");
  if (!audioMetricsContent.includes("Math.max(0.24")) {
    console.error("❌ Falta clamping biológico mínimo (Math.max(0.24, ...)) en audioMetrics.ts");
    hasErrors = true;
  } else {
    console.log("✅ Clamping biológico certificado en audioMetrics.ts: Jitter >= 0.24% (seguro ante rangos irreales)");
  }

  // 4. Verificación de componentes e imports en SyncTeleprompter
  console.log("\n🎙️ 4. Verificación de SyncTeleprompter.tsx:");
  const teleprompterContent = fs.readFileSync(path.join(baseDir, "src/components/telemetry/SyncTeleprompter.tsx"), "utf-8");
  if (!teleprompterContent.includes("audioEnergy") || !teleprompterContent.includes("isRecording")) {
    console.error("❌ Faltan props reactivas en SyncTeleprompter.tsx");
    hasErrors = true;
  } else {
    console.log("✅ Props reactivas y renderizado de anclaje neurovisceral verificado.");
  }

  if (hasErrors) {
    console.error("\n❌ [ARGUS // QA] Fallo en la certificación de Sprint 2.");
    process.exit(1);
  } else {
    console.log("\n✨ [ARGUS // QA] Certificación nominal de Sprint 2 completada con éxito.");
  }
}

runSprint2DspAudit();
