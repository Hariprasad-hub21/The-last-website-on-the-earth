// Web Audio API Procedural Synth Engine for 'The Last Website on Earth'

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupDrone();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  private setupDrone() {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(4, this.ctx.currentTime);

    // Deep sub-drone 1 (43.65 Hz - F1 note / Ground hum)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(43.65, this.ctx.currentTime);

    // Sub-drone 2 (55 Hz - A1 / Warm chord resonance)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(55.0, this.ctx.currentTime);

    this.droneOsc1.connect(this.filterNode);
    this.droneOsc2.connect(this.filterNode);
    this.filterNode.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();

    // Subtle LFO modulation for breathing drone
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(35, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.filterNode.frequency);
    lfo.start();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.isInitialized) {
      if (!muted) this.init();
      return;
    }
    if (this.ctx && this.masterGain) {
      if (this.ctx.state === 'suspended' && !muted) {
        this.ctx.resume();
      }
      const targetGain = muted ? 0 : 0.6;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  // Update atmosphere filter frequency by stage
  public setStageAtmosphere(stage: string) {
    if (!this.ctx || !this.filterNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    let cutoff = 140;
    if (stage === 'VAULT') cutoff = 120;
    if (stage === 'ARCHIVE') cutoff = 260;
    if (stage === 'CITY') cutoff = 450;
    if (stage === 'DREAMS') cutoff = 600;
    if (stage === 'SIGNAL') cutoff = 380;
    if (stage === 'CORE') cutoff = 520;
    if (stage === 'MONUMENT') cutoff = 750;
    if (stage === 'ENDING') cutoff = 90;

    this.filterNode.frequency.setTargetAtTime(cutoff, now, 1.5);
  }

  // UI Sound Effects
  public playClick(freq = 800) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  public playTerminalBeep() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  public playMemoryChime(freq = 523.25) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      
      // Dual harmonic sine bells
      [freq, freq * 1.5, freq * 2].forEach((f, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        const initialGain = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {}
  }

  public playSignalPulse() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {}
  }

  public playMonumentChord() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // Majestic resonant C-Major 9th chord (C3, G3, D4, E4, B4)
      const chord = [130.81, 196.0, 293.66, 329.63, 493.88];

      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.12);
        osc.stop(now + 5.0);
      });
    } catch (e) {}
  }

  public playWarpTransition() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.9);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(2000, now + 0.7);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {}
  }
}

export const audioEngine = new AudioEngine();
