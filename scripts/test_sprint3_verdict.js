// Archivo: scripts/test_sprint3_verdict.js
const fs = require("fs");
const path = require("path");

function runSprint3VerdictAudit() {
  console.log("🛡️ [ARGUS // QA] Auditando Sprint 3: Topografía de Bio-Tensión & Paradoja Dual...\n");

  const baseDir = path.resolve(__dirname, "..");
  let hasErrors = false;

  // 1. Límites estrictos de LOC
  const limits = [
    { file: "src/lib/telemetry/paradoxEngine.ts", maxLoc: 65 },
    { file: "src/components/verdict/PoincarePlot.tsx", maxLoc: 75 },
    { file: "src/components/verdict/TacticalVerdict.tsx", maxLoc: 90 },
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

  // 2. Verificación de Hash Forense dinámico y cartas dialécticas en TacticalVerdict
  console.log("\n🧬 2. Verificación de Elementos Visuales y Dialéctica 70/30 en TacticalVerdict.tsx:");
  const verdictContent = fs.readFileSync(path.join(baseDir, "src/components/verdict/TacticalVerdict.tsx"), "utf-8");
  
  if (!verdictContent.includes("verdict.forensicHash")) {
    console.error("❌ Falta interpolación dinámica de hash forense en TacticalVerdict.tsx");
    hasErrors = true;
  } else {
    console.log("✅ Hash forense dinámico {verdict.forensicHash} verificado.");
  }

  if (!verdictContent.includes("border-emerald-500/30") || !verdictContent.includes("bg-emerald-950/20")) {
    console.error("❌ Falta tarjeta dialéctica 70% verde (Solvencia ejecutiva)");
    hasErrors = true;
  } else {
    console.log("✅ Tarjeta dialéctica 70% verde (Solvencia ejecutiva) verificada.");
  }

  if (!verdictContent.includes("border-rose-500/30") || !verdictContent.includes("bg-rose-950/20")) {
    console.error("❌ Falta tarjeta dialéctica 30% roja (Fricción quirúrgica)");
    hasErrors = true;
  } else {
    console.log("✅ Tarjeta dialéctica 30% roja (Fricción quirúrgica) verificada.");
  }

  // 3. Verificación de geometría SVG en PoincarePlot.tsx
  console.log("\n📈 3. Verificación de Mapa de Fase de Poincaré (SVG):");
  const poincareContent = fs.readFileSync(path.join(baseDir, "src/components/verdict/PoincarePlot.tsx"), "utf-8");
  const svgElements = ["<svg", "<ellipse", "<circle", "SD1:", "SD2:"];
  svgElements.forEach((el) => {
    if (!poincareContent.includes(el)) {
      console.error(`❌ Elemento SVG o métrica ausente en PoincarePlot: '${el}'`);
      hasErrors = true;
    } else {
      console.log(`✅ Elemento SVG '${el}' verificado`);
    }
  });

  // 4. Verificación del motor de paradoja paradoxEngine.ts
  console.log("\n🧠 4. Verificación del Motor paradoxEngine.ts:");
  const engineContent = fs.readFileSync(path.join(baseDir, "src/lib/telemetry/paradoxEngine.ts"), "utf-8");
  if (!engineContent.includes("computeDualParadox") || !engineContent.includes("AX-")) {
    console.error("❌ Falta función principal o prefijo de hash forense AX- en paradoxEngine.ts");
    hasErrors = true;
  } else {
    console.log("✅ computeDualParadox con prefijo AX- verificado.");
  }

  if (hasErrors) {
    console.error("\n❌ [ARGUS // QA] Fallo en la certificación de Sprint 3.");
    process.exit(1);
  } else {
    console.log("\n✨ [ARGUS // QA] Certificación nominal de Sprint 3 completada con éxito.");
  }
}

runSprint3VerdictAudit();
