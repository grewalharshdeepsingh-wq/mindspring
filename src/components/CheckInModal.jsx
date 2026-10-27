import React, { useState } from 'react';
import { MOODS, STRESSORS } from '../data/stressors';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  BookOpen,
  Hourglass,
  Users,
  Home,
  Moon,
  Shield,
  Target
} from 'lucide-react';

const ICON_MAP = {
  BookOpen,
  Hourglass,
  Sparkles,
  Users,
  Home,
  Moon,
  Shield
};

export default function CheckInModal({ isOpen, onClose, onCompleteCheckIn, initialStressor, initialMood }) {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(initialMood || MOODS[3].id);
  const [selectedStressor, setSelectedStressor] = useState(initialStressor || STRESSORS[0].id);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  if (!isOpen) return null;

  const currentStressorObj = STRESSORS.find(s => s.id === selectedStressor) || STRESSORS[0];

  const handleFinish = () => {
    const finalGoal = customGoal.trim() || selectedGoal || currentStressorObj.defaultGoals[0];
    const moodObj = MOODS.find(m => m.id === selectedMood) || MOODS[0];

    onCompleteCheckIn({
      mood: selectedMood,
      moodEmoji: moodObj.emoji,
      moodLabel: moodObj.label,
      stressor: selectedStressor,
      stressorTitle: currentStressorObj.title,
      goal: finalGoal,
      preMoodScore: moodObj.score,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">
                60-Second Student Check-In
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Step {step} of 3 • MindSpring Context-Aware Personalisation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Current Mood State */}
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Quick Emotional Scan
                </span>
                <h4 className="text-xl font-bold font-heading text-slate-800 dark:text-white mt-2">
                  How does your mind feel right now?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  There are no wrong answers. MindSpring adjusts its activities to meet you right where you are.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {MOODS.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between h-28 relative ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-400/20' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="text-3xl">{m.emoji}</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">{m.label}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute top-3 right-3" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Stressor Identification */}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                  Cause-Based Diagnosis
                </span>
                <h4 className="text-xl font-bold font-heading text-slate-800 dark:text-white mt-2">
                  What is the primary source of your stress today?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Instead of generic meditation, we tailor practical steps specifically to this cause.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {STRESSORS.map((s) => {
                  const isSelected = selectedStressor === s.id;
                  const Icon = ICON_MAP[s.icon] || HelpCircle;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedStressor(s.id);
                        setSelectedGoal(s.defaultGoals[0]);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-2.5 rounded-xl ${
                          isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="text-sm font-bold text-slate-800 dark:text-white">{s.title}</h5>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full">
                              {s.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{s.description}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Micro-Goal Target */}
          {step === 3 && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Targeted Micro-Action
                </span>
                <h4 className="text-xl font-bold font-heading text-slate-800 dark:text-white mt-2">
                  Choose your small win for today
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Achievable 2–10 minute targets build momentum without toxic academic pressure.
                </p>
              </div>

              <div className="space-y-2">
                {currentStressorObj.defaultGoals.map((goal, idx) => {
                  const isSelected = selectedGoal === goal && !customGoal;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedGoal(goal);
                        setCustomGoal('');
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Target className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">{goal}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Or write your own custom micro-goal:
                  </label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g., Read biology pages 12 to 15 without looking at my phone"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Back
            </button>
          ) : (
            <div className="text-xs text-slate-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Takes &lt; 60 seconds</span>
            </div>
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 2 && !selectedGoal) {
                  setSelectedGoal(currentStressorObj.defaultGoals[0]);
                }
                setStep(step + 1);
              }}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My 4-Part Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
