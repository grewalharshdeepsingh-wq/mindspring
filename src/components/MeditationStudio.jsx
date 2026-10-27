import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart, 
  Moon, 
  Sun, 
  Headphones,
  CheckCircle2,
  Flower2,
  Wind,
  Mic,
  MicOff,
  Bell,
  BellOff,
  ArrowUpCircle,
  ArrowDownCircle,
  CircleDot
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

const MEDITATION_PROGRAMS = [
  {
    id: 'mindful_breath',
    title: 'Mindful Breathing Sanctuary',
    tag: 'Focus & Centering',
    icon: '🌸',
    guidance: [
      { atSec: 0, text: 'Find a comfortable upright posture. Gently close your eyes or soften your gaze downwards.' },
      { atSec: 15, text: 'Bring your attention to the rhythm of your breath. Follow the inhale, hold, and exhale cues.' },
      { atSec: 35, text: 'Notice where you feel the breath most clearly: your chest rising or the cool air at your nostrils.' },
      { atSec: 65, text: 'When your mind wanders into thoughts of homework or exams, gently note: "thinking", and return to your breath.' },
      { atSec: 110, text: 'Inhaling calm and mental space, exhaling all rush and tension. You are grounded and safe right here.' },
      { atSec: 160, text: 'Rest in this gentle stillness. Notice the peaceful clarity expanding with every breath cycle.' },
      { atSec: 210, text: 'Take three deep, full breaths. Slowly wiggle your fingers and gently return your awareness to the room.' }
    ]
  },
  {
    id: 'body_scan',
    title: 'Exam Tension Body Scan',
    tag: 'Somatic Release',
    icon: '🧘',
    guidance: [
      { atSec: 0, text: 'Take a slow, deep breath in... and let your shoulders drop away from your ears as you exhale.' },
      { atSec: 20, text: 'Notice your forehead and eyebrows. Soften any furrowing or concentration tension.' },
      { atSec: 50, text: 'Unclench your jaw. Let your tongue rest gently, allowing the muscles around your mouth to relax.' },
      { atSec: 90, text: 'Feel the solid contact of your feet against the floor, supporting you unconditionally.' },
      { atSec: 140, text: 'Scan down your spine, arms, and hands. Allow every muscle to release its grip on the day.' },
      { atSec: 190, text: 'Breathe into your whole body as a unified field of calm, capable stillness.' },
      { atSec: 240, text: 'When ready, open your eyes with a refreshed mind and relaxed shoulders.' }
    ]
  },
  {
    id: 'loving_kindness',
    title: 'Self-Compassion & Peace',
    tag: 'Emotional Healing',
    icon: '💖',
    guidance: [
      { atSec: 0, text: 'Place one hand gently over your heart or on your lap. Feel the warmth of your own presence.' },
      { atSec: 25, text: 'Silently repeat to yourself: "May I be peaceful. May I be kind to myself today."' },
      { atSec: 60, text: 'Acknowledge: "Studying and growing can be hard sometimes, and it is okay to feel imperfect."' },
      { atSec: 105, text: 'Silently repeat: "I am more than my grades. My worth is constant and whole."' },
      { atSec: 160, text: 'Send this warmth to classmates, family, and teachers: "May we all feel calm and supported."' },
      { atSec: 210, text: 'Rest in this feeling of deep kindness and quiet confidence.' }
    ]
  }
];

