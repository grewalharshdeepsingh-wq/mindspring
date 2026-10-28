// Web Audio API Procedural Sound Synthesizer
// Generates relaxing soundscapes on-demand without external mp3 dependencies

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.nodes = {};
    this.masterGain = null;
    this.isPlaying = {
      rain: false,
      waves: false,
      alpha: false,
      chimes: false,
    };
    this.volumes = {
      rain: 0.4,
      waves: 0.35,
      alpha: 0.25,
      chimes: 0.3,
    };
    this.chimeInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch (e) {}
    }
  }

  // Generate continuous buffer noise
  createNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Soft Rainfall
  startRain() {
    this.init();
    if (this.isPlaying.rain) return;

    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to sound like rain (lowpass around 800-1200Hz)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.volumes.rain, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    noiseSource.start();
    this.nodes.rain = { source: noiseSource, gain: gainNode };
    this.isPlaying.rain = true;
  }

  stopRain() {
    if (this.nodes.rain) {
      try {
        this.nodes.rain.source.stop();
        this.nodes.rain.source.disconnect();
      } catch (e) {}
      delete this.nodes.rain;
    }
    this.isPlaying.rain = false;
  }

  // 2. Gentle Ocean Waves
  startWaves() {
    this.init();
    if (this.isPlaying.waves) return;

    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);

    // LFO for periodic wave swell (every ~7 seconds)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime); // ~7s cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(this.volumes.waves * 0.45, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    noiseSource.start();
    lfo.start();

    this.nodes.waves = { source: noiseSource, lfo, gain: gainNode, lfoGain };
    this.isPlaying.waves = true;
  }

  stopWaves() {
    if (this.nodes.waves) {
      try {
        this.nodes.waves.source.stop();
        this.nodes.waves.lfo.stop();
        this.nodes.waves.source.disconnect();
      } catch (e) {}
      delete this.nodes.waves;
    }
    this.isPlaying.waves = false;
  }

  // 3. Relaxing Binaural Alpha Waves (Focus & Serenity)
  startAlpha() {
    this.init();
    if (this.isPlaying.alpha) return;

    // Base pitch 196 Hz (G3), binaural offset 10 Hz (Alpha state)
    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(216, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(226, this.ctx.currentTime); // 10Hz diff

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.volumes.alpha * 0.35, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);

    merger.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscLeft.start();
    oscRight.start();

    this.nodes.alpha = { oscLeft, oscRight, gain: gainNode };
    this.isPlaying.alpha = true;
  }

  stopAlpha() {
    if (this.nodes.alpha) {
      try {
        this.nodes.alpha.oscLeft.stop();
        this.nodes.alpha.oscRight.stop();
      } catch (e) {}
      delete this.nodes.alpha;
    }
    this.isPlaying.alpha = false;
  }

  // 4. Peaceful Meditation Chimes (Gentle periodic bell tones)
  playSingleChime(freq = 528) {
    if (!this.ctx) this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(this.volumes.chimes * 0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 3.5);
  }

  startChimes() {
    this.init();
    if (this.isPlaying.chimes) return;

    const chimeFrequencies = [528, 639, 432, 396, 741, 852];
    this.playSingleChime(528);

    this.chimeInterval = setInterval(() => {
      const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];
      this.playSingleChime(freq);
    }, 4500);

    this.isPlaying.chimes = true;
  }

  stopChimes() {
    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }
    this.isPlaying.chimes = false;
  }

  setVolume(type, val) {
    this.volumes[type] = val;
    if (this.nodes[type] && this.nodes[type].gain) {
      const targetGain = type === 'alpha' ? val * 0.35 : val;
      this.nodes[type].gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  // Mini-Game: Alien Jump Sound
  playJumpSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, this.ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Mini-Game: Alien Muffin/Donut Munch Sound
  playNomSound() {
    try {
      this.init();
      [420, 620].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startT + 0.06);

        gain.gain.setValueAtTime(0.22, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.07);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.07);
      });
    } catch (e) {}
  }

  // Mini-Game: Alien Fart Boost Sound
  playFartSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.35);

      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.18);
      osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch (e) {}
  }

  // Mini-Game: Alien Bonk / Sad Whimper Sound
  playBonkSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Mini-Game: Bubble Pop Sound
  playPopSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = 340 + Math.random() * 220;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 2.3, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Mini-Game: Zen Stone Stack Clink
  playZenClink() {
    try {
      this.init();
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(640, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(960, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // Mini-Game: Splash sound when stone falls in water
  playWaterSplash() {
    try {
      this.init();
      const noiseBuffer = this.createNoiseBuffer();
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noiseSource.start();
      noiseSource.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // Mini-Game: Catch Sound (Sweet harmonic sparkle)
  playCatchSound() {
    try {
      this.init();
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = this.ctx.currentTime + idx * 0.04;
        osc.frequency.setValueAtTime(freq, startT);
        gain.gain.setValueAtTime(0.18, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startT);
        osc.stop(startT + 0.3);
      });
    } catch (e) {}
  }

  // Mini-Game: Level Up / High Score Sparkle
  playLevelUpSound() {
    try {
      this.init();
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = this.ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startT);
        gain.gain.setValueAtTime(0.2, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startT);
        osc.stop(startT + 0.35);
      });
    } catch (e) {}
  }

  // Meditation Breath Phase Sound Cue (gentle tone matching inhale / hold / exhale)
  playBreathCue(phase) {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      if (phase === 'inhale') {
        // Soft rising frequency 240 -> 420 Hz
        osc.frequency.setValueAtTime(240, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.3);
      } else if (phase === 'hold') {
        // Serene bell chime (528 Hz)
        this.playSingleChime(528);
      } else if (phase === 'exhale') {
        // Soft descending frequency 420 -> 220 Hz
        osc.frequency.setValueAtTime(420, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 1.4);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
      }
    } catch (e) {}
  }

  // Mini-Game: Ghostface Crying Sound (Hilarious cartoon wah-wah sob)
  playGhostfaceCry() {
    try {
      this.init();
      // Descending sad trombone notes: F4, E4, Eb4, D4 with vibrato
      const notes = [349.23, 329.63, 311.13, 270.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';

        const startT = this.ctx.currentTime + idx * 0.22;
        const dur = idx === 3 ? 0.6 : 0.2;

        osc.frequency.setValueAtTime(freq, startT);
        if (idx === 3) {
          // Slow sad sliding pitch downward
          osc.frequency.linearRampToValueAtTime(freq * 0.75, startT + dur);
        }

        gain.gain.setValueAtTime(0.18, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + dur);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, startT);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + dur);
      });
    } catch (_) {}
  }

  // Mini-Game: Ghostface Dance Beat (Funky energetic synth groove)
  playGhostfaceDance() {
    try {
      this.init();
      // Upbeat funky arpeggio: C5, G5, A5, C6
      const arpeggio = [523.25, 783.99, 880.0, 1046.5];
      arpeggio.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        const startT = this.ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startT + 0.12);

        gain.gain.setValueAtTime(0.24, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.18);
      });
    } catch (_) {}
  }

  // Mini-Game: Funny Duck Quack ("Waa-quack!")
  playGhostfaceQuack() {
    try {
      this.init();
      [380, 440].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

        const startT = this.ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, startT + 0.08);

        gain.gain.setValueAtTime(0.2, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.09);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.09);
      });
    } catch (_) {}
  }

  // Mini-Game: Knife Whoosh
  playGhostfaceSwoosh() {
    try {
      this.init();
      const noise = this.createNoiseBuffer();
      const src = this.ctx.createBufferSource();
      src.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.12);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start();
      src.stop(this.ctx.currentTime + 0.15);
    } catch (_) {}
  }

  // Mini-Game: Door Crash / Kick
  playDoorCrash() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (_) {}
  }

  stopAll() {
    this.stopRain();
    this.stopWaves();
    this.stopAlpha();
    this.stopChimes();
  }
}

export const soundEngine = new SoundEngine();
