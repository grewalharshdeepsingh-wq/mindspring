import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Flame, 
  Heart, 
  Star, 
  ArrowLeft, 
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Play,
  Quote,
  Clock,
  Compass,
  Smile,
  RefreshCw,
  Rocket,
  Wind,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

// ==========================================
// STUDENT MOTIVATIONAL QUOTES REPOSITORY
// ==========================================
const MOTIVATIONAL_QUOTES = [
  {
    quote: "Breathe. You have overcome 100% of your hardest study days so far, and you will thrive through this one too.",
    author: "MindSpring Affirmation",
    theme: "Resilience"
  },
  {
    quote: "Your worth as a human being is never defined by a single exam, grade, or test score. You are whole and capable.",
    author: "Student Wellness Anchor",
    theme: "Self-Worth"
  },
  {
    quote: "Rest is not a reward you have to earn; it is an essential foundation that allows your brain to grow, consolidate, and remember.",
    author: "Cognitive Science Insight",
    theme: "Rest & Recovery"
  },
  {
    quote: "Progress over perfection. Even a single calm, focused step forward today is a monumental personal victory.",
    author: "Mindful Living Principle",
    theme: "Growth Mindset"
  },
  {
    quote: "Treat yourself with the exact same compassion, patience, and encouragement that you would offer your dearest friend.",
    author: "Self-Compassion Practice",
    theme: "Kindness"
  },
  {
    quote: "You don't have to understand everything all at once. Take one deep breath, then tackle the very next sentence.",
    author: "Calm Focus Principle",
    theme: "Focus"
  },
  {
    quote: "Calmness is a superpower. When the storm of exams feels loud, your inner peace is your greatest compass.",
    author: "Emotional Intelligence",
    theme: "Inner Peace"
  },
  {
    quote: "A diamond is just a piece of charcoal that handled stress remarkably well—and you are already shining brightly.",
    author: "Daily Encouragement",
    theme: "Confidence"
  },
  {
    quote: "Trust the quiet effort you put in. Real learning happens in the moments you choose gentle patience over panic.",
    author: "Academic Growth Mindset",
    theme: "Patience"
  }
];

function getRandomQuote(excludeIndex = -1) {
  let index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  if (index === excludeIndex) {
    index = (index + 1) % MOTIVATIONAL_QUOTES.length;
  }
  return { quoteObj: MOTIVATIONAL_QUOTES[index], index };
}