const BREATH_PATTERNS = [
  {
    id: 'box',
    name: 'Box Breath (4-4-4-4)',
    shortName: '4-4-4-4 Box',
    desc: 'Equal balance for rapid focus and anxiety reduction',
    steps: [
      { key: 'inhale', name: 'Inhale', duration: 4, text: 'Breathe in slowly through your nose...', voice: 'Inhale' },
      { key: 'hold', name: 'Hold', duration: 4, text: 'Hold your breath gently, keep shoulders relaxed...', voice: 'Hold' },
      { key: 'exhale', name: 'Exhale', duration: 4, text: 'Smoothly exhale completely through your mouth...', voice: 'Exhale' },
      { key: 'hold2', name: 'Hold & Rest', duration: 4, text: 'Rest in the quiet stillness before next breath...', voice: 'Hold and rest' }
    ]
  },
  {
    id: '478',
    name: 'Relaxing 4-7-8',
    shortName: '4-7-8 Deep Calm',
    desc: 'Deep parasympathetic trigger to melt exam stress',
    steps: [
      { key: 'inhale', name: 'Inhale', duration: 4, text: 'Inhale quietly through your nose for 4 seconds...', voice: 'Inhale' },
      { key: 'hold', name: 'Hold', duration: 7, text: 'Hold your breath gently for 7 seconds...', voice: 'Hold' },
      { key: 'exhale', name: 'Exhale', duration: 8, text: 'Long releasing whoosh exhale for 8 seconds...', voice: 'Exhale' }
    ]
  },
  {
    id: 'calm_flow',
    name: 'Calm Flow (4-2-6)',
    shortName: '4-2-6 Flow',
    desc: 'Gentle natural pacing for meditation sessions',
    steps: [
      { key: 'inhale', name: 'Inhale', duration: 4, text: 'Inhale gentle positive calm...', voice: 'Inhale' },
      { key: 'hold', name: 'Hold', duration: 2, text: 'Brief soft pause at the peak of the breath...', voice: 'Hold' },
      { key: 'exhale', name: 'Exhale', duration: 6, text: 'Smooth, elongated exhale letting everything go...', voice: 'Exhale' }
    ]
  }
];

