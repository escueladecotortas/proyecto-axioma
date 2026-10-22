// Archivo: scripts/run_quality_gate.js
const path = require('path');
const { executePipeline } = require('C:/Users/leola/Downloads/blueprint-nexus/system_core/engine/quality_gate_pipeline.js');

const targetFiles = [
  'src/components/canvas/orbShaders.ts',
  'src/components/canvas/ResonanceOrb.tsx',
  'src/components/telemetry/ThumbZonePad.tsx',
  'src/components/telemetry/BiometricSensor.tsx',
  'src/lib/telemetry/pitchDetector.ts',
  'src/lib/telemetry/audioMetrics.ts',
  'src/components/telemetry/SyncTeleprompter.tsx',
  'src/store/useTelemetryStore.ts',
  'src/lib/telemetry/paradoxEngine.ts',
  'src/components/verdict/PoincarePlot.tsx',
  'src/components/verdict/TacticalVerdict.tsx',
  'src/lib/dossier/chronoProtocolData.ts',
  'src/lib/dossier/pdfCompiler.ts',
  'src/lib/telemetry/dossierGenerator.ts',
  'src/components/telemetry/PaywallGate.tsx',
  'src/app/page.tsx',
];

const res = executePipeline({
  taskName: 'CIERRE_SESION_SPRINT_1_4',
  targetFiles: targetFiles.map((f) => path.resolve(__dirname, '..', f)),
  testScriptPath: path.resolve(__dirname, 'test_sprint4_dossier.js'),
  options: {
    cwd: path.resolve(__dirname, '..'),
    maxLines: 200,
    warningThreshold: 180,
  },
});

console.log(res.message);
if (res.warnings && res.warnings.length > 0) {
  res.warnings.forEach((w) => console.log('  ⚠️ ' + w.message));
}
if (res.veto) {
  console.error('  ❌ VETO:', res.reason, res.message);
  process.exit(1);
} else {
  console.log('✨ [ARGUS GATEKEEPER] Compuerta mecánica superada sin objeciones.');
}
