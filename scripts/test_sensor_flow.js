// Archivo: scripts/test_sensor_flow.js
const fs = require("fs");
const path = require("path");

function runSensorFlowAudit() {
  console.log("🛡️ [ARGUS // QA] Auditando flujo cinemático del Sensor Biométrico...\n");

  const baseDir = path.resolve(__dirname, "..");
  let hasErrors = false;

  // 1. Auditoría estricta anti-alert en todo el árbol src/
  console.log("🚫 Verificando erradicación absoluta de alert/confirm/popups:");
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scanDir(full);
      } else if (full.endsWith(".js") || full.endsWith(".jsx")) {
        const content = fs.readFileSync(full, "utf-8");
        if (/\balert\s*\(/.test(content) || /\bwindow\.alert\s*\(/.test(content) || /\bconfirm\s*\(/.test(content)) {
          console.error(`❌ Llamada prohibida a modal detectada en: ${path.relative(baseDir, full)}`);
          hasErrors = true;
        }
      }
    }
  }
  scanDir(path.join(baseDir, "src"));
  if (!hasErrors) {
    console.log("✅ Cero llamadas a window.alert() o modales del navegador encontradas.");
  }

  // 2. Verificación de submódulos y Ley de 200 Líneas (<= 180 preventivo)
  const targetModules = [
    "src/lib/ceremonialAudio.js",
    "src/components/StarfieldCanvas.jsx",
    "src/components/prologueData.js",
    "src/components/PrologueHeader.jsx",
    "src/components/BiometricSensor.jsx",
    "src/components/PrologueScene.jsx",
    "src/components/VoiceCalibrationScene.jsx",
    "src/app/page.js",
  ];

  console.log("\n📏 Auditando Ley de 200 Líneas (Máximo estricto: 180 líneas):");
  targetModules.forEach((relPath) => {
    const fullPath = path.join(baseDir, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Módulo no encontrado: ${relPath}`);
      hasErrors = true;
      return;
    }

    const lines = fs.readFileSync(fullPath, "utf-8").split("\n").length;
    if (lines > 180) {
      console.error(`❌ ${relPath} excede 180 líneas: tiene ${lines} líneas`);
      hasErrors = true;
    } else {
      console.log(`✅ ${relPath}: ${lines} líneas`);
    }
  });

  // 3. Verificación de eventos táctiles e interactividad en BiometricSensor
  console.log("\n👆 Verificando integración de eventos táctiles en BiometricSensor.jsx:");
  const sensorFile = path.join(baseDir, "src/components/BiometricSensor.jsx");
  const sensorContent = fs.readFileSync(sensorFile, "utf-8");
  const requiredHooks = ["onTouchStart", "onTouchEnd", "onMouseDown", "onMouseUp", "onCalibrationComplete"];
  requiredHooks.forEach((hook) => {
    if (!sensorContent.includes(hook)) {
      console.error(`❌ Falta hook o evento clave '${hook}' en BiometricSensor.jsx`);
      hasErrors = true;
    } else {
      console.log(`✅ Evento/Hook '${hook}' verificado`);
    }
  });

  if (hasErrors) {
    console.error("\n❌ [ARGUS // QA] Auditoría fallida. Hay infracciones de directiva.");
    process.exit(1);
  } else {
    console.log("\n✨ [ARGUS // QA] Certificación nominal completada sin advertencias.");
  }
}

runSensorFlowAudit();
