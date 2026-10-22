// Archivo: .agent/tasks/sprint-1-webgl-ergonomia.md
# DIRECTIVA PEAC // SPRINT 1: MOTOR WEBGL & ERGONOMÍA MÓVIL (v11.1 ➔ v12.0)
**Destinatarios:** @Atenea (UI/UX & WebGL) + @Codi (Lógica & Refactor)  
**Supervisión y Gatekeeper:** @Argus (Auditoría AST & Ley de 200L)  
**Workspace:** `axioma-core`  
**Estado:** COMPLETADO (100% Validado)

---

### Resumen de Ejecución
1. **Shaders GLSL Raymarching:** Implementado en `src/components/canvas/orbShaders.ts` (90 LOC).
2. **ResonanceOrb WebGL:** Viewport GPU interactivo en `src/components/canvas/ResonanceOrb.tsx` (111 LOC).
3. **ThumbZonePad Ergonomía Móvil:** Sensor confinado al tercio inferior en `src/components/telemetry/ThumbZonePad.tsx` (85 LOC).
4. **Refactor BiometricSensor:** Consolidado en `src/components/telemetry/BiometricSensor.tsx` (83 LOC, < 130 LOC certificado).
5. **Higiene:** Erradicado canvas plano obsoleto, adaptado viewport a 100dvh sin scroll ni colisiones táctiles.
