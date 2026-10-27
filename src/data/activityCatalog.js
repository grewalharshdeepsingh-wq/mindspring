// MindSpring Curated Vetted Wellness Activity Repository
// 4 Categories: 'relief' (Stress-Relief), 'growth' (Growth Activity), 'action' (Practical Stressor Action), 'break' (Fun / Mindful Break)

export const ACTIVITY_CATALOG = [
  // =================== 1. STRESS-RELIEF ACTIVITIES ===================
  {
    id: 'mindful_meditation',
    category: 'relief',
    title: 'Mindful Breathing & Guided Meditation',
    durationMinutes: 3,
    type: 'meditation',
    stressorSuitability: ['exam_stress', 'anxious', 'overwhelmed', 'procrastination', 'sleep_fatigue', 'social_pressure', 'family_expectations', 'conflict_bullying', 'scattered'],
    description: 'Guided mindfulness meditation with calming spoken anchors, somatic body scan, and gentle chime pacing to soothe racing exam thoughts.',
    benefit: 'Reduces amygdala reactivity and restores prefrontal executive focus in under 3 minutes.',
    icon: 'Flower2',
    interactiveComponent: 'meditation'
  },
  {
    id: 'box_breathing',
    category: 'relief',
    title: 'Box Breathing (Sama Vritti 4-4-4-4)',
    durationMinutes: 3,
    type: 'breathing',
    stressorSuitability: ['exam_stress', 'anxious', 'overwhelmed', 'procrastination', 'conflict_bullying'],
    description: 'Equal 4-second cycles of inhale, hold, exhale, hold with animated visual guidance. Used by emergency responders to quickly down-regulate the nervous system.',
    benefit: 'Lowers acute heart rate and clears racing thoughts in 180 seconds.',
    icon: 'Wind',
    interactiveComponent: 'breathing',
    config: { pattern: [4, 4, 4, 4], name: 'Box Breathing', cycles: 4 }
  },
  {
    id: 'four_seven_eight',
    category: 'relief',
    title: '4-7-8 Deep Parasympathetic Breath',
    durationMinutes: 4,
    type: 'breathing',
    stressorSuitability: ['sleep_fatigue', 'exam_stress', 'family_expectations', 'anxious'],
    description: 'Dr. Andrew Weil method: Inhale 4s, deep hold 7s, long soothing whoosh exhale 8s. Signals profound safety to the brain.',
    benefit: 'Relieves somatic tension and prepares the mind for restorative sleep or focused revision.',
    icon: 'Feather',
    interactiveComponent: 'breathing',
    config: { pattern: [4, 7, 8, 0], name: '4-7-8 Sleep & Calm Breath', cycles: 4 }
  },
  {
    id: 'grounding_54321',
    category: 'relief',
    title: '5-4-3-2-1 Sensory Grounding',
    durationMinutes: 4,
    type: 'guided_interactive',
    stressorSuitability: ['exam_stress', 'overwhelmed', 'conflict_bullying', 'low_confidence'],
    description: 'Anchor yourself in the present room: Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 positive thing you appreciate.',
    benefit: 'Interrupts panic spirals and cognitive overload by re-engaging physical sensory receptors.',
    icon: 'Eye',
    interactiveComponent: 'grounding'
  },
  {
    id: 'progressive_relaxation',
    category: 'relief',
    title: 'Shoulder & Jaw Tension Release',
    durationMinutes: 3,
    type: 'guided_steps',
    stressorSuitability: ['sleep_fatigue', 'exam_stress', 'procrastination'],
    description: 'Students carry 70% of study stress in the shoulders, neck, and clenched jaw. A 3-step physical decompression micro-routine.',
    benefit: 'Instant reduction of physical tightness caused by continuous desk posture.',
    icon: 'Smile',
    interactiveComponent: 'muscle_relax'
  },

  // =================== 2. GROWTH ACTIVITIES ===================
  {
    id: 'five_minute_start',
    category: 'growth',
    title: 'BJ Fogg 5-Minute Study Start',
    durationMinutes: 5,
    type: 'timer',
    stressorSuitability: ['procrastination', 'exam_stress', 'overwhelmed', 'scattered'],
    description: 'Behavioral science shows starting is 90% of the battle. Commit to just 5 minutes of focused reading or problem-solving with ambient audio. No obligation to continue afterward.',
    benefit: 'Bypasses the brain amygdala panic resistance response to massive syllabus tasks.',
    icon: 'Clock',
    interactiveComponent: 'study_timer'
  },
  {
    id: 'cbt_thought_flip',
    category: 'growth',
    title: 'CBT "Thought Flip" Reality Check',
    durationMinutes: 5,
    type: 'cbt_tool',
    stressorSuitability: ['low_confidence', 'exam_stress', 'family_expectations', 'social_pressure'],
    description: 'Identify an automatic negative catastrophic belief (e.g., "I will fail math and let everyone down"), test the objective evidence, and reframe it into an empowered, constructive perspective.',
    benefit: 'Builds cognitive resilience, disarming toxic perfectionism and fear of failure.',
    icon: 'Sparkles',
    interactiveComponent: 'thought_flip'
  },
  {
    id: 'self_compassion_reset',
    category: 'growth',
    title: 'Self-Compassion Pep Talk',
    durationMinutes: 4,
    type: 'reflective_prompt',
    stressorSuitability: ['low_confidence', 'social_pressure', 'conflict_bullying'],
    description: 'Speak to yourself the exact way you would encourage your best friend if they were struggling with the same problem.',
    benefit: 'Replaces punitive inner self-criticism with supportive motivation.',
    icon: 'Heart',
    interactiveComponent: 'compassion_letter'
  },

  // =================== 3. PRACTICAL STRESSOR ACTIONS ===================
  {
    id: 'exam_chunking_matrix',
    category: 'action',
    title: 'Syllabus Chunking Matrix',
    durationMinutes: 6,
    type: 'action_tool',
    stressorSuitability: ['exam_stress', 'overwhelmed'],
    description: 'Take 1 daunting exam topic. Split it into: 1 Concept to Review (5 min), 1 Formula / Key Term to memorize, and 1 Sample Question to attempt.',
    benefit: 'Converts an ambiguous giant subject into 3 concrete, achievable victories.',
    icon: 'Layers',
    interactiveComponent: 'exam_chunker'
  },
  {
    id: 'procrastination_two_min_ramp',
    category: 'action',
    title: 'The 2-Minute Desk Clear & Ramp',
    durationMinutes: 3,
    type: 'action_tool',
    stressorSuitability: ['procrastination', 'scattered'],
    description: 'Clear away unnecessary clutter, open the exact page or notebook needed, put your phone in another room or focus mode, and write the top line title.',
    benefit: 'Removes friction before physical cognitive work begins.',
    icon: 'CheckSquare',
    interactiveComponent: 'action_steps',
    steps: [
      'Put your phone screen-down or in another room for 30 minutes.',
      'Clear everything off your study space except the 1 book or notebook you need right now.',
      'Write down the single next micro-task (e.g., "Read page 42-45").',
      'Take 1 deep breath, smile, and start with line one.'
    ]
  },
  {
    id: 'comparison_shield',
    category: 'action',
    title: 'Comparison Shield & Baseline Audit',
    durationMinutes: 5,
    type: 'action_tool',
    stressorSuitability: ['social_pressure', 'low_confidence'],
    description: 'Acknowledge that someone else’s highlight reel or high test score doesn’t diminish your personal growth rate. Set your personal baseline goal.',
    benefit: 'Reclaims agency and neutralizes the toxic habit of social comparison.',
    icon: 'Shield',
    interactiveComponent: 'action_steps',
    steps: [
      'Write down 1 skill or topic you understand better today than you did 3 months ago.',
      'Remember: Marks are a snapshot of one test, not your ultimate intelligence or character.',
      'Identify 1 private goal for this week that is strictly for your personal satisfaction.',
      'Commit to not asking peers what score they got on the next quiz.'
    ]
  },
  {
    id: 'parent_dialogue_script',
    category: 'action',
    title: 'Parent & Family Conversation Builder',
    durationMinutes: 5,
    type: 'action_tool',
    stressorSuitability: ['family_expectations'],
    description: 'Express your genuine commitment to your studies while gently sharing when high pressure makes you anxious rather than motivated.',
    benefit: 'Provides constructive, respectful communication frameworks for healthy family dialogue.',
    icon: 'MessageCircle',
    interactiveComponent: 'action_steps',
    steps: [
      'Acknowledge love & intent: "I know you want me to have a bright future and succeed."',
      'Share the reality: "When there is heavy pressure on scores, it makes me panic and study less effectively."',
      'Propose a healthy rhythm: "Could we focus on my daily study habits and effort rather than only testing outcomes?"',
      'Ask for support: "A little encouragement when I try hard helps me more than high expectations."'
    ]
  },
  {
    id: 'sleep_hygiene_ritual',
    category: 'action',
    title: 'Nightly Sleep Reset Checklist',
    durationMinutes: 4,
    type: 'action_tool',
    stressorSuitability: ['sleep_fatigue'],
    description: 'Simple, non-negotiable bedtime habits that signal to your brain it is safe to shut down and recharge memory consolidation.',
    benefit: 'Improves next-day memory recall, concentration, and emotional stability.',
    icon: 'Moon',
    interactiveComponent: 'action_steps',
    steps: [
      'Stop reading new syllabus content at least 45 minutes before sleep (cramming late increases cortisol).',
      'Dim room lighting and turn off notifications on phone / tablet.',
      'Sip a glass of warm water or do 2 minutes of gentle shoulder rolling.',
      'Write down on paper any nagging worries to "park" them until tomorrow morning.'
    ]
  },
  {
    id: 'healthy_boundaries_script',
    category: 'action',
    title: 'Safe Social Boundaries & De-escalation',
    durationMinutes: 5,
    type: 'action_tool',
    stressorSuitability: ['conflict_bullying'],
    description: 'Learn assertive, calm ways to neutralize teasing, peer pressure, or uncomfortable social situations at school.',
    benefit: 'Protects psychological safety and stops emotional exhaustion from peer drama.',
    icon: 'UserCheck',
    interactiveComponent: 'action_steps',
    steps: [
      'Use the neutral broken-record phrase: "I’m not interested in discussing that right now."',
      'Physically move toward safe friends, a teacher, or the library space.',
      'Remember that hurtful behavior from others reflects their internal unhappiness, not your value.',
      'If bullying persists, confidentially inform your class teacher, counselor, or school mentor immediately.'
    ]
  },

  // =================== 4. OPTIONAL FUN / MINDFUL BREAKS ===================
  {
    id: 'zen_doodle_canvas',
    category: 'break',
    title: 'Mindful Zen Doodle & Scratchpad',
    durationMinutes: 5,
    type: 'creative_canvas',
    stressorSuitability: ['exam_stress', 'scattered', 'overwhelmed', 'anxious'],
    description: 'Free-form, no-judgment drawing canvas. Draw continuous swirls, gentle patterns, or colorful abstract shapes to release mental pressure.',
    benefit: 'Engages non-verbal creative brain centers, providing true mental restoration.',
    icon: 'PenTool',
    interactiveComponent: 'zen_canvas'
  },
  {
    id: 'gratitude_garden',
    category: 'break',
    title: 'Gratitude Garden Blossom',
    durationMinutes: 3,
    type: 'gratitude_flower',
    stressorSuitability: ['low_confidence', 'family_expectations', 'social_pressure'],
    description: 'Plant a digital flower by noting 1 tiny thing you are grateful for today (e.g., a warm cup of cocoa, a sunny window, a friend’s smile).',
    benefit: 'Rewires neural pathways toward positive optimism and emotional equilibrium.',
    icon: 'Flower',
    interactiveComponent: 'gratitude_garden'
  },
  {
    id: 'uplifting_riddle',
    category: 'break',
    title: 'Brain Refresh: Lateral Riddle & Fun Fact',
    durationMinutes: 2,
    type: 'brain_refresh',
    stressorSuitability: ['procrastination', 'exam_stress', 'sleep_fatigue'],
    description: 'A delightful 2-minute riddle and inspiring curiosity fact to tickle your curiosity and bring a genuine smile to your face.',
    benefit: 'Releases dopamine in a healthy, guilt-free way without doom-scrolling.',
    icon: 'HelpCircle',
    interactiveComponent: 'brain_refresh'
  },
  {
    id: 'soundscape_lounge',
    category: 'break',
    title: 'Calming Ambient Soundscape Session',
    durationMinutes: 5,
    type: 'soundscape',
    stressorSuitability: ['exam_stress', 'sleep_fatigue', 'overwhelmed'],
    description: 'Listen to layered gentle rain, rustling forest chimes, or calming alpha waves generated live right inside your browser.',
    benefit: 'Soothes sensory overload and reduces cortisol naturally.',
    icon: 'Headphones',
    interactiveComponent: 'soundscapes'
  }
];

