// Archivo: scripts/test_sensor_flow.js
const fs = require("fs");
const path = require("path");

function runSensorFlowAudit() {
  console.log("🛡️ [ARGUS // QA] Auditando flujo cinemático y WebGL del Sensor Biométrico v12.0...\n");

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
      } else if (/\.(js|jsx|ts|tsx)$/.test(full)) {
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
    "src/components/PrologueScene.jsx",
    "src/components/VoiceCalibrationScene.jsx",
    "src/components/canvas/orbShaders.ts",
    "src/components/canvas/ResonanceOrb.tsx",
    "src/components/telemetry/ThumbZonePad.tsx",
    "src/components/telemetry/BiometricSensor.tsx",
    "src/components/BiometricSensor.tsx",
    "src/app/page.tsx",
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

  // 3. Certificación especial: BiometricSensor.tsx < 130 líneas
  console.log("\n🎯 Certificando que BiometricSensor.tsx esté bajo las 130 líneas útiles:");
  const biometricSensorPath = path.join(baseDir, "src/components/telemetry/BiometricSensor.tsx");
  const bioLines = fs.readFileSync(biometricSensorPath, "utf-8").split("\n").length;
  if (bioLines >= 130) {
    console.error(`❌ BiometricSensor.tsx tiene ${bioLines} líneas (Límite: < 130 líneas)`);
    hasErrors = true;
  } else {
    console.log(`✅ BiometricSensor.tsx verificado: ${bioLines} líneas (< 130 líneas nominal)`);
  }

  // 4. Verificación de interactividad táctil en ThumbZonePad
  console.log("\n👆 Verificando integración de eventos táctiles ergonómicos en ThumbZonePad.tsx:");
  const padFile = path.join(baseDir, "src/components/telemetry/ThumbZonePad.tsx");
  const padContent = fs.readFileSync(padFile, "utf-8");
  const requiredEvents = ["onPointerDown", "onPointerUp", "onPointerLeave", "onHoldStart", "onHoldEnd"];
  requiredEvents.forEach((ev) => {
    if (!padContent.includes(ev)) {
      console.error(`❌ Falta hook o evento clave '${ev}' en ThumbZonePad.tsx`);
      hasErrors = true;
    } else {
      console.log(`✅ Evento '${ev}' verificado`);
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
