import React from 'react';
import { 
  Sparkles, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  Play, 
  Target, 
  ArrowRight,
  Shield,
  Heart,
  HelpCircle,
  Wind,
  Layers,
  BookOpen,
  Flower,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORY_STYLES = {
  relief: {
    label: '1. Stress Relief',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
  },
  growth: {
    label: '2. Growth Activity',
    color: 'from-purple-500 to-indigo-600',
    border: 'border-purple-200 dark:border-purple-800',
    bg: 'bg-purple-50/40 dark:bg-purple-950/20',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
  },
  action: {
    label: '3. Practical Stressor Action',
    color: 'from-blue-500 to-cyan-600',
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50/40 dark:bg-blue-950/20',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
  },
  break: {
    label: '4. Optional Fun Break',
    color: 'from-amber-500 to-rose-500',
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50/40 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
  }
};

export default function DailyPlanView({
  plan = [],
  currentCheckIn,
  onStartActivity,
  onRerollActivity,
  onOpenCheckIn,
  completedCount = 0
}) {
  const allDone = plan.length > 0 && plan.every(p => p.completed || p.skipped);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Welcome / Context-Aware Diagnosis Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                Personalised Daily Regimen
              </span>
              <span className="text-emerald-100 text-xs font-medium">
                Tailored via Cause Matrix
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Today's Calibrated Balance
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="bg-white/15 px-3 py-1 rounded-xl text-xs flex items-center space-x-1.5 backdrop-blur-sm">
                <span>Identified Cause:</span>
                <strong className="text-emerald-200">{currentCheckIn?.stressorTitle || 'Exam Revision Overwhelm'}</strong>
              </div>

              <div className="bg-white/15 px-3 py-1 rounded-xl text-xs flex items-center space-x-1.5 backdrop-blur-sm">
                <span>Today's Focus:</span>
                <strong className="text-white">"{currentCheckIn?.goal || 'Break a scary chapter into micro-steps'}"</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3">
            <div className="text-right">
              <span className="text-3xl font-extrabold font-mono">{completedCount} / {plan.length}</span>
              <span className="text-xs text-emerald-100 block">Tasks Completed</span>
            </div>
            <button
              onClick={onOpenCheckIn}
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recalibrate Mood</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" />
      </div>

      {/* Non-competitive reassurance alert banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>
            <strong>Zero Penalty Zone:</strong> You have full freedom to skip, swap, or pause any task at any time. Self-care is self-paced.
          </span>
        </div>
      </div>

      {/* The 4-Part Daily Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.map((item, idx) => {
          const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.relief;
          const isDone = item.completed;
          const isSkipped = item.skipped;

          return (
            <div
              key={item.instanceId || idx}
              className={`rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between relative ${
                isDone
                  ? 'bg-slate-50/90 dark:bg-slate-800/60 border-emerald-400/80 opacity-90'
                  : isSkipped
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                  : `bg-white dark:bg-slate-800 ${catStyle.border} shadow-sm hover:shadow-md`
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${catStyle.badge}`}>
                    {catStyle.label}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{item.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className={`text-base sm:text-lg font-bold font-heading mt-1 ${
                  isDone ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'
                }`}>
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.benefit && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 border border-slate-100 dark:border-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span><strong>Why this works:</strong> {item.benefit}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                {isDone ? (
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                    <span>Completed • Rated {item.userRating || 5}/5 ⭐</span>
                  </div>
                ) : isSkipped ? (
                  <span className="text-xs font-semibold text-slate-400 italic">
                    Skipped (No penalties)
                  </span>
                ) : (
                  <button
                    onClick={() => onStartActivity(item)}
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow transition transform hover:-translate-y-0.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Activity</span>
                  </button>
                )}

                {!isDone && (
                  <button
                    onClick={() => onRerollActivity(item.instanceId, item.category)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center space-x-1 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                    title="Swap with another activity in this category"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Swap Task</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {allDone && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-center shadow-lg animate-fade-in space-y-2">
          <Sparkles className="w-8 h-8 mx-auto text-amber-300 animate-bounce" />
          <h3 className="text-xl font-bold font-heading">
            You've taken care of your mind today!
          </h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Consistency in small moments creates lasting emotional strength. Great job showing up for yourself.
          </p>
        </div>
      )}
    </div>
  );
}
