import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyPlanView from './components/DailyPlanView';
import WellnessStudio from './components/WellnessStudio';
import SoundscapePlayer from './components/SoundscapePlayer';
import ProgressDashboard from './components/ProgressDashboard';
import ProgressTable from './components/ProgressTable';
import CounselorCrisisModal from './components/CounselorCrisisModal';
import PrivacySettingsModal from './components/PrivacySettingsModal';
import CheckInModal from './components/CheckInModal';
import ActivityRunnerModal from './components/ActivityRunnerModal';
import MiniGameStudio from './components/MiniGameStudio';
import { loadMindSpringVault, saveMindSpringVault } from './utils/storage';
import { generateDailyPlan, ACTIVITY_CATALOG } from './data/activityCatalog';
import { ShieldAlert, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [vault, setVault] = useState(() => loadMindSpringVault());
  const [activeTab, setActiveTab] = useState('plan');
  
  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [runningActivity, setRunningActivity] = useState(null);

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Initialize daily plan if empty
  useEffect(() => {
    if (!vault.dailyPlan || vault.dailyPlan.length === 0) {
      const initialStressor = vault.currentCheckIn?.stressor || 'exam_stress';
      const initialMood = vault.currentCheckIn?.mood || 'anxious';
      const initialPlan = generateDailyPlan(initialStressor, initialMood);
      const updatedVault = { ...vault, dailyPlan: initialPlan };
      setVault(updatedVault);
      saveMindSpringVault(updatedVault);
    }
  }, []);

  // Save vault changes
  const updateVault = (newVault) => {
    setVault(newVault);
    saveMindSpringVault(newVault);
  };

  // Check-In Completion
  const handleCompleteCheckIn = (checkInData) => {
    const newPlan = generateDailyPlan(checkInData.stressor, checkInData.mood);
    const updatedVault = {
      ...vault,
      currentCheckIn: checkInData,
      dailyPlan: newPlan,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    updateVault(updatedVault);
    setActiveTab('plan');
  };

  // Start an activity
  const handleStartActivity = (activity) => {
    setRunningActivity(activity);
  };

  // Finish an activity from runner
  const handleFinishActivity = (instanceId, feedbackData) => {
    const updatedPlan = vault.dailyPlan.map(item => {
      if (item.instanceId === instanceId || item.id === instanceId) {
        return {
          ...item,
          completed: true,
          userRating: feedbackData.rating,
          feedback: feedbackData.reflectionNote
        };
      }
      return item;
    });

    let updatedJournal = [...(vault.reflectionJournal || [])];
    if (feedbackData.reflectionNote) {
      updatedJournal.unshift({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        moodBefore: vault.currentCheckIn?.mood || 'Stressed',
        moodAfter: feedbackData.feelingShift || 'Calmer',
        summary: feedbackData.reflectionNote,
        rating: feedbackData.rating
      });
    }

    // Auto-log to progress table
    const completedTasksCount = updatedPlan.filter(p => p.completed).length;
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      studentName: vault.studentProfile?.name || 'Self',
      school: vault.studentProfile?.school || 'School',
      mood: feedbackData.feelingShift || 'Calmer 🌿',
      stressor: vault.currentCheckIn?.stressorTitle || 'Daily Wellness',
      goal: vault.currentCheckIn?.goal || 'Study Reset',
      tasksCompleted: `${completedTasksCount}/4 Completed`,
      rating: feedbackData.rating || 5,
      reflection: feedbackData.reflectionNote || 'Completed micro-wellness activity.',
      status: 'Completed'
    };

    const updatedRecords = [newRecord, ...(vault.progressRecords || [])];

    const updatedVault = {
      ...vault,
      dailyPlan: updatedPlan,
      completedActivitiesTotal: (vault.completedActivitiesTotal || 0) + 1,
      reflectionJournal: updatedJournal,
      progressRecords: updatedRecords,
      mindfulDaysCount: (vault.mindfulDaysCount || 1) + 1
    };

    updateVault(updatedVault);
  };

  // Manual Progress Table handlers
  const handleAddProgressRecord = (record) => {
    const updatedRecords = [record, ...(vault.progressRecords || [])];
    updateVault({ ...vault, progressRecords: updatedRecords });
  };

  const handleDeleteProgressRecord = (id) => {
    const updatedRecords = (vault.progressRecords || []).filter(r => r.id !== id);
    updateVault({ ...vault, progressRecords: updatedRecords });
  };

  // Re-roll / Swap single activity in category
  const handleRerollActivity = (instanceId, category) => {
    const candidates = ACTIVITY_CATALOG.filter(a => a.category === category);
    if (candidates.length === 0) return;
    const randomPick = candidates[Math.floor(Math.random() * candidates.length)];

    const updatedPlan = vault.dailyPlan.map(item => {
      if (item.instanceId === instanceId) {
        return {
          ...randomPick,
          instanceId: `reroll-${Date.now()}`,
          completed: false,
          skipped: false,
          userRating: 0
        };
      }
      return item;
    });

    updateVault({ ...vault, dailyPlan: updatedPlan });
  };

  // Gratitude Garden flower adding
  const handleAddFlower = (flower) => {
    const updatedFlowers = [flower, ...(vault.gardenFlowers || [])];
    updateVault({ ...vault, gardenFlowers: updatedFlowers });
  };

  // Weekly Reflection adding
  const handleAddReflection = (reflection) => {
    const updatedJournal = [reflection, ...(vault.reflectionJournal || [])];
    updateVault({ ...vault, reflectionJournal: updatedJournal });
  };

  // Profile update
  const handleUpdateProfile = (newProfile) => {
    updateVault({ ...vault, studentProfile: newProfile });
  };

  // Reset entire application
  const handleResetApp = () => {
    const fresh = loadMindSpringVault();
    setVault(fresh);
    setActiveTab('plan');
  };

  const completedCount = vault.dailyPlan ? vault.dailyPlan.filter(p => p.completed).length : 0;

  return (
    <div className={`${darkMode ? 'dark' : ''} ${highContrast ? 'contrast-125' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
        
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onOpenCrisis={() => setIsCrisisOpen(true)}
          onOpenProfile={() => setActiveTab('privacy')}
          studentName={vault.studentProfile?.name}
          schoolName={vault.studentProfile?.school}
        />

        {/* Main Application Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
          {activeTab === 'plan' && (
            <DailyPlanView
              plan={vault.dailyPlan || []}
              currentCheckIn={vault.currentCheckIn}
              onStartActivity={handleStartActivity}
              onRerollActivity={handleRerollActivity}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              completedCount={completedCount}
            />
          )}

          {activeTab === 'studio' && (
            <WellnessStudio
              flowers={vault.gardenFlowers || []}
              onAddFlower={handleAddFlower}
            />
          )}

          {activeTab === 'minigame' && (
            <MiniGameStudio
              onComplete={(rating) => {
                handleFinishActivity('minigame_break', {
                  rating: rating || 5,
                  feelingShift: 'Refreshed & Cheerful 🎮',
                  reflectionNote: 'Enjoyed a mindful mini-game break to reset focus and break study fatigue.'
                });
              }}
            />
          )}

          {activeTab === 'table' && (
            <ProgressTable
              records={vault.progressRecords || []}
              onAddRecord={handleAddProgressRecord}
              onDeleteRecord={handleDeleteProgressRecord}
              currentStudent={vault.studentProfile?.name}
              currentSchool={vault.studentProfile?.school}
            />
          )}

          {activeTab === 'soundscapes' && (
            <SoundscapePlayer />
          )}

          {activeTab === 'growth' && (
            <ProgressDashboard
              mindfulDaysCount={vault.mindfulDaysCount}
              completedActivitiesTotal={vault.completedActivitiesTotal}
              reflectionJournal={vault.reflectionJournal || []}
              onAddReflection={handleAddReflection}
            />
          )}

          {activeTab === 'counselor' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 mx-auto flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white">
                  Counselor & Ethical Safety Center
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  MindSpring provides immediate access to trusted school guidance and verified national 24/7 helplines.
                </p>
                <button
                  onClick={() => setIsCrisisOpen(true)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition"
                >
                  Open Confidential Escalation Portal
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <PrivacySettingsModal
              profile={vault.studentProfile}
              onUpdateProfile={handleUpdateProfile}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              onResetApp={handleResetApp}
            />
          )}
        </main>

        {/* Clean Footer without school / competition slang */}
        <footer className="border-t border-emerald-100 dark:border-slate-800 py-6 px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-slate-800 dark:text-slate-200">
                MindSpring
              </span>
              <span>•</span>
              <span>Personalised Student Wellness & Emotional Growth</span>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('table')}
                className="hover:text-emerald-600 transition underline decoration-slate-300"
              >
                Data & Progress Table
              </button>
              <button 
                onClick={() => setActiveTab('privacy')}
                className="hover:text-emerald-600 transition"
              >
                Profile & Privacy
              </button>
              <button 
                onClick={() => setIsCrisisOpen(true)}
                className="hover:text-rose-600 transition font-semibold text-rose-500"
              >
                24/7 Crisis Helplines
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            A non-diagnostic educational self-care platform dedicated to healthy habit formation, exam calm, and student well-being.
          </p>
        </footer>

        {/* Floating Emergency Support Hotkey Button */}
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setIsCrisisOpen(true)}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-3 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 border-2 border-white/40"
            title="Instant crisis helplines and confidential counselor connection"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Emergency Support</span>
          </button>
        </div>

        {/* Modals */}
        <CheckInModal
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
          onCompleteCheckIn={handleCompleteCheckIn}
          initialStressor={vault.currentCheckIn?.stressor}
          initialMood={vault.currentCheckIn?.mood}
        />

        <CounselorCrisisModal
          isOpen={isCrisisOpen}
          onClose={() => setIsCrisisOpen(false)}
          counselorEmail={vault.studentProfile?.counselorContact || 'counselor@school.edu'}
        />

        <ActivityRunnerModal
          activity={runningActivity}
          onClose={() => setRunningActivity(null)}
          onFinishActivity={handleFinishActivity}
          flowers={vault.gardenFlowers || []}
          onAddFlower={handleAddFlower}
        />

      </div>
    </div>
  );
}
