import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar, 
  Smile, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Plus, 
  Download
} from 'lucide-react';
import { exportVaultJSON } from '../utils/storage';

export default function ProgressDashboard({ 
  mindfulDaysCount = 12, 
  completedActivitiesTotal = 28,
  reflectionJournal = [],
  onAddReflection
}) {
  const [newJournalText, setNewJournalText] = useState('');
  const [selectedShift, setSelectedShift] = useState('Anxious ➔ Calm');

  const handleSaveReflection = (e) => {
    e.preventDefault();
    if (!newJournalText.trim()) return;

    onAddReflection({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      moodBefore: selectedShift.split(' ➔ ')[0],
      moodAfter: selectedShift.split(' ➔ ')[1],
      summary: newJournalText.trim(),
      rating: 5
    });
    setNewJournalText('');
  };

  const badges = [
    { name: 'Self-Care Starter', desc: 'Completed first 3 mindful check-ins', unlocked: true, icon: '🌱' },
    { name: 'Deep Breather', desc: 'Practiced 5 parasympathetic breathing sessions', unlocked: true, icon: '💨' },
    { name: 'Thought Reframer', desc: 'Successfully challenged a cognitive distortion', unlocked: true, icon: '🧠' },
    { name: 'Gentle Consistency', desc: 'Engaged for 10+ mindful days without pressure', unlocked: mindfulDaysCount >= 10, icon: '⭐' },
    { name: 'Inner Resilience', desc: 'Explored practical exam-chunking routines', unlocked: true, icon: '🛡️' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
              Non-Competitive Growth Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Personal Emotional Progress
            </h2>
            <p className="text-xs text-teal-100 max-w-xl">
              Strictly zero social comparison and no leaderboards. Your progress is measured purely against your own comfort, self-compassion, and resilience.
            </p>
          </div>

          <button
            onClick={exportVaultJSON}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/30 transition shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export Encrypted Log</span>
          </button>
        </div>
      </div>

      {/* Non-punitive Engagement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xl">
            🌱
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">
              {mindfulDaysCount} Days
            </span>
            <p className="text-xs text-slate-500 font-medium">Mindful Active Days (Never resets!)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center font-bold text-xl">
            ✨
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">
              {completedActivitiesTotal} Tasks
            </span>
            <p className="text-xs text-slate-500 font-medium">Micro-Habits Completed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-xl">
            📈
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">
              +78% Relief
            </span>
            <p className="text-xs text-slate-500 font-medium">Average Pre vs Post Calm Shift</p>
          </div>
        </div>
      </div>

      {/* Visual Mood Shift & Adaptive Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Shift Visualizer */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Emotional Shift (Before vs After Activities)</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Positive Regulation
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Exam Anxiety ➔ Grounded Focus</span>
                <span className="text-emerald-600 font-bold">84% positive shift</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Procrastination Paralysis ➔ 5-Min Action</span>
                <span className="text-teal-600 font-bold">76% initiated study</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Social Comparison ➔ Personal Baseline</span>
                <span className="text-purple-600 font-bold">71% reclaimed confidence</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Physical Exhaustion ➔ Muscle Decompression</span>
                <span className="text-blue-600 font-bold">82% somatic release</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Badges without Pressure */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Self-Compassion Milestone Sparks</span>
            </h3>
            <span className="text-xs text-slate-400">Non-punitive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center space-x-3 transition ${
                  b.unlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{b.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Private Reflection Journal */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Private Weekly Reflection Journal</span>
          </h3>
          <span className="text-xs text-slate-500 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Client-side encrypted</span>
          </span>
        </div>

        <form onSubmit={handleSaveReflection} className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Shift Experienced:</span>
            {['Anxious ➔ Calm', 'Overwhelmed ➔ Organized', 'Tired ➔ Restored', 'Doubtful ➔ Confident'].map((shift) => (
              <button
                key={shift}
                type="button"
                onClick={() => setSelectedShift(shift)}
                className={`px-2.5 py-1 text-xs rounded-xl transition ${
                  selectedShift === shift
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {shift}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={newJournalText}
              onChange={(e) => setNewJournalText(e.target.value)}
              placeholder="What worked well for you this week? What stressor felt a little lighter?"
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 h-20 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reflection</span>
            </button>
          </div>
        </form>

        {/* Existing reflections log */}
        <div className="space-y-3 pt-2">
          {reflectionJournal.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  {entry.moodBefore} ➔ {entry.moodAfter}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{entry.date}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 font-medium">
                "{entry.summary}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
