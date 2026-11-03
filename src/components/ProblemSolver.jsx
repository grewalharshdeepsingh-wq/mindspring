import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Flame, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Play, 
  Copy, 
  Check, 
  PlusCircle, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  Compass, 
  BookOpen, 
  Target, 
  BrainCircuit, 
  Clock, 
  HeartHandshake,
  Heart,
  History,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  analyzeAndSolveProblem, 
  buildRobotSummarizedAnswer,
  SAMPLE_PROBLEMS, 
  PROBLEM_CATEGORIES 
} from '../utils/problemSolverEngine';
import { ACTIVITY_CATALOG } from '../data/activityCatalog';
import RobotSolverAvatar from './RobotSolverAvatar';

const HISTORY_KEY = 'mindspring_problem_solver_history_v1';

export default function ProblemSolver({
  studentName = '',
  onStartActivity,
  onAddToDailyPlan,
  onSaveReflection,
  onOpenCrisis
}) {
  const [problemText, setProblemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [intensity, setIntensity] = useState('moderate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  
  // Robot Voice States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasFinishedSpeaking, setHasFinishedSpeaking] = useState(false);
  const speechRef = useRef(null);

  // Optional full detail accordion
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Feedback states
  const [copied, setCopied] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);

  // History state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // Cleanup speech synthesis on unmount or tab switch
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSelectSample = (sample) => {
    setProblemText(sample.text);
    setSelectedCategory(sample.category);
    setIntensity(sample.intensity);
    setResult(null);
  };

  /**
   * Speaks the given summarized paragraph using Web Speech API
   */
  const speakSummarizedAnswer = (textToSpeak) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setHasFinishedSpeaking(false);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.96;
    utterance.pitch = 1.05; // Slightly cheerful, friendly tone

    // Choose pleasant English voice
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Karen') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setHasFinishedSpeaking(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setHasFinishedSpeaking(true);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Robot speech synthesis note:', e);
      }
      setIsSpeaking(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  /**
   * Repeat option after robot finishes with answer
   */
  const handleRepeatSpeech = () => {
    if (!result) return;
    const text = result.summarizedParagraph || buildRobotSummarizedAnswer(result, studentName);
    speakSummarizedAnswer(text);
  };

  const handleSolve = () => {
    if (!problemText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);
    setResult(null);
    setAddedToPlan(false);
    setSavedToJournal(false);
    setHasFinishedSpeaking(false);
    setShowFullDetails(false);

    // Stop existing audio
    handleStopSpeech();

    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 1000);

    setTimeout(() => {
      const analysis = analyzeAndSolveProblem({
        problemText,
        category: selectedCategory,
        intensity,
        studentName
      });

      // Ensure summarized paragraph is ready
      if (!analysis.summarizedParagraph) {
        analysis.summarizedParagraph = buildRobotSummarizedAnswer(analysis, studentName);
      }

      setResult(analysis);
      setIsAnalyzing(false);
      setAnalysisStep(0);

      // Trigger celebration confetti
      if (!analysis.isCrisis) {
        try {
          confetti({
            particleCount: 55,
            spread: 65,
            origin: { y: 0.65 }
          });
        } catch (e) {}
      }

      // Automatically speak the summarized paragraph through the robot!
      speakSummarizedAnswer(analysis.summarizedParagraph);

      // Save to local history
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        problemSummary: problemText.slice(0, 100) + (problemText.length > 100 ? '...' : ''),
        domain: analysis.domainLabel || 'Student Challenge',
        affirmation: analysis.motivation?.affirmation || '',
        summarizedParagraph: analysis.summarizedParagraph,
        fullData: analysis
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (e) {}
    }, 1500);
  };

  const handleCopySummarized = () => {
    if (!result) return;
    const textToCopy = result.summarizedParagraph || buildRobotSummarizedAnswer(result, studentName);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddActionToDailyPlan = () => {
    if (!result || !onAddToDailyPlan) return;
    const task = {
      id: `problem-solve-${Date.now()}`,
      instanceId: `problem-solve-${Date.now()}`,
      title: result.solution?.steps?.[0]?.title || 'Robo-Mentor Action Step',
      durationMinutes: 5,
      category: 'action',
      description: result.solution?.immediate5Min || result.solution?.actionItem || '5-minute micro victory.',
      benefit: 'Targeted micro-action recommended by Robo-Mentor.',
      icon: 'Target',
      completed: false,
      userRating: 0
    };
    onAddToDailyPlan(task);
    setAddedToPlan(true);
    setTimeout(() => setAddedToPlan(false), 3000);
  };

  const handleSaveToGrowthJournal = () => {
    if (!result || !onSaveReflection) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      moodBefore: intensity === 'high' ? 'High Overwhelm' : 'Stuck & Anxious',
      moodAfter: 'Empowered & Clear 💡',
      summary: `Robo-Mentor Voice Guidance: "${(result.summarizedParagraph || '').slice(0, 120)}..." Affirmation: "${result.motivation?.affirmation || ''}"`,
      rating: 5
    };
    onSaveReflection(entry);
    setSavedToJournal(true);
    setTimeout(() => setSavedToJournal(false), 3000);
  };

  const handleLaunchRecommendedTool = (toolId) => {
    if (!onStartActivity) return;

    if (toolId === 'crisis') {
      if (onOpenCrisis) onOpenCrisis();
      return;
    }

    const matched = ACTIVITY_CATALOG.find(a => 
      a.id === toolId || 
      a.interactiveComponent === toolId ||
      a.type === toolId
    ) || ACTIVITY_CATALOG[0];

    onStartActivity(matched);
  };

  const handleLoadHistoryItem = (item) => {
    const loadedData = item.fullData || {};
    if (!loadedData.summarizedParagraph) {
      loadedData.summarizedParagraph = item.summarizedParagraph || buildRobotSummarizedAnswer(loadedData, studentName);
    }
    setResult(loadedData);
    setProblemText(item.problemSummary);
    setShowHistory(false);
    setHasFinishedSpeaking(false);
    setShowFullDetails(false);

    // Speak loaded solution
    speakSummarizedAnswer(loadedData.summarizedParagraph);
  };

  const handleDeleteHistoryItem = (e, id) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (err) {}
  };

  const currentSummarizedText = result?.summarizedParagraph || (result ? buildRobotSummarizedAnswer(result, studentName) : '');

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>AI Robot Voice Mentor</span>
              </span>
              <span className="text-emerald-100 text-xs font-medium">
                Summarized Spoken Guidance • Repeatable Audio
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Problem Solver & Robo-Mentor
            </h2>

            <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed max-w-xl">
              Type your problem below. Our friendly AI Robot will summarize the exact solution in a single spoken paragraph, giving you immediate clarity with a repeat option whenever you need to hear it again.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-2xl text-xs font-semibold backdrop-blur-sm transition border border-white/20"
              >
                <History className="w-4 h-4 text-emerald-200" />
                <span>Past Breakthroughs ({history.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-600" />
              <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white">
                Saved Solutions & Past Spoken Answers
              </h4>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close History ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoadHistoryItem(item)}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl cursor-pointer transition text-left flex flex-col justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      {item.domain}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">
                    "{item.problemSummary}"
                  </p>
                </div>
                
                {item.affirmation && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 italic pt-1 line-clamp-1">
                    "{item.affirmation}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="group-hover:underline flex items-center space-x-1">
                    <Volume2 className="w-3 h-3 text-cyan-600" />
                    <span>Re-listen with Robot</span>
                  </span>
                  <button
                    onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input & Form Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        
        {/* Sample Problem Quick-Picks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap a Student Situation or Type Below:</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Robot will summarize and speak the answer</span>
          </div>

          <div className="flex sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 no-scrollbar -mx-1 px-1">
            {SAMPLE_PROBLEMS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition font-medium text-left whitespace-nowrap sm:whitespace-normal shrink-0 sm:shrink active:scale-95"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-heading font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
              <span>What's troubling you right now?</span>
              <span className="text-rose-500">*</span>
            </label>
            {problemText && (
              <button
                onClick={() => { setProblemText(''); setResult(null); handleStopSpeech(); }}
                className="text-xs text-slate-400 hover:text-rose-500 transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Type your challenge openly here... e.g. 'I have a biology exam tomorrow morning, 4 chapters left, I'm panicking and can't focus. I feel like I'm going to fail.'"
            rows={3}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-base sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Confidential & Private • Spoken aloud directly by your Robot Mentor</span>
            <span>{problemText.length} characters</span>
          </div>
        </div>

        {/* Filters & Intensity Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Category Focus
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {PROBLEM_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Distress Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Distress Level</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold capitalize">
                {intensity === 'low' ? 'Mild Tension' : intensity === 'moderate' ? 'Moderate Stress' : 'High Anxiety / Paralyzed'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Mild', color: 'hover:border-emerald-400' },
                { id: 'moderate', label: 'Moderate', color: 'hover:border-amber-400' },
                { id: 'high', label: 'High / Stuck', color: 'hover:border-rose-400' }
              ].map(level => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setIntensity(level.id)}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition text-center min-h-[44px] flex items-center justify-center active:scale-95 ${
                    intensity === level.id 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 ' + level.color
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button
            type="button"
            disabled={!problemText.trim() || isAnalyzing}
            onClick={handleSolve}
            className={`w-full py-4 px-6 rounded-2xl font-heading font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition shadow-lg ${
              !problemText.trim() || isAnalyzing
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-emerald-500/25 transform hover:-translate-y-0.5 active:translate-y-0 ring-2 ring-emerald-400/20'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {analysisStep === 1 ? '🤖 Robot is reading your problem...' :
                   analysisStep === 2 ? '⚡ Formulating practical 1-paragraph game plan...' :
                   '🎙️ Synthesizing voice answer...'}
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Ask AI Robot for Voice Solution</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ANALYZING STATE ANIMATION */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-fade-in">
          <RobotSolverAvatar
            isAnalyzing={true}
            isSpeaking={false}
            hasFinished={false}
            studentName={studentName}
          />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-white">
              Your AI Robot is analyzing your situation...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extracting the core challenge and preparing a spoken personalized answer.
            </p>
          </div>
        </div>
      )}

      {/* RESULT SECTION - ROBOT VOICE ANSWER STAGE */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Safety Alert (Crisis detected) */}
          {result.isCrisis && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-700 dark:text-rose-300 font-heading font-extrabold text-lg">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
                <span>Immediate Safety Support</span>
              </div>
              <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
                {result.understanding?.validation || 'Your life and safety are the top priority.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onOpenCrisis}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Open 24/7 Helplines & Counselor Portal
                </button>
              </div>
            </div>
          )}

          {/* MAIN ROBOT VOICE ANSWER CARD */}
          <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-2 border-cyan-500/30 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Ambient Background Gradient Flares */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Strip with Domain Badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-heading font-extrabold text-sm sm:text-base text-slate-800 dark:text-white flex items-center space-x-1.5">
                  <span>Robo-Mentor Spoken Solution</span>
                </span>
              </div>
              
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 px-3 py-1 rounded-full border border-cyan-300 dark:border-cyan-800 shadow-sm">
                {result.domainLabel || 'Empathetic Action Plan'}
              </span>
            </div>

            {/* Center Stage: The Robot & The Voice Dialogue */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Robot Avatar Column (4 cols on md) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-2">
                <RobotSolverAvatar
                  isSpeaking={isSpeaking}
                  isAnalyzing={false}
                  hasFinished={hasFinishedSpeaking}
                  onToggleSpeech={isSpeaking ? handleStopSpeech : handleRepeatSpeech}
                  onRepeatSpeech={handleRepeatSpeech}
                  studentName={studentName}
                />
              </div>

              {/* Dialogue & Spoken Paragraph Column (8 cols on md) */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Speech Bubble Card */}
                <div className="relative bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-3">
                  
                  {/* Speech Bubble Pointer for Desktop */}
                  <div className="hidden md:block absolute -left-3 top-10 w-6 h-6 bg-white dark:bg-slate-800/90 border-l border-b border-slate-200 dark:border-slate-700/80 transform rotate-45" />

                  {/* Robot Header Inside Bubble */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🎙️</span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Spoken Summarized Answer:
                      </span>
                    </div>

                    {isSpeaking && (
                      <div className="flex items-center space-x-1 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                        <span className="w-1.5 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-4 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[11px] ml-1">Speaking</span>
                      </div>
                    )}
                  </div>

                  {/* The Summarized Paragraph Content */}
                  <div className="text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed font-sans font-medium">
                    <p className="p-1 select-text">
                      "{currentSummarizedText}"
                    </p>
                  </div>

                  {/* Spoken Action Callout */}
                  {result.solution?.immediate5Min && (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start space-x-2 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold shrink-0 mt-0.5">⚡ Key Step:</span>
                      <span className="text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                        {result.solution.immediate5Min}
                      </span>
                    </div>
                  )}
                </div>

                {/* PRIMARY ACTION BAR WITH THE REPEAT OPTION */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  
                  {/* REPEAT OPTION - High Visual Prominence */}
                  <button
                    onClick={handleRepeatSpeech}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition shadow-lg transform active:scale-95 ${
                      hasFinishedSpeaking
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white ring-4 ring-emerald-400/30 scale-105'
                        : isSpeaking
                        ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700 hover:bg-cyan-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/20'
                    }`}
                    title="Repeat Robot's voice answer"
                  >
                    <RotateCcw className={`w-4 h-4 ${hasFinishedSpeaking ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                    <span>Repeat Voice Answer</span>
                  </button>

                  {/* Stop / Pause Voice Button (When currently speaking) */}
                  {isSpeaking && (
                    <button
                      onClick={handleStopSpeech}
                      className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 transition"
                      title="Pause or stop robot voice"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Voice</span>
                    </button>
                  )}

                  {/* Copy Summarized Answer */}
                  <button
                    onClick={handleCopySummarized}
                    className="flex items-center space-x-1.5 px-3.5 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Answer!' : 'Copy'}</span>
                  </button>

                  {/* Add Action to Daily Plan */}
                  <button
                    onClick={handleAddActionToDailyPlan}
                    disabled={addedToPlan}
                    className={`flex items-center space-x-1.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                      addedToPlan
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {addedToPlan ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{addedToPlan ? 'Added to Plan!' : 'Add to Plan'}</span>
                  </button>

                  {/* Save to Journal */}
                  <button
                    onClick={handleSaveToGrowthJournal}
                    disabled={savedToJournal}
                    className={`flex items-center space-x-1.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                      savedToJournal
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {savedToJournal ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                    <span>{savedToJournal ? 'Saved!' : 'Save Breakthrough'}</span>
                  </button>

                </div>

                {/* Helpful Notification once finished speaking */}
                {hasFinishedSpeaking && (
                  <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Finished speaking! Click <strong>"Repeat Voice Answer"</strong> above anytime you wish to hear this guidance again.</span>
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Recommended Interactive Tool Quick Launch */}
            {result.solution?.recommendedTool && (
              <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                    Recommended Interactive Tool:
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">
                    {result.solution.recommendedTool.title}
                  </p>
                </div>
                <button
                  onClick={() => handleLaunchRecommendedTool(result.solution.recommendedTool.id)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* OPTIONAL ACCORDION: VIEW FULL TECHNICAL BREAKDOWN */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  {showFullDetails ? 'Hide Detailed Multi-Step Breakdown' : 'Want to read full 3-step technical details? (Optional)'}
                </span>
              </div>
              {showFullDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showFullDetails && (
              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-fade-in bg-slate-50/50 dark:bg-slate-900/40">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  
                  {/* Pillar 1 */}
                  <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                      <BrainCircuit className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Root Cause Mechanism</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {result.understanding?.rootCause}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-slate-700 pt-2">
                      "{result.understanding?.validation}"
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400">
                      <Target className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Step-by-Step Strategic Roadmap</h4>
                    </div>
                    <div className="space-y-2">
                      {result.solution?.steps?.map((st, idx) => (
                        <div key={idx} className="text-xs space-y-0.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{idx + 1}. {st.title}</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{st.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                      <Flame className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Affirmation & Mindset</h4>
                    </div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 italic">
                      "{result.motivation?.affirmation}"
                    </p>
                    {result.motivation?.mindsetShift && (
                      <div className="text-[11px] space-y-1 border-t border-slate-100 dark:border-slate-700 pt-2">
                        <div className="text-rose-500 line-through">❌ {result.motivation.mindsetShift.from}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✅ {result.motivation.mindsetShift.to}</div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Reset / Solve Another Problem Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                handleStopSpeech();
                setResult(null);
                setProblemText('');
                setHasFinishedSpeaking(false);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-2xl shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Solve Another Problem or Dilemma</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