export default function MeditationStudio({ onComplete }) {
  // Meditation Program selection
  const [selectedProgramId, setSelectedProgramId] = useState('mindful_breath');
  const [selectedPatternId, setSelectedPatternId] = useState('box');
  
  // Timer & active state
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Breathing Pacer state (inhale, hold, exhale)
  const [breathStepIdx, setBreathStepIdx] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Auditory guidance settings
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState(true);
  const [soundCueEnabled, setSoundCueEnabled] = useState(true);
  const [soundTrack, setSoundTrack] = useState('chimes'); // 'chimes' | 'rain' | 'alpha' | 'waves' | 'off'

  const currentProgram = MEDITATION_PROGRAMS.find(p => p.id === selectedProgramId) || MEDITATION_PROGRAMS[0];
  const currentPattern = BREATH_PATTERNS.find(p => p.id === selectedPatternId) || BREATH_PATTERNS[0];
  const currentStep = currentPattern.steps[breathStepIdx] || currentPattern.steps[0];

  // Ref to hold latest state for timers/callbacks
  const stateRef = useRef({
    voiceGuideEnabled,
    soundCueEnabled,
    currentPattern,
    breathStepIdx
  });

  useEffect(() => {
    stateRef.current = {
      voiceGuideEnabled,
      soundCueEnabled,
      currentPattern,
      breathStepIdx
    };
  }, [voiceGuideEnabled, soundCueEnabled, currentPattern, breathStepIdx]);

  // Voice speech synthesis helper
  const speakVoice = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.82; // relaxed, meditative pace
      utterance.pitch = 0.95;
      utterance.volume = 0.9;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const soothingVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel') || v.name.includes('Serena'))
        ) || voices.find(v => v.lang.startsWith('en'));
        if (soothingVoice) utterance.voice = soothingVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Guidance text for meditation
  const currentGuidance = [...currentProgram.guidance]
    .reverse()
    .find(g => elapsedSec >= g.atSec) || currentProgram.guidance[0];

  // Main countdown and breathing synchronization interval
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        // Decrement overall session time
        setTimeLeft(prev => prev - 1);
        setElapsedSec(prev => prev + 1);

        // Breath step countdown
        setStepSecondsLeft(prevSec => {
          if (prevSec <= 1) {
            // Transition to next breath step (e.g. Inhale -> Hold -> Exhale)
            const { currentPattern: pattern, breathStepIdx: currIdx, voiceGuideEnabled: voiceOn, soundCueEnabled: cueOn } = stateRef.current;
            const nextIdx = (currIdx + 1) % pattern.steps.length;
            const nextStep = pattern.steps[nextIdx];

            if (nextIdx === 0) {
              setCompletedCycles(c => c + 1);
            }

            setBreathStepIdx(nextIdx);

            // Auditory guidance triggers
            if (cueOn && soundEngine?.playBreathCue) {
              soundEngine.playBreathCue(nextStep.key);
            }
            if (voiceOn) {
              speakVoice(nextStep.voice);
            }

            return nextStep.duration;
          }
          return prevSec - 1;
        });

      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      soundEngine.stopAll();
      if (soundEngine.playLevelUpSound) soundEngine.playLevelUpSound();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSound = (type) => {
    if (soundTrack === type) {
      soundEngine.stopAll();
      setSoundTrack('off');
    } else {
      soundEngine.stopAll();
      if (type === 'rain') soundEngine.startRain();
      if (type === 'waves') soundEngine.startWaves();
      if (type === 'alpha') soundEngine.startAlpha();
      if (type === 'chimes') soundEngine.startChimes();
      setSoundTrack(type);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    // Background sound
    if (soundTrack === 'chimes') soundEngine.startChimes();
    if (soundTrack === 'rain') soundEngine.startRain();
    if (soundTrack === 'waves') soundEngine.startWaves();
    if (soundTrack === 'alpha') soundEngine.startAlpha();

    // Cue first breath step
    if (soundCueEnabled && soundEngine?.playBreathCue) {
      soundEngine.playBreathCue(currentStep.key);
    }
    if (voiceGuideEnabled) {
      speakVoice(currentStep.voice);
    }
  };

  const handlePause = () => {
    setIsActive(false);
    soundEngine.stopAll();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReset = (mins = durationMinutes) => {
    setIsActive(false);
    soundEngine.stopAll();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
    setElapsedSec(0);
    setBreathStepIdx(0);
    setStepSecondsLeft(currentPattern.steps[0].duration);
    setCompletedCycles(0);
  };

  const handlePatternChange = (patId) => {
    setSelectedPatternId(patId);
    const pat = BREATH_PATTERNS.find(p => p.id === patId) || BREATH_PATTERNS[0];
    setBreathStepIdx(0);
    setStepSecondsLeft(pat.steps[0].duration);
    if (isActive) {
      if (soundCueEnabled && soundEngine?.playBreathCue) {
        soundEngine.playBreathCue(pat.steps[0].key);
      }
      if (voiceGuideEnabled) {
        speakVoice(pat.steps[0].voice);
      }
    }
  };

  const handleProgramSelect = (progId) => {
    setIsActive(false);
    soundEngine.stopAll();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSelectedProgramId(progId);
    setTimeLeft(durationMinutes * 60);
    setElapsedSec(0);
    setBreathStepIdx(0);
    setStepSecondsLeft(currentPattern.steps[0].duration);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalSec = durationMinutes * 60;
  const progressPercent = ((totalSec - timeLeft) / totalSec) * 100;

  // Visual breath animation styling
  const isBreathInhale = currentStep.key === 'inhale';
  const isBreathHold = currentStep.key.includes('hold');
  const isBreathExhale = currentStep.key === 'exhale';

  let sphereScale = 'scale-100';
  let ringColor = 'text-teal-500';
  let badgeColor = 'bg-teal-500 text-white';
  let glowColor = 'bg-teal-400/25 dark:bg-teal-500/15';

  if (isBreathInhale) {
    sphereScale = 'scale-125 transition-transform duration-[3800ms] ease-out';
    ringColor = 'text-emerald-500';
    badgeColor = 'bg-emerald-600 text-white shadow-emerald-500/30';
    glowColor = 'bg-emerald-400/35 dark:bg-emerald-500/20';
  } else if (isBreathHold) {
    sphereScale = 'scale-125 transition-transform duration-700 ease-in-out';
    ringColor = 'text-indigo-500';
    badgeColor = 'bg-indigo-600 text-white shadow-indigo-500/30';
    glowColor = 'bg-indigo-400/30 dark:bg-indigo-500/20';
  } else if (isBreathExhale) {
    sphereScale = 'scale-90 transition-transform duration-[3800ms] ease-in';
    ringColor = 'text-cyan-500';
    badgeColor = 'bg-cyan-600 text-white shadow-cyan-500/30';
    glowColor = 'bg-cyan-400/30 dark:bg-cyan-500/20';
  }

  // Step countdown percentage for outer phase ring
  const stepTotal = currentStep.duration;
  const stepProgress = ((stepTotal - stepSecondsLeft) / stepTotal) * 100;

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-teal-50/60 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-3xl min-h-[580px] border border-teal-100 dark:border-slate-800 shadow-sm transition-all">
      
      {/* Header Banner */}
      <div className="text-center max-w-lg space-y-1.5">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-cyan-500/15 dark:from-teal-950/60 dark:to-cyan-950/60 border border-teal-200 dark:border-teal-700/50 px-3.5 py-1 rounded-full text-xs font-bold text-teal-800 dark:text-teal-300">
          <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span>Breath-Guided Meditation Sanctuary</span>
        </div>
        <h3 className="text-2xl font-heading font-extrabold text-slate-800 dark:text-white">
          Guided Inhale • Hold • Exhale Meditation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Follow the synchronized vocal and visual breathing rhythm to quiet exam anxiety and enter deep mental presence.
        </p>
      </div>

      {/* Program Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-2">
        {MEDITATION_PROGRAMS.map((prog) => (
          <button
            key={prog.id}
            onClick={() => handleProgramSelect(prog.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedProgramId === prog.id
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{prog.icon}</span>
            <span>{prog.title}</span>
          </button>
        ))}
      </div>

      {/* Breathing Rhythm Selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 my-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center space-x-1">
          <span>Pacing:</span>
        </span>
        {BREATH_PATTERNS.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => handlePatternChange(pattern.id)}
            className={`px-3 py-1 rounded-xl font-semibold transition ${
              selectedPatternId === pattern.id
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {pattern.shortName}
          </button>
        ))}
      </div>

      {/* Active Breath Phase Guidance Banner */}
      <div className="mt-3 text-center">
        <div className={`inline-flex items-center space-x-2 px-5 py-2 rounded-2xl shadow-lg transition-all transform duration-500 ${badgeColor}`}>
          {isBreathInhale && <ArrowUpCircle className="w-5 h-5 animate-bounce" />}
          {isBreathHold && <CircleDot className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />}
          {isBreathExhale && <ArrowDownCircle className="w-5 h-5 animate-bounce" />}
          
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-90">
              {isActive ? 'Current Breath Phase' : 'Next Breath Phase'}
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold tracking-wide uppercase">
              {currentStep.name} • {stepSecondsLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Pulsing Visual Meditation Sphere & Dynamic Progress Ring */}
      <div className="relative my-4 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
        {/* Soft glowing aura */}
        <div className={`absolute inset-0 rounded-full blur-3xl transform transition-all duration-1000 ${glowColor} ${
          isActive ? (isBreathInhale ? 'scale-125' : 'scale-95') : 'scale-90'
        }`} />

        {/* Outer Circular SVG Progress Rings */}
        <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
          {/* Background track */}
          <circle
            cx="50%"
            cy="50%"
            r="100"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Overall session progress track */}
          <circle
            cx="50%"
            cy="50%"
            r="100"
            stroke="currentColor"
            strokeWidth="4"
            className="text-teal-200 dark:text-teal-900/60"
            fill="transparent"
            strokeDasharray="628"
            strokeDashoffset={628 - (628 * progressPercent) / 100}
            strokeLinecap="round"
          />
          {/* Current Breath Phase Progress Ring */}
          <circle
            cx="50%"
            cy="50%"
            r="100"
            stroke="currentColor"
            strokeWidth="8"
            className={`${ringColor} transition-all duration-1000 ease-linear`}
            fill="transparent"
            strokeDasharray="628"
            strokeDashoffset={628 - (628 * stepProgress) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Pulsing Breath Sphere */}
        <div 
          className={`absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr ${
            isBreathInhale ? 'from-emerald-400 via-teal-500 to-cyan-500 shadow-emerald-400/30' :
            isBreathHold ? 'from-indigo-500 via-purple-500 to-indigo-600 shadow-indigo-400/30' :
            'from-cyan-400 via-sky-500 to-teal-500 shadow-cyan-400/30'
          } shadow-2xl flex flex-col items-center justify-center text-white ring-8 ring-white/40 dark:ring-white/10 ${sphereScale}`}
        >
          {/* Phase text */}
          <span className="text-xs uppercase tracking-widest font-extrabold opacity-90 drop-shadow">
            {isActive ? currentStep.name : 'Tap Start'}
          </span>

          {/* Phase seconds countdown */}
          <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tighter drop-shadow my-0.5">
            {isActive ? `${stepSecondsLeft}s` : `${currentStep.duration}s`}
          </span>

          {/* Total Session Time Left */}
          <div className="bg-black/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-1">
            Session: {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Guided Instruction / Phase Direction Quote */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-teal-200 dark:border-slate-700 shadow-sm text-center min-h-[82px] flex flex-col items-center justify-center space-y-1">
        <p className="text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-200 leading-snug">
          {isActive ? currentStep.text : 'Press "Start Meditation" — the audio voice & chime will tell you when to inhale, hold, and exhale.'}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          "{currentGuidance.text}"
        </p>
      </div>

      {/* Voice Coach, Audio Chimes & Ambient Sound Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 my-3">
        {/* Voice Coach Toggle */}
        <button
          onClick={() => {
            const nextVal = !voiceGuideEnabled;
            setVoiceGuideEnabled(nextVal);
            if (nextVal && isActive) {
              speakVoice(currentStep.voice);
            }
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            voiceGuideEnabled
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-teal-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
          }`}
          title="Tells you audibly when to inhale, hold, and exhale via voice speech"
        >
          {voiceGuideEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>Voice Coach: {voiceGuideEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Chime Cue Toggle */}
        <button
          onClick={() => setSoundCueEnabled(!soundCueEnabled)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            soundCueEnabled
              ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
              : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
          }`}
          title="Gentle acoustic chime cue at every breath transition"
        >
          {soundCueEnabled ? <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <BellOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>Chimes: {soundCueEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Durations */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[2, 3, 5, 10].map((mins) => (
            <button
              key={mins}
              onClick={() => handleReset(mins)}
              className={`px-2 py-1 rounded-lg transition ${
                durationMinutes === mins
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Ambient Sound Background */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => toggleSound('chimes')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              soundTrack === 'chimes' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            🔔 Bells
          </button>
          <button
            onClick={() => toggleSound('rain')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              soundTrack === 'rain' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            🌧️ Rain
          </button>
          <button
            onClick={() => toggleSound('waves')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              soundTrack === 'waves' ? 'bg-white dark:bg-slate-700 shadow text-cyan-600 font-bold' : 'text-slate-500'
            }`}
          >
            🌊 Waves
          </button>
          <button
            onClick={() => toggleSound('off')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              soundTrack === 'off' ? 'bg-white dark:bg-slate-700 shadow text-slate-700 font-bold' : 'text-slate-500'
            }`}
          >
            Mute
          </button>
        </div>
      </div>

      {/* Main Start / Pause Controls & Breath Cycle Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-md pt-2 border-t border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Cycles Completed: {completedCycles}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={isActive ? handlePause : handleStart}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-teal-500/25'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Meditation' : 'Start Meditation'}</span>
          </button>

          <button
            onClick={() => handleReset(durationMinutes)}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onComplete && (
            <button
              onClick={() => onComplete(5)}
              className="flex items-center space-x-1.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish & Save</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
