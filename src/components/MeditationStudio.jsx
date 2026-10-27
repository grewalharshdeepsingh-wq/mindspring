import React, { useState, useEffect } from 'react';
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
  Flower2
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

const MEDITATION_PROGRAMS = [
  {
    id: 'mindful_breath',
    title: 'Mindful Breathing Anchor',
    tag: 'Focus & Centering',
    icon: '🌸',
    guidance: [
      { atSec: 0, text: 'Find a comfortable upright posture. Gently close your eyes or soften your gaze downwards.' },
      { atSec: 15, text: 'Bring your attention to the natural rhythm of your breath. Do not force it—just observe.' },
      { atSec: 35, text: 'Notice where you feel the breath most clearly: the nostrils, chest, or belly rising and falling.' },
      { atSec: 65, text: 'When your mind wanders into thoughts of homework or exams, gently note: "thinking", and bring attention back.' },
      { atSec: 110, text: 'Inhaling calm, exhaling any tension or rush. You are completely safe and grounded in this moment.' },
      { atSec: 160, text: 'Rest in this gentle stillness. Notice the quiet space between each inhale and exhale.' },
      { atSec: 210, text: 'Take three deep, full breaths. Slowly wiggle your fingers and gently return your awareness to the room.' }
    ]
  },
  {
    id: 'body_scan',
    title: 'Exam Tension Body Scan',
    tag: 'Somatic Release',
    icon: '🧘',
    guidance: [
      { atSec: 0, text: 'Take a slow, deep breath in... and let your shoulders drop down away from your ears as you exhale.' },
      { atSec: 20, text: 'Notice your forehead and eyebrows. Soften any furrowing or concentration tension.' },
      { atSec: 50, text: 'Unclench your jaw. Let your tongue rest gently, allowing the muscles around your mouth to relax.' },
      { atSec: 90, text: 'Feel the contact of your feet against the floor. Feel the solid ground supporting you unconditionally.' },
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
      { atSec: 210, text: 'Rest in this feeling of deep kindness toward yourself.' }
    ]
  }
];

export default function MeditationStudio({ onComplete }) {
  const [selectedProgramId, setSelectedProgramId] = useState('mindful_breath');
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [soundTrack, setSoundTrack] = useState('chimes'); // 'chimes' | 'rain' | 'alpha' | 'off'
  const [elapsedSec, setElapsedSec] = useState(0);

  const currentProgram = MEDITATION_PROGRAMS.find(p => p.id === selectedProgramId) || MEDITATION_PROGRAMS[0];

  // Pick guidance text based on elapsed time
  const currentGuidance = [...currentProgram.guidance]
    .reverse()
    .find(g => elapsedSec >= g.atSec) || currentProgram.guidance[0];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setElapsedSec(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      soundEngine.stopAll();
      soundEngine.playSingleChime(528);
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleSound = (type) => {
    if (soundTrack === type) {
      soundEngine.stopAll();
      setSoundTrack('off');
    } else {
      soundEngine.stopAll();
      if (type === 'rain') soundEngine.startRain();
      if (type === 'alpha') soundEngine.startAlpha();
      if (type === 'chimes') soundEngine.startChimes();
      setSoundTrack(type);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    if (soundTrack === 'chimes') soundEngine.startChimes();
    if (soundTrack === 'rain') soundEngine.startRain();
    if (soundTrack === 'alpha') soundEngine.startAlpha();
  };

  const handlePause = () => {
    setIsActive(false);
    soundEngine.stopAll();
  };

  const handleReset = (mins = durationMinutes) => {
    setIsActive(false);
    soundEngine.stopAll();
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
    setElapsedSec(0);
  };

  const handleProgramSelect = (progId) => {
    setIsActive(false);
    soundEngine.stopAll();
    setSelectedProgramId(progId);
    setTimeLeft(durationMinutes * 60);
    setElapsedSec(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalSec = durationMinutes * 60;
  const progressPercent = ((totalSec - timeLeft) / totalSec) * 100;

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-teal-50/50 via-white to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[540px]">
      {/* Top Banner */}
      <div className="text-center max-w-md">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-300 dark:border-teal-700">
          Guided Mindfulness & Meditation
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-1.5">
          Student Meditation Sanctuary
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Guided calm, gentle breathing synchronization, and restorative mental clarity.
        </p>
      </div>

      {/* Program Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-3">
        {MEDITATION_PROGRAMS.map((prog) => (
          <button
            key={prog.id}
            onClick={() => handleProgramSelect(prog.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedProgramId === prog.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{prog.icon}</span>
            <span>{prog.title}</span>
          </button>
        ))}
      </div>

      {/* Pulsing Visual Meditation Lotus / Mandala */}
      <div className="relative my-4 flex items-center justify-center w-60 h-60">
        {/* Soft glowing aura */}
        <div className={`absolute inset-0 rounded-full bg-teal-300/30 dark:bg-teal-500/10 blur-2xl transform transition-transform duration-1000 ${
          isActive ? 'scale-125 animate-pulse-subtle' : 'scale-90'
        }`} />

        {/* Outer progress ring */}
        <svg className="w-56 h-56 transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="82"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx="112"
            cy="112"
            r="82"
            stroke="currentColor"
            strokeWidth="8"
            className="text-teal-500 transition-all duration-1000 ease-linear"
            fill="transparent"
            strokeDasharray="515"
            strokeDashoffset={515 - (515 * progressPercent) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Pulsing Sphere */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-800 dark:text-white tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mt-1">
            {isActive ? 'Breathe & Rest' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Guided Voice / Text Prompts Box */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-teal-200 dark:border-slate-700 shadow-sm text-center min-h-[76px] flex items-center justify-center">
        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed italic animate-fade-in">
          "{currentGuidance.text}"
        </p>
      </div>

      {/* Duration selector & Ambient sound pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 my-3">
        {/* Durations */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[2, 3, 5].map((mins) => (
            <button
              key={mins}
              onClick={() => handleReset(mins)}
              className={`px-2.5 py-1 rounded-lg transition ${
                durationMinutes === mins
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Ambient Sound */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => toggleSound('chimes')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              soundTrack === 'chimes' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            🔔 Chimes
          </button>
          <button
            onClick={() => toggleSound('rain')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              soundTrack === 'rain' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            🌧️ Rain
          </button>
          <button
            onClick={() => toggleSound('off')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              soundTrack === 'off' ? 'bg-white dark:bg-slate-700 shadow text-slate-700 font-bold' : 'text-slate-500'
            }`}
          >
            Mute
          </button>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center space-x-3 mt-2">
        <button
          onClick={isActive ? handlePause : handleStart}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
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
  );
}
