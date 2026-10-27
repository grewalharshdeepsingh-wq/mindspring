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
  Rocket
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
      {/* Trophy & Congrats Header */}
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
// 2. COSMIC ALIEN RUNNER (Chrome Dino Style, Crying Alien on Hit)
// ==========================================
function CosmicAlienRunner({ soundEnabled, onScoreUpdate, onSwitchGame, onComplete }) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [duration, setDuration] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [leapsCount, setLeapsCount] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_alien_high') || '0', 10);
  });

  const canvasRef = useRef(null);

  // Mutable game physics & state ref (avoids React re-render lag)
  const gRef = useRef({
    alienY: 0,
    velocityY: 0,
    isJumping: false,
    isCrying: false,
    cryingTimer: 0,
    frame: 0,
    groundY: 175,
    obstacles: [],
    stars: [],
    nextObstacleTimer: 60,
    score: 0,
    leaps: 0,
    soundEnabled: true,
    speed: 4.8
  });

  gRef.current.soundEnabled = soundEnabled;

  const handleStartGame = () => {
    setScore(0);
    setLeapsCount(0);
    setTimeLeft(duration);

    // Initialise stars for background
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
      velocityY: 0,
      isJumping: false,
      isCrying: false,
      cryingTimer: 0,
      frame: 0,
      groundY: 175,
      obstacles: [],
      stars,
      nextObstacleTimer: 50,
      score: 0,
      leaps: 0,
      soundEnabled,
      speed: 4.8
    };

    setGameState('playing');
  };

  // Jump trigger (Spacebar, Click, or Touch)
  const triggerJump = () => {
    const g = gRef.current;
    if (gameState !== 'playing' || g.isJumping || g.isCrying) return;
    g.isJumping = true;
    g.velocityY = -12.4;
    if (g.soundEnabled && soundEngine.playJumpSound) {
      soundEngine.playJumpSound();
    }
  };

  // Global keydown listener for Spacebar / ArrowUp
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

  // Session timer: KEEPS RUNNING WITHOUT RESETTING EVEN WHEN ALIEN HITS OBSTACLE!
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
      ctx.fillStyle = '#0f172a'; // dark slate cosmic
      ctx.fillRect(0, 0, W, H);

      // Distant nebulas
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#1e1b4b'); // indigo deep
      grad.addColorStop(0.7, '#0f172a');
      grad.addColorStop(1, '#022c22'); // subtle teal ground aura
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Starfield
      g.stars.forEach(st => {
        if (!g.isCrying) {
          st.x -= 0.6;
          if (st.x < 0) st.x = W + Math.random() * 20;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha})`;
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // Neon horizon ground line
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, g.groundY);
      ctx.lineTo(W, g.groundY);
      ctx.stroke();

      // Scrolling terrain dashes
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      const dashOffset = (g.frame * g.speed) % 36;
      for (let x = -dashOffset; x < W; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, g.groundY + 8);
        ctx.lineTo(x + 18, g.groundY + 8);
        ctx.stroke();
      }

      // 2. ALIEN PHYSICS & JUMPING
      if (g.isJumping) {
        g.velocityY += 0.62; // gravity
        g.alienY += g.velocityY;
        if (g.alienY >= g.groundY) {
          g.alienY = g.groundY;
          g.velocityY = 0;
          g.isJumping = false;
        }
      }

      // Handle Crying Timer (lasts ~900ms = 52 frames)
      if (g.isCrying) {
        g.cryingTimer--;
        if (g.cryingTimer <= 0) {
          g.isCrying = false;
        }
      }

      // 3. OBSTACLES SPAWNING & UPDATE
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

          // Next obstacle spawn delay (ensures fair jumpable gaps!)
          g.nextObstacleTimer = 65 + Math.floor(Math.random() * 45);
        }

        // Move obstacles
        g.obstacles.forEach(obs => {
          obs.x -= g.speed;
        });

        // Filter offscreen obstacles
        g.obstacles = g.obstacles.filter(obs => obs.x + obs.width > -40);
      }

      // 4. DRAW OBSTACLES & CHECK HITBOX / LEAPS
      const alienX = 85;
      const alienW = 34;
      const alienH = 40;
      const alienTop = g.alienY - alienH;

      g.obstacles.forEach(obs => {
        const obsX = obs.x;
        const obsY = g.groundY - obs.height;

        // Draw obstacle based on type
        if (obs.type === 'crystal') {
          // Purple space crystal
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
          // Orange spiky space rock
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(obsX + obs.width / 2, obsY + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fdba74';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Neon electric barrier
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(obsX + 4, obsY + 6, obs.width - 8, obs.height - 6);
          // Glowing top orb
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(obsX + obs.width / 2, obsY + 6, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Check if safely cleared/jumped past
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

        // Collision Check (AABB with safe margins)
        if (!g.isCrying) {
          const hitX = alienX + 16 > obsX + 4 && alienX - 16 < obsX + obs.width - 4;
          const hitY = g.alienY > obsY + 4 && alienTop < obsY + obs.height;

          if (hitX && hitY) {
            // HIT! Alien enters crying state
            g.isCrying = true;
            g.cryingTimer = 55; // ~900ms
            if (g.soundEnabled && soundEngine.playBonkSound) {
              soundEngine.playBonkSound();
            }
            // Push obstacle safely behind alien so it doesn't trigger again
            obs.x = -100;
          }
        }
      });

      // 5. DRAW THE CUTE GREEN ALIEN
      ctx.save();
      ctx.translate(alienX, g.alienY);

      // Body (Green dome)
      ctx.fillStyle = '#22c55e'; // Lime green
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
      ctx.lineTo(-10, -44);
      ctx.moveTo(6, -34);
      ctx.lineTo(10, -44);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8'; // Glowing cyan orb
      ctx.beginPath();
      ctx.arc(-10, -44, 4, 0, Math.PI * 2);
      ctx.arc(10, -44, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & Face
      if (g.isCrying) {
        // CRYING ALIEN: Big teardrops streaming & sad mouth
        // Sad eyes
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-6, -20, 4, Math.PI, 0); // upside-down curved eye
        ctx.arc(6, -20, 4, Math.PI, 0);
        ctx.stroke();

        // Big blue anime tears fountains streaming down!
        ctx.fillStyle = '#38bdf8';
        const tearDropY = (g.frame * 2.5) % 18;
        ctx.beginPath();
        ctx.arc(-8, -14 + tearDropY, 4, 0, Math.PI * 2);
        ctx.arc(8, -14 + tearDropY, 4, 0, Math.PI * 2);
        ctx.arc(-14, -10 + tearDropY * 0.8, 3, 0, Math.PI * 2);
        ctx.arc(14, -10 + tearDropY * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();

        // Sad open trembling mouth
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(0, -9, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Floating crying indicator
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('OUCH! 😭', 0, -52);
      } else if (g.isJumping) {
        // JUMPING ALIEN: Joyful happy eyes `^ ^`
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-6, -20, 4, Math.PI, 0);
        ctx.arc(6, -20, 4, Math.PI, 0);
        ctx.stroke();

        // Happy open smile
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, -11, 4, 0, Math.PI);
        ctx.fill();
      } else {
        // RUNNING ALIEN: Normal curious shiny eyes
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-6, -20, 4.5, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(6, -20, 4.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye reflections
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5, -22, 1.8, 0, Math.PI * 2);
        ctx.arc(7, -22, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Cute smile
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, -12, 3.5, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // Little Alien Feet / Stride animation
      if (!g.isJumping && !g.isCrying) {
        const legSwing = Math.sin(g.frame * 0.35) * 6;
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-8 + legSwing, -3, 6, 5);
        ctx.fillRect(2 - legSwing, -3, 6, 5);
      } else {
        // Feet tucked in jump
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-7, -4, 5, 4);
        ctx.fillRect(2, -4, 5, 4);
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore, onScoreUpdate]);

  // 1. IDLE SCREEN
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
            Help your cute green alien leap over cosmic crystals and obstacles (Chrome Dino style)! If you bump into an obstacle, the alien will cry for a quick moment and keep running—<strong>the timer stays running without resetting</strong>!
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
                  ? 'bg-emerald-600 text-white shadow-md'
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
          className="flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/30 transform hover:scale-105 active:scale-95 transition-all ring-4 ring-emerald-400/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Alien Runner</span>
        </button>
      </div>
    );
  }

  // 2. GAME OVER SCREEN (Results + Motivational Quote)
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

  // 3. ACTIVE PLAYING VIEW
  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">
            Score: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base">{score}</strong>
          </span>
          <span className="text-slate-500 font-semibold">
            Leaps: {leapsCount}
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

      {/* 60FPS Native Canvas Runner Arena */}
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

        {/* Tap to jump guide overlay */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 pointer-events-none border border-white/20">
          🚀 Press [Spacebar] or Tap Screen to Jump Obstacles!
        </div>
      </div>

      {/* Jump Button for Mobile & Laptop Trackpad Users */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 hidden sm:inline">Timing is key! Hop over oncoming space crystals and rocks:</span>
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

  // Fast mutable game ref to guarantee ZERO React re-render lag
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

  // Session timer
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

  // Pointer tracking across canvas (zero lag)
  const handlePointer = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;
    gRef.current.targetBasketX = Math.max(50, Math.min(canvas.width - 50, clientX));
  };

  // Arrow key controls
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

  // 60FPS Canvas Render Loop (Zero Lag + Beautiful Geometry Shapes)
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

      // Smooth basket linear interpolation (super buttery feel)
      g.basketX += (g.targetBasketX - g.basketX) * 0.22;

      // 1. RENDER STREAM BACKGROUND
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0f172a'); // night sky
      bgGrad.addColorStop(0.5, '#064e3b'); // tranquil river
      bgGrad.addColorStop(1, '#022c22'); // deep emerald pond
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Water stream ripples
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
        let color = '#fbbf24'; // golden
        let isHazard = false;

        if (rand < 0.28) {
          shape = 'dewdrop'; // 💧 Dewdrop of Peace
          pts = 15;
          color = '#38bdf8'; // sky blue
        } else if (rand < 0.52) {
          shape = 'sakura'; // 🌸 Lotus Blossom
          pts = 25;
          color = '#f472b6'; // pink
        } else if (rand < 0.74) {
          shape = 'crystal'; // 💎 Emerald Gem
          pts = 40;
          color = '#34d399'; // emerald
        } else if (rand < 0.88) {
          shape = 'star'; // ⭐ Golden Star
          pts = 35;
          color = '#fbbf24';
        } else {
          shape = 'storm'; // ⚡ Storm cloud hazard
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

      // 3. UPDATE & DRAW FALLING OBJECTS
      const basketY = H - 50;
      const basketW = 92;
      const basketH = 26;

      g.items.forEach(item => {
        item.y += item.speed;
        item.rot += 0.03;

        // Draw Object
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rot);

        if (item.shape === 'star') {
          // 5-Point Shimmering Star
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
          // Glossy Water Dewdrop
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 4, 10, 0, Math.PI);
          ctx.lineTo(0, -12);
          ctx.closePath();
          ctx.fill();
          // Specular shine
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-3, 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.shape === 'sakura') {
          // 5-Petal Lotus / Sakura Blossom
          ctx.fillStyle = '#f472b6';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 8;
          for (let petal = 0; petal < 5; petal++) {
            ctx.beginPath();
            ctx.ellipse(0, 7, 5, 8, (petal * 72) * Math.PI / 180, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fef08a'; // Flower core
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.shape === 'crystal') {
          // Emerald Faceted Gem
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
          // Storm Cloud Hazard with Lightning
          ctx.fillStyle = '#64748b';
          ctx.shadowColor = '#334155';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(-7, 0, 8, 0, Math.PI * 2);
          ctx.arc(7, 0, 8, 0, Math.PI * 2);
          ctx.arc(0, -6, 9, 0, Math.PI * 2);
          ctx.fill();
          // Lightning bolt
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

        // 4. CATCH COLLISION CHECK
        if (item.y >= basketY - 14 && item.y <= basketY + 16 && Math.abs(item.x - g.basketX) < basketW / 2 + 8) {
          // Caught!
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

          item.y = 999; // mark caught to remove
        }
      });

      // Filter off-screen items
      g.items = g.items.filter(item => item.y < H + 30);

      // 5. DRAW THE LOTUS BASKET
      ctx.save();
      ctx.translate(g.basketX, basketY);

      // Water glow ring
      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 14, 52, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Green lily pad base
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.ellipse(0, 10, 48, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Lotus Bowl
      const lotusGrad = ctx.createLinearGradient(-45, 0, 45, 0);
      lotusGrad.addColorStop(0, '#f59e0b'); // amber
      lotusGrad.addColorStop(0.5, '#fb7185'); // rose pink
      lotusGrad.addColorStop(1, '#14b8a6'); // teal
      ctx.fillStyle = lotusGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0.15, Math.PI - 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Lotus Bowl Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸 LOTUS', 0, 12);

      ctx.restore();

      // 6. DRAW FLOATING SCORE POPUPS
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

      {/* 60FPS Native Canvas Catch Stream */}
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

      {/* Touch / Arrow Navigation buttons */}
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
      desc: 'Spacebar jump past obstacles (Chrome Dino style)',
      badge: 'Focus & Reflex'
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
