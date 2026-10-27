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
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
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

  stopAll() {
    this.stopRain();
    this.stopWaves();
    this.stopAlpha();
    this.stopChimes();
  }
}

export const soundEngine = new SoundEngine();