// Helper to determine the balanced 4-part plan for a student based on stressor and mood
export function generateDailyPlan(stressorId, currentMoodId) {
  // 1. Pick Stress Relief activity (prefer meditation or breathing)
  const reliefCandidates = ACTIVITY_CATALOG.filter(a => 
    a.category === 'relief' && 
    (a.stressorSuitability.includes(stressorId) || a.stressorSuitability.includes(currentMoodId))
  );
  const relief = reliefCandidates.length > 0 
    ? reliefCandidates[Math.floor(Math.random() * reliefCandidates.length)]
    : ACTIVITY_CATALOG.find(a => a.id === 'mindful_meditation');

  // 2. Pick Growth activity
  const growthCandidates = ACTIVITY_CATALOG.filter(a => 
    a.category === 'growth' && 
    (a.stressorSuitability.includes(stressorId) || a.stressorSuitability.includes(currentMoodId))
  );
  const growth = growthCandidates.length > 0 
    ? growthCandidates[Math.floor(Math.random() * growthCandidates.length)]
    : ACTIVITY_CATALOG.find(a => a.id === 'five_minute_start');

  // 3. Pick Practical Stressor Action
  const actionCandidates = ACTIVITY_CATALOG.filter(a => 
    a.category === 'action' && 
    (a.stressorSuitability.includes(stressorId) || a.stressorSuitability.includes(currentMoodId))
  );
  const action = actionCandidates.length > 0 
    ? actionCandidates[Math.floor(Math.random() * actionCandidates.length)]
    : ACTIVITY_CATALOG.find(a => a.id === 'procrastination_two_min_ramp');

  // 4. Pick Optional Fun Break
  const breakCandidates = ACTIVITY_CATALOG.filter(a => 
    a.category === 'break' && 
    (a.stressorSuitability.includes(stressorId) || a.stressorSuitability.includes(currentMoodId))
  );
  const funBreak = breakCandidates.length > 0 
    ? breakCandidates[Math.floor(Math.random() * breakCandidates.length)]
    : ACTIVITY_CATALOG.find(a => a.id === 'zen_doodle_canvas');

  return [
    { ...relief, instanceId: `relief-${Date.now()}`, completed: false, skipped: false, userRating: 0, feedback: '' },
    { ...growth, instanceId: `growth-${Date.now() + 1}`, completed: false, skipped: false, userRating: 0, feedback: '' },
    { ...action, instanceId: `action-${Date.now() + 2}`, completed: false, skipped: false, userRating: 0, feedback: '' },
    { ...funBreak, instanceId: `break-${Date.now() + 3}`, completed: false, skipped: false, userRating: 0, feedback: '' },
  ];
}
