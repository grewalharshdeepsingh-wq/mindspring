import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Wind } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

const BREATH_MODES = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    tag: 'Focus & Rapid Calm',
    steps: [
      { name: 'Inhale', duration: 4, text: 'Slowly breathe in through your nose...' },
      { name: 'Hold', duration: 4, text: 'Gently hold your breath, keep shoulders relaxed...' },
      { name: 'Exhale', duration: 4, text: 'Smoothly exhale through your mouth...' },
      { name: 'Hold', duration: 4, text: 'Rest peacefully before the next breath...' }
    ]
  },
  {
    id: '478',
    name: '4-7-8 Sleep & Anxiety Reset',
    tag: 'Deep Parasympathetic Relaxation',
    steps: [
      { name: 'Inhale', duration: 4, text: 'Inhale quietly through your nose for 4s...' },
      { name: 'Hold', duration: 7, text: 'Hold your breath gently for 7s...' },
      { name: 'Exhale', duration: 8, text: 'Release with a whoosh exhale for 8s...' }
    ]
  },
  {
    id: 'calm_sigh',
    name: 'Physiological Sigh (2 Inhales + Long Out)',
    tag: 'Instant Panic Breaker',
    steps: [
      { name: 'Deep Inhale', duration: 3, text: 'Deep inhale filling lungs to 80%...' },
      { name: 'Top-Off Inhale', duration: 1.5, text: 'Quick sharp sniff to fully inflate alveoli...' },
      { name: 'Long Exhale', duration: 6, text: 'Slow, long, audible sigh out through mouth...' }
    ]
  }
];

export default function BreathingStudio({ onComplete, initialMode = 'box' }) {
  const [selectedModeId, setSelectedModeId] = useState(initialMode);
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeftInStep, setTimeLeftInStep] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  const currentMode = BREATH_MODES.find(m => m.id === selectedModeId) || BREATH_MODES[0];
  const currentStep = currentMode.steps[stepIndex];

  // Timer runner
  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeftInStep(prev => {
          if (prev <= 1) {
            // Next step in cycle
            setStepIndex(currIdx => {
              const nextIdx = (currIdx + 1) % currentMode.steps.length;
              if (nextIdx === 0) {
                setCompletedCycles(c => c + 1);
              }
              const nextDuration = currentMode.steps[nextIdx].duration;
              setTimeLeftInStep(nextDuration);
              if (chimeEnabled) {
                soundEngine.playSingleChime(nextIdx === 0 ? 528 : 432);
              }
              return nextIdx;
            });
            return 1;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, currentMode, chimeEnabled]);

  const handleStartPause = () => {
    if (!isActive && chimeEnabled) {
      soundEngine.playSingleChime(528);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setStepIndex(0);
    setTimeLeftInStep(currentMode.steps[0].duration);
    setCompletedCycles(0);
  };

  const handleModeChange = (modeId) => {
    setIsActive(false);
    setSelectedModeId(modeId);
    const mode = BREATH_MODES.find(m => m.id === modeId) || BREATH_MODES[0];
    setStepIndex(0);
    setTimeLeftInStep(mode.steps[0].duration);
    setCompletedCycles(0);
  };

  // Determine scale factor for the animated visual lung / sphere
  const isInhale = currentStep.name.toLowerCase().includes('inhale');
  const isHold = currentStep.name.toLowerCase().includes('hold');
  const isExhale = currentStep.name.toLowerCase().includes('exhale');

  let sphereScale = 'scale-100';
  let sphereColor = 'from-emerald-400 to-teal-500';
  if (isInhale) {
    sphereScale = 'scale-125 transition-transform duration-[4000ms]';
    sphereColor = 'from-teal-400 to-emerald-500';
  } else if (isHold) {
    sphereScale = 'scale-125';
    sphereColor = 'from-indigo-400 to-purple-500';
  } else if (isExhale) {
    sphereScale = 'scale-75 transition-transform duration-[4000ms]';
    sphereColor = 'from-blue-400 to-cyan-500';
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[520px]">
      {/* Mode selection buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4 w-full">
        {BREATH_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeChange(mode.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedModeId === mode.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {mode.name}
          </button>
        ))}
      </div>

      {/* Main Breathing Graphic Animated Circle */}
      <div className="relative flex items-center justify-center my-6 w-64 h-64 sm:w-72 sm:h-72">
        {/* Soft outer glow rings */}
        <div className={`absolute inset-0 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-2xl transform transition-transform duration-1000 ${
          isActive ? (isInhale ? 'scale-150' : 'scale-90') : 'scale-100'
        }`} />

        {/* Dynamic expanding animated circle */}
        <div 
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr ${sphereColor} shadow-2xl flex flex-col items-center justify-center text-white transition-all ease-in-out duration-700 ${sphereScale} ring-8 ring-white/30 dark:ring-white/10`}
        >
          <Wind className={`w-8 h-8 mb-1 opacity-80 ${isInhale ? 'animate-bounce' : ''}`} />
          <span className="text-xl sm:text-2xl font-heading font-extrabold tracking-wide uppercase drop-shadow">
            {isActive ? currentStep.name : 'Ready?'}
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono mt-0.5">
            {isActive ? timeLeftInStep : currentMode.steps[0].duration}s
          </span>
        </div>
      </div>

      {/* Guiding Text */}
      <div className="text-center max-w-sm px-4 min-h-[56px] flex flex-col justify-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all">
          {isActive ? currentStep.text : 'Press "Start Breathing" to begin your calibrated session.'}
        </p>
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
          Cycles Completed: {completedCycles}
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={handleStartPause}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isActive ? 'Pause' : 'Start Breathing'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
          title="Reset Session"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setChimeEnabled(!chimeEnabled)}
          className={`p-3 rounded-2xl border transition shadow-sm ${
            chimeEnabled
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
          }`}
          title={chimeEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
        >
          {chimeEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Done & Claim Micro-Reward */}
      {completedCycles >= 2 && onComplete && (
        <div className="mt-4 animate-fade-in">
          <button
            onClick={() => onComplete(5)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow hover:from-emerald-600 hover:to-teal-600 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>I feel calmer (Save & Finish)</span>
          </button>
        </div>
      )}
    </div>
  );
}
