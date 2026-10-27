// MindSpring Stressors and Deterministic Matching Matrix
// Rooted in evidence-based student wellness research (WHO, UNICEF, CBT, BJ Fogg Model)

export const MOODS = [
  { id: 'calm', label: 'Calm & Grounded', emoji: '🌿', color: 'from-emerald-400 to-teal-500', score: 5 },
  { id: 'happy', label: 'Uplifted & Motivated', emoji: '☀️', color: 'from-amber-400 to-orange-400', score: 5 },
  { id: 'scattered', label: 'Distracted / Procrastinating', emoji: '🌪️', color: 'from-yellow-400 to-amber-500', score: 3 },
  { id: 'anxious', label: 'Anxious / Nervous', emoji: '⚡', color: 'from-purple-400 to-indigo-500', score: 2 },
  { id: 'overwhelmed', label: 'Heavy / Overwhelmed', emoji: '🌊', color: 'from-rose-400 to-red-500', score: 1 },
  { id: 'exhausted', label: 'Drained / Low Energy', emoji: '🌙', color: 'from-blue-400 to-slate-500', score: 2 },
];

export const STRESSORS = [
  {
    id: 'exam_stress',
    title: 'Exam & Revision Overwhelm',
    icon: 'BookOpen',
    description: 'Syllabus backlog, upcoming assessments, test panic & fear of blanking out',
    tag: 'Academic Pressure',
    color: 'emerald',
    defaultGoals: [
      'Break a scary chapter into 3 small micro-steps',
      'Calm down physical test nerves before studying',
      'Create a realistic 25-minute revision sprint'
    ]
  },
  {
    id: 'procrastination',
    title: 'Task Avoidance & Procrastination',
    icon: 'Hourglass',
    description: 'Stuck scrolling, delayed starts, perfectionism paralysis & guilt',
    tag: 'Behavioral Habit',
    color: 'amber',
    defaultGoals: [
      'Just do 5 minutes of study without pressure to finish',
      'Clear the mental block holding back my start',
      'Break the guilt-scrolling loop with a quick reset'
    ]
  },
  {
    id: 'low_confidence',
    title: 'Fear of Failure & Low Confidence',
    icon: 'Sparkles',
    description: 'Self-doubt, feeling "not smart enough", imposter syndrome in class',
    tag: 'Self-Worth',
    color: 'purple',
    defaultGoals: [
      'Flip one harsh negative self-criticism into reality',
      'Remember 2 moments where I persevered before',
      'Build confidence to ask questions in class'
    ]
  },
  {
    id: 'social_pressure',
    title: 'Social Comparison & Peer Pressure',
    icon: 'Users',
    description: 'Comparing marks with peers, fear of being left behind or judged',
    tag: 'Social Balance',
    color: 'teal',
    defaultGoals: [
      'Focus strictly on my own personal baseline growth',
      'Set healthy boundaries around peer marks comparison',
      'Celebrate a classmate without feeling less valuable'
    ]
  },
  {
    id: 'family_expectations',
    title: 'Family Expectations & High Standards',
    icon: 'Home',
    description: 'Worry about letting parents down, expectations on competitive ranks',
    tag: 'Expectations',
    color: 'sky',
    defaultGoals: [
      'Reassure myself that my self-worth exceeds exam scores',
      'Prepare an honest, respectful check-in with parents',
      'Separate healthy effort from unrealistic perfection'
    ]
  },
  {
    id: 'sleep_fatigue',
    title: 'Sleep Debt & Physical Exhaustion',
    icon: 'Moon',
    description: 'Late night cramming, irregular sleep cycle, screen fatigue & headaches',
    tag: 'Physical Wellness',
    color: 'indigo',
    defaultGoals: [
      'Wind down screen exposure 30 minutes before bed',
      'Do a soothing 4-7-8 breathing session to relax tension',
      'Restore energy through gentle body neck/shoulder release'
    ]
  },
  {
    id: 'conflict_bullying',
    title: 'Interpersonal Friction & Social Stress',
    icon: 'Shield',
    description: 'Misunderstandings with friends, social drama, or exclusion',
    tag: 'Psychological Safety',
    color: 'rose',
    defaultGoals: [
      'Establish a safe mental buffer against unkind words',
      'Identify one trusted friend or counselor to talk to',
      'Ground myself in my core strengths and self-respect'
    ]
  }
];
