import React, { useState } from 'react';
import { 
  Wind, 
  Clock, 
  Sparkles, 
  PenTool, 
  Flower2, 
  Eye, 
  Heart,
  Moon,
  Gamepad2
} from 'lucide-react';
import BreathingStudio from './BreathingStudio';
import MeditationStudio from './MeditationStudio';
import StudyTimer from './StudyTimer';
import ThoughtFlipTool from './ThoughtFlipTool';
import ZenCanvas from './ZenCanvas';
import GratitudeGarden from './GratitudeGarden';
import ActionStepsViewer from './ActionStepsViewer';
import MiniGameStudio from './MiniGameStudio';

export default function WellnessStudio({ flowers, onAddFlower }) {
  const [activeTool, setActiveTool] = useState('meditation');

  const tools = [
    {
      id: 'meditation',
      name: 'Guided Meditation',
      icon: Moon,
      color: 'from-teal-500 to-cyan-600',
      desc: 'Guided calming meditation with audio chimes, voice coach, and inhale/hold/exhale pacing.'
    },
    {
      id: 'minigame',
      name: 'Stress Mini-Games',
      icon: Gamepad2,
      color: 'from-violet-500 to-purple-600',
      desc: 'Playable stress busters: Bubble Pop, Zen Stone Balancer & Lotus Catch.'
    },
    {
      id: 'breathing',
      name: 'Breathing Studio',
      icon: Wind,
      color: 'from-emerald-500 to-teal-600',
      desc: 'Box breathing & 4-7-8 parasympathetic lung exercises with animated rhythm.'
    },
    {
      id: 'timer',
      name: '5-Min Study Sprint',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      desc: 'BJ Fogg micro-habit timer with built-in focus ambient audio.'
    },
    {
      id: 'thought_flip',
      name: 'CBT Thought Flip',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      desc: 'Identify catastrophic cognitive traps and flip them into objective truth.'
    },
    {
      id: 'doodle',
      name: 'Mindful Zen Canvas',
      icon: PenTool,
      color: 'from-cyan-500 to-blue-600',
      desc: 'No-judgment digital drawing scratchpad with soft pastel brushes.'
    },
    {
      id: 'gratitude',
      name: 'Gratitude Garden',
      icon: Flower2,
      color: 'from-rose-500 to-pink-600',
      desc: 'Plant blooming digital flowers celebrating tiny everyday joys.'
    },
    {
      id: 'grounding',
      name: '5-4-3-2-1 Sensory Reset',
      icon: Eye,
      color: 'from-teal-600 to-slate-700',
      desc: 'Anchor somatic awareness to stop exam panic spirals instantly.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
            Self-Paced Sanctuary
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            MindSpring Wellness Studio
          </h2>
          <p className="text-xs text-teal-100">
            Access any evidence-based self-care tool whenever you need immediate calm, focus, or emotional perspective.
          </p>
        </div>
      </div>

      {/* Tool Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between h-28 ${
                isActive
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-400/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${t.color} text-white flex items-center justify-center shadow-sm`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{t.name}</h4>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Interactive</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Viewport */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
        {activeTool === 'meditation' && <MeditationStudio />}
        {activeTool === 'minigame' && <MiniGameStudio />}
        {activeTool === 'breathing' && <BreathingStudio />}
        {activeTool === 'timer' && <StudyTimer />}
        {activeTool === 'thought_flip' && <ThoughtFlipTool />}
        {activeTool === 'doodle' && <ZenCanvas />}
        {activeTool === 'gratitude' && <GratitudeGarden flowers={flowers} onAddFlower={onAddFlower} />}
        {activeTool === 'grounding' && (
          <ActionStepsViewer
            activity={{
              id: 'grounding_54321',
              title: '5-4-3-2-1 Sensory Grounding',
              description: 'Ground racing thoughts back into physical reality step-by-step.',
              steps: [
                'Look around: Identify 5 distinct things you see right now.',
                'Touch: Notice 4 physical textures (chair, desk, your shirt, book cover).',
                'Listen: Name 3 subtle sounds in your room or distance.',
                'Scent: Notice 2 smells or inhale fresh cool air deeply.',
                'Appreciation: Whisper 1 trait you respect about your character.'
              ]
            }}
          />
        )}
      </div>
    </div>
  );
}
