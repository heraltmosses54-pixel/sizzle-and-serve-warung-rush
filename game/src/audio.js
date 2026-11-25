// Tiny WebAudio sound kit: every effect is synthesised, so the game ships no audio files
// and makes no network request. Created lazily on the first user gesture (browsers block
// audio before one) and silenced by the M key or the mute button.
export class SoundKit {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  toggleMute() { this.muted = !this.muted; return this.muted; }

  /** A short oscillator blip: frequency, duration, waveform, volume. */
  blip(freq, dur, type = 'sine', vol = 0.12, when = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  /** Filtered noise burst, used for the pan sizzle. */
  sizzle(dur = 0.5) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.10, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
  }

  click() { this.blip(660, 0.06, 'triangle', 0.08); }
  add() { this.blip(520, 0.07, 'triangle', 0.10); this.blip(780, 0.09, 'triangle', 0.08, 0.05); }
  cookDone() { this.blip(880, 0.12, 'sine', 0.10); this.blip(1174, 0.16, 'sine', 0.10, 0.10); }
  serve() { this.blip(523, 0.10, 'triangle', 0.12); this.blip(659, 0.10, 'triangle', 0.12, 0.08); this.blip(784, 0.18, 'triangle', 0.12, 0.16); }
  coin() { this.blip(988, 0.08, 'square', 0.05); this.blip(1319, 0.14, 'square', 0.05, 0.07); }
  wrong() { this.blip(220, 0.18, 'sawtooth', 0.08); this.blip(165, 0.24, 'sawtooth', 0.08, 0.12); }
  expire() { this.blip(392, 0.15, 'sine', 0.10); this.blip(311, 0.22, 'sine', 0.10, 0.14); }
  levelUp() { this.blip(523, 0.09, 'triangle', 0.10); this.blip(659, 0.09, 'triangle', 0.10, 0.08); this.blip(784, 0.09, 'triangle', 0.10, 0.16); this.blip(1047, 0.2, 'triangle', 0.10, 0.24); }
}
