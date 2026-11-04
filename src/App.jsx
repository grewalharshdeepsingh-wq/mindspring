import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import DailyPlanView from './components/DailyPlanView';
import WellnessStudio from './components/WellnessStudio';
import SoundscapePlayer from './components/SoundscapePlayer';
import ProgressDashboard from './components/ProgressDashboard';
import ProgressTable from './components/ProgressTable';
import CounselorCrisisModal from './components/CounselorCrisisModal';
import PrivacySettingsModal from './components/PrivacySettingsModal';
import CheckInModal from './components/CheckInModal';
import DownloadAppModal from './components/DownloadAppModal';
import ActivityRunnerModal from './components/ActivityRunnerModal';
import MiniGameStudio from './components/MiniGameStudio';
import ProblemSolver from './components/ProblemSolver';
import MobileBottomNav from './components/MobileBottomNav';
import AboutModal from './components/AboutModal';
import { loadMindSpringVault, saveMindSpringVault } from './utils/storage';
import { generateDailyPlan, ACTIVITY_CATALOG } from './data/activityCatalog';
import { ShieldAlert, Sparkles, Heart, ArrowUp, HeartHandshake } from 'lucide-react';

function SectionDivider({ icon, title, subtitle }) {
  return (
    <div className="relative py-4 sm:py-6 select-none">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
      </div>
      <div className="relative flex justify-center">
        <div className="bg-slate-50 dark:bg-slate-950 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 backdrop-blur-sm">
          <span className="text-sm">{icon}</span>
          <span className="tracking-wide uppercase text-[11px] font-extrabold">{title}</span>
          {subtitle && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px] hidden sm:inline">{subtitle}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [vault, setVault] = useState(() => loadMindSpringVault());
  const [activeTab, setActiveTab] = useState('plan');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [runningActivity, setRunningActivity] = useState(null);

  // Smooth scroll tracking refs
  const isManualScrollRef = useRef(false);
  const manualScrollTimeoutRef = useRef(null);

  // Appearance with persistent storage and system theme detection
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('mindspring_theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [highContrast, setHighContrast] = useState(false);

  // Sync dark theme with document root & localStorage
  useEffect(() => {
    localStorage.setItem('mindspring_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [darkMode]);

  // Smooth Tab Navigation & Scroll
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    isManualScrollRef.current = true;
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }
    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 900);

    if (tabId === 'plan') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elem = document.getElementById(tabId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll Spy: tracks section visibility as user scrolls through single page
  useEffect(() => {
    const sectionIds = ['plan', 'solver', 'studio', 'minigame', 'soundscapes', 'table', 'growth', 'counselor', 'privacy'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 400);

      if (isManualScrollRef.current) return;

      const probePosition = scrollY + 220; // sticky header compensation

      let current = 'plan';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          if (probePosition >= el.offsetTop) {
            current = id;
          }
        }
      }

      // Check if near bottom of page
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 80) {
        current = 'privacy';
      }

      setActiveTab(prev => (prev !== current ? current : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    };
  }, []);

  // Handle URL hash on initial load
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const validIds = ['plan', 'solver', 'studio', 'minigame', 'soundscapes', 'table', 'growth', 'counselor', 'privacy'];
      if (validIds.includes(targetId)) {
        setTimeout(() => {
          handleTabClick(targetId);
        }, 300);
      }
    }
  }, []);

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
    handleTabClick('plan');
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

  // Add custom action item to daily plan
  const handleAddActionToDailyPlan = (task) => {
    const updatedPlan = [task, ...(vault.dailyPlan || [])];
    updateVault({ ...vault, dailyPlan: updatedPlan });
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
    handleTabClick('plan');
  };

  const completedCount = vault.dailyPlan ? vault.dailyPlan.filter(p => p.completed).length : 0;

  return (
    <div className={`${darkMode ? 'dark' : ''} ${highContrast ? 'contrast-125' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
        
        {/* Sticky Header with Smooth Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabClick}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onOpenCrisis={() => setIsCrisisOpen(true)}
          onOpenProfile={() => handleTabClick('privacy')}
          onOpenDownloadApp={() => setIsDownloadOpen(true)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(prev => !prev)}
          studentName={vault.studentProfile?.name}
          schoolName={vault.studentProfile?.school}
        />

        {/* Main Application Container - Unified Single Page Layout */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full pb-24 md:pb-12 space-y-12 sm:space-y-16">
          
          {/* Section 1: Daily Plan */}
          <section id="plan" className="scroll-mt-32 sm:scroll-mt-36">
            <DailyPlanView
              plan={vault.dailyPlan || []}
              currentCheckIn={vault.currentCheckIn}
              onStartActivity={handleStartActivity}
              onRerollActivity={handleRerollActivity}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onNavigateToSolver={() => handleTabClick('solver')}
              completedCount={completedCount}
            />
          </section>

          <SectionDivider 
            icon="💡" 
            title="AI Mentor & Problem Solver" 
            subtitle="Intelligent root-cause diagnosis & actionable encouragement" 
          />

          {/* Section 2: Problem Solver */}
          <section id="solver" className="scroll-mt-32 sm:scroll-mt-36">
            <ProblemSolver
              studentName={vault.studentProfile?.name}
              onStartActivity={handleStartActivity}
              onAddToDailyPlan={handleAddActionToDailyPlan}
              onSaveReflection={handleAddReflection}
              onOpenCrisis={() => setIsCrisisOpen(true)}
            />
          </section>

          <SectionDivider 
            icon="🌿" 
            title="Wellness & Self-Care Studio" 
            subtitle="Guided meditation, breathing, sprint timer & gratitude garden" 
          />

          {/* Section 3: Wellness Studio */}
          <section id="studio" className="scroll-mt-32 sm:scroll-mt-36">
            <WellnessStudio
              flowers={vault.gardenFlowers || []}
              onAddFlower={handleAddFlower}
            />
          </section>

          <SectionDivider 
            icon="🎮" 
            title="Zen Arcade & Stress-Buster Games" 
            subtitle="Monster Money Catch, Door Runner, Bubble Pop & Affirmations" 
          />

          {/* Section 4: Zen Arcade Mini-Games */}
          <section id="minigame" className="scroll-mt-32 sm:scroll-mt-36">
            <MiniGameStudio
              onComplete={(rating) => {
                handleFinishActivity('minigame_break', {
                  rating: rating || 5,
                  feelingShift: 'Refreshed & Cheerful 🎮',
                  reflectionNote: 'Enjoyed a mindful mini-game break to reset focus and break study fatigue.'
                });
              }}
            />
          </section>

          <SectionDivider 
            icon="🎧" 
            title="Ambient Soundscapes & Focus Audio" 
            subtitle="Rain, ocean waves, binaural alpha waves & Tibetan bells" 
          />

          {/* Section 5: Ambient Soundscapes */}
          <section id="soundscapes" className="scroll-mt-32 sm:scroll-mt-36">
            <SoundscapePlayer />
          </section>

          <SectionDivider 
            icon="📊" 
            title="Data & Activity Records" 
            subtitle="Confidential student ledger, filterable history & CSV export" 
          />

          {/* Section 6: Data & Progress Table */}
          <section id="table" className="scroll-mt-32 sm:scroll-mt-36">
            <ProgressTable
              records={vault.progressRecords || []}
              onAddRecord={handleAddProgressRecord}
              onDeleteRecord={handleDeleteProgressRecord}
              currentStudent={vault.studentProfile?.name}
              currentSchool={vault.studentProfile?.school}
            />
          </section>

          <SectionDivider 
            icon="📈" 
            title="Growth Insights & Reflection Journal" 
            subtitle="Mindful streaks, achievement badges & personal reflections" 
          />

          {/* Section 7: Growth Dashboard */}
          <section id="growth" className="scroll-mt-32 sm:scroll-mt-36">
            <ProgressDashboard
              mindfulDaysCount={vault.mindfulDaysCount}
              completedActivitiesTotal={vault.completedActivitiesTotal}
              reflectionJournal={vault.reflectionJournal || []}
              onAddReflection={handleAddReflection}
            />
          </section>

          <SectionDivider 
            icon="🛡️" 
            title="Counselor & Safety Center" 
            subtitle="24/7 National helplines & confidential escalation portal" 
          />

          {/* Section 8: Counselor & Ethical Safety Center */}
          <section id="counselor" className="scroll-mt-32 sm:scroll-mt-36">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-md overflow-hidden">
              {/* Top Rose Banner */}
              <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                      Confidential & 24/7 Accessible
                    </span>
                    <span className="text-rose-200 text-xs font-medium">
                      Verified Ethical Support
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                    Counselor & Ethical Safety Center
                  </h2>
                  <p className="text-xs text-rose-100 max-w-xl">
                    MindSpring provides immediate access to trusted school guidance and verified national 24/7 helplines. Your mental health, emotional safety, and personal dignity always come first.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setIsCrisisOpen(true)}
                    className="px-5 py-3 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 whitespace-nowrap active:scale-95 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Open Confidential Escalation Portal</span>
                  </button>
                </div>
              </div>

              {/* Helpline Cards & Counselor Direct Info */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tele-MANAS */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>Tele-MANAS (Govt of India)</span>
                      </h4>
                      <span className="text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-extrabold px-2 py-0.5 rounded-full">
                        24/7 National
                      </span>
                    </div>
                    <div className="text-base font-mono font-extrabold text-rose-700 dark:text-rose-300">
                      14416 / 1800-891-4416
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Free, confidential psychological first-aid available nationwide in multiple regional languages.
                    </p>
                  </div>

                  {/* Childline India */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Childline India (Student Outreach)</span>
                      </h4>
                      <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-extrabold px-2 py-0.5 rounded-full">
                        24/7 Toll-Free
                      </span>
                    </div>
                    <div className="text-base font-mono font-extrabold text-amber-700 dark:text-amber-300">
                      1098
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Emergency phone outreach service dedicated to adolescents and students experiencing distress.
                    </p>
                  </div>

                  {/* KIRAN Helpline */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>KIRAN Mental Health Helpline</span>
                      </h4>
                      <span className="text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-extrabold px-2 py-0.5 rounded-full">
                        Govt Helpline
                      </span>
                    </div>
                    <div className="text-base font-mono font-extrabold text-blue-700 dark:text-blue-300">
                      1800-599-0019
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Ministry of Social Justice 24x7 toll-free mental health support providing clinical guidance.
                    </p>
                  </div>

                  {/* School Counselor Direct */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Your School Counselor</span>
                      </h4>
                      <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold px-2 py-0.5 rounded-full">
                        Confidential
                      </span>
                    </div>
                    <div className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300 truncate">
                      {(!vault.studentProfile?.counselorContact ||
                        vault.studentProfile?.counselorContact === 'counselor@school.edu' ||
                        vault.studentProfile?.counselorContact === 'counselor@drishtischool.edu.in')
                        ? 'scounselor024@gmail.com'
                        : vault.studentProfile.counselorContact}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Click the escalation portal above to prepare a private email draft or reach out confidentially.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0" />
                    <span>
                      <strong>Ethical Boundary:</strong> MindSpring is an educational wellness tool and does not provide formal medical diagnoses. In acute distress, please reach out to trusted adults, school counselors, or the 24/7 helplines above.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCrisisOpen(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition shrink-0 whitespace-nowrap cursor-pointer active:scale-95"
                  >
                    Reach Out Privately
                  </button>
                </div>
              </div>
            </div>
          </section>

          <SectionDivider 
            icon="🔒" 
            title="Profile & Privacy Settings" 
            subtitle="Personal profile customization & local storage encryption" 
          />

          {/* Section 9: Profile & Privacy Settings */}
          <section id="privacy" className="scroll-mt-32 sm:scroll-mt-36">
            <PrivacySettingsModal
              profile={vault.studentProfile}
              onUpdateProfile={handleUpdateProfile}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              onResetApp={handleResetApp}
            />
          </section>

        </main>

        {/* Clean Footer with Smooth Navigation */}
        <footer className="border-t border-emerald-100 dark:border-slate-800 py-6 px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span 
                className="font-heading font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-emerald-600 transition" 
                onClick={() => handleTabClick('plan')}
              >
                MindSpring
              </span>
              <span>•</span>
              <span>Personalised Student Wellness & Emotional Growth</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => setDarkMode(prev => !prev)}
                className="hover:text-emerald-600 transition font-bold flex items-center space-x-1 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Toggle Dark / Light Theme"
              >
                <span>{darkMode ? '☀️ Light Theme' : '🌙 Dark Theme'}</span>
              </button>
              <button 
                onClick={() => setIsDownloadOpen(true)}
                className="hover:text-emerald-600 transition font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 cursor-pointer"
              >
                <span>📱 Download APK / App</span>
              </button>
              <button 
                onClick={() => handleTabClick('table')}
                className="hover:text-emerald-600 transition underline decoration-slate-300 cursor-pointer"
              >
                Data & Progress Table
              </button>
              <button 
                onClick={() => handleTabClick('privacy')}
                className="hover:text-emerald-600 transition cursor-pointer"
              >
                Profile & Privacy
              </button>
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="hover:text-emerald-600 transition cursor-pointer"
              >
                About Team
              </button>
              <button 
                onClick={() => setIsCrisisOpen(true)}
                className="hover:text-rose-600 transition font-semibold text-rose-500 cursor-pointer"
              >
                24/7 Crisis Helplines
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            A non-diagnostic educational self-care platform dedicated to healthy habit formation, exam calm, and student well-being.
          </p>
        </footer>

        {/* Floating Quick Action Hotkey Buttons */}
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2.5">
          {/* Scroll to Top button when scrolled */}
          {showBackToTop && (
            <button
              onClick={() => handleTabClick('plan')}
              className="flex items-center justify-center w-10 h-10 bg-slate-800/90 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full shadow-xl transition transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20 cursor-pointer"
              title="Scroll to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-emerald-400" />
            </button>
          )}

          {/* Emergency Support Button */}
          <button
            onClick={() => setIsCrisisOpen(true)}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 border-2 border-white/40 cursor-pointer"
            title="Instant crisis helplines and confidential counselor connection"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Emergency Support</span>
          </button>
        </div>

        {/* Mobile Ergonomic Bottom Navigation Bar (md:hidden) */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={handleTabClick}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onOpenCrisis={() => setIsCrisisOpen(true)}
          onOpenDownloadApp={() => setIsDownloadOpen(true)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(prev => !prev)}
          completedCount={completedCount}
          totalPlanCount={vault.dailyPlan?.length || 4}
        />

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
          counselorEmail={
            (!vault.studentProfile?.counselorContact ||
             vault.studentProfile?.counselorContact === 'counselor@school.edu' ||
             vault.studentProfile?.counselorContact === 'counselor@drishtischool.edu.in')
              ? 'scounselor024@gmail.com'
              : vault.studentProfile.counselorContact
          }
        />

        <DownloadAppModal
          isOpen={isDownloadOpen}
          onClose={() => setIsDownloadOpen(false)}
        />

        <AboutModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
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
