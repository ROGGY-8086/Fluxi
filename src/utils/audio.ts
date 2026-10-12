/**
 * Tactile, satisfying Web Audio sound synthesizer
 * Features crisp mechanical clicks, resonant radar pings, and rewarding chimes
 * Handles browser autoplay policy by unlocking AudioContext on user gestures
 */

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  public unlockAudio() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch {
      // Browser audio restriction
    }
  }

  private getCtx(): AudioContext | null {
    this.unlockAudio();
    return this.ctx;
  }

  /**
   * Crisp, tactile mechanical click sound for buttons and switches
   */
  playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. High transient snap (mechanical switch click)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(2200, now);
      snapOsc.frequency.exponentialRampToValueAtTime(450, now + 0.04);

      snapGain.gain.setValueAtTime(0.32, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.045);

      // 2. Low tactile body thud (weighty switch bottoming-out)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(280, now);
      thudOsc.frequency.exponentialRampToValueAtTime(110, now + 0.055);

      thudGain.gain.setValueAtTime(0.24, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Resonant radar ping for countermeasures and targets
   */
  playPing() {
    if (!this.enabled) return;
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12); // B5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback
    }
  }

  /**
   * High-tech countermeasure deployment frequency sweep
   */
  playCountermeasure() {
    if (!this.enabled) return;
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Rewarding harmonic chime for correct matches and drill completion
   */
  playMatchChime() {
    if (!this.enabled) return;
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.28, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const soundFx = new SoundFX();
