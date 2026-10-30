import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Smile, 
  HelpCircle,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Clock,
  Timer,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

import { LOGIC_QUESTIONS } from '../data/ghostfaceQuestions';

// Re-export for external references
export { LOGIC_QUESTIONS };

// Helper: Fisher-Yates array randomizer
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper: Format seconds to mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function GhostfaceRunnerGame({ 
  soundEnabled = true, 
  onSwitchGame, 
  onComplete 
}) {
  const canvasRef = useRef(null);

  // High score from local storage
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('mindspring_ghostface_high') || '0', 10);
    } catch (_) {
      return 0;
    }
  });

  // Game configuration
  const [selectedDuration, setSelectedDuration] = useState(60); // 60s or 90s

  // Game flow states
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'running' | 'dancing' | 'crying' | 'gameover'
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Time Run States
  const [timeLeft, setTimeLeft] = useState(60);
  const [runTime, setRunTime] = useState(0);
  const [timeBonusText, setTimeBonusText] = useState(null);

  // Shuffled Questions Queue for unique order every run
  const shuffledDeckRef = useRef([]);
  const currentQIndexRef = useRef(0);
  const [currentQuestion, setCurrentQuestion] = useState(LOGIC_QUESTIONS[0]);

  const [chosenLane, setChosenLane] = useState(0); // -1: Left, 1: Right
  const [explanation, setExplanation] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [doorAnswers, setDoorAnswers] = useState({
    left: '',
    right: '',
    correctLane: -1 // -1 for left, 1 for right
  });

  // Live mutable values for 60 FPS requestAnimationFrame canvas loop
  const gRef = useRef({
    distance: 100, // 100% to 0% as doors approach
    speed: 0.38,   // speed of approach
    playerX: 0,    // smooth lane offset: -1 (left) to +1 (right)
    targetLane: -1, // default left
    animTime: 0,
    danceTimer: 0,
    cryTimer: 0,
    doorPassed: false,
    particles: [],
    tears: [],
    // Side character: The Duck & friends
    sideChar: {
      active: false,
      type: 'duck', // 'duck' | 'banana' | 'capybara'
      side: 'left', // 'left' | 'right'
      y: 0,
      timer: 0,
      actionTime: 0,
      speech: "QUACK! 🦆"
    },
    nextSideCharDelay: 250 // frames until next funny cameo
  });

  // Prepare next question from the randomized run deck
  const prepareQuestion = useCallback((qIdx) => {
    const deck = shuffledDeckRef.current.length > 0 ? shuffledDeckRef.current : LOGIC_QUESTIONS;
    const q = deck[qIdx % deck.length];
    const isLeftCorrect = Math.random() > 0.5;

    setCurrentQuestion(q);
    setDoorAnswers({
      left: isLeftCorrect ? q.correct : q.wrong,
      right: isLeftCorrect ? q.wrong : q.correct,
      correctLane: isLeftCorrect ? -1 : 1
    });

    gRef.current.distance = 100;
    gRef.current.doorPassed = false;
    gRef.current.speed = Math.min(0.55, 0.35 + Math.floor(score / 500) * 0.04);
  }, [score]);

  // Handle Lane Steering
  const steerTo = useCallback((lane) => {
    if (gameState !== 'running') return;
    gRef.current.targetLane = lane;
    setChosenLane(lane);
    if (soundEnabled) {
      soundEngine.playGhostfaceSwoosh();
    }
  }, [gameState, soundEnabled]);

  // Start / Restart Game with Fresh Shuffled Questions
  const handleStartGame = () => {
    // 1. Generate a completely fresh shuffled deck for this run
    const freshlyShuffled = shuffleArray(LOGIC_QUESTIONS);
    shuffledDeckRef.current = freshlyShuffled;
    currentQIndexRef.current = 0;

    // 2. Reset scores and run stats
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setExplanation('');
    setTimeBonusText(null);
    setRunTime(0);
    setTimeLeft(selectedDuration);

    setChosenLane(-1);
    gRef.current.targetLane = -1;
    gRef.current.playerX = -1;
    gRef.current.distance = 100;
    gRef.current.particles = [];
    gRef.current.tears = [];

    // Audio Cue for Run Launch
    if (soundEnabled && soundEngine.playArcadeStart) {
      soundEngine.playArcadeStart();
    }

    // 3. Prepare first randomized question
    prepareQuestion(0);
    setGameState('running');
  };

  // 1-second interval for Time Runs countdown
  useEffect(() => {
    let interval = null;
    if (gameState === 'running' || gameState === 'dancing' || gameState === 'crying') {
      interval = setInterval(() => {
        setRunTime(r => r + 1);
        setTimeLeft(prev => {
          if (prev <= 6 && prev > 1 && soundEnabled && soundEngine.playCountdownTick) {
            soundEngine.playCountdownTick(prev === 2);
          }
          if (prev <= 1) {
            // Time is UP: End the run!
            setGameState('gameover');
            if (soundEnabled) {
              if (score > highScore && soundEngine.playHighScoreSound) {
                soundEngine.playHighScoreSound();
              } else if (soundEngine.playGameOverSound) {
                soundEngine.playGameOverSound();
              }
            }
            try {
              confetti({ particleCount: 80, spread: 75, origin: { y: 0.5 } });
            } catch (_) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, soundEnabled, score, highScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'running') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steerTo(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steerTo(1);
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Fast forward / rush through door
        gRef.current.distance = Math.max(0, gRef.current.distance - 20);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, steerTo]);

  // Main 60 FPS Canvas Game Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    const render = () => {
      const g = gRef.current;
      g.animTime += 1;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Smooth lane transition interpolation (lerp)
      g.playerX += (g.targetLane - g.playerX) * 0.16;

      // ----------------------------------------------------
      // 1. BACKGROUND & 3D CORRIDOR RUNNER ENVIRONMENT
      // ----------------------------------------------------
      const vpX = width / 2;
      const vpY = height * 0.25;

      // Dark atmospheric gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617'); // Dark slate/black
      bgGrad.addColorStop(0.35, '#0f172a');
      bgGrad.addColorStop(1, '#022c22'); // Forest green / horror mist vibe
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Floor Runner Perspective Track
      const trackTopW = width * 0.25;
      const trackBotW = width * 0.72;
      const trackBotY = height;

      ctx.beginPath();
      ctx.moveTo(vpX - trackTopW / 2, vpY);
      ctx.lineTo(vpX + trackTopW / 2, vpY);
      ctx.lineTo(vpX + trackBotW / 2, trackBotY);
      ctx.lineTo(vpX - trackBotW / 2, trackBotY);
      ctx.closePath();

      const floorGrad = ctx.createLinearGradient(0, vpY, 0, trackBotY);
      floorGrad.addColorStop(0, '#1e293b');
      floorGrad.addColorStop(0.5, '#0f172a');
      floorGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = floorGrad;
      ctx.fill();

      // Perspective Grid Lines scrolling downward
      ctx.strokeStyle = '#10b98133';
      ctx.lineWidth = 1.5;
      const gridOffset = (g.animTime * (gameState === 'running' ? 3.5 : 0)) % 40;

      for (let i = 0; i < 8; i++) {
        const p = ((i * 40 + gridOffset) % 320) / 320;
        const curY = vpY + Math.pow(p, 1.8) * (trackBotY - vpY);
        const curW = trackTopW + p * (trackBotW - trackTopW);
        ctx.beginPath();
        ctx.moveTo(vpX - curW / 2, curY);
        ctx.lineTo(vpX + curW / 2, curY);
        ctx.stroke();
      }

      // Center Divider line
      ctx.setLineDash([12, 10]);
      ctx.strokeStyle = '#34d39966';
      ctx.beginPath();
      ctx.moveTo(vpX, vpY);
      ctx.lineTo(vpX, trackBotY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Side Guard Rails with neon glow
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(vpX - trackTopW / 2, vpY);
      ctx.lineTo(vpX - trackBotW / 2, trackBotY);
      ctx.moveTo(vpX + trackTopW / 2, vpY);
      ctx.lineTo(vpX + trackBotW / 2, trackBotY);
      ctx.stroke();

      // ----------------------------------------------------
      // 2. RANDOM FUNNY SIDE CHARACTERS (DUCK, BANANA, ETC.)
      // ----------------------------------------------------
      g.nextSideCharDelay -= 1;
      if (g.nextSideCharDelay <= 0 && !g.sideChar.active && gameState === 'running') {
        const types = ['duck_glasses', 'duck_flip', 'banana', 'capybara'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const side = Math.random() > 0.5 ? 'left' : 'right';

        g.sideChar = {
          active: true,
          type: chosenType,
          side: side,
          y: height * 0.52 + Math.random() * (height * 0.25),
          timer: 170,
          speech: chosenType.startsWith('duck') ? 'QUACK! 🦆🕶️' :
                  chosenType === 'banana' ? 'PEANUT BUTTER! 🍌' : 'STAY CHILL 🍊'
        };

        if (soundEnabled) {
          // 1. High-impact procedural arcade SFX
          if (chosenType.startsWith('duck') && soundEngine.playGhostfaceQuack) {
            soundEngine.playGhostfaceQuack();
          } else if (chosenType === 'banana' && soundEngine.playBananaBoing) {
            soundEngine.playBananaBoing();
          } else if (chosenType === 'capybara' && soundEngine.playCapybaraRelax) {
            soundEngine.playCapybaraRelax();
          }

          // 2. Loud spoken character voice via Web Speech Synthesis
          if ('speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const voicePhrase = chosenType.startsWith('duck') 
                ? 'Quack quack!' 
                : chosenType === 'banana' 
                  ? 'Peanut butter jelly time!' 
                  : 'Stay chill, you got this!';

              const utter = new SpeechSynthesisUtterance(voicePhrase);
              utter.volume = 1.0; // Maximum volume!

              if (chosenType.startsWith('duck')) {
                utter.pitch = 1.95; // Squeaky, hilarious duck pitch
                utter.rate = 1.35;
              } else if (chosenType === 'banana') {
                utter.pitch = 1.6; // High energetic cartoon pitch
                utter.rate = 1.25;
              } else {
                utter.pitch = 0.85; // Deep, soothing, ultra-relaxed capybara pitch
                utter.rate = 0.9;
              }

              window.speechSynthesis.speak(utter);
            } catch (_) {}
          }
        }
      }

      if (g.sideChar.active) {
        g.sideChar.timer -= 1;
        const sc = g.sideChar;
        const isLeft = sc.side === 'left';
        const charX = isLeft 
          ? width * 0.08 + Math.sin(g.animTime * 0.1) * 8 
          : width * 0.92 - Math.sin(g.animTime * 0.1) * 8;
        const charY = sc.y;

        ctx.save();
        ctx.translate(charX, charY);

        if (sc.type.startsWith('duck')) {
          const bob = Math.sin(g.animTime * 0.3) * 6;
          // Duck Yellow Body
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(0, bob, 18, 14, 0, 0, Math.PI * 2);
          ctx.fill();

          // Duck Head
          ctx.beginPath();
          ctx.arc(isLeft ? 10 : -10, bob - 12, 11, 0, Math.PI * 2);
          ctx.fill();

          // Orange Beak
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          if (isLeft) {
            ctx.moveTo(18, bob - 12);
            ctx.lineTo(28, bob - 10);
            ctx.lineTo(18, bob - 6);
          } else {
            ctx.moveTo(-18, bob - 12);
            ctx.lineTo(-28, bob - 10);
            ctx.lineTo(-18, bob - 6);
          }
          ctx.closePath();
          ctx.fill();

          // Sunglasses or Hat
          if (sc.type === 'duck_glasses') {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(isLeft ? 4 : -14, bob - 15, 12, 6);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(isLeft ? 6 : -12, bob - 14, 3, 2);
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(isLeft ? 5 : -15, bob - 24, 10, 8);
            ctx.fillRect(isLeft ? 2 : -18, bob - 17, 16, 3);
          }

          // Flapping wing
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.ellipse(isLeft ? -4 : 4, bob + Math.sin(g.animTime * 0.4) * 4, 10, 6, isLeft ? -0.3 : 0.3, 0, Math.PI * 2);
          ctx.fill();

          // Feet
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(-8, bob + 13, 6, 4);
          ctx.fillRect(2, bob + 13, 6, 4);

        } else if (sc.type === 'banana') {
          const rot = Math.sin(g.animTime * 0.25) * 0.35;
          ctx.rotate(rot);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0.4, 2.8, false);
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#facc15';
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(-3, -3, 2, 0, Math.PI * 2);
          ctx.arc(3, -3, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.roundRect(-16, -8, 32, 20, 8);
          ctx.fill();
          ctx.beginPath();
          ctx.roundRect(isLeft ? 4 : -20, -18, 18, 14, 6);
          ctx.fill();
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(isLeft ? 13 : -11, -22, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Speech Bubble (Enlarged, animated & loud styling!)
        const bubbleBounce = Math.sin(g.animTime * 0.4) * 2;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-52, -56 + bubbleBounce, 104, 26, 8);
        ctx.fill();
        ctx.stroke();

        // Little speech pointer triangle
        ctx.beginPath();
        ctx.moveTo(-4, -30 + bubbleBounce);
        ctx.lineTo(4, -30 + bubbleBounce);
        ctx.lineTo(0, -22 + bubbleBounce);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = '900 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sc.speech, 0, -40 + bubbleBounce);

        ctx.restore();

        if (sc.timer <= 0) {
          sc.active = false;
          g.nextSideCharDelay = 180 + Math.floor(Math.random() * 140);
        }
      }

      // ----------------------------------------------------
      // 3. THE TWO APPROACHING DOORS (LEFT & RIGHT)
      // ----------------------------------------------------
      const doorProg = Math.max(0, Math.min(1, (100 - g.distance) / 100));
      const doorScale = 0.22 + Math.pow(doorProg, 2.2) * 0.88;
      const doorY = vpY + Math.pow(doorProg, 1.6) * (height * 0.46);

      const trackCurrentW = trackTopW + Math.pow(doorProg, 1.4) * (trackBotW - trackTopW);
      const laneDist = trackCurrentW * 0.28;

      const doorW = 95 * doorScale;
      const doorH = 150 * doorScale;

      // Draw Left Door
      const leftDoorX = vpX - laneDist;
      drawDoor(ctx, leftDoorX, doorY, doorW, doorH, 'A', doorAnswers.left, '#3b82f6', '#1d4ed8', doorProg);

      // Draw Right Door
      const rightDoorX = vpX + laneDist;
      drawDoor(ctx, rightDoorX, doorY, doorW, doorH, 'B', doorAnswers.right, '#8b5cf6', '#6d28d9', doorProg);

      // ----------------------------------------------------
      // 4. GHOSTFACE CHARACTER RENDERING & ANIMATION
      // ----------------------------------------------------
      const playerLaneOffset = g.playerX * (trackBotW * 0.26);
      const ghostfaceX = vpX + playerLaneOffset;
      const ghostfaceY = height * 0.74;

      if (gameState === 'running') {
        drawRunningGhostface(ctx, ghostfaceX, ghostfaceY, g.animTime);

        // Distance decreases as Ghostface sprints
        g.distance -= g.speed;

        // Check door crash threshold!
        if (g.distance <= 2 && !g.doorPassed) {
          g.doorPassed = true;
          const chosen = g.targetLane < 0 ? -1 : 1;
          const isCorrect = chosen === doorAnswers.correctLane;

          // Sound: Door kick / crash impact on door entry
          if (soundEnabled && soundEngine.playDoorCrash) {
            soundEngine.playDoorCrash();
          }

          if (isCorrect) {
            // ==========================================
            // SUCCESS: GHOSTFACE DANCES & EARNS POINTS!
            // ==========================================
            setGameState('dancing');
            g.danceTimer = 130;

            // Score calculation: Base + Streak multiplier + Speed bonus
            const mult = streak >= 7 ? 3.0 : streak >= 4 ? 2.0 : streak >= 2 ? 1.5 : 1.0;
            const speedBonus = g.distance > 40 ? 30 : 0;
            const earnedPoints = Math.round(100 * mult) + speedBonus;

            const newScore = score + earnedPoints;
            const newStreak = streak + 1;
            setScore(newScore);
            setStreak(newStreak);
            setBestStreak(b => Math.max(b, newStreak));
            setCorrectCount(c => c + 1);

            // Time Run Bonus: +5 Seconds!
            setTimeLeft(t => Math.min(180, t + 5));
            setTimeBonusText('+5s ⏱️');
            setTimeout(() => setTimeBonusText(null), 1600);

            // Floating canvas score popup
            g.particles.push({
              x: ghostfaceX,
              y: ghostfaceY - 60,
              vx: 0,
              vy: -2,
              symbol: `+${earnedPoints}! ✨`,
              color: '#34d399',
              life: 50
            });

            if (newScore > highScore) {
              setHighScore(newScore);
              try {
                localStorage.setItem('mindspring_ghostface_high', newScore.toString());
              } catch (_) {}
            }

            if (soundEnabled) {
              soundEngine.playGhostfaceDance();
              // Streak musical chime reward!
              if (newStreak >= 2 && soundEngine.playComboStreak) {
                setTimeout(() => soundEngine.playComboStreak(newStreak), 280);
              } else if (soundEngine.playTimeBonusSound) {
                setTimeout(() => soundEngine.playTimeBonusSound(), 260);
              }
            }

            try {
              confetti({
                particleCount: 65,
                spread: 70,
                origin: { x: ghostfaceX / width, y: ghostfaceY / height }
              });
            } catch (_) {}

          } else {
            // ==========================================
            // WRONG: GHOSTFACE LAYS DOWN & CRIES!
            // ==========================================
            setGameState('crying');
            g.cryTimer = 160;
            setStreak(0);
            setWrongCount(w => w + 1);

            // Time Penalty: -3 Seconds!
            setTimeLeft(t => Math.max(1, t - 3));
            setTimeBonusText('-3s ⚠️');
            setTimeout(() => setTimeBonusText(null), 1600);

            setExplanation(currentQuestion.explanation);

            if (soundEnabled) {
              soundEngine.playGhostfaceCry();
              if (soundEngine.playTimePenaltySound) {
                setTimeout(() => soundEngine.playTimePenaltySound(), 350);
              }
            }
          }
        }

      } else if (gameState === 'dancing') {
        drawDancingGhostface(ctx, vpX, ghostfaceY, g.animTime);

        if (Math.random() < 0.4) {
          g.particles.push({
            x: vpX + (Math.random() - 0.5) * 80,
            y: ghostfaceY - 60 - Math.random() * 30,
            vx: (Math.random() - 0.5) * 2,
            vy: -1.8 - Math.random() * 2,
            symbol: ['🎵', '🎶', '✨', '⭐', '🕺'][Math.floor(Math.random() * 5)],
            color: '#facc15',
            life: 45
          });
        }

        g.danceTimer -= 1;
        if (g.danceTimer <= 0) {
          // Advance to next shuffled question!
          currentQIndexRef.current += 1;
          prepareQuestion(currentQIndexRef.current);
          setGameState('running');
        }

      } else if (gameState === 'crying') {
        drawCryingGhostface(ctx, vpX + playerLaneOffset, ghostfaceY + 15, g.animTime, g.tears);

        g.cryTimer -= 1;
        if (g.cryTimer <= 0) {
          // Advance to next shuffled question!
          currentQIndexRef.current += 1;
          prepareQuestion(currentQIndexRef.current);
          setGameState('running');
        }
      }

      // Render Floating particles (music notes, score numbers, stars)
      g.particles = g.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.color || '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.symbol, p.x, p.y);
        return p.life > 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, doorAnswers, currentQuestion, score, streak, highScore, prepareQuestion, soundEnabled]);

  // Fast forward / Rush door
  const handleRushDoor = () => {
    if (gameState === 'running') {
      gRef.current.distance = 1;
    }
  };

  // Calculate Performance Rank
  const getRankTitle = (pts) => {
    if (pts >= 1500) return { title: '🧠 300 IQ Supreme Logic God', desc: 'Flawless common sense under extreme speed!' };
    if (pts >= 1000) return { title: '🔪 Swift Mind Assassin', desc: 'Blazing fast reflexes and top-tier intellect!' };
    if (pts >= 500) return { title: '👻 Certified Door Scholar', desc: 'Solid logical thinking and good intuition!' };
    return { title: '🦆 Apprentice of the Duck', desc: 'Great effort! The duck believes in your next run!' };
  };

  const accuracyRate = Math.round((correctCount / Math.max(1, correctCount + wrongCount)) * 100);

  return (
    <div className={isFullscreen 
      ? "fixed inset-0 z-50 bg-slate-950 flex flex-col justify-center items-center p-2 sm:p-4 overflow-y-auto" 
      : "relative rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-500/40 bg-slate-950 flex flex-col max-w-4xl mx-auto w-full animate-fade-in"
    }>
      
      {/* 1. TOP QUESTION & HUD BAR (Integrated in single compact 48px header) */}
      <div className="bg-slate-900 border-b border-emerald-500/30 px-3 sm:px-4 py-2 text-white flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md w-full">
        <div className="flex items-center space-x-2 text-xs truncate max-w-full">
          <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-lg border border-emerald-500/30 whitespace-nowrap shrink-0">
            👻 Q#{currentQIndexRef.current + 1}
          </span>
          <h3 className="font-heading font-extrabold text-xs sm:text-sm text-amber-200 tracking-wide truncate" title={currentQuestion.question}>
            "{currentQuestion.question}"
          </h3>
        </div>

        {/* Live Scores & Time Run HUD */}
        <div className="flex items-center space-x-3 text-xs shrink-0 font-mono">
          {/* Time Run Countdown */}
          <div className={`flex items-center space-x-1 font-bold px-2 py-0.5 rounded-lg border transition ${
            timeLeft <= 10 
              ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 animate-pulse' 
              : 'bg-slate-800 text-cyan-300 border-slate-700'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
            {timeBonusText && (
              <span className={`text-[10px] font-extrabold pl-1 animate-bounce ${
                timeBonusText.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {timeBonusText}
              </span>
            )}
          </div>

          {/* Score Counter */}
          <div className="flex items-center space-x-1 text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{score}</span>
          </div>

          {/* Streak Indicator */}
          {streak > 1 && (
            <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-lg text-[10px] animate-pulse border border-amber-500/30">
              🔥 {streak}x
            </span>
          )}

          {/* Fullscreen Focus Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. SLIM APPROACHING DISTANCE BAR */}
      {gameState === 'running' && (
        <div className="w-full bg-slate-800/80 h-1 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-75"
            style={{ width: `${Math.max(0, 100 - gRef.current.distance)}%` }}
          />
        </div>
      )}

      {/* 3. MAIN GAME CANVAS VIEWPORT */}
      <div className="relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={760}
          height={350}
          className="w-full h-auto max-h-[360px] object-contain cursor-pointer select-none"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 2) {
              steerTo(-1);
            } else {
              steerTo(1);
            }
          }}
        />

        {/* Start / Idle Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-3 animate-fade-in z-20">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg">
              👻🔪
            </div>
            
            <div className="space-y-1 max-w-md">
              <h3 className="text-xl font-heading font-extrabold text-white">
                Ghostface Logic Door Runner
              </h3>
              <p className="text-xs text-slate-300">
                Massive pool of 170+ non-repeating questions! Choose the <strong>CORRECT door</strong> to make Ghostface dance, earn score points, and extend your time clock (+5s)! 🦆
              </p>
            </div>

            {/* Run Duration Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-semibold">Run Duration:</span>
              <button
                type="button"
                onClick={() => setSelectedDuration(60)}
                className={`px-3 py-1 rounded-xl font-bold transition border ${
                  selectedDuration === 60 
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm' 
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                ⏱️ 60s Blitz
              </button>
              <button
                type="button"
                onClick={() => setSelectedDuration(90)}
                className={`px-3 py-1 rounded-xl font-bold transition border ${
                  selectedDuration === 90 
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm' 
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                ⏱️ 90s Champion
              </button>
            </div>

            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START SPRINT RUN! 🔪</span>
            </button>
          </div>
        )}

        {/* Dancing Toast Overlay */}
        {gameState === 'dancing' && (
          <div className="absolute top-2 bg-emerald-600/90 text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow-xl flex items-center space-x-1.5 animate-bounce border border-emerald-300 z-20">
            <span>🎉 CORRECT! 200 IQ MOVE! DANCE PARTY (+5s)! 🕺✨</span>
          </div>
        )}

        {/* Crying Toast Overlay */}
        {gameState === 'crying' && (
          <div className="absolute top-2 bg-rose-700/95 text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow-xl text-center space-y-0.5 animate-pulse border border-rose-400 max-w-sm z-20">
            <div>😭 WRONG DOOR! GHOSTFACE IS SOBBING (-3s)! 💦</div>
            {explanation && (
              <p className="text-[10px] font-medium text-rose-100">
                💡 Truth: {explanation}
              </p>
            )}
          </div>
        )}

        {/* GAME OVER RUN SUMMARY OVERLAY */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 animate-fade-in z-30">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-lg">
              🏆
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                Run Complete • Time Up!
              </span>
              <h3 className="text-xl font-heading font-extrabold text-white">
                {getRankTitle(score).title}
              </h3>
              <p className="text-[11px] text-slate-300">
                {getRankTitle(score).desc}
              </p>
            </div>

            {/* Score & Stats Grid */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-md text-center">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Final Score</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">{score}</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Total Time</span>
                <span className="text-base font-extrabold text-cyan-300 font-mono">{formatTime(runTime)}</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Accuracy</span>
                <span className="text-base font-extrabold text-amber-300 font-mono">{accuracyRate}%</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Best Streak</span>
                <span className="text-base font-extrabold text-purple-300 font-mono">{bestStreak}x</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span>✅ Correct: <strong className="text-emerald-400">{correctCount}</strong></span>
              <span>•</span>
              <span>❌ Mistakes: <strong className="text-rose-400">{wrongCount}</strong></span>
              <span>•</span>
              <span>🏆 All-Time High: <strong className="text-amber-400">{highScore}</strong></span>
            </div>

            {/* Run Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={handleStartGame}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Another Run 🔪</span>
              </button>

              {onComplete && (
                <button
                  onClick={() => onComplete(5)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Run</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. SLEEK INTEGRATED DOOR ANSWER BUTTONS (Directly beneath canvas, 38px height) */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-900 border-t border-slate-800 w-full">
        {/* Left Door Button */}
        <button
          onClick={() => steerTo(-1)}
          className={`py-2 px-3 rounded-xl border-2 transition text-left flex items-center justify-between ${
            chosenLane === -1
              ? 'bg-blue-600/30 border-blue-400 text-white ring-2 ring-blue-400/40'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            <span className="w-5 h-5 rounded-lg bg-blue-500 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
              A
            </span>
            <span className="text-xs font-bold truncate">
              {doorAnswers.left || 'Door A'}
            </span>
          </div>
          <ArrowLeft className={`w-4 h-4 shrink-0 ${chosenLane === -1 ? 'text-blue-400' : 'text-slate-500'}`} />
        </button>

        {/* Right Door Button */}
        <button
          onClick={() => steerTo(1)}
          className={`py-2 px-3 rounded-xl border-2 transition text-left flex items-center justify-between ${
            chosenLane === 1
              ? 'bg-purple-600/30 border-purple-400 text-white ring-2 ring-purple-400/40'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            <span className="w-5 h-5 rounded-lg bg-purple-500 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
              B
            </span>
            <span className="text-xs font-bold truncate">
              {doorAnswers.right || 'Door B'}
            </span>
          </div>
          <ArrowRight className={`w-4 h-4 shrink-0 ${chosenLane === 1 ? 'text-purple-400' : 'text-slate-500'}`} />
        </button>
      </div>

      {/* 5. MICRO TOOLBAR (Quick actions & hints) */}
      <div className="px-3 py-1.5 bg-slate-950 text-slate-400 text-[11px] flex items-center justify-between w-full">
        <span className="hidden sm:inline">
          Run: <strong>{formatTime(runTime)}</strong> • Accuracy: <strong>{accuracyRate}%</strong> • Controls: <strong>[A]/[←]</strong> Left • <strong>[D]/[→]</strong> Right
        </span>
        <span className="sm:hidden">
          ⏱️ {timeLeft}s • {score} pts
        </span>

        <div className="flex items-center space-x-2">
          {gameState === 'running' && (
            <button
              onClick={handleRushDoor}
              className="px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 transition flex items-center space-x-1"
              title="Rush forward into chosen door"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Rush ⚡</span>
            </button>
          )}

          <button
            onClick={handleStartGame}
            className="px-2 py-0.5 text-slate-400 hover:text-white transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart</span>
          </button>

          {onSwitchGame && (
            <button
              onClick={onSwitchGame}
              className="px-2 py-0.5 text-emerald-400 hover:text-emerald-300 transition"
            >
              Other Games
            </button>
          )}

          {onComplete && (
            <button
              onClick={() => onComplete(5)}
              className="px-2 py-0.5 text-teal-400 hover:text-teal-300 transition flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// VECTOR CANVAS DRAWING UTILITIES
// ==========================================

// Draw Door in 3D perspective
function drawDoor(ctx, x, y, w, h, label, text, primaryColor, darkColor, prog) {
  if (prog < 0.05) return;

  ctx.save();
  ctx.translate(x, y);

  // Outer Door Frame
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = Math.max(1.5, 3 * prog);
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Inner Door Panel
  const panelW = w * 0.82;
  const panelH = h * 0.86;
  const doorGrad = ctx.createLinearGradient(0, -panelH / 2, 0, panelH / 2);
  doorGrad.addColorStop(0, primaryColor + '55');
  doorGrad.addColorStop(1, darkColor);
  ctx.fillStyle = doorGrad;
  ctx.beginPath();
  ctx.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 4);
  ctx.fill();

  // Door Knob
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(panelW * 0.32, 0, Math.max(2, 4 * prog), 0, Math.PI * 2);
  ctx.fill();

  // Door Door Label Badge (A or B)
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(0, -panelH * 0.35, Math.max(6, 12 * prog), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.max(8, Math.floor(13 * prog))}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, -panelH * 0.35);

  // Answer Text written on door
  if (prog > 0.16) {
    const fontSize = Math.max(9, Math.floor(13 * prog));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // High contrast background pill for instant answer readability
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.beginPath();
    ctx.roundRect(-panelW * 0.46, -panelH * 0.08, panelW * 0.92, panelH * 0.42, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    // Wrap text into 2 lines if needed
    const words = (text || '').split(' ');
    if (words.length > 2 && text.length > 12) {
      const mid = Math.ceil(words.length / 2);
      const l1 = words.slice(0, mid).join(' ');
      const l2 = words.slice(mid).join(' ');
      ctx.fillText(l1, 0, panelH * 0.05);
      ctx.fillText(l2, 0, panelH * 0.22);
    } else {
      ctx.fillText(text, 0, panelH * 0.12);
    }
  }

  ctx.restore();
}

// 1. Draw Ghostface in RUNNING MODE
function drawRunningGhostface(ctx, x, y, time) {
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(time * 0.28) * 5;
  const legSwing = Math.sin(time * 0.28) * 12;

  // Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 36, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Running Legs
  ctx.fillStyle = '#020617';
  ctx.fillRect(-12 + legSwing * 0.4, 18, 7, 16);
  ctx.fillRect(5 - legSwing * 0.4, 18, 7, 16);

  // Flowing Black Hooded Robe / Cloak
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.moveTo(0, -32 + bob);
  ctx.lineTo(-24, 22 + bob);
  // Tattered Hem
  ctx.lineTo(-14, 28 + bob);
  ctx.lineTo(-4, 22 + bob);
  ctx.lineTo(8, 28 + bob);
  ctx.lineTo(24, 22 + bob);
  ctx.closePath();
  ctx.fill();

  // Flowing cloak shadow ripples
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-10, -10 + bob);
  ctx.lineTo(-12, 22 + bob);
  ctx.moveTo(8, -10 + bob);
  ctx.lineTo(10, 22 + bob);
  ctx.stroke();

  // White Scream Mask
  drawScreamMask(ctx, 0, -22 + bob, 1.0);

  // Black Hood wrapping around mask
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(0, -22 + bob, 15, Math.PI * 0.8, Math.PI * 2.2);
  ctx.lineTo(0, -38 + bob);
  ctx.closePath();
  ctx.fill();

  // Right Hand & Hunting Knife
  const armPump = Math.cos(time * 0.28) * 10;
  ctx.save();
  ctx.translate(16, -4 + bob + armPump);
  drawKnifeHand(ctx, -0.2);
  ctx.restore();

  ctx.restore();
}

// 2. Draw Ghostface in DANCING MODE (Victory groove!)
function drawDancingGhostface(ctx, x, y, time) {
  ctx.save();
  ctx.translate(x, y);

  const danceBeat = time * 0.24;
  const hipSway = Math.sin(danceBeat) * 14;
  const headBob = Math.abs(Math.sin(danceBeat * 2)) * 6;
  const knifeSwing = Math.sin(danceBeat) * 0.6;

  // Flashy colorful dance floor glow underneath
  ctx.fillStyle = ['#ec489955', '#3b82f655', '#10b98155', '#f59e0b55'][Math.floor(time * 0.1) % 4];
  ctx.beginPath();
  ctx.ellipse(0, 36, 36, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Grooving legs
  ctx.fillStyle = '#020617';
  ctx.fillRect(-12 + hipSway * 0.3, 16, 7, 18);
  ctx.fillRect(5 - hipSway * 0.3, 16, 7, 18);

  // Billowing Dancing Robe
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.moveTo(0, -32 - headBob);
  ctx.lineTo(-26 + hipSway, 22);
  ctx.lineTo(-12, 28);
  ctx.lineTo(0, 22);
  ctx.lineTo(14, 28);
  ctx.lineTo(26 + hipSway, 22);
  ctx.closePath();
  ctx.fill();

  // Scream Mask tilted cheerfully
  ctx.save();
  ctx.rotate(hipSway * 0.02);
  drawScreamMask(ctx, 0, -22 - headBob, 1.05);
  ctx.restore();

  // Raised Arm Waving the Knife overhead like a disco baton!
  ctx.save();
  ctx.translate(16 + hipSway * 0.5, -34 - headBob);
  ctx.rotate(-1.2 + knifeSwing);
  drawKnifeHand(ctx, 0);
  ctx.restore();

  // Left Arm Disco Point
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(-18 - hipSway * 0.5, -10, 6, 0, Math.PI * 2);
  ctx.fill();

  // Funky Speech Bubble
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-45, -78, 90, 22, 8);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("200 IQ MOVE! 🕺✨", 0, -63);

  ctx.restore();
}

// 3. Draw Ghostface in CRYING MODE (Lays down on floor sobbing!)
function drawCryingGhostface(ctx, x, y, time, tearsArray) {
  ctx.save();
  ctx.translate(x, y);

  const tantrumKick = Math.sin(time * 0.35) * 8;

  // Expanding Blue Tear Puddle on the floor
  ctx.fillStyle = '#38bdf888';
  ctx.beginPath();
  ctx.ellipse(0, 16, 48, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dropped Knife lying flat on the floor beside him
  ctx.save();
  ctx.translate(34, 14);
  ctx.rotate(0.6);
  drawDroppedKnife(ctx);
  ctx.restore();

  // Ghostface Body Laying Flat on Floor
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.ellipse(0, 10, 32, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tantrum Feet kicking up in the air
  ctx.fillRect(-28, 6 + tantrumKick, 8, 12);
  ctx.fillRect(-24, 6 - tantrumKick, 8, 12);

  // Head facedown / side angle on floor
  ctx.save();
  ctx.translate(16, 4);
  ctx.rotate(0.35);
  drawScreamMask(ctx, 0, 0, 0.85);
  ctx.restore();

  // GENERATE TEAR FOUNTAIN PARTICLES!
  if (Math.random() < 0.6) {
    tearsArray.push({
      x: 18 + (Math.random() - 0.5) * 6,
      y: 4,
      vx: (Math.random() - 0.5) * 3 + 1,
      vy: -3.5 - Math.random() * 2,
      life: 26
    });
  }

  // Draw Animated Tear Arcs
  ctx.fillStyle = '#38bdf8';
  for (let i = tearsArray.length - 1; i >= 0; i--) {
    const t = tearsArray[i];
    t.x += t.vx;
    t.y += t.vy;
    t.vy += 0.28; // gravity
    t.life -= 1;

    ctx.beginPath();
    ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
    ctx.fill();

    if (t.life <= 0) {
      tearsArray.splice(i, 1);
    }
  }

  // Comic "WHYYYY?!" Speech Bubble
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-42, -38, 84, 22, 8);
  ctx.fill();
  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("WHYYYY?! 😭💦", 0, -24);

  ctx.restore();
}

// Draw Iconic White Scream Mask
function drawScreamMask(ctx, x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // White Mask Oval Base
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(-15, -18, -14, 2, -5, 16);
  ctx.bezierCurveTo(-3, 20, 3, 20, 5, 16);
  ctx.bezierCurveTo(14, 2, 15, -18, 0, -18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Iconic Drooping Hollow Eye Sockets
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.ellipse(-6, -6, 3.5, 6.5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, -6, 3.5, 6.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // White Eye Highlights (specular dot)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-7, -8, 1.2, 0, Math.PI * 2);
  ctx.arc(5, -8, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Tiny Nostril slits
  ctx.fillStyle = '#020617';
  ctx.fillRect(-2, 0, 1.2, 2.5);
  ctx.fillRect(0.8, 0, 1.2, 2.5);

  // Iconic Gaping Teardrop Scream Mouth
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.ellipse(0, 8, 4, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Clothed Arm holding Hunting Knife
function drawKnifeHand(ctx, angle = 0) {
  ctx.rotate(angle);

  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, -3, 8, 5);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(7, -6, 3, 11);

  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(10, -4);
  ctx.lineTo(24, -4);
  ctx.bezierCurveTo(28, -2, 30, 2, 24, 3);
  ctx.lineTo(10, 3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(28, 0, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

// Dropped Knife on floor
function drawDroppedKnife(ctx) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-8, -2, 7, 4);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-1, -4, 2, 8);
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(1, -3);
  ctx.lineTo(16, -3);
  ctx.bezierCurveTo(19, -1, 20, 2, 16, 2);
  ctx.lineTo(1, 2);
  ctx.closePath();
  ctx.fill();
}
