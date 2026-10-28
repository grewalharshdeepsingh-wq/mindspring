// MindSpring Intelligent Problem Solver & Motivational Engine
// Offline-first, evidence-based cognitive & psychological triage for student challenges.
// Combines Cognitive Behavioral Therapy (CBT), BJ Fogg micro-habits, and empathetic mentoring.

export const SAMPLE_PROBLEMS = [
  {
    label: "Exam Tomorrow & Syllabus Backlog",
    category: "academic",
    intensity: "high",
    text: "I have a major exam tomorrow and I still haven't finished 4 important chapters. I am panicking, my mind is blanking out, and I don't know where to start."
  },
  {
    label: "Stuck in 3-Hour Procrastination Loop",
    category: "focus",
    intensity: "moderate",
    text: "I've been scrolling social media and wasting time for 3 hours even though I have an assignment due tonight. I feel terrible guilt but I still can't bring myself to open my book."
  },
  {
    label: "Bad Marks & Fear of Parents' Disappointment",
    category: "family",
    intensity: "high",
    text: "I got poor marks on my latest test. My parents had huge expectations for me, and I am terrified to show them my paper. I feel like a total failure and disappointment to my family."
  },
  {
    label: "Left Out & Friend Group Friction",
    category: "social",
    intensity: "moderate",
    text: "My close friends made plans without including me and they are whispering in class. I feel completely rejected, lonely, and cannot concentrate on my studies."
  },
  {
    label: "Completely Burnt Out & Emotionally Drained",
    category: "burnout",
    intensity: "high",
    text: "I've been studying non-stop for weeks without proper sleep. Now my brain feels foggy, I have constant headaches, and I literally have zero energy or will to study."
  },
  {
    label: "Imposter Syndrome / Comparing with Toppers",
    category: "confidence",
    intensity: "moderate",
    text: "Everyone in my class seems so much smarter and faster than me. No matter how hard I work, I feel like I'm always lagging behind and will never be good enough."
  },
  {
    label: "Stage Fright Before Class Presentation",
    category: "confidence",
    intensity: "high",
    text: "I have to give a 5-minute presentation in front of the whole class tomorrow. My hands start shaking, my heart beats fast, and I'm terrified I'll forget everything and be laughed at."
  },
  {
    label: "Overwhelmed by Too Many Deadlines",
    category: "focus",
    intensity: "high",
    text: "Everything is hitting me at once: 3 tests, lab reports, coaching homework, and family chores. My to-do list is massive and I'm completely paralyzed by chaos."
  }
];

export const PROBLEM_CATEGORIES = [
  { id: 'all', label: 'All Challenges' },
  { id: 'academic', label: '📚 Academic & Exams' },
  { id: 'focus', label: '⏳ Focus & Procrastination' },
  { id: 'confidence', label: '✨ Confidence & Mindset' },
  { id: 'family', label: '🏠 Family & Expectations' },
  { id: 'social', label: '👥 Friends & Social' },
  { id: 'burnout', label: '🌙 Burnout & Fatigue' },
];

// Safety crisis keywords
const CRISIS_PATTERNS = [
  /\b(suicid|kill\s*myself|end\s*my\s*life|want\s*to\s*die|self\s*harm|cut\s*myself|hurt\s*myself|better\s*off\s*dead|no\s*reason\s*to\s*live)\b/i
];

/**
 * Analyzes the user's problem and returns:
 * 1. Brief understanding & root-cause diagnosis
 * 2. Step-by-step actionable solution with 5-min triage and recommended tool
 * 3. Uplifting, high-impact motivation and power affirmation
 */
