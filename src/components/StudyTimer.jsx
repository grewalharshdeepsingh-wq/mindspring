import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Headphones, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audioSynthesizer';

export default function StudyTimer({ onComplete, initialSeconds = 300, topic = 'Your Chosen Subject' }) {
  const [totalDuration, setTotalDuration] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [soundTrack, setSoundTrack] = useState('rain'); // 'rain' | 'alpha' | 'off'
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      soundEngine.stopAll();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Audio sync
  const toggleAudio = (type) => {
    if (soundTrack === type) {
      soundEngine.stopAll();
      setSoundTrack('off');
    } else {
      soundEngine.stopAll();
      if (type === 'rain') soundEngine.startRain();
      if (type === 'alpha') soundEngine.startAlpha();
      setSoundTrack(type);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    if (soundTrack === 'rain') soundEngine.startRain();
    if (soundTrack === 'alpha') soundEngine.startAlpha();
  };

  const handlePause = () => {
    setIsActive(false);
    soundEngine.stopAll();
  };

  const handleReset = (seconds = 300) => {
    setIsActive(false);
    soundEngine.stopAll();
    setTotalDuration(seconds);
    setTimeLeft(seconds);
    setIsFinished(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 440 - (440 * progressPercentage) / 100;

  return (
    <div className="flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50/50 via-white to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[500px]">
      {/* BJ Fogg Concept Banner */}
      <div className="text-center max-w-md">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
          BJ Fogg Micro-Habit Strategy
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-2">
          The 5-Minute Micro-Start
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Commit only to the first 5 minutes. Bypasses the brain's overwhelm response. Once finished, you are 100% free to stop guilt-free!
        </p>
      </div>

      {/* SVG Circular Animated Timer */}
      <div className="relative my-6 flex items-center justify-center">
        <svg className="w-56 h-56 transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="85"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx="112"
            cy="112"
            r="85"
            stroke="currentColor"
            strokeWidth="12"
            className="text-amber-500 transition-all duration-1000 ease-linear"
            fill="transparent"
            strokeDasharray="534"
            strokeDashoffset={534 - (534 * progressPercentage) / 100}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono text-slate-800 dark:text-white tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {isActive ? 'In the Zone' : isFinished ? 'Session Complete!' : 'Ready to begin'}
          </span>
        </div>
      </div>

      {/* Ambient Audio Pill selector */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <Headphones className="w-3.5 h-3.5 text-slate-500 ml-2" />
        <span className="text-slate-500 font-semibold text-[11px]">Focus Sound:</span>
        <button
          onClick={() => toggleAudio('rain')}
          className={`px-2.5 py-1 rounded-xl font-medium transition ${
            soundTrack === 'rain' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          🌧️ Soft Rain
        </button>
        <button
          onClick={() => toggleAudio('alpha')}
          className={`px-2.5 py-1 rounded-xl font-medium transition ${
            soundTrack === 'alpha' ? 'bg-white dark:bg-slate-700 shadow text-purple-600 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          🧠 Alpha Waves
        </button>
        <button
          onClick={() => toggleAudio('off')}
          className={`px-2.5 py-1 rounded-xl font-medium transition ${
            soundTrack === 'off' ? 'bg-white dark:bg-slate-700 shadow text-slate-700 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Silent
        </button>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center space-x-3 mt-6">
        {!isFinished ? (
          <>
            <button
              onClick={isActive ? handlePause : handleStart}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause Sprint' : 'Start 5 Minutes'}</span>
            </button>

            <button
              onClick={() => handleReset(300)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition shadow-sm"
              title="Reset to 5m"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
            <button
              onClick={() => {
                if (onComplete) onComplete(5);
              }}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Great Job! Claim Victory</span>
            </button>

            <button
              onClick={() => handleReset(600)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow transition"
            >
              <span>Feeling momentum? Add 10 mins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
