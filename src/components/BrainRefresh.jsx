import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const RIDDLES = [
  {
    riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "An Echo 🏔️",
    fact: "Did you know? Taking a 2-minute laughter or curiosity break increases blood flow to the brain's prefrontal cortex by 17%!"
  },
  {
    riddle: "What has keys, but no locks; space, but no room; and you can enter, but never go in?",
    answer: "A Keyboard ⌨️",
    fact: "Fun study hack: Changing your study spot once every 2 weeks enhances associative recall by linking concepts to fresh environments."
  },
  {
    riddle: "The more of this you take, the more you leave behind. What are they?",
    answer: "Footsteps 👣",
    fact: "Adolescent neuroplasticity is at its lifetime peak between ages 11-19, meaning every healthy habit you practice now sticks for life."
  }
];

export default function BrainRefresh({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = RIDDLES[index];

  const handleNext = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % RIDDLES.length);
  };

  const handleReveal = () => {
    setShowAnswer(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  return (
    <div className="flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-50/50 via-white to-teal-50/40 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[500px]">
      <div className="text-center max-w-md">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
          Dopamine Refresh
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-1.5">
          Brain Tickler & Mindful Break
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Step back from intense study tension with a quick spark of curiosity.
        </p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-6 rounded-3xl border border-amber-200 dark:border-slate-700 shadow-md my-4 space-y-4">
        <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Curiosity Riddle #{index + 1}</span>
        </div>

        <p className="text-base font-semibold text-slate-800 dark:text-white leading-relaxed">
          "{current.riddle}"
        </p>

        {showAnswer ? (
          <div className="space-y-3 pt-2 animate-fade-in">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 text-center">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Answer</span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{current.answer}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-600 dark:text-slate-300">
              💡 <span className="font-semibold">{current.fact}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleReveal}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Reveal Answer
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleNext}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Another Riddle</span>
        </button>

        <button
          onClick={() => {
            if (onComplete) onComplete(5);
          }}
          className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Done & Refreshed</span>
        </button>
      </div>
    </div>
  );
}
