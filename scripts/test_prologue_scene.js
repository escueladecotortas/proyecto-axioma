// Archivo: scripts/test_prologue_scene.js
const fs = require("fs");
const path = require("path");

function runQaAudit() {
  console.log("🔍 [ARGUS // QA] Iniciando auditoría técnica de Escena Prólogo...\n");

  const baseDir = path.resolve(__dirname, "..");
  let hasErrors = false;

  // 1. Verificación de activos multimedia
  const audioAsset = path.join(baseDir, "public", "cinema", "prologue_voiceover.m4a");
  if (!fs.existsSync(audioAsset)) {
    console.error("❌ Asset ausente: public/cinema/prologue_voiceover.m4a");
    hasErrors = true;
  } else {
    const stats = fs.statSync(audioAsset);
    console.log(`✅ Asset verificado: public/cinema/prologue_voiceover.m4a (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  // 2. Verificación de archivos y Ley de 200 Líneas (Umbral preventivo: 180)
  const targetFiles = [
    "src/lib/ceremonialAudio.js",
    "src/components/StarfieldCanvas.jsx",
    "src/components/prologueData.js",
    "src/components/PrologueScene.jsx",
    "src/app/page.js",
  ];

  console.log("\n📏 Auditando Ley de 200 Líneas (Límite: <= 180 líneas):");
  targetFiles.forEach((relPath) => {
    const fullPath = path.join(baseDir, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Archivo faltante: ${relPath}`);
      hasErrors = true;
      return;
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split("\n").length;

    // Verificar cabecera canónica PEAC
    const firstLine = content.split("\n")[0].trim();
    const expectedHeader = `// Archivo: ${relPath}`;
    const headerValid = firstLine === expectedHeader || firstLine.startsWith(`// Archivo: ${relPath}`);

    if (!headerValid) {
      console.warn(`⚠️ Cabecera PEAC no canónica en ${relPath}: "${firstLine}"`);
    }

    if (lines > 180) {
      console.error(`❌ Exceso de líneas en ${relPath}: ${lines} líneas (Máximo: 180)`);
      hasErrors = true;
    } else {
      console.log(`✅ ${relPath}: ${lines} líneas (Modularización nominal)`);
    }
  });

  if (hasErrors) {
    console.error("\n❌ [ARGUS // QA] Auditoría fallida.");
    process.exit(1);
  } else {
    console.log("\n✨ [ARGUS // QA] Todos los controles pasaron satisfactoriamente.");
  }
}

runQaAudit();
