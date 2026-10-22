// Archivo: src/lib/dossier/chronoProtocolData.ts
export interface ProtocolDay {
  day: number;
  focus: string;
  morning: string;
  midday: string;
  night: string;
}

export const CHRONO_PROTOCOL: ProtocolDay[] = [
  {
    day: 1,
    focus: "Desactivación de Hipervigilancia Basal",
    morning: "Exposición a luz solar directa (15 min) antes de pantallas para sincronizar reloj circadiano.",
    midday: "Pausa de descompresión simpática: 3 min de respiración 4-7-8 al detectar tensión vocal.",
    night: "Bloqueo estricto de espectro azul 90 min antes de dormir. Temperatura de sala a 19°C.",
  },
  {
    day: 2,
    focus: "Calibración del Gating Talámico",
    morning: "Fonación sostenida vocal /a/ (5 repeticiones de 6 seg) para estimular tono vagal laríngeo.",
    midday: "Micro-ayuno dopaminérgico: 45 min de trabajo de foco profundo sin notificaciones periféricas.",
    night: "Anclaje propioceptivo: estiramiento diafragmático y descarga de hombros/mandíbula.",
  },
  {
    day: 3,
    focus: "Modulación de Frecuencia Ejecutiva",
    morning: "Ducha de contraste térmico (2 min caliente / 30 seg frío) para reactividad endotelial.",
    midday: "Respiración de coherencia a 0.1 Hz (6 respiraciones/minuto) durante 5 min post-meridiano.",
    night: "Lectura analógica en papel. Cero consumo de estímulos algorítmicos o noticias nocturnas.",
  },
  {
    day: 4,
    focus: "Integración Neurovisceral Periférica",
    morning: "Hidratación con electrolitos (magnesio/potasio) previa a cualquier ingesta de cafeína.",
    midday: "Auditoría de tono muscular: registrar y liberar apnea no consciente durante llamadas o tareas.",
    night: "Oscuridad absoluta en dormitorio (blackout total) para optimizar pulsos de melatonina.",
  },
  {
    day: 5,
    focus: "Consolidación de Resonancia Autonómica",
    morning: "Caminata de flujo óptico libre de 20 min sin auriculares ni demandas atencionales dirigidas.",
    midday: "Test microacústico de voz: evaluar estabilidad fonatoria ante situaciones de alta presión.",
    night: "Ventilación de espacio con aire fresco y registro escrito de pendientes para vaciado cognitivo.",
  },
  {
    day: 6,
    focus: "Desacople de Tensión Simpática Oculta",
    morning: "Movilidad articular espinal y descompresión de caja torácica al despertar.",
    midday: "Sustitución de café de tarde por infusión de adaptógenos (Ashwagandha o Manzanilla concentrada).",
    night: "Escucha pasiva de frecuencias isocrónicas o ruido marrón a bajo volumen durante 20 min.",
  },
  {
    day: 7,
    focus: "Estabilización y Nuevo Umbral Basal",
    morning: "Re-evaluación en el artefacto Axioma para comparar desviación de Jitter y Coherencia.",
    midday: "Fijación consciente del nuevo umbral: toma de decisiones desde la estabilidad, no desde la urgencia.",
    night: "Consolidación del ciclo semanal y preparación del entorno para el siguiente ciclo biológico.",
  },
];
