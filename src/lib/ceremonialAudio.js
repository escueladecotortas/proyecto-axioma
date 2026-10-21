// Archivo: src/lib/ceremonialAudio.js

/**
 * Sintetizador ceremonial nativo basado en Web Audio API.
 * Emite una frecuencia de resonancia armónica en 432 Hz con filtro cálido y envolvente suave.
 */
class CeremonialAudioEngine {
  constructor() {
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.filterNode = null;
    this.isPlaying = false;
  }

  // Inicializa el contexto de audio solo tras interacción del usuario
  initContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  // Inicia el oscilador en 432 Hz con fade-in suave
  startDrone(frequency = 432, targetGain = 0.08) {
    try {
      this.initContext();
      if (this.isPlaying) return;

      const now = this.audioContext.currentTime;

      // Filtro pasa-bajos cálido para atenuar armónicos estridentes
      this.filterNode = this.audioContext.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(650, now);
      this.filterNode.Q.setValueAtTime(2, now);

      // Nodo de ganancia con envolvente suave (fade-in)
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.0001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(targetGain, now + 4);

      // Oscilador senoidal puro en 432 Hz
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.type = "sine";
      this.oscillator.frequency.setValueAtTime(frequency, now);

      // Conexión en cadena: Oscilador -> Filtro -> Ganancia -> Salida
      this.oscillator.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      this.oscillator.start(now);
      this.isPlaying = true;
    } catch (error) {
      console.warn("[CeremonialAudio] Error al iniciar sintetizador:", error);
    }
  }

  // Detiene el tono senoidal con desvanecimiento progresivo
  stopDrone(fadeDuration = 2.5) {
    if (!this.isPlaying || !this.gainNode || !this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        if (this.oscillator) {
          try {
            this.oscillator.stop();
            this.oscillator.disconnect();
          } catch (e) {}
          this.oscillator = null;
        }
        this.isPlaying = false;
      }, fadeDuration * 1000);
    } catch (error) {
      console.warn("[CeremonialAudio] Error al detener sintetizador:", error);
    }
  }
}

export const ceremonialAudio = new CeremonialAudioEngine();
