import React, { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, BookOpen, Clock, ShieldCheck, MessageCircle, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActionStepsViewer({ activity, onComplete }) {
  const [checkedSteps, setCheckedSteps] = useState({});
  const [chunkForm, setChunkForm] = useState({
    subject: '',
    concept: '',
    formula: '',
    question: ''
  });

  const isExamChunker = activity.id === 'exam_chunking_matrix';
  const steps = activity.steps || [
    'Take a deep breath and give yourself permission to focus on only one micro-step.',
    'Write down exactly what you are working on.',
    'Work without multi-tasking or checking messages.',
    'Review your work with pride, no matter how small.'
  ];

  const toggleStep = (idx) => {
    setCheckedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleFinish = () => {
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
    if (onComplete) onComplete(5);
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-sky-50/40 via-white to-emerald-50/30 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[520px]">
      {/* Top Banner */}
      <div className="text-center max-w-md mb-2">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-300 dark:border-teal-700">
          Practical Root-Cause Intervention
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-1.5">
          {activity.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {activity.description}
        </p>
      </div>

      {/* Special interactive view for Exam Chunking Matrix */}
      {isExamChunker ? (
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-5 rounded-3xl border border-emerald-200 dark:border-slate-700 shadow-sm space-y-3.5 my-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Turn an overwhelming chapter into 3 bite-sized wins:</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Subject & Intimidating Topic:
            </label>
            <input
              type="text"
              value={chunkForm.subject}
              onChange={(e) => setChunkForm({ ...chunkForm, subject: e.target.value })}
              placeholder="e.g., Mathematics - Quadratic Equations"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                1. Single Concept
              </span>
              <textarea
                value={chunkForm.concept}
                onChange={(e) => setChunkForm({ ...chunkForm, concept: e.target.value })}
                placeholder="e.g. Read discriminant definition"
                className="w-full mt-1 p-2 text-xs rounded-lg border-0 bg-white/80 dark:bg-slate-900 text-slate-800 dark:text-white resize-none h-16"
              />
            </div>

            <div className="p-3 bg-sky-50/70 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                2. Key Term / Formula
              </span>
              <textarea
                value={chunkForm.formula}
                onChange={(e) => setChunkForm({ ...chunkForm, formula: e.target.value })}
                placeholder="e.g. D = b² - 4ac"
                className="w-full mt-1 p-2 text-xs rounded-lg border-0 bg-white/80 dark:bg-slate-900 text-slate-800 dark:text-white resize-none h-16"
              />
            </div>

            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                3. Just 1 Practice Q
              </span>
              <textarea
                value={chunkForm.question}
                onChange={(e) => setChunkForm({ ...chunkForm, question: e.target.value })}
                placeholder="e.g. Solve textbook Example 3"
                className="w-full mt-1 p-2 text-xs rounded-lg border-0 bg-white/80 dark:bg-slate-900 text-slate-800 dark:text-white resize-none h-16"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Action Step Checklist */
        <div className="w-full max-w-lg space-y-3 my-3">
          {steps.map((stepText, idx) => {
            const isDone = !!checkedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center space-x-3.5 ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className={`p-1 rounded-full ${isDone ? 'text-emerald-600' : 'text-slate-300'}`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-100" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <span className={`text-xs sm:text-sm font-medium ${
                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {stepText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete Button */}
      <div className="mt-4">
        <button
          onClick={handleFinish}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Complete Practical Action</span>
        </button>
      </div>
    </div>
  );
}
