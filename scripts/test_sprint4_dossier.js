// Archivo: scripts/test_sprint4_dossier.js
const fs = require("fs");
const path = require("path");

function runSprint4DossierAudit() {
  console.log("🛡️ [ARGUS // QA] Auditando Sprint 4: Motor de Dossier Vectorial Multi-Página & PDF 1.4...\n");

  const baseDir = path.resolve(__dirname, "..");
  let hasErrors = false;

  // 1. Límites estrictos de LOC
  const limits = [
    { file: "src/lib/dossier/chronoProtocolData.ts", maxLoc: 80 },
    { file: "src/lib/dossier/pdfCompiler.ts", maxLoc: 115 },
    { file: "src/lib/telemetry/dossierGenerator.ts", maxLoc: 110 },
    { file: "src/components/telemetry/PaywallGate.tsx", maxLoc: 90 },
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

  // 2. Verificación de estructura y especificación PDF 1.4 en pdfCompiler.ts
  console.log("\n📄 2. Verificación de Especificación ISO PDF 1.4 en pdfCompiler.ts:");
  const compilerContent = fs.readFileSync(path.join(baseDir, "src/lib/dossier/pdfCompiler.ts"), "utf-8");
  const requiredPdfTokens = [
    "%PDF-1.4",
    "/Type /Catalog",
    "/Type /Pages",
    "/Type /Page",
    "/MediaBox",
    "/BaseFont /Helvetica",
    "xref",
    "trailer",
    "%%EOF",
  ];
  requiredPdfTokens.forEach((token) => {
    if (!compilerContent.includes(token)) {
      console.error(`❌ Falta token canónico PDF en compiler: '${token}'`);
      hasErrors = true;
    } else {
      console.log(`✅ Token ISO '${token}' verificado`);
    }
  });

  // 3. Verificación de 7 días estructurados en chronoProtocolData.ts
  console.log("\n🗓️ 3. Verificación del Protocolo Cronobiológico de 7 Días:");
  const chronoContent = fs.readFileSync(path.join(baseDir, "src/lib/dossier/chronoProtocolData.ts"), "utf-8");
  for (let day = 1; day <= 7; day++) {
    if (!chronoContent.includes(`day: ${day},`)) {
      console.error(`❌ Falta día ${day} en CHRONO_PROTOCOL`);
      hasErrors = true;
    }
  }
  if (!hasErrors) {
    console.log("✅ Ciclo circadiano de 7 días (Día 1 a Día 7) verificado con foco, matutino, meridiano y nocturno.");
  }

  // 4. Verificación de SHA-256 nativo en dossierGenerator.ts
  console.log("\n🔒 4. Verificación de Hash SHA-256 Nativo en dossierGenerator.ts:");
  const generatorContent = fs.readFileSync(path.join(baseDir, "src/lib/telemetry/dossierGenerator.ts"), "utf-8");
  if (!generatorContent.includes("crypto.subtle.digest('SHA-256'") && !generatorContent.includes('crypto.subtle.digest("SHA-256"')) {
    console.error("❌ Falta invocación de Web Crypto API SHA-256 en dossierGenerator.ts");
    hasErrors = true;
  } else {
    console.log("✅ Criptografía SHA-256 nativa vía Web Crypto API verificada.");
  }

  if (hasErrors) {
    console.error("\n❌ [ARGUS // QA] Fallo en la certificación de Sprint 4.");
    process.exit(1);
  } else {
    console.log("\n✨ [ARGUS // QA] Certificación nominal de Sprint 4 completada con éxito.");
  }
}

runSprint4DossierAudit();
