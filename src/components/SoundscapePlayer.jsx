import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Brain, 
  Bell, 
  Play, 
  Square,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

export default function SoundscapePlayer() {
  const [playingStates, setPlayingStates] = useState({
    rain: false,
    waves: false,
    alpha: false,
    chimes: false,
  });

  const [volumes, setVolumes] = useState({
    rain: 0.4,
    waves: 0.35,
    alpha: 0.25,
    chimes: 0.3,
  });

  const handleToggle = (track) => {
    const nextState = !playingStates[track];
    setPlayingStates(prev => ({ ...prev, [track]: nextState }));

    if (nextState) {
      if (track === 'rain') soundEngine.startRain();
      if (track === 'waves') soundEngine.startWaves();
      if (track === 'alpha') soundEngine.startAlpha();
      if (track === 'chimes') soundEngine.startChimes();
    } else {
      if (track === 'rain') soundEngine.stopRain();
      if (track === 'waves') soundEngine.stopWaves();
      if (track === 'alpha') soundEngine.stopAlpha();
      if (track === 'chimes') soundEngine.stopChimes();
    }
  };

  const handleVolumeChange = (track, val) => {
    setVolumes(prev => ({ ...prev, [track]: val }));
    soundEngine.setVolume(track, val);
  };

  const stopAll = () => {
    soundEngine.stopAll();
    setPlayingStates({
      rain: false,
      waves: false,
      alpha: false,
      chimes: false,
    });
  };

  const isAnyPlaying = Object.values(playingStates).some(Boolean);

  const tracks = [
    {
      id: 'rain',
      name: 'Gentle Rainfall',
      desc: 'Filtered continuous rain texture to mask distracting noises',
      icon: CloudRain,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'waves',
      name: 'Pacific Ocean Waves',
      desc: 'Periodic swells (~7s) matching natural resting respiration',
      icon: Waves,
      color: 'from-teal-500 to-emerald-500',
    },
    {
      id: 'alpha',
      name: 'Binaural Alpha Waves (10 Hz)',
      desc: 'Encourages calm alertness and reduces exam revision fatigue',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'chimes',
      name: 'Tibetan Meditation Bells',
      desc: 'Spaced harmonic chimes (528 Hz Solfeggio frequency)',
      icon: Bell,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
              Procedural Audio Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Calming Ambient Soundscapes
            </h2>
            <p className="text-xs text-cyan-100 max-w-xl">
              Synthesized live in your browser using the Web Audio API. Zero buffering, no external streaming data, and designed to mask background study distractions.
            </p>
          </div>

          <div>
            {isAnyPlaying && (
              <button
                onClick={stopAll}
                className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Mute All Audio</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient Waveform Visualization bars */}
        <div className="flex items-end justify-center space-x-1.5 h-16 mt-6 opacity-40">
          {[40, 65, 80, 50, 90, 70, 45, 85, 95, 60, 40, 75, 80, 55, 90, 65, 45, 70, 85, 40].map((h, i) => (
            <div
              key={i}
              style={{ height: isAnyPlaying ? `${h}%` : '20%' }}
              className={`w-2.5 rounded-full bg-cyan-300 transition-all duration-300 ${isAnyPlaying ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Grid of Sound Generators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track) => {
          const Icon = track.icon;
          const isPlaying = playingStates[track.id];
          return (
            <div
              key={track.id}
              className={`p-6 rounded-3xl border-2 transition-all ${
                isPlaying
                  ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-md ring-2 ring-teal-400/20'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${track.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white">
                      {track.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {track.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(track.id)}
                  className={`p-3 rounded-2xl font-bold text-xs transition shadow-sm ${
                    isPlaying
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volumes[track.id]}
                  onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400 w-8 text-right">
                  {Math.round(volumes[track.id] * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
