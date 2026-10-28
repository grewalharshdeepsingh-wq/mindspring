import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Flame, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
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
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  analyzeAndSolveProblem, 
  SAMPLE_PROBLEMS, 
  PROBLEM_CATEGORIES 
} from '../utils/problemSolverEngine';
import { ACTIVITY_CATALOG } from '../data/activityCatalog';

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
  const [activeResultTab, setActiveResultTab] = useState('all'); // 'all' | 'understanding' | 'solution' | 'motivation'
  
  // Feedback states
  const [copied, setCopied] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

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

  // Stop speech if component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
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

  const handleSolve = () => {
    if (!problemText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);
    setResult(null);
    setAddedToPlan(false);
    setSavedToJournal(false);

    // Stop existing audio
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    // Dynamic staged progression for realistic psychological analysis
    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 1000);

    setTimeout(() => {
      const analysis = analyzeAndSolveProblem({
        problemText,
        category: selectedCategory,
        intensity,
        studentName
      });

      setResult(analysis);
      setIsAnalyzing(false);
      setAnalysisStep(0);

      // Trigger celebration if not crisis
      if (!analysis.isCrisis) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (e) {}
      }

      // Save to local history
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        problemSummary: problemText.slice(0, 100) + (problemText.length > 100 ? '...' : ''),
        domain: analysis.domainLabel || 'Student Challenge',
        affirmation: analysis.motivation?.affirmation || '',
        fullData: analysis
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (e) {}
    }, 1500);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!result?.motivation?.pepTalk) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.motivation.pepTalk);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick gentle voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `MINDSPRING PROBLEM SOLVER & MOTIVATOR
-------------------------------------------------
[UNDERSTANDING & ROOT CAUSE]
${result.understanding.summary}
Root Trigger: ${result.understanding.rootCause}
Validation: ${result.understanding.validation}

[ACTIONABLE SOLUTION]
⚡ Immediate 5-Minute Relief: ${result.solution.immediate5Min}

Step-by-Step Strategic Roadmap:
1. ${result.solution.steps[0]?.title}: ${result.solution.steps[0]?.action}
2. ${result.solution.steps[1]?.title}: ${result.solution.steps[1]?.action}
3. ${result.solution.steps[2]?.title}: ${result.solution.steps[2]?.action}

[MOTIVATIONAL BOOST & POWER AFFIRMATION]
${result.motivation.pepTalk}

🌟 Power Affirmation: "${result.motivation.affirmation}"
🔄 Mindset Shift: From "${result.motivation.mindsetShift?.from}" ➔ To "${result.motivation.mindsetShift?.to}"
-------------------------------------------------
Generated by MindSpring Student Wellness`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddActionToDailyPlan = () => {
    if (!result || !onAddToDailyPlan) return;
    const task = {
      id: `problem-solve-${Date.now()}`,
      instanceId: `problem-solve-${Date.now()}`,
      title: result.solution.steps[0]?.title || 'Solve Today’s Challenge',
      durationMinutes: 5,
      category: 'action',
      description: result.solution.immediate5Min || result.solution.actionItem,
      benefit: 'Targeted micro-action to break panic and restore clarity.',
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
      summary: `Overcame problem: "${problemText.slice(0, 60)}...". Action taken: ${result.solution.immediate5Min} Affirmation: "${result.motivation.affirmation}"`,
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

    // Match catalog activity
    const matched = ACTIVITY_CATALOG.find(a => 
      a.id === toolId || 
      a.interactiveComponent === toolId ||
      a.type === toolId
    ) || ACTIVITY_CATALOG[0];

    onStartActivity(matched);
  };

  const handleLoadHistoryItem = (item) => {
    setResult(item.fullData);
    setProblemText(item.problemSummary);
    setShowHistory(false);
  };

  const handleDeleteHistoryItem = (e, id) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (err) {}
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Empathetic AI Mentor</span>
              </span>
              <span className="text-emerald-100 text-xs font-medium">
                CBT • BJ Fogg Micro-Habits • Emotional Validation
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Problem Solver & Daily Motivator
            </h2>

            <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed max-w-xl">
              Type whatever is stressing you out—exam panic, procrastination, parental pressure, or social dilemmas. 
              Get an instant psychological breakdown, a realistic 3-step action plan, and high-impact personal motivation.
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

      {/* History Drawer/Card */}
      {showHistory && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-600" />
              <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white">
                Saved Solutions & Past Encouragements
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
                    <span>Revisit Solution</span>
                    <ArrowRight className="w-3 h-3" />
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
              <span>Tap a Common Student Situation to Try:</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Or write your custom problem below</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROBLEMS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition font-medium text-left"
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
                onClick={() => { setProblemText(''); setResult(null); }}
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
            placeholder="Type openly here... e.g. 'I have a huge biology exam tomorrow morning, 4 chapters left, I'm panicking and can't focus. I'm afraid I'll let my parents down.'"
            rows={4}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>100% Confidential & On-Device • No judgment, only supportive guidance.</span>
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

          {/* Distress / Urgency Meter */}
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
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
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
            className={`w-full py-3.5 px-6 rounded-2xl font-heading font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition shadow-lg ${
              !problemText.trim() || isAnalyzing
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {analysisStep === 1 ? '🧠 Understanding your situation...' :
                   analysisStep === 2 ? '💡 Formulating 3-tier practical solution...' :
                   '🔥 Crafting personalized motivational boost...'}
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Understand Problem, Get Solution & Motivate Me</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Safety / Crisis Alert if detected */}
          {result.isCrisis && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-700 dark:text-rose-300 font-heading font-extrabold text-lg">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
                <span>Immediate Safety Support</span>
              </div>
              <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
                {result.understanding.validation}
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

          {/* Action Toolbar on Result */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Diagnosis Complete • {result.domainLabel || 'Targeted Strategy'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Audio Listen Button */}
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isSpeaking
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
                title="Listen to motivational audio pep talk"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen to Motivation'}</span>
              </button>

              {/* Copy Summary */}
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
              </button>

              {/* Add to Daily Plan */}
              <button
                onClick={handleAddActionToDailyPlan}
                disabled={addedToPlan}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  addedToPlan
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {addedToPlan ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{addedToPlan ? 'Added to Plan!' : 'Add Action to Plan'}</span>
              </button>

              {/* Save to Journal */}
              <button
                onClick={handleSaveToGrowthJournal}
                disabled={savedToJournal}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  savedToJournal
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {savedToJournal ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                <span>{savedToJournal ? 'Saved to Journal!' : 'Save Breakthrough'}</span>
              </button>
            </div>
          </div>

          {/* Core 3 Pillars: 1) Understanding, 2) Solution, 3) Motivation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* PILLAR 1: UNDERSTANDING THE PROBLEM */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Pillar 1</span>
                    <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
                      Understanding Your Problem
                    </h3>
                  </div>
                </div>

                {/* Brief Summary */}
                <div className="p-3.5 bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-800 dark:text-cyan-300">
                    What's Really Happening:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    {result.understanding.summary}
                  </p>
                </div>

                {/* Root Cause Mechanism */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Biological / Psychological Trigger:</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {result.understanding.rootCause}
                  </p>
                </div>

                {/* Empathetic Validation */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Empathetic Validation:</span>
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 italic">
                    "{result.understanding.validation}"
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Cognitive Clarity</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">100% Validated</span>
              </div>
            </div>

            {/* PILLAR 2: PRACTICAL SOLUTION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">Pillar 2</span>
                    <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
                      Actionable Solution Plan
                    </h3>
                  </div>
                </div>

                {/* 5-Min Emergency Relief */}
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>⚡ Immediate 5-Minute Relief:</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {result.solution.immediate5Min}
                  </p>
                </div>

                {/* 3 Step Roadmap */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                    Step-by-Step Strategic Roadmap:
                  </span>
                  
                  {result.solution.steps.map((st, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {st.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                        {st.action}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recommended Interactive Tool */}
                {result.solution.recommendedTool && (
                  <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-teal-200 dark:border-slate-700 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                        Recommended Tool:
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">
                        {result.solution.recommendedTool.title}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLaunchRecommendedTool(result.solution.recommendedTool.id)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition whitespace-nowrap shrink-0 flex items-center space-x-1"
                    >
                      <span>Launch</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Realistic Execution</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">Step 1 Ready</span>
              </div>
            </div>

            {/* PILLAR 3: MOTIVATION & ENCOURAGEMENT */}
            <div className="bg-gradient-to-b from-amber-50/70 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-amber-200 dark:border-amber-800/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pillar 3</span>
                    <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
                      Your Motivational Boost
                    </h3>
                  </div>
                </div>

                {/* Pep Talk Letter */}
                <div className="p-4 bg-white/80 dark:bg-slate-800/80 border border-amber-100 dark:border-amber-900/30 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Compassionate Pep Talk:</span>
                    </span>
                    <button
                      onClick={handleToggleSpeech}
                      className="text-amber-600 hover:text-amber-700 text-xs font-bold flex items-center space-x-1"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{isSpeaking ? 'Mute' : 'Speak'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-serif sm:font-sans font-medium">
                    {result.motivation.pepTalk}
                  </p>
                </div>

                {/* Power Affirmation */}
                <div className="p-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-md space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90 block">
                    🌟 Golden Power Affirmation:
                  </span>
                  <p className="text-xs font-heading font-extrabold tracking-wide italic">
                    "{result.motivation.affirmation}"
                  </p>
                </div>

                {/* Mindset Shift */}
                {result.motivation.mindsetShift && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                      🔄 Mindset Shift:
                    </span>
                    <div className="text-[11px] space-y-1">
                      <div className="text-rose-600 dark:text-rose-400 line-through">
                        ❌ {result.motivation.mindsetShift.from}
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                        ✅ {result.motivation.mindsetShift.to}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Inner Strength</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Restored 🔥</span>
              </div>
            </div>

          </div>

          {/* Reset / Solve Another Problem Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setResult(null);
                setProblemText('');
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Solve Another Problem or Try New Dilemma</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