export function analyzeAndSolveProblem({
  problemText = '',
  category = 'all',
  intensity = 'moderate',
  studentName = ''
}) {
  const cleanText = problemText.trim();
  const lower = cleanText.toLowerCase();
  const displayName = studentName ? studentName.trim() : 'Champion';

  // 1. Safety check
  const isCrisis = CRISIS_PATTERNS.some(p => p.test(lower));
  if (isCrisis) {
    return {
      isCrisis: true,
      category: 'safety',
      understanding: {
        summary: "We hear the immense weight and pain you are carrying right now.",
        rootCause: "Overwhelming emotional distress signaling that you need immediate compassionate human connection, not solo study pressure.",
        validation: "Your life, safety, and well-being are infinitely more valuable than any grade, school test, or expectation. You do not have to carry this alone."
      },
      solution: {
        immediate5Min: "Step away from all study materials immediately. Drink a glass of water, sit in a safe spot, and reach out to one of the trusted 24/7 confidential helplines below.",
        steps: [
          {
            title: "Pause and ground your body",
            action: "Take 4 slow, long exhalations. Remind yourself: 'I am safe in this physical moment, and help is available.'"
          },
          {
            title: "Connect with a trained, compassionate counselor",
            action: "Call 988 (USA/Canada), Tele-MANAS at 14416 (India), Childline 1098, or text HOME to 741741 for free, private, non-judgmental support."
          },
          {
            title: "Talk to someone you trust",
            action: "Tell a parent, trusted teacher, or school counselor: 'I am having a very hard time right now and need support.'"
          }
        ],
        recommendedTool: {
          id: 'crisis',
          title: '24/7 Confidential Crisis Helplines',
          type: 'counselor',
          description: 'Immediate, toll-free, 100% confidential professional support.'
        },
        actionItem: "Reach out to a trusted adult or helpline right now."
      },
      motivation: {
        pepTalk: `${displayName}, please know this deeply: You are important, your presence in this world matters, and this painful moment will pass. Pain lies to us and makes problems seem permanent, but tomorrow holds healing, relief, and new possibilities. Please let someone help you carry this weight today.`,
        affirmation: "My life is precious, my story is not finished, and I deserve support and care.",
        mindsetShift: {
          from: "I have to suffer through this alone.",
          to: "Reaching out for help is an act of supreme courage, not weakness."
        },
        audioScript: `${displayName}, you are not alone. Please pause, take a deep breath, and reach out to a trusted adult or counselor. Your life has immense value.`
      }
    };
  }

  // 2. Identify dominant problem domain
  const domain = detectDomain(lower, category);

  // 3. Build comprehensive structured output
  return buildProblemSolution(domain, lower, intensity, displayName, cleanText);
}

