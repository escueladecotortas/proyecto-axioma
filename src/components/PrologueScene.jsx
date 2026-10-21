// Archivo: src/components/PrologueScene.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Play } from "lucide-react";
import StarfieldCanvas from "./StarfieldCanvas";
import BiometricSensor from "./BiometricSensor";
import PrologueHeader from "./PrologueHeader";
import { ceremonialAudio } from "../lib/ceremonialAudio";
import { PROLOGUE_PHRASES } from "./prologueData";

export function PrologueScene({ onCalibrationComplete = null, onComplete = null } = {}) {
  const [stage, setStage] = useState("idle"); // idle | narrative | sensor | flash
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const handleStartExperience = () => {
    setStage("narrative");
    ceremonialAudio.startDrone(432, 0.08);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.warn("[PrologueScene] Autoplay bloqueado:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (!duration || duration === Infinity) return;

    const progress = currentTime / duration;
    if (progress < 0.25) setCurrentPhrase(0);
    else if (progress < 0.50) setCurrentPhrase(1);
    else if (progress < 0.75) setCurrentPhrase(2);
    else setCurrentPhrase(3);

    if (progress >= 0.96) setStage("sensor");
  };

  const handleSensorComplete = () => {
    setStage("flash");
    ceremonialAudio.stopDrone(1.5);
    setTimeout(() => {
      if (onCalibrationComplete) onCalibrationComplete();
      if (onComplete) onComplete();
    }, 950);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  useEffect(() => () => ceremonialAudio.stopDrone(0.5), []);

  const activePhrase = PROLOGUE_PHRASES[currentPhrase];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#030305] px-6 py-8 select-none">
      <StarfieldCanvas />

      {stage === "flash" && (
        <div className="fixed inset-0 z-50 bg-[#F5F5F7] animate-optical-flash pointer-events-none" />
      )}

      <audio
        ref={audioRef}
        src="/cinema/prologue_voiceover.m4a"
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setStage("sensor")}
      />

      <PrologueHeader isMuted={isMuted} onToggleMute={toggleMute} />

      {/* Contenedor dinámico */}
      <main className="relative z-10 my-auto flex w-full max-w-3xl flex-col items-center text-center px-4">
        {stage === "idle" && (
          <div className="flex flex-col items-center animate-cinematic-text">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2B872]/20 bg-[#0A0B0E]/90 px-4 py-1.5 text-xs text-[#E2B872]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] tracking-widest uppercase">EXPERIENCIA CINEMÁTICA</span>
            </div>
            <h1 className="mb-4 text-3xl sm:text-5xl font-light tracking-tight text-[#F5F5F7]">
              The Axioma Experience
            </h1>
            <p className="mb-10 max-w-md text-sm text-[#8E8E93] leading-relaxed">
              Un viaje sonoro y neurovisceral para restablecer el orden biológico y la telemetría personal.
            </p>
            <button
              onClick={handleStartExperience}
              className="group relative inline-flex items-center gap-3 rounded-full border border-[#E2B872]/40 bg-[#0A0B0E] px-8 py-4 text-xs font-mono tracking-widest uppercase text-[#F5F5F7] shadow-[0_0_30px_rgba(226,184,114,0.15)] hover:border-[#E2B872] hover:shadow-[0_0_40px_rgba(226,184,114,0.3)] transition-all duration-500 cursor-pointer"
            >
              <Play className="h-4 w-4 text-[#E2B872] transition-transform group-hover:scale-110" />
              <span>Iniciar Experiencia</span>
            </button>
          </div>
        )}

        {stage === "narrative" && (
          <div key={currentPhrase} className="flex flex-col items-center animate-cinematic-text">
            <span className="mb-4 font-mono text-[11px] tracking-[0.25em] text-[#E2B872] uppercase">
              {activePhrase.tag}
            </span>
            <h2 className="mb-6 text-3xl sm:text-5xl font-light tracking-tight text-[#F5F5F7] drop-shadow-[0_0_20px_rgba(245,245,247,0.15)]">
              {activePhrase.headline}
            </h2>
            <p className="max-w-xl text-base sm:text-xl font-light text-[#8E8E93] leading-relaxed">
              &ldquo;{activePhrase.body}&rdquo;
            </p>
            <div className="mt-12 flex items-center gap-2">
              {PROLOGUE_PHRASES.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    idx === currentPhrase ? "w-8 bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" : "w-2 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {(stage === "sensor" || stage === "flash") && (
          <div className="flex flex-col items-center animate-cinematic-text">
            <span className="mb-3 font-mono text-[10px] tracking-[0.3em] uppercase text-[#00F2FE]">
              ACTO II // SINTONIZACIÓN DACTILAR
            </span>
            <h3 className="mb-2 text-2xl sm:text-4xl font-light text-[#F5F5F7]">
              Iniciación de Coherencia
            </h3>
            <p className="mb-6 max-w-md text-xs sm:text-sm text-[#8E8E93]">
              Apoyá y sostené tu pulgar en el sensor para armonizar tu bio-frecuencia.
            </p>
            <BiometricSensor onCalibrationComplete={handleSensorComplete} />
          </div>
        )}
      </main>

      <footer className="relative z-10 flex w-full max-w-5xl items-center justify-between border-t border-white/5 pt-4 text-[10px] font-mono text-[#8E8E93]">
        <span>AXIOMA // OBSERVATORIO CINEMÁTICO</span>
        <span>SATÉLITE :3010 · LOCAL-FIRST</span>
      </footer>
    </div>
  );
}

export default PrologueScene;
