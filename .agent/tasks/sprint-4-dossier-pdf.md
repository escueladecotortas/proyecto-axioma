// Archivo: .agent/tasks/sprint-4-dossier-pdf.md
# DIRECTIVA PEAC // SPRINT 4: MOTOR DE DOSSIER VECTORIAL MULTI-PÁGINA & CI/CD (v11.1 ➔ v12.0)
**Destinatarios:** @Codi (Compilador PDF & Crypto) + @Atenea (Layout Editorial Suizo)  
**Supervisión y Gatekeeper:** @Argus (Auditoría AST, Formato ISO PDF & Ley de 200L)  
**Workspace:** `axioma-core`  
**Estado:** COMPLETADO & CERTIFICADO (100% Validado)

---

### Resumen de Ejecución
1. **Catálogo Cronobiológico de 7 Días:** `src/lib/dossier/chronoProtocolData.ts` (60 LOC < 80 LOC). Estructura completa de micro-hábitos circadianos diarios (Día 1 a Día 7 con foco, matutino, meridiano y nocturno).
2. **Compilador Vectorial PDF Nativo:** `src/lib/dossier/pdfCompiler.ts` (88 LOC < 115 LOC). Emisión conforme a ISO PDF 1.4 (`/Catalog`, `/Pages`, `/Page`, Helvetica/Helvetica-Bold, `xref`, `trailer`, `%%EOF`), con primitivas vectoriales de cajas, líneas y texto sin dependencias externas.
3. **Generador de Dossier Forense de 3 Páginas:** `src/lib/telemetry/dossierGenerator.ts` (94 LOC < 110 LOC). Criptografía SHA-256 nativa (Web Crypto API), Carátula forense, topografía de micro-acústica y protocolo diario de 7 días.
4. **Compuerta de Descarga PaywallGate:** `src/components/telemetry/PaywallGate.tsx` (83 LOC < 90 LOC). Descarga automática de archivo binario `.pdf` real que abre nativamente en Acrobat y navegadores.
