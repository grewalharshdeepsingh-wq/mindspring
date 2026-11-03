import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

/**
 * RobotSolverAvatar
 * An animated, friendly AI Robot companion that visually reacts to:
 * - Analyzing / Thinking
 * - Speaking (animated mouth soundwave, glowing antenna rings, pulsing core)
 * - Finished speaking (happy smiling eyes, glowing aura, celebration)
 * - Idle / Waiting
 */
export default function RobotSolverAvatar({
  isSpeaking = false,
  isAnalyzing = false,
  hasFinished = false,
  onToggleSpeech,
  onRepeatSpeech,
  studentName = ''
}) {
  const [blink, setBlink] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center select-none py-2">
      {/* Floating Robot Container */}
      <div className="relative group">
        
        {/* Ambient Glow Aura */}
        <div 
          className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            isSpeaking 
              ? 'bg-gradient-to-r from-cyan-400/40 via-emerald-400/35 to-teal-400/40 opacity-100 scale-110 animate-pulse' 
              : isAnalyzing
              ? 'bg-gradient-to-r from-amber-400/30 via-cyan-400/30 to-emerald-400/30 opacity-80 animate-spin'
              : hasFinished
              ? 'bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 opacity-70 scale-105'
              : 'bg-cyan-500/15 opacity-50'
          }`}
          style={{ animationDuration: isAnalyzing ? '8s' : '3s' }}
        />

        {/* Robot Main SVG & Motion */}
        <div 
          className={`relative transition-transform duration-700 ease-in-out ${
            isSpeaking ? 'animate-[floatGentle_3s_ease-in-out_infinite]' : 'animate-[floatGentle_5s_ease-in-out_infinite]'
          }`}
        >
          <svg
            viewBox="0 0 200 220"
            className="w-40 h-44 sm:w-48 sm:h-52 drop-shadow-2xl transition-all"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic Body Gradient */}
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>

              {/* Visor Gradient */}
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Cyan Neon Glow */}
              <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              {/* Emerald Glow */}
              <linearGradient id="emeraldNeon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Highlight Rim */}
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ANTENNA & SIGNAL WAVES */}
            {/* Signal Broadcast Waves (Active when speaking) */}
            {isSpeaking && (
              <g className="animate-pulse">
                <path
                  d="M80 20 C80 10, 120 10, 120 20"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d="M70 12 C70 -2, 130 -2, 130 12"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </g>
            )}

            {/* Antenna Stem */}
            <line x1="100" y1="36" x2="100" y2="52" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="50" r="3" fill="#0284c7" />

            {/* Antenna Orb */}
            <circle
              cx="100"
              cy="34"
              r="7"
              fill={isSpeaking ? "url(#emeraldNeon)" : isAnalyzing ? "#f59e0b" : "url(#cyanNeon)"}
              filter="url(#glowFilter)"
              className={isSpeaking ? "animate-pulse" : ""}
            />
            <circle cx="98" cy="32" r="2.5" fill="#ffffff" opacity="0.8" />

            {/* SIDE EAR MODULES / HEADPHONES */}
            {/* Left Ear */}
            <rect x="36" y="78" width="12" height="34" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <circle 
              cx="42" 
              cy="95" 
              r="3.5" 
              fill={isSpeaking ? "#22d3ee" : "#0284c7"} 
              filter={isSpeaking ? "url(#glowFilter)" : undefined} 
            />

            {/* Right Ear */}
            <rect x="152" y="78" width="12" height="34" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <circle 
              cx="158" 
              cy="95" 
              r="3.5" 
              fill={isSpeaking ? "#22d3ee" : "#0284c7"} 
              filter={isSpeaking ? "url(#glowFilter)" : undefined} 
            />

            {/* HEAD CHASSIS */}
            <rect
              x="45"
              y="52"
              width="110"
              height="84"
              rx="28"
              fill="url(#bodyGrad)"
              stroke="url(#rimGrad)"
              strokeWidth="2.5"
            />

            {/* GLOSSY VISOR SCREEN */}
            <rect
              x="55"
              y="63"
              width="90"
              height="62"
              rx="18"
              fill="url(#visorGrad)"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Visor Glare Reflection */}
            <path
              d="M59 72 Q100 66 141 72 Q130 67 100 67 Q70 67 59 72 Z"
              fill="#ffffff"
              opacity="0.15"
            />

            {/* EYES */}
            {blink ? (
              // Blinking state: flat line
              <g stroke="#22d3ee" strokeWidth="3" strokeLinecap="round">
                <line x1="72" y1="88" x2="88" y2="88" />
                <line x1="112" y1="88" x2="128" y2="88" />
              </g>
            ) : hasFinished && !isSpeaking ? (
              // Finished speaking: Happy curved eyes ^ ^
              <g stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowFilter)">
                <path d="M72 90 Q80 81 88 90" fill="none" />
                <path d="M112 90 Q120 81 128 90" fill="none" />
              </g>
            ) : isAnalyzing ? (
              // Analyzing: Scanning horizontal cyber-visors
              <g filter="url(#glowFilter)">
                <rect x="68" y="85" width="24" height="6" rx="3" fill="#38bdf8" className="animate-pulse" />
                <rect x="108" y="85" width="24" height="6" rx="3" fill="#38bdf8" className="animate-pulse" />
              </g>
            ) : (
              // Normal & Speaking Eyes: Glowing Expressive Orbs
              <g filter="url(#glowFilter)">
                {/* Left Eye */}
                <ellipse cx="80" cy="88" rx="8" ry="9" fill={isSpeaking ? "#22d3ee" : "#38bdf8"} />
                <circle cx="78" cy="85" r="3" fill="#ffffff" />
                {/* Right Eye */}
                <ellipse cx="120" cy="88" rx="8" ry="9" fill={isSpeaking ? "#22d3ee" : "#38bdf8"} />
                <circle cx="118" cy="85" r="3" fill="#ffffff" />
              </g>
            )}

            {/* MOUTH / EQUALIZER VOICE WAVEFORM */}
            {isSpeaking ? (
              // Speaking State: Live bouncing soundwave equalizer bars
              <g filter="url(#glowFilter)">
                {/* Bar 1 */}
                <line x1="86" y1="110" x2="86" y2="116" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round">
                  <animate attributeName="y1" values="107;112;106;111;107" dur="0.4s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="117;114;118;115;117" dur="0.4s" repeatCount="indefinite" />
                </line>
                {/* Bar 2 */}
                <line x1="93" y1="105" x2="93" y2="119" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
                  <animate attributeName="y1" values="104;110;105;111;104" dur="0.32s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="120;115;121;114;120" dur="0.32s" repeatCount="indefinite" />
                </line>
                {/* Bar 3 (Center) */}
                <line x1="100" y1="102" x2="100" y2="122" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round">
                  <animate attributeName="y1" values="101;111;102;112;101" dur="0.28s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="123;114;124;113;123" dur="0.28s" repeatCount="indefinite" />
                </line>
                {/* Bar 4 */}
                <line x1="107" y1="105" x2="107" y2="119" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
                  <animate attributeName="y1" values="105;111;104;110;105" dur="0.35s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="119;114;121;115;119" dur="0.35s" repeatCount="indefinite" />
                </line>
                {/* Bar 5 */}
                <line x1="114" y1="108" x2="114" y2="116" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round">
                  <animate attributeName="y1" values="108;112;106;111;108" dur="0.42s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="116;113;118;114;116" dur="0.42s" repeatCount="indefinite" />
                </line>
              </g>
            ) : hasFinished ? (
              // Finished speaking: Cheerful wide smile
              <path
                d="M88 111 Q100 121 112 111"
                stroke="#34d399"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                filter="url(#glowFilter)"
              />
            ) : isAnalyzing ? (
              // Analyzing: Gentle pulsating dash
              <line 
                x1="92" 
                y1="114" 
                x2="108" 
                y2="114" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                className="animate-pulse"
              />
            ) : (
              // Idle state: Subtle friendly digital smile
              <path
                d="M92 113 Q100 119 108 113"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* NECK JOINT */}
            <rect x="88" y="136" width="24" height="10" rx="3" fill="#334155" />
            <line x1="94" y1="139" x2="106" y2="139" stroke="#64748b" strokeWidth="1.5" />
            <line x1="94" y1="143" x2="106" y2="143" stroke="#64748b" strokeWidth="1.5" />

            {/* TORSO / BODY CHASSIS */}
            <path
              d="M58 146 C58 146, 68 142, 100 142 C132 142, 142 146, 142 146 L134 186 C134 192, 126 196, 100 196 C74 196, 66 192, 66 186 Z"
              fill="url(#bodyGrad)"
              stroke="url(#rimGrad)"
              strokeWidth="2"
            />

            {/* CHEST REACTOR / EMPATHY CORE */}
            <circle
              cx="100"
              cy="166"
              r="13"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <circle
              cx="100"
              cy="166"
              r="8"
              fill={isSpeaking ? "url(#emeraldNeon)" : hasFinished ? "url(#emeraldNeon)" : "url(#cyanNeon)"}
              filter="url(#glowFilter)"
              className={isSpeaking ? "animate-ping" : ""}
              style={{ animationDuration: '2s' }}
            />
            <circle
              cx="100"
              cy="166"
              r="4"
              fill="#ffffff"
              opacity="0.9"
            />

            {/* ROBOT HANDS / CHEVRONS */}
            <path
              d="M52 154 Q44 168 54 178"
              stroke="#64748b"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="54" cy="178" r="4" fill="#38bdf8" />

            <path
              d="M148 154 Q156 168 146 178"
              stroke="#64748b"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="146" cy="178" r="4" fill="#38bdf8" />

            {/* HOVER THRUSTER RING */}
            <ellipse
              cx="100"
              cy="196"
              rx="18"
              ry="4"
              fill="#0284c7"
              filter="url(#glowFilter)"
              opacity={isSpeaking ? "0.9" : "0.6"}
            />
            {/* Thruster Glow Particle Beam */}
            <path
              d="M92 198 L100 210 L108 198 Z"
              fill="url(#cyanNeon)"
              opacity={isSpeaking ? "0.7" : "0.3"}
              filter="url(#glowFilter)"
            />
          </svg>
        </div>

        {/* Soft Floor Shadow that counter-scales with hover */}
        <div 
          className={`mx-auto h-3 rounded-full bg-slate-900/30 dark:bg-black/50 blur-md transition-all duration-700 ${
            isSpeaking ? 'w-24 opacity-60 scale-95' : 'w-28 opacity-40 scale-100'
          }`} 
        />
      </div>

      {/* Live Status Badge */}
      <div className="mt-3 flex items-center space-x-2">
        {isSpeaking ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 text-xs font-bold border border-cyan-300 dark:border-cyan-800 shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span>Robo-Mentor is speaking...</span>
          </span>
        ) : hasFinished ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Answer Complete! Ready to replay</span>
          </span>
        ) : isAnalyzing ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Analyzing problem & formulating answer...</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-semibold">
            <span>AI Empathetic Voice Companion</span>
          </span>
        )}
      </div>
    </div>
  );
}
