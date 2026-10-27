import React, { useState, useEffect } from 'react';
import { X, Sparkles, Star, RotateCcw, ArrowLeft, CheckCircle2, Feather, HelpCircle } from 'lucide-react';
import BreathingStudio from './BreathingStudio';
import MeditationStudio from './MeditationStudio';
import StudyTimer from './StudyTimer';
import ThoughtFlipTool from './ThoughtFlipTool';
import ZenCanvas from './ZenCanvas';
import GratitudeGarden from './GratitudeGarden';
import ActionStepsViewer from './ActionStepsViewer';
import BrainRefresh from './BrainRefresh';
import SoundscapePlayer from './SoundscapePlayer';
import confetti from 'canvas-confetti';

export default function ActivityRunnerModal({ 
  activity, 
  onClose, 
  onFinishActivity,
  flowers,
  onAddFlower 
}) {
  const [stage, setStage] = useState('active'); // 'active' | 'feedback'
  const [rating, setRating] = useState(5);
  const [feelingShift, setFeelingShift] = useState('Much Better');
  const [reflectionNote, setReflectionNote] = useState('');

  // Crucial: ALWAYS reset to 'active' whenever a new activity is opened!
  useEffect(() => {
    if (activity) {
      setStage('active');
      setRating(activity.userRating || 5);
      setReflectionNote(activity.feedback || '');
      setFeelingShift('Much Better');
    }
  }, [activity?.instanceId, activity?.id]);

  if (!activity) return null;

  const handleInteractiveComplete = (score = 5) => {
    setRating(score);
    setStage('feedback');
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
  };

  const handleSaveFeedbackAndExit = () => {
    onFinishActivity(activity.instanceId || activity.id, {
      rating,
      feelingShift,
      reflectionNote: reflectionNote.trim(),
      completedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header with Activity Switcher and Close */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {activity.category === 'relief' ? '1. Stress-Relief' :
               activity.category === 'growth' ? '2. Growth Activity' :
               activity.category === 'action' ? '3. Practical Action' : '4. Mindful Break'}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ~{activity.durationMinutes || 3} mins
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {stage === 'feedback' ? (
              <button
                onClick={() => setStage('active')}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Activity</span>
              </button>
            ) : (
              <button
                onClick={() => setStage('feedback')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-2"
              >
                Skip to Rating & Save
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {stage === 'active' ? (
            <div>
              {/* Dynamic activity renderer */}
              {activity.interactiveComponent === 'meditation' && (
                <MeditationStudio onComplete={handleInteractiveComplete} />
              )}
              {activity.interactiveComponent === 'breathing' && (
                <BreathingStudio onComplete={handleInteractiveComplete} />
              )}
              {activity.interactiveComponent === 'study_timer' && (
                <StudyTimer onComplete={handleInteractiveComplete} />
              )}
              {activity.interactiveComponent === 'thought_flip' && (
                <ThoughtFlipTool onComplete={handleInteractiveComplete} />
              )}
              {activity.interactiveComponent === 'zen_canvas' && (
                <ZenCanvas onComplete={handleInteractiveComplete} />
              )}
              {activity.interactiveComponent === 'gratitude_garden' && (
                <GratitudeGarden 
                  flowers={flowers} 
                  onAddFlower={onAddFlower} 
                  onComplete={handleInteractiveComplete} 
                />
              )}
              {activity.interactiveComponent === 'brain_refresh' && (
                <BrainRefresh onComplete={handleInteractiveComplete} />
              )}
              {activity.interactiveComponent === 'soundscapes' && (
                <div className="p-4">
                  <SoundscapePlayer />
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleInteractiveComplete(5)}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Finish Soundscape Session
                    </button>
                  </div>
                </div>
              )}
              {activity.interactiveComponent === 'grounding' && (
                <ActionStepsViewer 
                  activity={{
                    ...activity,
                    steps: [
                      '5: Acknowledge 5 things you see around you right now (a pen, wall, lamp, clock, hand).',
                      '4: Touch 4 physical textures (desk edge, notebook paper, your cotton shirt, cool glass).',
                      '3: Notice 3 sounds around you (ceiling fan, distant birds, your own breathing).',
                      '2: Notice 2 scents or take a deep smell of fresh air.',
                      '1: Name 1 positive thing you appreciate about yourself.'
                    ]
                  }} 
                  onComplete={handleInteractiveComplete} 
                />
              )}
              {activity.interactiveComponent === 'muscle_relax' && (
                <ActionStepsViewer 
                  activity={{
                    ...activity,
                    steps: [
                      '1. Clench both fists and shrug your shoulders up to your ears tightly for 5 seconds... now drop and exhale completely.',
                      '2. Open your mouth wide, relax your jaw muscles, and let your tongue rest loosely behind front teeth.',
                      '3. Close your eyes, let your forehead smooth out, and take 3 slow belly breaths.'
                    ]
                  }} 
                  onComplete={handleInteractiveComplete} 
                />
              )}
              {(activity.interactiveComponent === 'action_steps' || 
                activity.interactiveComponent === 'exam_chunker' || 
                activity.interactiveComponent === 'compassion_letter') && (
                <ActionStepsViewer activity={activity} onComplete={handleInteractiveComplete} />
              )}
            </div>
          ) : (
            /* STAGE 2: ADAPTIVE FEEDBACK & RATING */
            <div className="p-6 space-y-6 animate-slide-up text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white">
                  Activity Complete!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  How did this activity feel? You can also click "Try Activity Again" below if you want another round.
                </p>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Rate this session's helpfulness:
                </label>
                <div className="flex items-center justify-center space-x-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition transform"
                    >
                      <Star className={`w-7 h-7 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feeling Shift */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  How does your mind feel right now?
                </label>
                <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                  {['Much Better 🌸', 'A Little Lighter 🌤️', 'About the Same 🌿'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFeelingShift(option)}
                      className={`p-2.5 rounded-xl border transition ${
                        feelingShift === option
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Note */}
              <div className="text-left space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Quick Reflection (Saved in your Progress Table):
                </label>
                <input
                  type="text"
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="e.g., Breathing slowed my heart rate; feeling ready to study"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSaveFeedbackAndExit}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-lg transition"
                >
                  Save to Progress Table & Return
                </button>

                <button
                  onClick={() => setStage('active')}
                  className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Activity Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