// ==========================================
// SHARED GAME RESULTS & QUOTE CARD
// ==========================================
function GameResultCard({ 
  gameName, 
  score, 
  stats, 
  onPlayAgain, 
  onSwitchGame, 
  onComplete, 
  soundEnabled 
}) {
  const [quoteState, setQuoteState] = useState(() => getRandomQuote());

  useEffect(() => {
    if (soundEnabled && soundEngine.playLevelUpSound) {
      soundEngine.playLevelUpSound();
    }
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  }, [soundEnabled]);

  const handleNextQuote = () => {
    setQuoteState(prev => getRandomQuote(prev.index));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-xl mx-auto space-y-5">
      {/* Trophy Header */}
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
        <Trophy className="w-8 h-8" />
      </div>

      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Mindful Break Complete
        </span>
        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-800 dark:text-white mt-1.5">
          {gameName} Session Finished!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your brain has received a healthy, calming dopamine boost. Great job taking care of yourself!
        </p>
      </div>

      {/* Score & Stats Pill */}
      <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 w-full">
        <div className="px-4 py-1.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Final Score</div>
          <div className="text-2xl font-extrabold font-mono text-teal-600 dark:text-teal-400">{score}</div>
        </div>

        {stats.map((s, idx) => (
          <div key={idx} className="px-4 py-1.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{s.label}</div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Motivational Quote Box */}
      <div className="relative overflow-hidden w-full bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 dark:from-teal-950/40 dark:to-slate-900 border-2 border-teal-300 dark:border-teal-700/60 rounded-3xl p-5 sm:p-6 text-left shadow-sm">
        <Quote className="w-8 h-8 text-teal-500/30 dark:text-teal-400/20 absolute -top-1 -left-1 transform -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-teal-300 bg-white/70 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              💡 Mindful Affirmation • {quoteState.quoteObj.theme}
            </span>
            <button
              onClick={handleNextQuote}
              className="flex items-center space-x-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-teal-200 dark:border-teal-800 shadow-sm transition"
              title="Click for another inspirational quote"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Another Quote</span>
            </button>
          </div>

          <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed italic pt-1">
            "{quoteState.quoteObj.quote}"
          </p>

          <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 text-right">
            — {quoteState.quoteObj.author}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
        <button
          onClick={onPlayAgain}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        {onSwitchGame && (
          <button
            onClick={onSwitchGame}
            className="flex items-center space-x-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition"
          >
            <Gamepad2 className="w-4 h-4 text-purple-500" />
            <span>Try Another Game</span>
          </button>
        )}

        {onComplete && (
          <button
            onClick={() => onComplete(5)}
            className="flex items-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Break to Journal</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 1. STRESS BUBBLE POP GAME
// ==========================================
const STRESS_WORDS = [
  'Exam Panic', 'Overthinking', 'Perfectionism', 'Self-Doubt', 
  'Late-Night Fatigue', 'Peer Pressure', 'Procrastination', 
  'Formula Anxiety', 'Imposter Feeling', 'Deadlines', 'Syllabus Rush'
];

const BONUS_WORDS = [
  { text: '✨ Inner Calm', pts: 50, color: 'from-amber-400 to-yellow-400' },
  { text: '🌸 Self-Care', pts: 30, color: 'from-pink-400 to-rose-400' },
  { text: '⚡ Fresh Focus', pts: 40, color: 'from-emerald-400 to-teal-400' },
  { text: '💎 Deep Peace', pts: 60, color: 'from-cyan-400 to-blue-400' }
];

function BubblePopGame({ soundEnabled, onScoreUpdate, onSwitchGame, onComplete }) {
  const [gameState, setGameState] = useState('idle');
  const [duration, setDuration] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [bubbles, setBubbles] = useState([]);
  const [popEffects, setPopEffects] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_bubble_high') || '0', 10);
  });

  const nextId = useRef(1);
  const comboTimer = useRef(null);

  const handleStartGame = () => {
    setScore(0);
    setPoppedCount(0);
    setCombo(1);
    setTimeLeft(duration);
    setPopEffects([]);

    const seeded = [];
    for (let i = 0; i < 7; i++) {
      const isBonus = Math.random() < 0.25;
      const bonusObj = isBonus ? BONUS_WORDS[Math.floor(Math.random() * BONUS_WORDS.length)] : null;
      seeded.push({
        id: nextId.current++,
        text: isBonus ? bonusObj.text : STRESS_WORDS[Math.floor(Math.random() * STRESS_WORDS.length)],
        pts: isBonus ? bonusObj.pts : 15,
        isBonus,
        color: isBonus ? bonusObj.color : 'from-indigo-500/90 to-purple-600/90',
        x: 12 + (i % 4) * 23 + (Math.random() * 6 - 3),
        y: 15 + Math.floor(i / 4) * 38 + Math.random() * 15,
        size: isBonus ? 78 : 84,
        speed: 0.25 + Math.random() * 0.35
      });
    }
    setBubbles(seeded);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('gameover');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const loop = setInterval(() => {
      setBubbles(prev => {
        return prev
          .map(b => {
            const nextY = b.y - b.speed;
            if (nextY < -15) {
              const isBonus = Math.random() < 0.25;
              const bonusObj = isBonus ? BONUS_WORDS[Math.floor(Math.random() * BONUS_WORDS.length)] : null;
              return {
                ...b,
                text: isBonus ? bonusObj.text : STRESS_WORDS[Math.floor(Math.random() * STRESS_WORDS.length)],
                pts: isBonus ? bonusObj.pts : 15,
                isBonus,
                color: isBonus ? bonusObj.color : 'from-indigo-500/90 to-purple-600/90',
                x: 10 + Math.random() * 78,
                y: 105,
                speed: 0.25 + Math.random() * 0.35
              };
            }
            return { ...b, y: nextY };
          });
      });
    }, 30);
    return () => clearInterval(loop);
  }, [gameState]);

  useEffect(() => {
    if (popEffects.length === 0) return;
    const cleanup = setTimeout(() => {
      setPopEffects(prev => prev.slice(1));
    }, 700);
    return () => clearTimeout(cleanup);
  }, [popEffects]);

  const handlePop = (bubble, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (soundEnabled && soundEngine.playPopSound) {
      soundEngine.playPopSound();
    }

    const earned = bubble.pts * combo;
    const newScore = score + earned;
    setScore(newScore);
    setPoppedCount(p => p + 1);
    if (onScoreUpdate) onScoreUpdate(newScore);

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('mindspring_bubble_high', newScore.toString());
    }

    const newEffect = {
      id: Date.now() + Math.random(),
      x: bubble.x,
      y: bubble.y,
      text: `+${earned}`,
      combo: combo > 1 ? `${combo}x` : null,
      isBonus: bubble.isBonus
    };
    setPopEffects(prev => [...prev.slice(-4), newEffect]);

    setCombo(c => Math.min(c + 1, 5));
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(1), 2000);

    if (bubble.isBonus) {
      try {
        confetti({
          particleCount: 18,
          spread: 40,
          origin: {
            x: bubble.x / 100,
            y: Math.max(0.1, Math.min(0.9, bubble.y / 100))
          }
        });
      } catch (err) {}
    }

    setBubbles(prev => {
      const filtered = prev.filter(b => b.id !== bubble.id);
      const isBonus = Math.random() < 0.28;
      const bonusObj = isBonus ? BONUS_WORDS[Math.floor(Math.random() * BONUS_WORDS.length)] : null;
      const respawn = {
        id: nextId.current++,
        text: isBonus ? bonusObj.text : STRESS_WORDS[Math.floor(Math.random() * STRESS_WORDS.length)],
        pts: isBonus ? bonusObj.pts : 15,
        isBonus,
        color: isBonus ? bonusObj.color : 'from-indigo-500/90 to-purple-600/90',
        x: 10 + Math.random() * 78,
        y: 102,
        size: isBonus ? 78 : 84,
        speed: 0.25 + Math.random() * 0.35
      };
      return [...filtered, respawn];
    });
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-purple-500/20">
          🫧
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-heading font-extrabold text-slate-800 dark:text-white">
            Stress Bubble Pop
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Exam anxiety and negative thoughts rise like bubbles. Tap or click them to pop the pressure away and build your serene calm combo!
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center space-x-2 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-bold text-slate-500 px-2 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Duration:</span>
          </span>
          {[30, 45, 60].map(s => (
            <button
              key={s}
              onClick={() => setDuration(s)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                duration === s
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {s}s Session
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          <Trophy className="w-3.5 h-3.5" />
          <span>Your Best Score: {highScore} Points</span>
        </div>

        <button
          onClick={handleStartGame}
          className="flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-purple-500/30 transform hover:scale-105 active:scale-95 transition-all ring-4 ring-purple-400/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Popping Worries</span>
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <GameResultCard
        gameName="Stress Bubble Pop"
        score={score}
        stats={[
          { label: 'Worries Popped', value: `${poppedCount} Worries` },
          { label: 'Time Elapsed', value: `${duration}s` },
          { label: 'Best Combo', value: `${combo}x Streak` }
        ]}
        onPlayAgain={handleStartGame}
        onSwitchGame={onSwitchGame}
        onComplete={onComplete}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 text-white font-mono font-extrabold px-3 py-1 rounded-xl shadow-sm text-sm">
            Score: {score}
          </div>
          {combo > 1 && (
            <div className="flex items-center space-x-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg animate-bounce">
              <Flame className="w-3.5 h-3.5" />
              <span>{combo}x Combo!</span>
            </div>
          )}
          <span className="text-slate-500 dark:text-slate-400 font-semibold">
            Popped: {poppedCount}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`font-mono font-extrabold px-3 py-1 rounded-xl text-xs flex items-center space-x-1 ${
            timeLeft <= 10 
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 animate-pulse' 
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Time Left: {timeLeft}s</span>
          </div>

          <button
            onClick={() => setGameState('idle')}
            className="text-slate-400 hover:text-slate-700 p-1"
            title="End Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[420px] bg-gradient-to-b from-sky-50/70 via-indigo-50/40 to-teal-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-purple-200 dark:border-slate-800 overflow-hidden my-3 shadow-inner select-none touch-none">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-500 pointer-events-none border">
          🫧 Tap or click bubbles to pop them before they float away!
        </div>

        {bubbles.map(b => (
          <div
            key={b.id}
            onPointerDown={(e) => handlePop(b, e)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              transform: 'translate(-50%, -50%)'
            }}
            className={`absolute rounded-full bg-gradient-to-tr ${b.color} text-white shadow-xl backdrop-blur-sm border-2 border-white/70 dark:border-white/40 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-transform duration-75 active:scale-90 hover:scale-110`}
          >
            <span className="text-[10px] font-bold leading-tight drop-shadow-sm line-clamp-2 pointer-events-none">
              {b.text}
            </span>
            <span className="text-[9px] opacity-90 mt-0.5 font-mono font-bold pointer-events-none">
              +{b.pts}
            </span>
            <div className="absolute top-1.5 left-2 w-3.5 h-2 bg-white/50 rounded-full rotate-[-30deg] pointer-events-none" />
          </div>
        ))}

        {popEffects.map(effect => (
          <div
            key={effect.id}
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute pointer-events-none flex flex-col items-center animate-fade-in font-extrabold z-20"
          >
            <span className={`text-base ${effect.isBonus ? 'text-amber-400 drop-shadow' : 'text-emerald-500'} scale-125`}>
              {effect.text}
            </span>
            {effect.combo && (
              <span className="text-[10px] text-amber-500 uppercase tracking-widest bg-black/40 px-1.5 py-0.5 rounded-md">
                {effect.combo} Combo
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. COSMIC ALIEN RUNNER (Muffins/Donuts + Tasty Laugh + Fart Boost Flying!)
// ==========================================
function CosmicAlienRunner({ soundEnabled, onScoreUpdate, onSwitchGame, onComplete }) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [duration, setDuration] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [leapsCount, setLeapsCount] = useState(0);
  const [treatsCount, setTreatsCount] = useState(0);
  const [isFartBoosting, setIsFartBoosting] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_alien_high') || '0', 10);
  });

  // Mobile detection and fullscreen mode for mobile
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Resize listener to track mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Exit fullscreen helper
  const handleExitFullscreen = () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
  };

  // Exit fullscreen automatically when session ends or resets
  useEffect(() => {
    if (gameState !== 'playing') {
      handleExitFullscreen();
    }
  }, [gameState]);

  useEffect(() => {
    return () => {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (e) {}
    };
  }, []);

  const canvasRef = useRef(null);

  // Fast mutable ref for 60fps rendering without React re-render lag
  const gRef = useRef({
    alienY: 0,
    targetY: 175,
    velocityY: 0,
    isJumping: false,
    isCrying: false,
    cryingTimer: 0,
    // Muffins / Donuts claim & Fart Boost
    treatsCount: 0,
    isFartBoosting: false,
    fartBoostTimer: 0,
    tastySpeechTimer: 0,
    fartPuffs: [], // Animated gas clouds
    treats: [], // Floating donuts & muffins
    obstacles: [],
    stars: [],
    frame: 0,
    groundY: 175,
    nextObstacleTimer: 50,
    nextTreatTimer: 65,
    score: 0,
    leaps: 0,
    soundEnabled: true,
    speed: 4.8
  });

  gRef.current.soundEnabled = soundEnabled;

  const handleStartGame = () => {
    setScore(0);
    setLeapsCount(0);
    setTreatsCount(0);
    setIsFartBoosting(false);
    setTimeLeft(duration);

    // For mobile version: automatically shift to fullscreen for just the game
    if (isMobile) {
      setIsFullscreen(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    }

    const stars = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 140,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    gRef.current = {
      alienY: 175,
      targetY: 175,
      velocityY: 0,
      isJumping: false,
      isCrying: false,
      cryingTimer: 0,
      treatsCount: 0,
      isFartBoosting: false,
      fartBoostTimer: 0,
      tastySpeechTimer: 0,
      fartPuffs: [],
      treats: [],
      obstacles: [],
      stars,
      frame: 0,
      groundY: 175,
      nextObstacleTimer: 50,
      nextTreatTimer: 45,
      score: 0,
      leaps: 0,
      soundEnabled,
      speed: 4.8
    };

    setGameState('playing');
  };

  // Jump Action
  const triggerJump = () => {
    const g = gRef.current;
    if (gameState !== 'playing' || g.isJumping || g.isCrying || g.isFartBoosting) return;
    g.isJumping = true;
    g.velocityY = -12.5;
    if (g.soundEnabled && soundEngine.playJumpSound) {
      soundEngine.playJumpSound();
    }
  };

  // Spacebar / ArrowUp listener
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Session timer (KEEPS RUNNING WITHOUT RESETTING WHEN HIT!)
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('gameover');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // 60FPS Game Loop via requestAnimationFrame
  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    const loop = () => {
      const g = gRef.current;
      g.frame++;
      const W = canvas.width;
      const H = canvas.height;
      g.groundY = H - 45;

      // 1. CLEAR & BACKGROUND
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.7, '#0f172a');
      grad.addColorStop(1, g.isFartBoosting ? '#14532d' : '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Starfield
      g.stars.forEach(st => {
        if (!g.isCrying) {
          st.x -= g.isFartBoosting ? 1.4 : 0.6;
          if (st.x < 0) st.x = W + Math.random() * 20;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha})`;
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // Neon horizon line
      ctx.strokeStyle = g.isFartBoosting ? '#a3e635' : '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, g.groundY);
      ctx.lineTo(W, g.groundY);
      ctx.stroke();

      // Terrain scrolling dashes
      ctx.strokeStyle = g.isFartBoosting ? '#65a30d' : '#059669';
      ctx.lineWidth = 2;
      const speedMult = g.isFartBoosting ? 1.5 : 1.0;
      const dashOffset = (g.frame * g.speed * speedMult) % 36;
      for (let x = -dashOffset; x < W; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, g.groundY + 8);
        ctx.lineTo(x + 18, g.groundY + 8);
        ctx.stroke();
      }

      // 2. FART BOOST & FLYING PHYSICS
      if (g.isFartBoosting) {
        g.fartBoostTimer--;
        // Alien flies smoothly high in the sky (soaring at groundY - 75)
        const targetFlyY = g.groundY - 78 + Math.sin(g.frame * 0.18) * 8;
        g.alienY += (targetFlyY - g.alienY) * 0.2;
        g.isJumping = false;
        g.velocityY = 0;

        // Spawn puffy green/yellow fart clouds from behind the alien!
        if (g.frame % 3 === 0) {
          g.fartPuffs.push({
            x: 65,
            y: g.alienY - 10 + (Math.random() * 10 - 5),
            size: 10 + Math.random() * 8,
            alpha: 0.85,
            vx: -(4.5 + Math.random() * 2),
            vy: (Math.random() - 0.5) * 1.5,
            color: Math.random() < 0.6 ? '#84cc16' : '#eab308' // Lime or Yellow-green gas!
          });
        }

        // Fart boost expiration
        if (g.fartBoostTimer <= 0) {
          g.isFartBoosting = false;
          setIsFartBoosting(false);
        }
      } else if (g.isJumping) {
        // Normal Jump physics
        g.velocityY += 0.62; // gravity
        g.alienY += g.velocityY;
        if (g.alienY >= g.groundY) {
          g.alienY = g.groundY;
          g.velocityY = 0;
          g.isJumping = false;
        }
      } else {
        g.alienY = g.groundY;
      }

      // Update & Draw Fart Propulsion Gas Clouds
      g.fartPuffs.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.45;
        p.alpha -= 0.025;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
      g.fartPuffs = g.fartPuffs.filter(p => p.alpha > 0);

      // Handle Crying Timer
      if (g.isCrying) {
        g.cryingTimer--;
        if (g.cryingTimer <= 0) {
          g.isCrying = false;
        }
      }

      // Handle "Tasty! 😋" Speech Bubble Timer
      if (g.tastySpeechTimer > 0) {
        g.tastySpeechTimer--;
      }

      // 3. SPAWN & MOVE OBSTACLES
      if (!g.isCrying) {
        g.nextObstacleTimer--;
        if (g.nextObstacleTimer <= 0) {
          const type = Math.random() < 0.5 ? 'crystal' : (Math.random() < 0.5 ? 'meteor' : 'barrier');
          const width = type === 'meteor' ? 32 : (type === 'crystal' ? 24 : 26);
          const height = type === 'meteor' ? 28 : (type === 'crystal' ? 38 : 42);

          g.obstacles.push({
            x: W + 20,
            width,
            height,
            type,
            passed: false
          });

          g.nextObstacleTimer = 65 + Math.floor(Math.random() * 45);
        }

        const currentSpeed = g.isFartBoosting ? g.speed * 1.5 : g.speed;
        g.obstacles.forEach(obs => {
          obs.x -= currentSpeed;
        });
        g.obstacles = g.obstacles.filter(obs => obs.x + obs.width > -40);
      }

      // 4. SPAWN & MOVE MUFFINS / DONUTS AT HEIGHT
      if (!g.isCrying) {
        g.nextTreatTimer--;
        if (g.nextTreatTimer <= 0) {
          const treatType = Math.random() < 0.5 ? 'donut' : 'muffin';
          // Elevated at jump height (so alien must jump to claim it!)
          const treatY = g.groundY - 55 - Math.random() * 30;

          g.treats.push({
            x: W + 25,
            y: treatY,
            type: treatType,
            width: 26,
            height: 26,
            collected: false
          });

          g.nextTreatTimer = 55 + Math.floor(Math.random() * 50);
        }

        const currentSpeed = g.isFartBoosting ? g.speed * 1.5 : g.speed;
        g.treats.forEach(t => {
          t.x -= currentSpeed;
        });
        g.treats = g.treats.filter(t => t.x > -40);
      }

      const alienX = 85;
      const alienW = 34;
      const alienH = 40;
      const alienTop = g.alienY - alienH;

      // 5. DRAW & CHECK MUFFIN/DONUT CLAIMS
      g.treats.forEach(treat => {
        if (treat.collected) return;
        const tx = treat.x;
        const ty = treat.y;

        // Draw Treat
        ctx.save();
        ctx.translate(tx, ty);

        if (treat.type === 'donut') {
          // Glazed Strawberry Donut 🍩
          ctx.fillStyle = '#f59e0b'; // golden pastry
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();

          // Pink Frosting
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
          ctx.fill();

          // Donut Hole
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();

          // Sprinkles
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(-5, -6, 2.5, 1.5);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(3, -5, 1.5, 2.5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-2, 4, 2.5, 1.5);
        } else {
          // Blueberry Muffin 🧁
          // Muffin wrapper base
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(-9, 0);
          ctx.lineTo(-6, 11);
          ctx.lineTo(6, 11);
          ctx.lineTo(9, 0);
          ctx.closePath();
          ctx.fill();

          // Fluffy chocolate/blueberry muffin top
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(0, -1, 11, Math.PI, 0);
          ctx.fill();

          // Chocolate chips
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(-4, -4, 2, 0, Math.PI * 2);
          ctx.arc(3, -5, 2, 0, Math.PI * 2);
          ctx.arc(0, -1, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Check if claimed by alien
        const dist = Math.hypot(alienX - tx, (g.alienY - 20) - ty);
        if (dist < 26) {
          treat.collected = true;
          g.score += 50;
          g.treatsCount += 1;
          g.tastySpeechTimer = 48; // Show "Hehe, tasty! 😋"

          setScore(g.score);
          setTreatsCount(g.treatsCount);
          if (onScoreUpdate) onScoreUpdate(g.score);

          // Munch sound
          if (g.soundEnabled && soundEngine.playNomSound) {
            soundEngine.playNomSound();
          }

          // Alien voice says "Hehe, tasty!"
          if (g.soundEnabled && 'speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance('Hehe, tasty!');
              u.pitch = 1.7; // cute high alien pitch
              u.rate = 1.15;
              window.speechSynthesis.speak(u);
            } catch (err) {}
          }

          // 5-Treat Fart Boost Activation!
          if (g.treatsCount >= 5) {
            g.treatsCount = 0;
            setTreatsCount(0);
            g.isFartBoosting = true;
            g.fartBoostTimer = 180; // 3 seconds at 60fps!
            setIsFartBoosting(true);

            if (g.soundEnabled && soundEngine.playFartSound) {
              soundEngine.playFartSound();
            }

            try {
              confetti({ particleCount: 35, spread: 55, origin: { x: alienX / W, y: g.alienY / H } });
            } catch (e) {}
          }
        }
      });

      // 6. DRAW OBSTACLES & CHECK COLLISION
      g.obstacles.forEach(obs => {
        const obsX = obs.x;
        const obsY = g.groundY - obs.height;

        if (obs.type === 'crystal') {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.moveTo(obsX + obs.width / 2, obsY);
          ctx.lineTo(obsX + obs.width, obsY + obs.height);
          ctx.lineTo(obsX, obsY + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obs.type === 'meteor') {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(obsX + obs.width / 2, obsY + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fdba74';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(obsX + 4, obsY + 6, obs.width - 8, obs.height - 6);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(obsX + obs.width / 2, obsY + 6, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Leaps cleared
        if (!obs.passed && obsX + obs.width < alienX - 10) {
          obs.passed = true;
          g.score += 25;
          g.leaps += 1;
          setScore(g.score);
          setLeapsCount(g.leaps);
          if (onScoreUpdate) onScoreUpdate(g.score);

          if (g.score > highScore) {
            setHighScore(g.score);
            localStorage.setItem('mindspring_alien_high', g.score.toString());
          }
        }

        // Collision Check (Completely immune when Fart Boosting!)
        if (!g.isCrying && !g.isFartBoosting) {
          const hitX = alienX + 16 > obsX + 4 && alienX - 16 < obsX + obs.width - 4;
          const hitY = g.alienY > obsY + 4 && alienTop < obsY + obs.height;

          if (hitX && hitY) {
            // HIT! Alien cries for ~900ms, timer keeps running!
            g.isCrying = true;
            g.cryingTimer = 55;
            if (g.soundEnabled && soundEngine.playBonkSound) {
              soundEngine.playBonkSound();
            }
            obs.x = -100;
          }
        }
      });

      // 7. DRAW THE CUTE GREEN ALIEN (Running / Jumping / Crying / Fart-Flying)
      ctx.save();
      ctx.translate(alienX, g.alienY);

      // Body (Green dome)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(0, -18, 16, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Antennae with glowing orb
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -34);
      ctx.lineTo(g.isFartBoosting ? -14 : -10, -44);
      ctx.moveTo(6, -34);
      ctx.lineTo(g.isFartBoosting ? 4 : 10, -44);
      ctx.stroke();

      ctx.fillStyle = g.isFartBoosting ? '#a3e635' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(g.isFartBoosting ? -14 : -10, -44, 4, 0, Math.PI * 2);
      ctx.arc(g.isFartBoosting ? 4 : 10, -44, 4, 0, Math.PI * 2);
      ctx.fill();

      // Face & Eyes
      if (g.isCrying) {
        // CRYING ALIEN
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-6, -20, 4, Math.PI, 0);
        ctx.arc(6, -20, 4, Math.PI, 0);
        ctx.stroke();

        // Teardrop fountains!
        ctx.fillStyle = '#38bdf8';
        const tearDropY = (g.frame * 2.5) % 18;
        ctx.beginPath();
        ctx.arc(-8, -14 + tearDropY, 4, 0, Math.PI * 2);
        ctx.arc(8, -14 + tearDropY, 4, 0, Math.PI * 2);
        ctx.arc(-14, -10 + tearDropY * 0.8, 3, 0, Math.PI * 2);
        ctx.arc(14, -10 + tearDropY * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();

        // Trembling sad mouth
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(0, -9, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('OUCH! 😭', 0, -52);
      } else if (g.isFartBoosting) {
        // FART FLYING ALIEN: Cheeky mischievous grin!
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-6, -20, 4, Math.PI, 0);
        ctx.arc(6, -20, 4, Math.PI, 0);
        ctx.stroke();

        // Mischievous wide open grin!
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, -11, 5, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -11, 6, 2); // Tiny white teeth

        // Super flying arms!
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, -18);
        ctx.lineTo(22, -18);
        ctx.stroke();
      } else if (g.isJumping) {
        // JUMPING ALIEN
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-6, -20, 4, Math.PI, 0);
        ctx.arc(6, -20, 4, Math.PI, 0);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, -11, 4, 0, Math.PI);
        ctx.fill();
      } else {
        // NORMAL RUNNING ALIEN
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-6, -20, 4.5, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(6, -20, 4.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5, -22, 1.8, 0, Math.PI * 2);
        ctx.arc(7, -22, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, -12, 3.5, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // Alien Feet
      if (!g.isJumping && !g.isCrying && !g.isFartBoosting) {
        const legSwing = Math.sin(g.frame * 0.35) * 6;
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-8 + legSwing, -3, 6, 5);
        ctx.fillRect(2 - legSwing, -3, 6, 5);
      } else {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-7, -4, 5, 4);
        ctx.fillRect(2, -4, 5, 4);
      }

      // "Hehe, tasty! 😋" Speech Bubble when donut claimed
      if (g.tastySpeechTimer > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-42, -62, 84, 22, [8]);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hehe, tasty! 😋', 0, -47);
      }

      ctx.restore();

      // 8. FART BOOST OVERLAY BANNER ON CANVAS
      if (g.isFartBoosting) {
        const boostSec = (g.fartBoostTimer / 60).toFixed(1);
        ctx.fillStyle = 'rgba(132, 204, 22, 0.9)';
        ctx.beginPath();
        ctx.roundRect(W / 2 - 130, 16, 260, 28, [14]);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`💨 FART BOOST ACTIVE: ${boostSec}s 💨`, W / 2, 35);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore, onScoreUpdate]);

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 text-white flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
          👽
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-heading font-extrabold text-slate-800 dark:text-white">
            Cosmic Alien Runner
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Jump to leap over obstacles, grab elevated donuts & muffins (alien laughs & says <em>"Tasty!"</em>), and collect 5 treats to unleash a hilarious <strong>3-second Fart Boost</strong> flight!
          </p>
        </div>

        {/* Feature summary pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-xl font-bold border border-emerald-200 dark:border-emerald-800">
            🍩 Claim 5 Treats = 3s Fart Boost!
          </span>
          <span className="bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 px-3 py-1 rounded-xl font-bold border border-cyan-200 dark:border-cyan-800">
            😭 Obstacle Hit = Crying Alien (Timer Never Resets)
          </span>
        </div>

        {/* Duration selector */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center space-x-2 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-bold text-slate-500 px-2 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Duration:</span>
          </span>
          {[30, 45, 60].map(s => (
            <button
              key={s}
              onClick={() => setDuration(s)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                duration === s
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {s}s Session
            </button>
          ))}
        </div>

        {/* High score badge */}
        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          <Trophy className="w-3.5 h-3.5" />
          <span>Your Best Score: {highScore} Points</span>
        </div>

        {/* Mobile notice */}
        {isMobile && (
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mobile Ready: Automatically shifts to Fullscreen on Start</span>
          </div>
        )}

        <button
          onClick={handleStartGame}
          className="flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/30 transform hover:scale-105 active:scale-95 transition-all ring-4 ring-emerald-400/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Alien Runner</span>
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <GameResultCard
        gameName="Cosmic Alien Runner"
        score={score}
        stats={[
          { label: 'Obstacles Cleared', value: `${leapsCount} Leaps` },
          { label: 'Time Elapsed', value: `${duration}s` },
          { label: 'Calm Focus Score', value: `${score} pts` }
        ]}
        onPlayAgain={handleStartGame}
        onSwitchGame={onSwitchGame}
        onComplete={onComplete}
        soundEnabled={soundEnabled}
      />
    );
  }

  // =========================================================================
  // MOBILE FULLSCREEN MODE (Activated on Start for Mobile Devices Only)
  // Keeps laptop version 100% untouched while providing an immersive mobile arcade!
  // =========================================================================
  if (isMobile && isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col p-3 pb-5 safe-area-inset select-none touch-none overflow-hidden h-[100dvh]">
        {/* Mobile Top HUD */}
        <div className="flex items-center justify-between gap-2 bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-xs shadow-md">
          <div className="flex items-center space-x-2.5">
            <span className="font-heading font-extrabold text-xs text-slate-200">
              Score: <strong className="text-emerald-400 font-mono text-sm">{score}</strong>
            </span>

            {/* Treat Claim Meter for Fart Boost */}
            <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-lg font-bold text-[11px] border transition ${
              isFartBoosting 
                ? 'bg-lime-500 text-white border-lime-400 animate-pulse shadow-sm shadow-lime-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              <span>🍩</span>
              <span className="font-mono">{treatsCount}/5</span>
              {isFartBoosting && <span className="text-[9px] uppercase tracking-wide">💨 BOOST!</span>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`font-mono font-extrabold px-2.5 py-0.5 rounded-lg text-[11px] flex items-center space-x-1 ${
              timeLeft <= 10 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{timeLeft}s</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExitFullscreen();
                setGameState('idle');
              }}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 active:scale-95 transition text-[11px] font-bold"
              title="Exit Fullscreen Game"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Mobile 60FPS Canvas Viewport - Tap Anywhere to Jump */}
        <div 
          onClick={triggerJump}
          onTouchStart={(e) => {
            e.preventDefault();
            triggerJump();
          }}
          className="relative flex-1 w-full flex items-center justify-center my-2 rounded-2xl border border-emerald-500/30 overflow-hidden bg-slate-900/80 cursor-pointer select-none touch-none shadow-2xl"
        >
          <canvas
            ref={canvasRef}
            width={720}
            height={320}
            className="w-full h-full max-h-[62vh] object-contain block"
          />

          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-emerald-300 pointer-events-none border border-emerald-500/30 flex items-center space-x-1.5 shadow-lg whitespace-nowrap">
            <span>👆 Tap anywhere on screen to Jump</span>
          </div>
        </div>

        {/* Large Mobile Touch Jump Button */}
        <div className="w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerJump();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerJump();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 active:from-emerald-600 active:to-cyan-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/30 transition transform active:scale-98 flex items-center justify-center space-x-2 border border-emerald-400/40"
          >
            <Rocket className="w-4 h-4 fill-current" />
            <span>TAP TO JUMP 🚀</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LAPTOP / DESKTOP VERSION (100% UNCHANGED)
  // =========================================================================
  return (
    <div className="flex flex-col h-full select-none">
      {/* Header Bar with Donut/Muffin Counter HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">
            Score: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base">{score}</strong>
          </span>

          {/* Treat Claim Meter for Fart Boost */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl font-bold border transition ${
            isFartBoosting 
              ? 'bg-lime-500 text-white border-lime-400 animate-pulse'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
          }`}>
            <span>🍩 Treats:</span>
            <span className="font-mono text-sm">{treatsCount}/5</span>
            {isFartBoosting && <span className="text-[10px] uppercase tracking-wide">💨 BOOST!</span>}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`font-mono font-extrabold px-3 py-1 rounded-xl text-xs flex items-center space-x-1 ${
            timeLeft <= 10 
              ? 'bg-rose-100 text-rose-600 animate-pulse' 
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Time Left: {timeLeft}s</span>
          </div>

          <button
            onClick={() => setGameState('idle')}
            className="text-slate-400 hover:text-slate-700 p-1"
            title="End Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 60FPS Canvas Arena */}
      <div 
        onClick={triggerJump}
        className="relative flex-1 min-h-[360px] rounded-2xl border border-emerald-500/30 overflow-hidden my-3 cursor-pointer select-none touch-none shadow-inner"
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={320}
          className="w-full h-full block"
        />

        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 pointer-events-none border border-white/20">
          🚀 Press [Spacebar] to Jump, grab elevated Donuts & trigger Fart Boost!
        </div>
      </div>

      {/* Jump Button */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 hidden sm:inline">Jump for elevated muffins/donuts & leap past crystals:</span>
        <button
          onClick={triggerJump}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center space-x-2"
        >
          <Rocket className="w-4 h-4" />
          <span>JUMP [Spacebar] 🚀</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. LOTUS CALM CATCH (60FPS Canvas, Zero Lag, Beautiful Glowing Shapes)
// ==========================================
function LotusCatchGame({ soundEnabled, onScoreUpdate, onSwitchGame, onComplete }) {
  const [gameState, setGameState] = useState('idle');
  const [duration, setDuration] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_lotus_high') || '0', 10);
  });

  const canvasRef = useRef(null);

  const gRef = useRef({
    basketX: 360,
    targetBasketX: 360,
    items: [],
    popups: [],
    score: 0,
    caught: 0,
    frame: 0,
    nextSpawnTimer: 35,
    soundEnabled: true
  });

  gRef.current.soundEnabled = soundEnabled;

  const handleStartGame = () => {
    setScore(0);
    setCaughtCount(0);
    setTimeLeft(duration);

    gRef.current = {
      basketX: 360,
      targetBasketX: 360,
      items: [],
      popups: [],
      score: 0,
      caught: 0,
      frame: 0,
      nextSpawnTimer: 25,
      soundEnabled
    };

    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('gameover');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handlePointer = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;
    gRef.current.targetBasketX = Math.max(50, Math.min(canvas.width - 50, clientX));
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyDown = (e) => {
      const g = gRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        g.targetBasketX = Math.max(50, g.targetBasketX - 35);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        const canvas = canvasRef.current;
        const maxW = canvas ? canvas.width - 50 : 670;
        g.targetBasketX = Math.min(maxW, g.targetBasketX + 35);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    const loop = () => {
      const g = gRef.current;
      g.frame++;
      const W = canvas.width;
      const H = canvas.height;

      g.basketX += (g.targetBasketX - g.basketX) * 0.22;

      // 1. BACKGROUND
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#064e3b');
      bgGrad.addColorStop(1, '#022c22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Water ripples
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.12)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const yLine = 120 + i * 65 + Math.sin(g.frame * 0.03 + i) * 8;
        ctx.beginPath();
        ctx.moveTo(0, yLine);
        ctx.bezierCurveTo(W * 0.33, yLine + 12, W * 0.66, yLine - 12, W, yLine);
        ctx.stroke();
      }

      // 2. SPAWN BEAUTIFUL FALLING OBJECTS
      g.nextSpawnTimer--;
      if (g.nextSpawnTimer <= 0) {
        const rand = Math.random();
        let shape = 'star';
        let pts = 30;
        let color = '#fbbf24';
        let isHazard = false;

        if (rand < 0.28) {
          shape = 'dewdrop';
          pts = 15;
          color = '#38bdf8';
        } else if (rand < 0.52) {
          shape = 'sakura';
          pts = 25;
          color = '#f472b6';
        } else if (rand < 0.74) {
          shape = 'crystal';
          pts = 40;
          color = '#34d399';
        } else if (rand < 0.88) {
          shape = 'star';
          pts = 35;
          color = '#fbbf24';
        } else {
          shape = 'storm';
          pts = -15;
          color = '#94a3b8';
          isHazard = true;
        }

        g.items.push({
          x: 40 + Math.random() * (W - 80),
          y: -20,
          shape,
          pts,
          color,
          isHazard,
          rot: Math.random() * Math.PI * 2,
          speed: 1.8 + Math.random() * 1.4
        });

        g.nextSpawnTimer = 34 + Math.floor(Math.random() * 22);
      }

      // 3. DRAW FALLING OBJECTS
      const basketY = H - 50;
      const basketW = 92;

      g.items.forEach(item => {
        item.y += item.speed;
        item.rot += 0.03;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rot);

        if (item.shape === 'star') {
          ctx.fillStyle = '#fde047';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            ctx.lineTo(Math.cos((18 + p * 72) * Math.PI / 180) * 14, -Math.sin((18 + p * 72) * Math.PI / 180) * 14);
            ctx.lineTo(Math.cos((54 + p * 72) * Math.PI / 180) * 6, -Math.sin((54 + p * 72) * Math.PI / 180) * 6);
          }
          ctx.closePath();
          ctx.fill();
        } else if (item.shape === 'dewdrop') {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 4, 10, 0, Math.PI);
          ctx.lineTo(0, -12);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-3, 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.shape === 'sakura') {
          ctx.fillStyle = '#f472b6';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 8;
          for (let petal = 0; petal < 5; petal++) {
            ctx.beginPath();
            ctx.ellipse(0, 7, 5, 8, (petal * 72) * Math.PI / 180, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.shape === 'crystal') {
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(0, -12);
          ctx.lineTo(10, 0);
          ctx.lineTo(0, 12);
          ctx.lineTo(-10, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#a7f3d0';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#64748b';
          ctx.shadowColor = '#334155';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(-7, 0, 8, 0, Math.PI * 2);
          ctx.arc(7, 0, 8, 0, Math.PI * 2);
          ctx.arc(0, -6, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.moveTo(-2, -3);
          ctx.lineTo(3, 3);
          ctx.lineTo(0, 4);
          ctx.lineTo(2, 9);
          ctx.lineTo(-3, 2);
          ctx.lineTo(0, 1);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();

        // Catch check
        if (item.y >= basketY - 14 && item.y <= basketY + 16 && Math.abs(item.x - g.basketX) < basketW / 2 + 8) {
          if (item.isHazard) {
            g.score = Math.max(0, g.score - 15);
            g.popups.push({ x: item.x, y: basketY - 10, text: '-15', color: '#f87171', alpha: 1 });
          } else {
            g.score += item.pts;
            g.caught += 1;
            if (g.soundEnabled && soundEngine.playCatchSound) {
              soundEngine.playCatchSound();
            }
            g.popups.push({ x: item.x, y: basketY - 10, text: `+${item.pts}`, color: '#34d399', alpha: 1 });
          }

          setScore(g.score);
          setCaughtCount(g.caught);
          if (onScoreUpdate) onScoreUpdate(g.score);

          if (g.score > highScore) {
            setHighScore(g.score);
            localStorage.setItem('mindspring_lotus_high', g.score.toString());
          }

          item.y = 999;
        }
      });

      g.items = g.items.filter(item => item.y < H + 30);

      // 4. DRAW LOTUS BASKET
      ctx.save();
      ctx.translate(g.basketX, basketY);

      // Water ripple
      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 14, 52, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lily pad
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.ellipse(0, 10, 48, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lotus bowl
      const lotusGrad = ctx.createLinearGradient(-45, 0, 45, 0);
      lotusGrad.addColorStop(0, '#f59e0b');
      lotusGrad.addColorStop(0.5, '#fb7185');
      lotusGrad.addColorStop(1, '#14b8a6');
      ctx.fillStyle = lotusGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0.15, Math.PI - 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸 LOTUS', 0, 12);

      ctx.restore();

      // 5. DRAW POPUPS
      g.popups.forEach(pop => {
        pop.y -= 1.2;
        pop.alpha -= 0.035;
        ctx.fillStyle = pop.color;
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.globalAlpha = 1.0;
      });
      g.popups = g.popups.filter(pop => pop.alpha > 0);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore, onScoreUpdate]);

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-pink-500/20">
          🌸
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-heading font-extrabold text-slate-800 dark:text-white">
            Lotus Calm Catch
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Glide your golden lotus basket across the tranquil stream at silky-smooth 60 FPS! Catch glowing stars, dewdrops, and pink lotus petals while dodging stormy lightning clouds.
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center space-x-2 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-bold text-slate-500 px-2 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Duration:</span>
          </span>
          {[30, 45, 60].map(s => (
            <button
              key={s}
              onClick={() => setDuration(s)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                duration === s
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {s}s Session
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          <Trophy className="w-3.5 h-3.5" />
          <span>Your Best Score: {highScore} Points</span>
        </div>

        <button
          onClick={handleStartGame}
          className="flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 hover:from-rose-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-rose-500/30 transform hover:scale-105 active:scale-95 transition-all ring-4 ring-rose-400/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Catching Calm</span>
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <GameResultCard
        gameName="Lotus Calm Catch"
        score={score}
        stats={[
          { label: 'Serenity Objects', value: `${caughtCount} Caught` },
          { label: 'Time Elapsed', value: `${duration}s` },
          { label: 'Calm Focus Score', value: `${score} pts` }
        ]}
        onPlayAgain={handleStartGame}
        onSwitchGame={onSwitchGame}
        onComplete={onComplete}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-mono bg-rose-600 text-white font-bold px-3 py-1 rounded-xl">
            Score: {score}
          </span>
          <span className="text-slate-500 font-semibold">
            Caught: {caughtCount}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`font-mono font-extrabold px-3 py-1 rounded-xl text-xs flex items-center space-x-1 ${
            timeLeft <= 10 
              ? 'bg-rose-100 text-rose-600 animate-pulse' 
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Time Left: {timeLeft}s</span>
          </div>

          <button
            onClick={() => setGameState('idle')}
            className="text-slate-400 hover:text-slate-700 p-1"
            title="End Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        className="relative flex-1 min-h-[380px] rounded-2xl border border-teal-500/30 overflow-hidden my-3 cursor-ew-resize select-none touch-none shadow-inner"
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={380}
          className="w-full h-full block"
        />

        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 pointer-events-none border border-white/20">
          🌸 Glide your mouse, finger, or [← / →] arrows to catch serenity objects!
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 hidden sm:inline">Dodge the stormy lightning clouds!</span>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <button
            onPointerDown={() => {
              gRef.current.targetBasketX = Math.max(50, gRef.current.targetBasketX - 55);
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:bg-slate-200 font-bold flex items-center justify-center space-x-1 shadow-sm transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Move Left</span>
          </button>
          <button
            onPointerDown={() => {
              const canvas = canvasRef.current;
              const maxW = canvas ? canvas.width - 50 : 670;
              gRef.current.targetBasketX = Math.min(maxW, gRef.current.targetBasketX + 55);
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:bg-slate-200 font-bold flex items-center justify-center space-x-1 shadow-sm transition active:scale-95"
          >
            <span>Move Right</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN MINI-GAME STUDIO COMPONENT
// ==========================================
export default function MiniGameStudio({ onComplete }) {
  const [selectedGame, setSelectedGame] = useState('bubbles'); // 'bubbles' | 'alien' | 'lotus'
  const [soundEnabled, setSoundEnabled] = useState(true);

  const games = [
    {
      id: 'bubbles',
      name: 'Stress Bubble Pop',
      icon: '🫧',
      desc: 'Pop away exam worries & build combo streaks',
      badge: 'Popular Stress Buster'
    },
    {
      id: 'alien',
      name: 'Cosmic Alien Runner',
      icon: '👽',
      desc: 'Claim donuts & trigger 3s Fart Boost flight!',
      badge: 'Muffins & Fart Boost 💨'
    },
    {
      id: 'lotus',
      name: 'Lotus Calm Catch',
      icon: '🌸',
      desc: 'Glide to catch glowing stars & dewdrops at 60 FPS',
      badge: '60 FPS Serenity'
    }
  ];

  return (
    <div className="flex flex-col space-y-4 animate-fade-in pb-4">
      {/* Mini-Game Hub Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-800 text-white p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm inline-flex items-center space-x-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>MindSpring Mindful Arcade</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Stress-Buster Mini-Games
            </h2>
            <p className="text-xs text-purple-100">
              Need a quick study reset? Choose a game below, click <strong>Start Game</strong>, and play for a focused, timed session. When the timer ends, celebrate with your performance stats and an inspiring motivational quote!
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition backdrop-blur-sm ${
                soundEnabled 
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/40' 
                  : 'bg-black/30 text-white/60'
              }`}
              title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>

            {onComplete && (
              <button
                onClick={() => onComplete(5)}
                className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Break</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Game Mode Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {games.map(g => {
          const isActive = selectedGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex items-start space-x-3 ${
                isActive
                  ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-400/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                {g.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{g.name}</h4>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    {g.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {g.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Viewport Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[460px]">
        {selectedGame === 'bubbles' && (
          <BubblePopGame 
            soundEnabled={soundEnabled} 
            onSwitchGame={() => setSelectedGame('alien')}
            onComplete={onComplete}
          />
        )}
        {selectedGame === 'alien' && (
          <CosmicAlienRunner 
            soundEnabled={soundEnabled} 
            onSwitchGame={() => setSelectedGame('lotus')}
            onComplete={onComplete}
          />
        )}
        {selectedGame === 'lotus' && (
          <LotusCatchGame 
            soundEnabled={soundEnabled} 
            onSwitchGame={() => setSelectedGame('bubbles')}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}