function detectDomain(text, selectedCat) {
  if (selectedCat && selectedCat !== 'all') {
    return selectedCat;
  }

  // Linguistic pattern scoring
  const scores = {
    academic: 0,
    focus: 0,
    confidence: 0,
    family: 0,
    social: 0,
    burnout: 0
  };

  // Academic / Exam panic
  if (/exam|test|syllabus|chapter|blank|revision|marks|formula|study|math|science|fail|grade/i.test(text)) scores.academic += 3;
  if (/tomorrow|tonight|running out of time|backlog|due/i.test(text)) scores.academic += 2;

  // Focus & Procrastination
  if (/scroll|phone|distract|procrastinat|put off|wasting time|instagram|youtube|can't focus|lazy|delay/i.test(text)) scores.focus += 4;
  if (/paralyzed|stuck|freeze|start/i.test(text)) scores.focus += 2;

  // Family expectations
  if (/parent|mother|father|mom|dad|family|disappoint|shout|expect|scold|angry/i.test(text)) scores.family += 4;

  // Friends & Social
  if (/friend|group|left out|bully|rumor|ignoring|teas|popular|lonely|alone|classmate/i.test(text)) scores.social += 4;

  // Burnout & Fatigue
  if (/tired|exhaust|sleep|headache|foggy|drain|burnout|no energy|insomnia|collapse/i.test(text)) scores.burnout += 4;

  // Confidence & Imposter syndrome
  if (/imposter|dumb|stupid|not smart|not good enough|compare|presentation|stage fright|nervous|anxious/i.test(text)) scores.confidence += 4;

  let best = 'academic';
  let maxScore = -1;
  for (const [key, val] of Object.entries(scores)) {
    if (val > maxScore) {
      maxScore = val;
      best = key;
    }
  }

  return maxScore > 0 ? best : 'academic';
}

function buildProblemSolution(domain, text, intensity, studentName, _originalText) {
  switch (domain) {
    case 'academic': {
      const isUrgent = /tomorrow|tonight|few hours|blank/i.test(text);
      return {
        isCrisis: false,
        category: 'academic',
        domainLabel: 'Exam & Academic Strategy',
        understanding: {
          summary: isUrgent
            ? "You are facing intense time pressure with a heavy syllabus backlog, triggering an acute freeze reflex."
            : "You are experiencing academic overwhelm from a heavy workload and fear of falling short on assessments.",
          rootCause: "Cognitive Overload & Threat-Response Freeze. When your brain views an entire syllabus as a single giant threat, your prefrontal cortex shuts down, making you feel blank or panicked.",
          validation: "Feeling panicked before a test is a universal biological reaction, not a reflection of your intelligence. Your brain is trying to protect you, but we can calm it down and salvage your preparation systematically."
        },
        solution: {
          immediate5Min: "Take 3 deep physiological sighs (two quick inhales through the nose, one long slow exhale through the mouth). Grab 1 blank sheet of paper and write down ONLY the 3 highest-yield topics that carry 60% of the test marks.",
          steps: [
            {
              title: "Apply the 80/20 Triage Rule",
              action: "Do not attempt to read 100% of the book line-by-line tonight. Focus strictly on: summary sheets, formulas/key definitions, and past year sample questions."
            },
            {
              title: "Work in 20-Minute Focused Micro-Sprints",
              action: "Set a timer for 20 minutes on just ONE concept. Hide your phone outside the room. When the timer rings, take a 3-minute stretch."
            },
            {
              title: "Protect Minimum 6 Hours of Sleep",
              action: "Pulling an all-nighter destroys memory consolidation. Even 5-6 hours of sleep will give you 200% better recall than cramming until 4 AM while hallucinating."
            }
          ],
          recommendedTool: {
            id: 'study_timer',
            title: 'BJ Fogg 5-Minute Study Start',
            type: 'timer',
            description: 'Bypass panic resistance with a 5-minute zero-pressure focus sprint with calming background audio.'
          },
          actionItem: "Pick the single easiest high-yield topic and study it for just 15 minutes."
        },
        motivation: {
          pepTalk: `${studentName}, listen closely: One exam does not define your future or measure your worth as a human being. Right now, stop fighting the clock and start conquering the next 15 minutes. Even if you only master 3 key concepts tonight, that is 3 concepts more than panic will give you. You have faced difficult chapters before and survived. Breathe into your chest, drop your shoulders, and take this one step at a time. You've got this!`,
          affirmation: "I don't need to be perfect; I just need to be present and do what I can right now.",
          mindsetShift: {
            from: "I'm ruined because I didn't study everything.",
            to: "I will maximize the points I can realistically secure right now."
          },
          audioScript: `${studentName}, take a deep breath. Stop fighting the clock. Focus on one small concept right now. You are stronger and smarter than your anxiety.`
        }
      };
    }

    case 'focus': {
      return {
        isCrisis: false,
        category: 'focus',
        domainLabel: 'Procrastination & Focus Recovery',
        understanding: {
          summary: "You are caught in an avoidance-guilt loop where starting feels emotionally uncomfortable, so your brain escapes into quick dopamine.",
          rootCause: "Emotional Discomfort Avoidance (Perfectionism Paralysis). Procrastination is not laziness; it is your brain escaping the subconscious fear of doing poorly or facing mental friction.",
          validation: "The guilt you feel while scrolling proves you actually care deeply about your work. Forgive yourself for the last 3 hours immediately—shame only prolongs the procrastination cycle."
        },
        solution: {
          immediate5Min: "Physically stand up, shake your arms, and drink one full glass of cold water. Put your phone in another room or inside a drawer. Return to your desk and open your notebook without writing a single word yet.",
          steps: [
            {
              title: "Lower the Starting Bar to Ridiculously Easy",
              action: "Give yourself permission to do terrible, messy work for the first 5 minutes. Tell yourself: 'I am only going to write 2 sentences or solve 1 example problem.'"
            },
            {
              title: "Break the Task into 3 Nano-Actions",
              action: "Don't write 'Finish Project' on your to-do list. Write: 1) Open file, 2) Type title, 3) Write first heading."
            },
            {
              title: "Ride the Momentum Wave",
              action: "Neuroscience proves that once you start, the Zeigarnik effect kicks in and the mental resistance drops by 80%. Let inertia work for you."
            }
          ],
          recommendedTool: {
            id: 'study_timer',
            title: '5-Minute Focus Sprint',
            type: 'timer',
            description: 'A micro-commitment timer that tricks your brain past resistance without burnout.'
          },
          actionItem: "Work for exactly 5 minutes with phone in another room."
        },
        motivation: {
          pepTalk: `${studentName}, forgive yourself for the time already passed. What matters is not how the last 3 hours went, but what you choose to do with the next 10 minutes. Action produces motivation, not the other way around! You do not need to feel like studying; you just need to move your hands. Let's break the paralysis right now—one tiny micro-win will turn the entire momentum of your day around!`,
          affirmation: "The secret of getting ahead is simply getting started. Small progress is still progress.",
          mindsetShift: {
            from: "I wasted half the day, so today is ruined.",
            to: "The reset button is always available. My comeback starts right now."
          },
          audioScript: `${studentName}, let go of the guilt. The past is done. Your momentum starts with one simple action right now. Let's do 5 minutes together.`
        }
      };
    }

    case 'family': {
      return {
        isCrisis: false,
        category: 'family',
        domainLabel: 'Family Expectations & Emotional Safety',
        understanding: {
          summary: "You are experiencing intense anxiety around meeting family standards and the painful fear of disappointing the people who raise you.",
          rootCause: "Interpersonal Worth Attachment. When love or approval feels tied to academic performance, low marks trigger deep rejection anxiety.",
          validation: "It hurts when parents express anger or disappointment, but please know: their reaction stems from their own anxieties about your security. Your intrinsic value as their child never decreases because of numbers on a page."
        },
        solution: {
          immediate5Min: "Do 2 minutes of box breathing (4 in, 4 hold, 4 out, 4 hold). Remind yourself 3 times: 'My exam score is just an academic checkpoint, not my worth as a person.'",
          steps: [
            {
              title: "Separate Effort from the Outcome",
              action: "Analyze where the gaps actually occurred (e.g. concept confusion, silly calculation errors, or poor time management) so you have objective facts."
            },
            {
              title: "Prepare an Ownership Script for Your Parents",
              action: "Approach them proactively: 'I know this score isn't what we hoped for. I've analyzed where I lost marks, and here is my specific plan to improve next time.'"
            },
            {
              title: "Create an Emotional Boundary",
              action: "If they are angry or compare you to others, do not internalize the harsh words. Let the storm blow over; actions over the next month speak louder than arguments."
            }
          ],
          recommendedTool: {
            id: 'thought_flip',
            title: 'CBT Thought Flip',
            type: 'thought_flip',
            description: 'Flip catastrophic fears of rejection into grounded objective reality.'
          },
          actionItem: "Write down 2 actionable steps you will take to improve the next assessment."
        },
        motivation: {
          pepTalk: `${studentName}, hold your head high. You are so much more than a student with a test score—you are a growing human being with talents, empathy, and dreams that no exam paper can ever capture. Even the greatest thinkers, scientists, and leaders experienced failed exams and parental friction. What defines you is your resilience to learn from this bump and keep moving forward. Be proud of the effort you make every single day.`,
          affirmation: "I am worthy of respect and love, independent of any academic score.",
          mindsetShift: {
            from: "If my parents are upset, I am a failure.",
            to: "My parents care about my future, but my growth is a long journey and this test is just one data point."
          },
          audioScript: `${studentName}, remember: your worth is not defined by test scores. Breathe deeply. You have a long, bright future ahead.`
        }
      };
    }

    case 'social': {
      return {
        isCrisis: false,
        category: 'social',
        domainLabel: 'Peer Dynamics & Social Belonging',
        understanding: {
          summary: "You are dealing with social exclusion, misunderstanding, or drama, which triggers our deepest biological fear of isolation.",
          rootCause: "Social Threat Sensitivity. In school, our evolutionary brain equates social belonging with survival, which is why peer friction feels physically painful.",
          validation: "It hurts deeply when friends act distant or unkind. Your feelings of sadness and frustration are completely valid. But remember that teen friendships fluctuate constantly, and their behavior is a reflection of them, not your value."
        },
        solution: {
          immediate5Min: "Step away from school group chats or social media feeds. Splash cool water on your face to stimulate your vagus nerve and reset your emotional state.",
          steps: [
            {
              title: "Avoid Catastrophizing Assumptions",
              action: "Often whispers or exclusions are thoughtless misunderstandings rather than planned malice. Don't assume the worst until you have clear communication."
            },
            {
              title: "Broaden Your Social Circle by Just 1 Person",
              action: "Initiate a warm conversation with someone outside that clique—a classmate who sits quietly, a lab partner, or a friend from another section."
            },
            {
              title: "Focus on Your Inner Anchor",
              action: "Invest your energy into things you control: your curiosity, your passions, your reading, and your health. True friends gravitate toward people who cultivate their own light."
            }
          ],
          recommendedTool: {
            id: 'gratitude',
            title: 'Gratitude Garden',
            type: 'gratitude',
            description: 'Rebalance your focus on everyday kindness and positive moments.'
          },
          actionItem: "Reach out to one supportive person or write 1 thing you appreciate about yourself."
        },
        motivation: {
          pepTalk: `${studentName}, your worth is not up for a popularity vote in a school hallway. School years can be socially turbulent, but the people who make you feel small today are not the authors of your destiny. You are kind, thoughtful, and deserving of genuine, authentic friendships. Keep showing up with dignity and warmth. Your true tribe will appreciate you for exactly who you are!`,
          affirmation: "I don't need everyone's approval; I belong to myself and value my peace.",
          mindsetShift: {
            from: "Nobody likes me and I don't fit in.",
            to: "I am growing into who I want to be, and I will attract friendships built on genuine respect."
          },
          audioScript: `${studentName}, don't let temporary school drama dim your light. You are worthy of genuine friendships, and you will find people who truly cherish you.`
        }
      };
    }

    case 'burnout': {
      return {
        isCrisis: false,
        category: 'burnout',
        domainLabel: 'Burnout Recovery & Energy Restoration',
        understanding: {
          summary: "You are experiencing chronic nervous system exhaustion and cognitive fatigue from sustained high output without restorative rest.",
          rootCause: "Ego Depletion & Sleep Debt. The human brain cannot continuously synthesize new information without REM sleep and parasympathetic downtime.",
          validation: "Your body is not failing you—it is screaming for rest. Forcing a burnt-out brain to memorize formulas is like driving a car with zero fuel; you must refill the tank first."
        },
        solution: {
          immediate5Min: "Lie down flat on your back, place your hands on your belly, close your eyes, and do 10 gentle belly breaths. No screens, no audio, just total physical release.",
          steps: [
            {
              title: "Implement an Absolute Digital Curfew Tonight",
              action: "Turn off all blue light screens 45 minutes before sleep. Read a physical leisure book or listen to ambient rain soundscapes."
            },
            {
              title: "Slash Your Schedule Down to Essentials",
              action: "Cancel or postpone non-urgent tasks today. Keep only 1 essential academic commitment and let the rest wait."
            },
            {
              title: "Fuel with Hydration & Gentle Movement",
              action: "Drink 2 large glasses of water and take a 10-minute walk outside in natural light to rebalance serotonin and circadian cortisol."
            }
          ],
          recommendedTool: {
            id: 'meditation',
            title: 'Restorative Guided Meditation',
            type: 'meditation',
            description: 'A somatic body scan to melt physical neck and eye tension and restore mental clarity.'
          },
          actionItem: "Schedule an early bedtime tonight with at least 8 hours of restorative sleep."
        },
        motivation: {
          pepTalk: `${studentName}, taking rest is not slacking off—rest is an essential part of the work! Elite athletes rest to build muscle; student brains rest to consolidate memory and sharpen intellect. You have worked relentlessly and pushed through difficult challenges. Give yourself permission to pause today without guilt. A rested, recharged you can accomplish in 1 hour what an exhausted you struggles with for 5 hours. Honor your body today!`,
          affirmation: "Rest is productive. Recharging my mind makes me unstoppable.",
          mindsetShift: {
            from: "If I rest, I am falling behind.",
            to: "Rest is strategic maintenance that protects my intelligence and longevity."
          },
          audioScript: `${studentName}, give yourself permission to rest. You have pushed so hard. Recharging your energy today will give you twice the strength tomorrow.`
        }
      };
    }

    case 'confidence':
    default: {
      return {
        isCrisis: false,
        category: 'confidence',
        domainLabel: 'Self-Belief & Confidence Rebuild',
        understanding: {
          summary: "You are dealing with harsh inner self-criticism, fear of judgment, and feelings of not measuring up to your peers.",
          rootCause: "Imposter Phenomenon & Negativity Bias. The brain magnifies personal flaws 10x while downplaying personal strengths and past achievements.",
          validation: "Almost every high-achieving student secretly feels like an imposter who will get 'found out'. The fact that you feel anxious means you care deeply about doing well, but self-doubt is just a mental echo, not the truth."
        },
        solution: {
          immediate5Min: "Stand in an expansive posture with your chest open and shoulders back for 60 seconds. Write down 2 specific challenges you faced in the past and successfully overcame.",
          steps: [
            {
              title: "Challenge the Catastrophic Voice",
              action: "Ask yourself: 'What is the absolute worst that could happen, and will this matter in 6 months?' Usually the real worst-case is completely survivable."
            },
            {
              title: "Focus on Process, Not Performance",
              action: "Shift your mental benchmark from 'I must be flawless' to 'I will show up, do my best, and accept whatever learning comes with it.'"
            },
            {
              title: "Collect Your Wins in Writing",
              action: "Keep a daily 1-line log of small triumphs: asking a question, understanding a theorem, or resisting distraction."
            }
          ],
          recommendedTool: {
            id: 'thought_flip',
            title: 'CBT Thought Flip Tool',
            type: 'thought_flip',
            description: 'Disarm self-criticism and reframe imposter thoughts into factual strengths.'
          },
          actionItem: "Record 1 victory from this week, no matter how small."
        },
        motivation: {
          pepTalk: `${studentName}, stop comparing your behind-the-scenes struggles to everyone else's highlight reels! You do not see the doubts, tears, and mistakes your peers make in private. You are here because of your perseverance, your curiosity, and your continuous courage to keep trying. Trust your training, trust your mind, and step forward with confidence. You are more capable than you realize!`,
          affirmation: "I have what it takes to handle whatever comes my way. I believe in my ability to learn.",
          mindsetShift: {
            from: "Everyone is better than me and I don't belong here.",
            to: "I belong in any room I walk into. I am here to learn and grow at my own unique pace."
          },
          audioScript: `${studentName}, believe in yourself today. You have overcome obstacles before, and you have everything inside you to succeed right now.`
        }
      };
    }
  }
}
