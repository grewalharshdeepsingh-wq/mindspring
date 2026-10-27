import React, { useState } from 'react';
import { RotateCw, Sparkles, CheckCircle, ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const DISTORTIONS = [
  { id: 'catastrophizing', name: 'Catastrophizing', desc: 'Expecting the absolute worst-case scenario to happen ("I will fail and my life is over").' },
  { id: 'all_or_nothing', name: 'All-or-Nothing Thinking', desc: 'Viewing things in black-or-white extremes ("If I don\'t get top marks, I\'m useless").' },
  { id: 'mind_reading', name: 'Mind Reading / Social Projection', desc: 'Assuming teachers or classmates are judging or looking down on you.' },
  { id: 'should_statements', name: 'Tyranny of "Shoulds"', desc: 'Putting crushing rules on yourself ("I should never make mistakes").' }
];

const PRESETS = [
  {
    thought: "I'm lagging behind on revision. Everyone else understands this chapter except me.",
    distortion: 'mind_reading',
    reframed: "Everyone learns at their own pace, and silence doesn't mean others know everything. I only need to master 1 sub-topic today."
  },
  {
    thought: "If I score low on this test, my parents will be devastated and ashamed of me.",
    distortion: 'catastrophizing',
    reframed: "My parents want me to do well because they care about my future, but one test does not determine their love or my value as a human."
  },
  {
    thought: "I made a careless mistake during class question time. Now everyone thinks I am stupid.",
    distortion: 'all_or_nothing',
    reframed: "Making mistakes in class is how brains learn. Nobody remembers my mistake after 5 minutes because they are focused on themselves."
  }
];

export default function ThoughtFlipTool({ onComplete }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [negativeThought, setNegativeThought] = useState('');
  const [selectedDistortion, setSelectedDistortion] = useState('catastrophizing');
  const [reframedThought, setReframedThought] = useState('');

  const loadPreset = (preset) => {
    setNegativeThought(preset.thought);
    setSelectedDistortion(preset.distortion);
    setReframedThought(preset.reframed);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    if (!negativeThought.trim()) {
      setNegativeThought(PRESETS[0].thought);
      setReframedThought(PRESETS[0].reframed);
    }
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-purple-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[520px]">
      {/* Header */}
      <div className="text-center max-w-md">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-300 dark:border-purple-700">
          Cognitive Behavioral Therapy (CBT)
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-2">
          The 3D "Thought Flip" Reality Check
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Feelings aren't facts. Disarm automatic negative self-criticism by examining the evidence and flipping it into an objective truth.
        </p>
      </div>

      {/* Preset pills for quick exploration */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-3">
        <span className="text-[11px] font-semibold text-slate-400">Quick Samples:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(p)}
            className="text-[11px] bg-white dark:bg-slate-800 hover:bg-purple-50 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 transition"
          >
            Example #{idx + 1}
          </button>
        ))}
      </div>

      {/* 3D Flipping Card Container */}
      <div className="w-full max-w-lg perspective my-2">
        <div className={`relative transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT: Anxious / Negative Thought */}
          {!isFlipped ? (
            <div className="bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-ping" />
                  <span>The Harsh / Anxious Belief</span>
                </span>
                <span className="text-xs text-slate-400">Step 1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  What automatic worry or self-doubt is bothering you?
                </label>
                <textarea
                  value={negativeThought}
                  onChange={(e) => setNegativeThought(e.target.value)}
                  placeholder="e.g., If I make a mistake on this question, the whole class will think I'm incapable..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Which cognitive trap might this be?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DISTORTIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDistortion(d.id)}
                      className={`p-2 rounded-xl text-left border text-[11px] transition ${
                        selectedDistortion === d.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFlip}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Flip Into Balanced Reality</span>
              </button>
            </div>
          ) : (
            /* BACK: Reframed Empowered Reality */
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-600 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>The Objective Balanced Reality (The Flip)</span>
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Flipped! ✨
                </span>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-emerald-200 dark:border-emerald-700">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Previous Harsh Thought:</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic line-through mt-0.5">
                  "{negativeThought || 'I will fail everything'}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Empowered Realistic Truth:
                </label>
                <textarea
                  value={reframedThought}
                  onChange={(e) => setReframedThought(e.target.value)}
                  placeholder="e.g., Mistakes are natural. One question doesn't define my intelligence..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-emerald-300 dark:border-emerald-600 bg-emerald-50/40 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 h-24 resize-none font-medium"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFlipped(false)}
                  className="flex-1 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-100 transition"
                >
                  Edit Thought
                </button>
                <button
                  onClick={() => {
                    if (onComplete) onComplete(5);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Reframe</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
