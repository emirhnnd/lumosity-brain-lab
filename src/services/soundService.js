// Web Audio API Synthesizer Sound Service

class SoundService {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play tone error', e);
    }
  }

  tileBeep(index) {
    // Pitch rises with tile index or sequence position
    const baseFreq = 300 + (index * 60);
    this.playTone(baseFreq, 'sine', 0.18, 0.12);
  }

  click() {
    this.playTone(400, 'triangle', 0.08, 0.08);
  }

  triggerVisualPulse(type) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neuro-fx', { detail: { type } }));
    }
  }

  success() {
    this.triggerVisualPulse('success');
    // Happy major triad chord
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;
    this.playTone(523.25, 'sine', 0.15, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.12), 200); // G5
  }

  error() {
    this.triggerVisualPulse('error');
    // Low double buzz
    this.playTone(180, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.25, 0.15), 100);
  }

  levelUp() {
    this.triggerVisualPulse('levelUp');
    // Fast rising arpeggio
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.1), idx * 80);
    });
  }

  spellCast() {
    this.triggerVisualPulse('spellCast');
    // Futuristic laser sweep
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch(e) {}
  }
}

export const soundService = new SoundService();
