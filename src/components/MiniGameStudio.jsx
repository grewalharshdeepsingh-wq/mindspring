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
  Smile
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

// ==========================================
// 1. STRESS BUBBLE POP GAME
// ==========================================
const STRESS_WORDS = [
  'Exam Panic', 'Overthinking', 'Perfectionism', 'Self-Doubt', 
  'Late-Night Fatigue', 'Peer Pressure', 'Procrastination', 
  'Formula Anxiety', 'Imposter Feeling', 'Deadlines'
];

const BONUS_WORDS = [
  { text: '✨ Inner Calm', pts: 50, color: 'from-amber-400 to-yellow-300' },
  { text: '🌸 Self-Care', pts: 30, color: 'from-pink-400 to-rose-300' },
  { text: '⚡ Fresh Focus', pts: 40, color: 'from-emerald-400 to-teal-300' },
  { text: '💎 Deep Peace', pts: 60, color: 'from-cyan-400 to-blue-300' }
];

function BubblePopGame({ soundEnabled, onScoreUpdate }) {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [gameMode, setGameMode] = useState('endless'); // 'endless' | 'timed'
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_bubble_high') || '0', 10);
  });

  const nextId = useRef(1);
  const comboTimer = useRef(null);

  // Spawn bubbles periodically
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length >= 10) return prev; // max 10 concurrent bubbles
        const isBonus = Math.random() < 0.3;
        const bonusObj = isBonus ? BONUS_WORDS[Math.floor(Math.random() * BONUS_WORDS.length)] : null;
        const text = isBonus ? bonusObj.text : STRESS_WORDS[Math.floor(Math.random() * STRESS_WORDS.length)];
        const pts = isBonus ? bonusObj.pts : 15;
        const color = isBonus ? bonusObj.color : 'from-indigo-400/80 to-purple-500/80';

        const newBubble = {
          id: nextId.current++,
          text,
          pts,
          isBonus,
          color,
          x: 10 + Math.random() * 75, // percentage
          size: isBonus ? 76 : 84,
          speed: 1.2 + Math.random() * 1.5,
          y: 100 // starts at bottom
        };
        return [...prev, newBubble];
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [isGameOver]);

  // Float bubbles upward
  useEffect(() => {
    if (isGameOver) return;

    const anim = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -15) // remove when off top
      );
    }, 50);

    return () => clearInterval(anim);
  }, [isGameOver]);

  // Timed mode countdown
  useEffect(() => {
    if (gameMode !== 'timed' || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsGameOver(true);
          if (soundEnabled && soundEngine.playLevelUpSound) soundEngine.playLevelUpSound();
          try {
            confetti({ particleCount: 70, spread: 60 });
          } catch (e) {}
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, isGameOver, soundEnabled]);

  const popBubble = (b, e) => {
    e.stopPropagation();
    if (soundEnabled && soundEngine.playPopSound) {
      soundEngine.playPopSound();
    }

    // Add points with combo
    const ptsEarned = b.pts * combo;
    const newScore = score + ptsEarned;
    setScore(newScore);
    setPoppedCount(p => p + 1);
    if (onScoreUpdate) onScoreUpdate(newScore);

    // Update high score
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('mindspring_bubble_high', newScore.toString());
    }

    // Increment combo
    setCombo(c => Math.min(c + 1, 6));
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(1), 2200);

    // Mini confetti on bonus pop
    if (b.isBonus) {
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: {
            x: e.clientX ? e.clientX / window.innerWidth : 0.5,
            y: e.clientY ? e.clientY / window.innerHeight : 0.5
          }
        });
      } catch (err) {}
    }

    // Remove popped bubble
    setBubbles(prev => prev.filter(item => item.id !== b.id));
  };

  const handleRestart = (mode = gameMode) => {
    setGameMode(mode);
    setScore(0);
    setPoppedCount(0);
    setCombo(1);
    setTimeLeft(60);
    setIsGameOver(false);
    setBubbles([]);
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100/90 dark:bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 text-white font-mono font-extrabold px-3 py-1 rounded-xl text-sm shadow-sm">
            Score: {score}
          </div>
          {combo > 1 && (
            <div className="flex items-center space-x-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg animate-bounce">
              <Flame className="w-3.5 h-3.5" />
              <span>{combo}x Combo!</span>
            </div>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Popped: {poppedCount}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {gameMode === 'timed' && (
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
              timeLeft <= 10 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}>
              ⏱️ {timeLeft}s
            </span>
          )}

          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => handleRestart('endless')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                gameMode === 'endless' ? 'bg-teal-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Zen Flow
            </button>
            <button
              onClick={() => handleRestart('timed')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                gameMode === 'timed' ? 'bg-teal-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              60s Challenge
            </button>
          </div>

          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 pl-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Floating Canvas Area */}
      <div className="relative flex-1 min-h-[380px] bg-gradient-to-b from-sky-50/70 via-indigo-50/40 to-teal-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-teal-100 dark:border-slate-800 overflow-hidden my-3 relative shadow-inner cursor-crosshair">
        
        {/* Calming backdrop watermarks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10">
          <Sparkles className="w-96 h-96 text-teal-600" />
        </div>

        {/* Instruction tip */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-slate-500 dark:text-slate-400 pointer-events-none border border-white/50">
          🫧 Tap or click the rising worry bubbles to pop your stress away!
        </div>

        {/* Bubbles */}
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
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${b.color} text-white shadow-lg backdrop-blur-sm border-2 border-white/60 dark:border-white/30 flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-110 active:scale-90 group animate-pulse-subtle`}
          >
            <span className="text-[10px] font-bold leading-tight drop-shadow-sm line-clamp-2">
              {b.text}
            </span>
            <span className="text-[9px] opacity-80 mt-0.5 font-mono">
              +{b.pts}
            </span>
            {/* Gloss reflection highlight */}
            <div className="absolute top-1.5 left-2 w-3.5 h-2 bg-white/50 rounded-full rotate-[-30deg]" />
          </button>
        ))}

        {/* Game Over Modal overlay for Timed mode */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-fade-in">
            <Trophy className="w-14 h-14 text-amber-400 animate-bounce mb-2" />
            <h3 className="text-2xl font-heading font-extrabold">Time's Up! Calming Session Complete</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              You popped <strong className="text-emerald-400">{poppedCount} stress worries</strong> and achieved a score of <strong className="text-amber-300">{score}</strong>!
            </p>
            <div className="flex items-center space-x-3 mt-5">
              <button
                onClick={() => handleRestart('timed')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Play Again (60s)
              </button>
              <button
                onClick={() => handleRestart('endless')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
              >
                Switch to Zen Mode
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Tip: Keep popping to trigger multiplier combos up to 6x!</span>
        <button
          onClick={() => handleRestart(gameMode)}
          className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 hover:underline font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Field</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. ZEN STONE BALANCER GAME (TOWER OF CALM)
// ==========================================
const STONE_COLORS = [
  'from-stone-500 to-stone-700 border-stone-400',
  'from-teal-600 to-emerald-800 border-teal-400',
  'from-slate-600 to-slate-800 border-slate-400',
  'from-amber-600 to-stone-700 border-amber-400',
  'from-indigo-600 to-slate-800 border-indigo-400',
  'from-cyan-600 to-teal-800 border-cyan-400'
];

function StoneStackerGame({ soundEnabled, onScoreUpdate }) {
  const [tower, setTower] = useState([
    { x: 50, width: 140, height: 34, color: 'from-emerald-700 to-teal-900 border-emerald-500' }
  ]);
  const [swingPos, setSwingPos] = useState(50); // percentage 20 to 80
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedbackText, setFeedbackText] = useState('Press "Drop Stone" or Spacebar when centered!');
  const [wobble, setWobble] = useState(false);
  const [highTower, setHighTower] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_tower_high') || '1', 10);
  });

  const directionRef = useRef(1);

  // Smooth pendulum swaying of top swinging stone
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setSwingPos(prev => {
        let next = prev + directionRef.current * 1.4;
        if (next >= 78) {
          directionRef.current = -1;
          next = 78;
        } else if (next <= 22) {
          directionRef.current = 1;
          next = 22;
        }
        return next;
      });
    }, 28);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const dropStone = () => {
    if (isGameOver) return;

    const currentTop = tower[tower.length - 1];
    const diff = Math.abs(swingPos - currentTop.x);

    // Tolerance thresholds: diff <= 6 is perfect, <= 18 is good, > 18 tumbles
    if (diff <= 18) {
      const isPerfect = diff <= 6;
      if (soundEnabled && soundEngine.playZenClink) {
        soundEngine.playZenClink();
      }

      const pts = isPerfect ? 100 : 50;
      const newScore = score + pts;
      setScore(newScore);
      if (onScoreUpdate) onScoreUpdate(newScore);

      const nextWidth = Math.max(70, currentTop.width - (isPerfect ? 0 : 8));
      const nextColor = STONE_COLORS[tower.length % STONE_COLORS.length];

      const newStone = {
        x: swingPos,
        width: nextWidth,
        height: 30,
        color: nextColor
      };

      const newTower = [...tower, newStone];
      setTower(newTower);

      if (newTower.length > highTower) {
        setHighTower(newTower.length);
        localStorage.setItem('mindspring_tower_high', newTower.length.toString());
      }

      if (isPerfect) {
        setFeedbackText('✨ Perfect Balance! Harmonic resonance achieved (+100) ✨');
        try {
          confetti({ particleCount: 20, spread: 40 });
        } catch (e) {}
      } else {
        setFeedbackText('🌿 Good Placement! Tower stable (+50)');
      }
    } else {
      // Tumble off
      if (soundEnabled && soundEngine.playWaterSplash) {
        soundEngine.playWaterSplash();
      }
      setWobble(true);
      setIsGameOver(true);
      setFeedbackText('💧 Stone slipped into the calm pond! Deep breath, let us begin anew.');
    }
  };

  const handleRestart = () => {
    setTower([
      { x: 50, width: 140, height: 34, color: 'from-emerald-700 to-teal-900 border-emerald-500' }
    ]);
    setScore(0);
    setIsGameOver(false);
    setWobble(false);
    setFeedbackText('Aim for the center and drop the river pebble!');
  };

  // Keyboard shortcut (Spacebar to drop)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isGameOver) {
        e.preventDefault();
        dropStone();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [swingPos, tower, isGameOver]);

  const currentHeight = tower.length;

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-100/90 dark:bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">
            Tower Height: <strong className="text-teal-600 dark:text-teal-400">{currentHeight} Stones</strong>
          </span>
          <span className="font-mono bg-teal-600 text-white font-bold px-2.5 py-0.5 rounded-lg">
            Score: {score}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Highest Stack: {highTower} Stones</span>
          </span>
          <button
            onClick={handleRestart}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
            title="Reset Stacker"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Pond / Garden Stacking Viewport */}
      <div 
        onClick={!isGameOver ? dropStone : undefined}
        className="relative flex-1 min-h-[400px] bg-gradient-to-b from-slate-200 via-teal-100/60 to-emerald-200/80 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-900 rounded-2xl border border-teal-200 dark:border-slate-800 overflow-hidden my-3 cursor-pointer flex flex-col justify-between"
      >
        {/* Sky / Pendulum zone */}
        <div className="relative w-full h-20 pt-4">
          <div 
            style={{ left: `${swingPos}%` }}
            className="absolute top-2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          >
            {/* String line */}
            <div className="w-0.5 h-6 bg-slate-400/80 dark:bg-slate-500" />
            {/* Swinging Stone */}
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
          {/* Reflective Water Pond ripple */}
          <div className="w-72 h-8 rounded-full bg-teal-500/20 dark:bg-teal-400/10 blur-md mb-[-12px]" />

          {/* Render Stacked Stones from bottom to top */}
          <div className={`flex flex-col-reverse items-center transition-transform ${wobble ? 'animate-shake' : ''}`}>
            {tower.map((stone, idx) => (
              <div
                key={idx}
                style={{
                  width: `${stone.width}px`,
                  height: `${stone.height}px`,
                  marginLeft: `${(stone.x - 50) * 2.8}px`,
                  borderRadius: '16px 16px 14px 14px'
                }}
                className={`my-[-2px] bg-gradient-to-r ${stone.color} border shadow-md flex items-center justify-center text-white/90 text-[10px] font-mono font-bold transition-all duration-300`}
              >
                <span>#{idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Base rock label */}
          <span className="text-[10px] text-slate-500 font-semibold mt-1">
            🌱 Ancient Foundation River Stone
          </span>
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-fade-in">
            <h3 className="text-2xl font-heading font-extrabold">Zen Tower Complete</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              You stacked <strong className="text-emerald-400">{currentHeight} Stones</strong> in serene mindful balance!
            </p>
            <button
              onClick={handleRestart}
              className="mt-5 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Stack Another Cairn
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Click anywhere or press [Spacebar] to drop the stone</span>
        <button
          onClick={dropStone}
          disabled={isGameOver}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
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
  { type: 'peace', label: '💧 Peace', pts: 15, isHazard: false, color: 'text-cyan-500' },
  { type: 'joy', label: '🌸 Joy', pts: 25, isHazard: false, color: 'text-pink-500' },
  { type: 'clarity', label: '⭐ Clarity', pts: 35, isHazard: false, color: 'text-amber-400' },
  { type: 'storm', label: '⚡ Stress Cloud', pts: -20, isHazard: true, color: 'text-slate-700' }
];

function LotusCatchGame({ soundEnabled, onScoreUpdate }) {
  const [basketX, setBasketX] = useState(50); // percentage (10 to 90)
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('mindspring_lotus_high') || '0', 10);
  });

  const nextId = useRef(1);

  // Spawn falling items
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setFallingItems(prev => {
        if (prev.length >= 7) return prev;
        const itemType = Math.random() < 0.25 ? CATCH_ITEMS[3] : CATCH_ITEMS[Math.floor(Math.random() * 3)];
        const newItem = {
          id: nextId.current++,
          ...itemType,
          x: 10 + Math.random() * 80,
          y: -5,
          speed: 1.4 + Math.random() * 1.6
        };
        return [...prev, newItem];
      });
    }, 900);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Movement loop & collision check
  useEffect(() => {
    if (isGameOver) return;
    const loop = setInterval(() => {
      setFallingItems(prev => {
        const nextList = [];
        for (let item of prev) {
          const nextY = item.y + item.speed;

          // Check if caught in basket (y near 88%, x near basketX)
          if (nextY >= 82 && nextY <= 92 && Math.abs(item.x - basketX) < 14) {
            // Collision caught!
            if (item.isHazard) {
              setLives(l => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  setIsGameOver(true);
                }
                return nextLives;
              });
            } else {
              if (soundEnabled && soundEngine.playCatchSound) {
                soundEngine.playCatchSound();
              }
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
            continue; // caught, so don't re-add
          }

          if (nextY < 105) {
            nextList.push({ ...item, y: nextY });
          }
        }
        return nextList;
      });
    }, 40);
    return () => clearInterval(loop);
  }, [basketX, isGameOver, soundEnabled, highScore]);

  // Handle keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBasketX(x => Math.max(10, x - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBasketX(x => Math.min(90, x + 6));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, xPct)));
  };

  const handleRestart = () => {
    setFallingItems([]);
    setScore(0);
    setLives(3);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-100/90 dark:bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-mono bg-teal-600 text-white font-bold px-3 py-1 rounded-xl">
            Score: {score}
          </span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3].map(i => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300 dark:text-slate-600'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best: {highScore}</span>
          </span>
          <button
            onClick={handleRestart}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Catch Canvas */}
      <div
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-[380px] bg-gradient-to-b from-teal-50/70 via-cyan-50/50 to-emerald-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-teal-200 dark:border-slate-800 overflow-hidden my-3 cursor-ew-resize"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-500 pointer-events-none">
          Move your mouse, touch, or use [← / →] arrows to catch positive serenity drops!
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

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-fade-in">
            <Trophy className="w-14 h-14 text-amber-400 animate-bounce mb-2" />
            <h3 className="text-2xl font-heading font-extrabold">Gentle Session Finished</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              You collected <strong className="text-amber-300">{score} Peace Points</strong> today!
            </p>
            <button
              onClick={handleRestart}
              className="mt-5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen Left/Right arrow controls for mobile */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Avoid the dark stress clouds!</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBasketX(x => Math.max(10, x - 12))}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBasketX(x => Math.min(90, x + 12))}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:bg-slate-200 transition"
          >
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
  const [lastScore, setLastScore] = useState(0);

  const games = [
    {
      id: 'bubbles',
      name: 'Stress Bubble Pop',
      icon: '🫧',
      desc: 'Pop away exam worries & build combo streaks',
      badge: 'Most Popular'
    },
    {
      id: 'stones',
      name: 'Zen Stone Balancer',
      icon: '🪨',
      desc: 'Stack smooth river pebbles in peaceful equilibrium',
      badge: 'Focus & Timing'
    },
    {
      id: 'lotus',
      name: 'Lotus Calm Catch',
      icon: '🌸',
      desc: 'Catch positive serenity drops with your lotus bowl',
      badge: 'Reflex & Joy'
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
              Need a 3-minute study break? Pop stress worries, stack balancing stones, or catch serene droplets to refresh your brain dopamine without social media doomscrolling.
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
                <span>Save Break (Complete)</span>
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

      {/* Active Game Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
        {selectedGame === 'bubbles' && (
          <BubblePopGame soundEnabled={soundEnabled} onScoreUpdate={setLastScore} />
        )}
        {selectedGame === 'stones' && (
          <StoneStackerGame soundEnabled={soundEnabled} onScoreUpdate={setLastScore} />
        )}
        {selectedGame === 'lotus' && (
          <LotusCatchGame soundEnabled={soundEnabled} onScoreUpdate={setLastScore} />
        )}
      </div>
    </div>
  );
}
