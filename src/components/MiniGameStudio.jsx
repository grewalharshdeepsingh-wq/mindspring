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
  RefreshCw
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

// Helper to pick random quote
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
  }, []);

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
  // Game state: 'idle' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState('idle');
  const [duration, setDuration] = useState(45); // seconds
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [bubbles, setBubbles] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_bubble_high') || '0', 10);
  });

  const nextId = useRef(1);
  const comboTimer = useRef(null);

  // Start the game explicitly
  const handleStartGame = () => {
    setScore(0);
    setPoppedCount(0);
    setCombo(1);
    setTimeLeft(duration);
    
    // Seed initial bubbles inside viewport
    const initialBubbles = [];
    for (let i = 0; i < 6; i++) {
      const isBonus = Math.random() < 0.25;
      const bonusObj = isBonus ? BONUS_WORDS[Math.floor(Math.random() * BONUS_WORDS.length)] : null;
      initialBubbles.push({
        id: nextId.current++,
        text: isBonus ? bonusObj.text : STRESS_WORDS[Math.floor(Math.random() * STRESS_WORDS.length)],
        pts: isBonus ? bonusObj.pts : 15,
        isBonus,
        color: isBonus ? bonusObj.color : 'from-indigo-500/85 to-purple-600/85',
        x: 12 + (i % 3) * 32 + (Math.random() * 8 - 4),
        y: 20 + Math.floor(i / 3) * 36 + Math.random() * 10,
        size: isBonus ? 78 : 84,
        speed: 0.6 + Math.random() * 0.8
      });
    }
    setBubbles(initialBubbles);
    setGameState('playing');
  };

  // Timer countdown while playing
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

  // Spawn bubbles periodically while playing
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length >= 9) return prev;
        const isBonus = Math.random() < 0.28;
        const bonusObj = isBonus ? BONUS_WORDS[Math.floor(Math.random() * BONUS_WORDS.length)] : null;
        const newBubble = {
          id: nextId.current++,
          text: isBonus ? bonusObj.text : STRESS_WORDS[Math.floor(Math.random() * STRESS_WORDS.length)],
          pts: isBonus ? bonusObj.pts : 15,
          isBonus,
          color: isBonus ? bonusObj.color : 'from-indigo-500/85 to-purple-600/85',
          x: 10 + Math.random() * 75,
          y: 100, // enter from bottom
          size: isBonus ? 78 : 84,
          speed: 0.8 + Math.random() * 1.2
        };
        return [...prev, newBubble];
      });
    }, 850);
    return () => clearInterval(interval);
  }, [gameState]);

  // Movement animation loop while playing
  useEffect(() => {
    if (gameState !== 'playing') return;
    const loop = setInterval(() => {
      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -15)
      );
    }, 45);
    return () => clearInterval(loop);
  }, [gameState]);

  // Bubble pop click handler
  const popBubble = (bubble, e) => {
    e.stopPropagation();
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

    setCombo(c => Math.min(c + 1, 5));
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(1), 2200);

    if (bubble.isBonus) {
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: {
            x: e.clientX ? e.clientX / window.innerWidth : 0.5,
            y: e.clientY ? e.clientY / window.innerHeight : 0.5
          }
        });
      } catch (err) {}
    }

    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
  };

  // 1. IDLE SCREEN (Ready to start)
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
                  ? 'bg-purple-600 text-white shadow-md'
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

        {/* Big Start Button */}
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

  // 2. GAME OVER SCREEN (With Results & Motivational Quote)
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

  // 3. ACTIVE PLAYING VIEW
  return (
    <div className="flex flex-col h-full select-none">
      {/* Active Header Status Bar */}
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

      {/* Floating Canvas Area */}
      <div className="relative flex-1 min-h-[400px] bg-gradient-to-b from-sky-50/70 via-indigo-50/40 to-teal-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-purple-200 dark:border-slate-800 overflow-hidden my-3 shadow-inner cursor-pointer">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-slate-500 pointer-events-none border">
          🫧 Tap/click bubbles to pop them before they float away!
        </div>

        {bubbles.map(b => (
          <button
            key={b.id}
            onClick={(e) => popBubble(b, e)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${b.color} text-white shadow-lg backdrop-blur-sm border-2 border-white/60 dark:border-white/30 flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-115 active:scale-90 animate-pulse-subtle`}
          >
            <span className="text-[10px] font-bold leading-tight drop-shadow-sm line-clamp-2">
              {b.text}
            </span>
            <span className="text-[9px] opacity-90 mt-0.5 font-mono font-bold">
              +{b.pts}
            </span>
            <div className="absolute top-1.5 left-2 w-3.5 h-2 bg-white/50 rounded-full rotate-[-30deg]" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. ZEN STONE BALANCER GAME (TOWER OF CALM)
// ==========================================
const STONE_GRADIENTS = [
  'from-stone-500 to-stone-700 border-stone-400',
  'from-teal-600 to-emerald-800 border-teal-400',
  'from-slate-600 to-slate-800 border-slate-400',
  'from-amber-600 to-stone-700 border-amber-400',
  'from-indigo-600 to-slate-800 border-indigo-400',
  'from-cyan-600 to-teal-800 border-cyan-400'
];

function StoneStackerGame({ soundEnabled, onScoreUpdate, onSwitchGame, onComplete }) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [duration, setDuration] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45);
  const [tower, setTower] = useState([
    { x: 50, width: 140, height: 32, color: 'from-emerald-700 to-teal-900 border-emerald-500' }
  ]);
  const [swingPos, setSwingPos] = useState(50);
  const [score, setScore] = useState(0);
  const [feedbackText, setFeedbackText] = useState('Press "Drop Stone" or [Spacebar] when centered!');
  const [perfectCount, setPerfectCount] = useState(0);
  const [highTower, setHighTower] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_tower_high') || '1', 10);
  });

  const swingDirection = useRef(1);

  const handleStartGame = () => {
    setTower([
      { x: 50, width: 140, height: 32, color: 'from-emerald-700 to-teal-900 border-emerald-500' }
    ]);
    setScore(0);
    setPerfectCount(0);
    setTimeLeft(duration);
    setFeedbackText('Aim for the center and drop the river pebble!');
    setGameState('playing');
  };

  // Timer countdown
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

  // Pendulum swing loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setSwingPos(prev => {
        let next = prev + swingDirection.current * 1.5;
        if (next >= 78) {
          swingDirection.current = -1;
          next = 78;
        } else if (next <= 22) {
          swingDirection.current = 1;
          next = 22;
        }
        return next;
      });
    }, 28);
    return () => clearInterval(interval);
  }, [gameState]);

  // Drop Stone Action
  const dropStone = () => {
    if (gameState !== 'playing') return;

    const topStone = tower[tower.length - 1];
    const diff = Math.abs(swingPos - topStone.x);

    if (diff <= 18) {
      const isPerfect = diff <= 6;
      if (soundEnabled && soundEngine.playZenClink) {
        soundEngine.playZenClink();
      }

      const pts = isPerfect ? 100 : 50;
      const newScore = score + pts;
      setScore(newScore);
      if (onScoreUpdate) onScoreUpdate(newScore);

      if (isPerfect) setPerfectCount(p => p + 1);

      const nextWidth = Math.max(68, topStone.width - (isPerfect ? 0 : 8));
      const nextColor = STONE_GRADIENTS[tower.length % STONE_GRADIENTS.length];

      const newStone = {
        x: swingPos,
        width: nextWidth,
        height: 28,
        color: nextColor
      };

      const newTower = [...tower, newStone];
      setTower(newTower);

      if (newTower.length > highTower) {
        setHighTower(newTower.length);
        localStorage.setItem('mindspring_tower_high', newTower.length.toString());
      }

      if (isPerfect) {
        setFeedbackText('✨ Perfect Balance! Harmonic alignment (+100) ✨');
        try {
          confetti({ particleCount: 20, spread: 45 });
        } catch (e) {}
      } else {
        setFeedbackText('🌿 Good Placement! Tower stable (+50)');
      }
    } else {
      // Tumble off
      if (soundEnabled && soundEngine.playWaterSplash) {
        soundEngine.playWaterSplash();
      }
      setFeedbackText('💧 Stone tumbled into the calm pond! Keep going—drop the next stone.');
    }
  };

  // Keyboard shortcut (Spacebar to drop stone)
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        dropStone();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, swingPos, tower]);

  // 1. IDLE SCREEN
  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-stone-600 via-teal-700 to-emerald-800 text-white flex items-center justify-center text-4xl shadow-xl shadow-teal-500/20">
          🪨
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-heading font-extrabold text-slate-800 dark:text-white">
            Zen Stone Balancer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Stack peaceful Japanese river stones into a towering cairn. Practice presence, calm timing, and single-pointed focus.
          </p>
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
                  ? 'bg-teal-700 text-white shadow-md'
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
          <span>Highest Cairn Stacked: {highTower} Stones</span>
        </div>

        {/* Big Start Button */}
        <button
          onClick={handleStartGame}
          className="flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-600/30 transform hover:scale-105 active:scale-95 transition-all ring-4 ring-teal-400/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Stacking Stones</span>
        </button>
      </div>
    );
  }

  // 2. GAME OVER SCREEN (Results + Motivational Quote)
  if (gameState === 'gameover') {
    return (
      <GameResultCard
        gameName="Zen Stone Balancer"
        score={score}
        stats={[
          { label: 'Tower Height', value: `${tower.length} Stones` },
          { label: 'Perfect Placements', value: `${perfectCount} Stones` },
          { label: 'Time Elapsed', value: `${duration}s` }
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
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">
            Tower Height: <strong className="text-teal-600 dark:text-teal-400">{tower.length} Stones</strong>
          </span>
          <span className="font-mono bg-teal-600 text-white font-bold px-2.5 py-0.5 rounded-lg">
            Score: {score}
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

      {/* Main Pond / Garden Stacking Viewport */}
      <div 
        onClick={dropStone}
        className="relative flex-1 min-h-[400px] bg-gradient-to-b from-slate-200 via-teal-100/50 to-emerald-200/70 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-900 rounded-2xl border border-teal-200 dark:border-slate-800 overflow-hidden my-3 cursor-pointer flex flex-col justify-between"
      >
        {/* Sky / Pendulum zone */}
        <div className="relative w-full h-20 pt-3">
          <div 
            style={{ left: `${swingPos}%` }}
            className="absolute top-2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
          >
            <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-500" />
            <div className="w-24 h-7 rounded-2xl bg-gradient-to-tr from-stone-600 to-stone-800 border-2 border-stone-400 shadow-xl flex items-center justify-center">
              <span className="text-[9px] font-bold text-white tracking-widest uppercase">Pebble</span>
            </div>
          </div>
        </div>

        {/* Dynamic Feedback Banner */}
        <div className="text-center z-10 px-4">
          <span className="inline-block bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
            {feedbackText}
          </span>
        </div>

        {/* Stone Stack on the water pond base */}
        <div className="relative w-full pb-6 flex flex-col items-center justify-end">
          <div className="w-72 h-7 rounded-full bg-teal-500/20 blur-md mb-[-12px]" />

          <div className="flex flex-col-reverse items-center">
            {tower.map((stone, idx) => (
              <div
                key={idx}
                style={{
                  width: `${stone.width}px`,
                  height: `${stone.height}px`,
                  marginLeft: `${(stone.x - 50) * 2.6}px`,
                  borderRadius: '16px 16px 12px 12px'
                }}
                className={`my-[-2px] bg-gradient-to-r ${stone.color} border shadow-md flex items-center justify-center text-white/90 text-[10px] font-mono font-bold transition-all duration-300`}
              >
                <span>#{idx + 1}</span>
              </div>
            ))}
          </div>

          <span className="text-[10px] text-slate-500 font-semibold mt-1">
            🌱 Foundation River Rock
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 hidden sm:inline">Click arena, press [Spacebar], or tap "Drop Stone":</span>
        <button
          onClick={dropStone}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-extrabold rounded-xl shadow-md transition"
        >
          Drop Stone 🪨
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. LOTUS CALM CATCH (CATCHING PEACE)
// ==========================================
const CATCH_ITEMS = [
  { type: 'peace', label: '💧 Peace', pts: 15, isHazard: false, color: 'text-cyan-600' },
  { type: 'joy', label: '🌸 Joy', pts: 25, isHazard: false, color: 'text-pink-600' },
  { type: 'clarity', label: '⭐ Clarity', pts: 35, isHazard: false, color: 'text-amber-500' },
  { type: 'focus', label: '💎 Focus', pts: 45, isHazard: false, color: 'text-emerald-600' },
  { type: 'storm', label: '⚡ Stress', pts: -15, isHazard: true, color: 'text-slate-700' }
];

function LotusCatchGame({ soundEnabled, onScoreUpdate, onSwitchGame, onComplete }) {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [duration, setDuration] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45);
  const [basketX, setBasketX] = useState(50); // percentage (10 to 90)
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_lotus_high') || '0', 10);
  });

  const nextId = useRef(1);

  const handleStartGame = () => {
    setScore(0);
    setCaughtCount(0);
    setTimeLeft(duration);
    setFallingItems([]);
    setBasketX(50);
    setGameState('playing');
  };

  // Timer countdown
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

  // Spawn falling items periodically
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setFallingItems(prev => {
        if (prev.length >= 7) return prev;
        const isHazard = Math.random() < 0.22;
        const itemType = isHazard 
          ? CATCH_ITEMS[4] 
          : CATCH_ITEMS[Math.floor(Math.random() * 4)];

        const newItem = {
          id: nextId.current++,
          ...itemType,
          x: 12 + Math.random() * 76,
          y: -5,
          speed: 1.2 + Math.random() * 1.4
        };
        return [...prev, newItem];
      });
    }, 750);
    return () => clearInterval(interval);
  }, [gameState]);

  // Movement loop & collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;
    const loop = setInterval(() => {
      setFallingItems(prev => {
        const remaining = [];
        for (let item of prev) {
          const nextY = item.y + item.speed;

          // Check if caught in lotus basket (near bottom y: 82% to 92%)
          if (nextY >= 82 && nextY <= 92 && Math.abs(item.x - basketX) < 14) {
            // Collision caught!
            if (item.isHazard) {
              setScore(s => Math.max(0, s - 15));
            } else {
              if (soundEnabled && soundEngine.playCatchSound) {
                soundEngine.playCatchSound();
              }
              setCaughtCount(c => c + 1);
              setScore(s => {
                const ns = s + item.pts;
                if (onScoreUpdate) onScoreUpdate(ns);
                if (ns > highScore) {
                  setHighScore(ns);
                  localStorage.setItem('mindspring_lotus_high', ns.toString());
                }
                return ns;
              });
            }
            continue; // caught, so remove from falling
          }

          if (nextY < 105) {
            remaining.push({ ...item, y: nextY });
          }
        }
        return remaining;
      });
    }, 40);
    return () => clearInterval(loop);
  }, [gameState, basketX, soundEnabled, highScore]);

  // Keyboard navigation
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBasketX(x => Math.max(10, x - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBasketX(x => Math.min(90, x + 6));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Mouse move tracking
  const handleMouseMove = (e) => {
    if (gameState !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, xPct)));
  };

  // 1. IDLE SCREEN
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
            Glide your golden lotus basket across the reflecting stream to catch positive serenity droplets while dodging heavy exam clouds!
          </p>
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
                  ? 'bg-rose-600 text-white shadow-md'
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

        {/* Big Start Button */}
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

  // 2. GAME OVER SCREEN (Results + Motivational Quote)
  if (gameState === 'gameover') {
    return (
      <GameResultCard
        gameName="Lotus Calm Catch"
        score={score}
        stats={[
          { label: 'Serenity Drops', value: `${caughtCount} Caught` },
          { label: 'Time Elapsed', value: `${duration}s` },
          { label: 'Focus Score', value: `${score} pts` }
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
      {/* Header Bar */}
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

      {/* Main Catch Canvas */}
      <div
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-[400px] bg-gradient-to-b from-teal-50/70 via-cyan-50/50 to-emerald-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-teal-200 dark:border-slate-800 overflow-hidden my-3 cursor-ew-resize"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-500 pointer-events-none">
          Move your mouse, touch, or use [← / →] arrows to guide your lotus bowl!
        </div>

        {/* Falling items */}
        {fallingItems.map(item => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-xs font-bold pointer-events-none"
          >
            <span>{item.label}</span>
          </div>
        ))}

        {/* Player Lotus Basket */}
        <div
          style={{ left: `${basketX}%` }}
          className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
        >
          <div className="w-24 h-10 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-teal-400 p-1 shadow-2xl flex items-center justify-center border-2 border-white ring-4 ring-teal-400/20">
            <span className="text-white text-xs font-extrabold uppercase drop-shadow flex items-center space-x-1">
              <span>🌸</span>
              <span>Lotus</span>
            </span>
          </div>
          <div className="w-16 h-2 bg-teal-500/20 rounded-full blur-sm mt-0.5" />
        </div>
      </div>

      {/* On-screen Left/Right arrow controls */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 hidden sm:inline">Dodge the dark lightning clouds!</span>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => setBasketX(x => Math.max(10, x - 12))}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:bg-slate-200 font-bold flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Move Left</span>
          </button>
          <button
            onClick={() => setBasketX(x => Math.min(90, x + 12))}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:bg-slate-200 font-bold flex items-center justify-center space-x-1"
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
  const [selectedGame, setSelectedGame] = useState('bubbles'); // 'bubbles' | 'stones' | 'lotus'
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
      id: 'stones',
      name: 'Zen Stone Balancer',
      icon: '🪨',
      desc: 'Stack smooth river pebbles in peaceful equilibrium',
      badge: 'Focus & Patience'
    },
    {
      id: 'lotus',
      name: 'Lotus Calm Catch',
      icon: '🌸',
      desc: 'Catch positive serenity drops with your lotus bowl',
      badge: 'Reflex & Serenity'
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
              Need a quick study reset? Choose a game below, press <strong>Start Game</strong>, and play for a focused, timed session. When the timer ends, receive your performance stats and an inspiring motivational quote!
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[440px]">
        {selectedGame === 'bubbles' && (
          <BubblePopGame 
            soundEnabled={soundEnabled} 
            onSwitchGame={() => setSelectedGame('stones')}
            onComplete={onComplete}
          />
        )}
        {selectedGame === 'stones' && (
          <StoneStackerGame 
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
