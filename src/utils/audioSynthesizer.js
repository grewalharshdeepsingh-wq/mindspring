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

  // Mini-Game & Zen Arcade: Game Start Jingle
  playArcadeStart() {
    try {
      this.init();
      // Ascending C-Major Triad with sparkling overtone: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const startT = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.2, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.32);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.32);
      });
    } catch (e) {}
  }

  // Mini-Game & Zen Arcade: Game Over / Session Complete Melody
  playGameOverSound() {
    try {
      this.init();
      // Serene descending cadence: G5 -> E5 -> C5 + warm base
      const notes = [783.99, 659.25, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const startT = this.ctx.currentTime + idx * 0.16;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.22, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.6);
      });

      // Warm resolving fundamental
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(261.63, this.ctx.currentTime + 0.32);
      subGain.gain.setValueAtTime(0.18, this.ctx.currentTime + 0.32);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.1);

      sub.connect(subGain);
      subGain.connect(this.masterGain);
      sub.start(this.ctx.currentTime + 0.32);
      sub.stop(this.ctx.currentTime + 1.1);
    } catch (e) {}
  }

  // Mini-Game & Zen Arcade: New High Score Fanfare
  playHighScoreSound() {
    try {
      this.init();
      // Rapid shimmering arpeggio: C5, E5, G5, B5, C6, E6
      const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
      arpeggio.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        const startT = this.ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.24, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.45);
      });
    } catch (e) {}
  }

  // Mini-Game & Zen Arcade: Combo Streak Chime (Pitches up with level)
  playComboStreak(level = 1) {
    try {
      this.init();
      const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5 to C6
      const noteIdx = Math.min(Math.max(level - 1, 0), scale.length - 1);
      const freq = scale[noteIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // Mini-Game & Zen Arcade: Final Countdown Tick (Last 5 seconds)
  playCountdownTick(isFinal = false) {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const freq = isFinal ? 880 : 587.33; // A5 for final, D5 for countdown
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(isFinal ? 0.25 : 0.16, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Mini-Game: Alien Jump Sound
  playJumpSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.26, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  // Mini-Game: Alien Muffin/Donut Munch Sound
  playNomSound() {
    try {
      this.init();
      [460, 680].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startT = this.ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.45, startT + 0.06);

        gain.gain.setValueAtTime(0.24, startT);
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
      filter.frequency.setValueAtTime(520, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.42);

      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(75, this.ctx.currentTime + 0.22);
      osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.42);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.43);
    } catch (e) {}
  }

  // Mini-Game: Alien Fart Propulsion Whoosh Puff (during boost)
  playFartThrustPuff() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 40, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // Mini-Game: Alien Leaped Over Obstacle Smoothly
  playObstacleClearSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // Mini-Game: Alien Bonk / Sad Whimper Sound
  playBonkSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.28);
    } catch (e) {}
  }

  // Mini-Game: Stress Bubble Pop (Tactile, watery pop)
  playPopSound() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 380 + Math.random() * 260; // Natural organic variation
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.4, this.ctx.currentTime + 0.065);

      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.075);
    } catch (e) {}
  }

  // Mini-Game: Stress Bubble Golden/Bonus Pop (Celestial Sparkle)
  playBonusPopSound() {
    try {
      this.init();
      // Shimmering F-sharp major chord: F#5 (739.99), A#5 (932.33), C#6 (1108.73)
      const notes = [739.99, 932.33, 1108.73, 1479.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const startT = this.ctx.currentTime + idx * 0.035;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.2, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.38);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.38);
      });
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
    this.playLotusCatch('star');
  }

  // Mini-Game: Lotus Calm Catch - Distinct Zen Tones per Item Shape
  playLotusCatch(shape = 'star') {
    try {
      this.init();

      if (shape === 'droplet') {
        // Water drop "bloop": downwards pitch swoop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.14);

      } else if (shape === 'sakura') {
        // Cherry blossom: sweet koto / acoustic chime pair
        [880.0, 1108.73].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          const startT = this.ctx.currentTime + idx * 0.05;
          osc.frequency.setValueAtTime(freq, startT);

          gain.gain.setValueAtTime(0.2, startT);
          gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.35);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(startT);
          osc.stop(startT + 0.35);
        });

      } else if (shape === 'crystal') {
        // Sacred Crystal: Long resonant Tibetan singing bowl chime (528 Hz)
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(528, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(1056, this.ctx.currentTime); // 1st harmonic

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc2.start();
        osc.stop(this.ctx.currentTime + 0.9);
        osc2.stop(this.ctx.currentTime + 0.9);

      } else {
        // Default / Star: Shimmering triad chime
        [659.25, 830.61, 987.77].forEach((freq, idx) => {
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
      }
    } catch (e) {}
  }

  // Mini-Game: Hazard / Stormcloud caught in Lotus Calm Catch (-15 pts)
  playHazardHitSound() {
    try {
      this.init();
      // Muffled low thunder rumble / soft warning thump
      const noise = this.createNoiseBuffer();
      const src = this.ctx.createBufferSource();
      src.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start();
      src.stop(this.ctx.currentTime + 0.28);
    } catch (e) {}
  }

  // Mini-Game: Subtle Lotus Glide ripple
  playLotusGlide() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
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

  // Mini-Game: Funny Duck Quack ("Waa-quack-quack!") - Ultra funny Donald-style quack
  playGhostfaceQuack() {
    try {
      this.init();
      // Rapid hilarious 4-note squawking duck fanfare with extreme vibrato
      const quackNotes = [
        { f: 450, d: 0.08, delay: 0.0 },
        { f: 620, d: 0.09, delay: 0.09 },
        { f: 780, d: 0.11, delay: 0.19 },
        { f: 410, d: 0.15, delay: 0.31 }
      ];

      quackNotes.forEach(q => {
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        // Add fast funny wobbly vibrato
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(26, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);
        lfo.connect(osc.frequency);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1250, this.ctx.currentTime);
        filter.Q.setValueAtTime(5.0, this.ctx.currentTime);

        const startT = this.ctx.currentTime + q.delay;
        osc.frequency.setValueAtTime(q.f, startT);
        osc.frequency.exponentialRampToValueAtTime(q.f * 0.65, startT + q.d);

        gain.gain.setValueAtTime(0.65, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + q.d);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        lfo.start(startT);
        osc.stop(startT + q.d);
        lfo.stop(startT + q.d);
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
      // Low punchy impact thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.38, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.24);

      // Noise crack for wooden door slam
      const noise = this.createNoiseBuffer();
      const src = this.ctx.createBufferSource();
      src.buffer = noise;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      nGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      src.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.masterGain);

      src.start();
      src.stop(this.ctx.currentTime + 0.15);
    } catch (_) {}
  }

  // Mini-Game: Funny Banana Cameo Cartoon Spring Boing ("Boing-boing-boing!")
  playBananaBoing() {
    try {
      this.init();
      // Crazy cartoon wobbling slide whistle + spring boing
      const boings = [
        { start: 240, peak: 950, end: 320, t: 0.0, dur: 0.2 },
        { start: 350, peak: 1150, end: 420, t: 0.18, dur: 0.22 },
        { start: 500, peak: 1400, end: 200, t: 0.38, dur: 0.26 }
      ];

      boings.forEach(b => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';

        const startT = this.ctx.currentTime + b.t;
        osc.frequency.setValueAtTime(b.start, startT);
        osc.frequency.exponentialRampToValueAtTime(b.peak, startT + b.dur * 0.45);
        osc.frequency.exponentialRampToValueAtTime(b.end, startT + b.dur);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, startT);

        gain.gain.setValueAtTime(0.6, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + b.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + b.dur);
      });
    } catch (_) {}
  }

  // Mini-Game: Capybara Cameo Ultra Chill Zen Gong + Deep Funny Snore/Purr
  playCapybaraRelax() {
    try {
      this.init();
      // Super chill comedy gong with funny warm wobble
      const gongNotes = [110.0, 220.0, 329.63, 440.0, 659.25];
      gongNotes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx < 2 ? 'sawtooth' : 'sine';

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400 + idx * 100, this.ctx.currentTime);

        const startT = this.ctx.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.linearRampToValueAtTime(freq * 0.96, startT + 1.1);

        gain.gain.setValueAtTime(0.65 / (idx + 1), startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 1.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 1.1);
      });
    } catch (_) {}
  }

  // Mini-Game: Time Bonus Earned (+5s ⏱️)
  playTimeBonusSound() {
    try {
      this.init();
      // Upbeat double ding: G5 (784Hz) -> C6 (1046.5Hz)
      [783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const startT = this.ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.22, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.28);
      });
    } catch (_) {}
  }

  // Mini-Game: Time Penalty Deducted (-3s ⚠️)
  playTimePenaltySound() {
    try {
      this.init();
      // Low descending buzz: 220Hz -> 140Hz
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
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
