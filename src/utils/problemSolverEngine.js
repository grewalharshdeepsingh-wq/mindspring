// MindSpring Intelligent Problem Solver & Motivational Engine
// Offline-first, evidence-based cognitive & psychological triage for student challenges.
// Combines Cognitive Behavioral Therapy (CBT), BJ Fogg micro-habits, Somatic Down-Regulation, and empathetic mentoring.

export const SAMPLE_PROBLEMS = [
  {
    label: "Exam Tomorrow & Syllabus Backlog",
    category: "academic",
    intensity: "high",
    text: "I have a major biology exam tomorrow morning and I still haven't finished 4 important chapters. I am panicking, my mind is blanking out, and I don't know where to start."
  },
  {
    label: "Stuck Scrolling Social Media for Hours",
    category: "focus",
    intensity: "moderate",
    text: "I've been scrolling Instagram reels and YouTube shorts for 3 hours instead of doing my history assignment due tonight. I feel terrible guilt but I'm paralyzed."
  },
  {
    label: "Bad Marks & Fear of Parents' Disappointment",
    category: "family",
    intensity: "high",
    text: "I got a really low score in my math exam. My parents expected me to get above 90% and I am terrified to show them my paper. I feel like a total disappointment to my family."
  },
  {
    label: "Making Silly Calculation Mistakes",
    category: "academic",
    intensity: "moderate",
    text: "I keep losing 10-15 marks on silly calculation mistakes, misreading questions, and rushing in chemistry and physics. Even when I know the concepts, I mess up."
  },
  {
    label: "Class Presentation Stage Fright",
    category: "confidence",
    intensity: "high",
    text: "I have to give a 5-minute presentation in English class tomorrow. My hands start shaking, my heart beats fast, my throat dries up, and I'm terrified I'll freeze and be laughed at."
  },
  {
    label: "Comparing Myself to Class Toppers",
    category: "confidence",
    intensity: "moderate",
    text: "Everyone in my tuition and school seems 10x smarter and faster than me. No matter how many hours I put in, I feel like an imposter who will never be good enough."
  },
  {
    label: "Group Project Teammates Not Doing Any Work",
    category: "social",
    intensity: "high",
    text: "My group project partner is ghosting me and doing zero work while the submission is in 2 days. I'm doing everything alone and feeling overwhelmed and resentful."
  },
  {
    label: "Sleep Deprivation & Brain Fog",
    category: "burnout",
    intensity: "high",
    text: "I've been sleeping only 3-4 hours every night studying for finals. My head is throbbing, my eyes burn, I can't remember anything I read, and I have zero energy."
  },
  {
    label: "Left Out by Close Friends",
    category: "social",
    intensity: "high",
    text: "My close friends went out together without inviting me and they are whispering in class. I feel completely lonely, excluded, and can't focus on my studies at all."
  },
  {
    label: "Teacher Humiliation & Harsh Feedback",
    category: "academic",
    intensity: "high",
    text: "My professor harshly scolded me in front of the whole class and gave me a C- with rude remarks. I feel completely humiliated and don't want to attend classes."
  },
  {
    label: "Entrance Exam & Future Existential Dread",
    category: "academic",
    intensity: "high",
    text: "I am constantly stressed about college entrance exams (JEE/NEET/SAT) and my future. What if I fail and ruin my entire life? I can't stop overthinking."
  },
  {
    label: "ADHD / Mind Racing Everywhere",
    category: "focus",
    intensity: "moderate",
    text: "My brain has 20 tabs open at once. I sit down to study and 2 minutes later I'm fidgeting, cleaning my room, or thinking about something totally random."
  }
];

export const PROBLEM_CATEGORIES = [
  { id: 'all', label: 'All Challenges' },
  { id: 'academic', label: '📚 Academic, Exams & Grades' },
  { id: 'focus', label: '⏳ Focus, Phone & Procrastination' },
  { id: 'confidence', label: '✨ Confidence, Imposter & Stage Fright' },
  { id: 'family', label: '🏠 Parents & Expectations' },
  { id: 'social', label: '👥 Friends, Peers & Group Work' },
  { id: 'burnout', label: '🌙 Burnout, Sleep & Exhaustion' },
];

// Safety crisis keywords
const CRISIS_PATTERNS = [
  /\b(suicid|kill\s*myself|end\s*my\s*life|want\s*to\s*die|self\s*harm|cut\s*myself|hurt\s*myself|better\s*off\s*dead|no\s*reason\s*to\s*live|tired\s*of\s*living)\b/i
];

/**
 * Extracts entities, subjects, people, timelines, and emotional signals from text
 */
export function extractEntitiesAndContext(text) {
  const lower = text.toLowerCase();

  // 1. Subjects
  const subjectPatterns = [
    { name: 'Mathematics', regex: /\b(math|maths|mathematics|calculus|algebra|geometry|trigonometry|statistics|derivative|integral)\b/i },
    { name: 'Physics', regex: /\b(physics|kinematics|thermodynamics|mechanics|optics|electromagnetism|quantum)\b/i },
    { name: 'Chemistry', regex: /\b(chemistry|organic chemistry|inorganic|chemical|stoichiometry|lab report)\b/i },
    { name: 'Biology', regex: /\b(biology|zoology|botany|anatomy|genetics|cell biology|biochem)\b/i },
    { name: 'Computer Science & Coding', regex: /\b(computer science|coding|programming|python|java|c\+\+|javascript|code|web dev|algorithm|data structures|debug)\b/i },
    { name: 'English & Essay Writing', regex: /\b(english|essay|literature|grammar|paper|comprehension|reading|writing|speech)\b/i },
    { name: 'History & Social Studies', regex: /\b(history|civics|geography|social studies|world war|revolutions|dates)\b/i },
    { name: 'Economics & Commerce', regex: /\b(economics|micro|macro|accounts|accounting|business studies|finance)\b/i },
    { name: 'Psychology', regex: /\b(psychology|sociology)\b/i },
    { name: 'Competitive Entrance Exams', regex: /\b(entrance exam|jee|neet|sat|act|mcat|gre|gmat|boards|finals|midterms|mock test)\b/i }
  ];

  const detectedSubjects = [];
  for (const s of subjectPatterns) {
    if (s.regex.test(lower)) {
      detectedSubjects.push(s.name);
    }
  }

  // 2. Timeframes & Urgency
  let detectedTimeframe = null;
  if (/\b(tomorrow\s*morning|tomorrow|in the morning)\b/i.test(lower)) {
    detectedTimeframe = 'Tomorrow Morning (Imminent)';
  } else if (/\b(tonight|few hours|in 2 hours|in an hour|due tonight|midnight)\b/i.test(lower)) {
    detectedTimeframe = 'Tonight / In A Few Hours (Urgent)';
  } else if (/\b(this week|in 2 days|in 3 days|weekend|upcoming)\b/i.test(lower)) {
    detectedTimeframe = 'This Week (Upcoming)';
  } else if (/\b(weeks|months|chronic|every day|always|constantly)\b/i.test(lower)) {
    detectedTimeframe = 'Ongoing / Habitual';
  }

  // 3. Key Relationships
  const detectedPeople = [];
  if (/\b(parent|parents|mom|mother|dad|father|family)\b/i.test(lower)) detectedPeople.push('Parents / Family');
  if (/\b(teacher|professor|instructor|sir|ma'?am|faculty)\b/i.test(lower)) detectedPeople.push('Teacher / Professor');
  if (/\b(friend|friends|best friend|clique|group of friends)\b/i.test(lower)) detectedPeople.push('Friends / Peers');
  if (/\b(partner|teammate|teammates|group members|group project)\b/i.test(lower)) detectedPeople.push('Group Project Partners');
  if (/\b(topper|toppers|classmates|peers|everyone else)\b/i.test(lower)) detectedPeople.push('Classmates / Toppers');
  if (/\b(roommate|roommates)\b/i.test(lower)) detectedPeople.push('Roommate');

  // 4. Somatic & Emotional Signals
  const detectedSymptoms = [];
  if (/\b(blank|blanking|freeze|frozen|mind is blank)\b/i.test(lower)) detectedSymptoms.push('Mind Blankout / Freeze');
  if (/\b(shak(e|ing)|trembl(e|ing)|throat|palpitation|heart beat|heart racing|sweat)\b/i.test(lower)) detectedSymptoms.push('Physical Trembling / Palpitations');
  if (/\b(headache|eyes burn|foggy|brain fog|migraine)\b/i.test(lower)) detectedSymptoms.push('Headache / Cognitive Fog');
  if (/\b(cry|crying|tears|sob)\b/i.test(lower)) detectedSymptoms.push('Deep Tearfulness / Sadness');
  if (/\b(guilt|ashamed|shame|hate myself)\b/i.test(lower)) detectedSymptoms.push('Guilt / Self-Shame');
  if (/\b(paralyzed|stuck|can't start)\b/i.test(lower)) detectedSymptoms.push('Task Paralysis');
  if (/\b(insomnia|no sleep|can't sleep|slept 3 hours|slept 4 hours|all-nighter)\b/i.test(lower)) detectedSymptoms.push('Severe Sleep Debt');

  // 5. Extract core user pain point quote
  let painPointQuote = '';
  const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);
  if (sentences.length > 0) {
    const candidate = sentences.find(s => 
      /\b(panic|can't|afraid|scared|terrified|guilt|stupid|fail|blank|shaking|hate|wasting|exhausted|ghosting)\b/i.test(s)
    ) || sentences[0];
    painPointQuote = candidate.slice(0, 110) + (candidate.length > 110 ? '...' : '');
  }

  return {
    subjects: detectedSubjects,
    subjectName: detectedSubjects.length > 0 ? detectedSubjects[0] : null,
    timeframe: detectedTimeframe,
    people: detectedPeople,
    peopleName: detectedPeople.length > 0 ? detectedPeople[0] : null,
    symptoms: detectedSymptoms,
    painPointQuote
  };
}

/**
 * 22 Distinct Student Stress Archetypes with exact psychological diagnoses & customized solutions
 */
const STRESS_ARCHETYPES = [
  // 1. Exam Tomorrow & Syllabus Backlog Panic
  {
    id: 'exam_tomorrow_panic',
    category: 'academic',
    title: 'Exam Tomorrow & Acute Syllabus Backlog',
    match: (text) => (
      /\b(exam|test|paper)\b/i.test(text) &&
      /\b(tomorrow|tonight|morning|few hours|hours left)\b/i.test(text) &&
      /\b(backlog|chapters|haven't finished|not finished|so much left|blank|panic)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your exam';
      return {
        domainLabel: 'Acute Exam Triage & Backlog Panic',
        category: 'academic',
        understanding: {
          summary: `You are facing an immediate ${subj} exam with uncompleted chapters, triggering an acute biological fight-or-flight freeze reflex.`,
          rootCause: "Amygdala Threat Hijack & Cognitive Overload. When your brain views an entire unfinished syllabus as an insurmountable threat with hours remaining, the prefrontal cortex temporarily locks up, making you feel blank or paralyzed.",
          validation: `Feeling blank or panicked right now is 100% biological chemistry, not a measure of your capability. Your brain is trying to protect you, but panic will not gain you marks—calm, ruthless triage will.`
        },
        solution: {
          immediate5Min: `Take 3 physiological sighs (two quick inhales through the nose, one long slow exhale through the mouth). Grab 1 blank sheet of paper and write down ONLY the 3 highest-weight topics or repeated questions in ${subj} that carry 60% of the marks.`,
          steps: [
            {
              title: "Execute the 80/20 High-Yield Triage",
              action: `Stop reading textbook pages line-by-line tonight. Switch immediately to: teacher summary slides, formula sheets, and past 3 years' question papers for ${subj}. Only study topics that appear repeatedly.`
            },
            {
              title: "Run 20-Minute Active-Recall Sprints",
              action: "Set a timer for 20 minutes on just ONE concept. Put your phone in another room. Test yourself by closing the notes and writing the key points from memory."
            },
            {
              title: "Enforce a Strict 5.5-Hour Sleep Gate",
              action: "Do not pull an all-nighter. Neuroscience shows that staying awake past 3 AM cuts memory retrieval by up to 45%. Even 5-6 hours of sleep allows your hippocampus to organize what you study tonight."
            }
          ],
          recommendedTool: {
            id: 'exam_chunking_matrix',
            title: 'Syllabus Chunking Matrix',
            type: 'action_tool',
            description: 'Divide giant topics into bite-sized 5-minute review segments.'
          },
          actionItem: `Pick the single easiest high-yield topic in ${subj} and review it for 15 minutes right now.`
        },
        motivation: {
          pepTalk: `${studentName}, take a deep breath. Stop fighting the clock. You cannot change what wasn't studied yesterday, but you have full power over the next 3 hours. Securing even 3 solid concepts tonight will put marks in your pocket that panic would steal from you. You have navigated high-stakes tests before and you are going to walk into that exam room with composure. One question at a time!`,
          affirmation: `I don't need a perfect preparation to achieve a resilient victory. I focus calmly on the highest-value concepts right now.`,
          mindsetShift: {
            from: "I haven't finished everything, so I am going to fail.",
            to: "I will master the top 60% of high-yield questions right now and maximize every available mark."
          },
          audioScript: `${studentName}, take a slow breath. Stop looking at the entire syllabus. Focus on mastering just one concept over the next fifteen minutes. You are capable and resilient.`
        }
      };
    }
  },

  // 2. Exam Mind Blankout & Panic Attacks in Tests
  {
    id: 'test_anxiety_freeze',
    category: 'academic',
    title: 'Exam Blankout & Somatic Test Anxiety',
    match: (text) => (
      /\b(blank|blanking|freeze|mind is blank|mind goes blank)\b/i.test(text) &&
      /\b(exam|test|paper|questions|studying)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your assessments';
      return {
        domainLabel: 'Somatic Anxiety & Exam Mind-Freeze',
        category: 'academic',
        understanding: {
          summary: `You are experiencing sudden memory blockouts and physical anxiety freeze during ${subj} preparation or tests.`,
          rootCause: "Cortisol Saturation in Working Memory. When acute test anxiety surges, excessive stress hormones saturate prefrontal receptors, temporarily disconnecting conscious retrieval pathways even when the knowledge is securely stored in your memory.",
          validation: `Your memory has not vanished—it is simply hidden behind a temporary surge of adrenaline. As soon as we lower your physiological arousal by 15%, your memory recall circuits immediately reconnect.`
        },
        solution: {
          immediate5Min: "Do the 4-4-4-4 Box Breathing protocol: Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. As you breathe, do alternating bilateral hand taps on your thighs to re-synchronize brain hemispheres.",
          steps: [
            {
              title: "The 60-Second Marginal 'Brain Dump'",
              action: "The moment an exam paper is handed to you, flip to the back rough page and immediately scribble formulas, dates, diagrams, and mnemonics before reading question 1."
            },
            {
              title: "The 'Low-Hanging Fruit' Warm-Up Sweep",
              action: "Never start with the hardest question. Scan the paper and answer the 2 absolute easiest questions first. This triggers dopamine release and dismantles cognitive freeze."
            },
            {
              title: "Somatic Vagal Reset Cue",
              action: "Whenever your mind blanks, press both feet flat into the floor, un-clench your jaw, drop your tongue from the roof of your mouth, and exhale slowly for 6 seconds."
            }
          ],
          recommendedTool: {
            id: 'box_breathing',
            title: 'Box Breathing (Sama Vritti 4-4-4-4)',
            type: 'breathing',
            description: 'Navy SEAL parasympathetic breathing to instantly break somatic panic and restore memory recall.'
          },
          actionItem: "Do 4 rounds of box breathing right now until your shoulder tension drops."
        },
        motivation: {
          pepTalk: `${studentName}, remember this truth: A blank mind is a biological symptom of a racing heart, never a lack of intelligence. The facts you studied are already stored in your neural pathways. You do not have to force answers; you simply have to quiet the alarm bell in your chest. Breathe, settle your body, and let your natural intelligence flow back.`,
          affirmation: `As my breathing slows, my mental clarity and recall naturally return.`,
          mindsetShift: {
            from: "My mind is totally blank, I forgot everything.",
            to: "My body is temporarily startled. Once I breathe slowly, the information will return."
          },
          audioScript: `${studentName}, drop your shoulders and exhale slowly. The knowledge you studied is inside you. Steady your breath and let your clarity return.`
        }
      };
    }
  },

  // 3. Bad Marks & Fear of Parental Disappointment
  {
    id: 'bad_grades_parental_fear',
    category: 'family',
    title: 'Low Test Marks & Fear of Parental Reaction',
    match: (text) => (
      /\b(low marks|poor marks|bad marks|failed|low score|poor score|bad grade|terrible marks)\b/i.test(text) ||
      (/\b(marks|score|grade|test|paper)\b/i.test(text) && /\b(parent|parents|mom|dad|father|mother|scared|disappoint|shout|angry)\b/i.test(text))
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'the recent test';
      return {
        domainLabel: 'Academic Setback & Parental Communication',
        category: 'family',
        understanding: {
          summary: `You are coping with disappointing marks in ${subj} alongside intense fear of your parents' anger or emotional disapproval.`,
          rootCause: "Interpersonal Worth Attachment & Social Rejection Alarm. When academic performance feels tied to parental affection and approval, a low score triggers deep evolutionary fears of rejection and emotional isolation.",
          validation: `It hurts tremendously when test scores don't match your family's expectations. But please hear this clearly: a grade is an academic snapshot of one test date, never a measure of your worth as a human or your potential in life.`
        },
        solution: {
          immediate5Min: "Take 10 slow deep breaths. Write down this factual grounding line on paper: 'My test score is data about my current study strategy, not a verdict on my character or future.'",
          steps: [
            {
              title: "Perform the Objective 3-Bucket Error Autopsy",
              action: `Review your ${subj} paper objectively. Group lost marks into: 1) Concept confusion, 2) Silly/calculation error, or 3) Time management. Having exact facts transforms emotional shame into a concrete engineering problem.`
            },
            {
              title: "Use the Proactive Ownership Dialogue Script",
              action: `Approach your parents before they discover the paper: 'I know this score in ${subj} isn't what we aimed for. I was disappointed too, but I've already analyzed where I lost marks and built a 3-step schedule to fix them.'`
            },
            {
              title: "Build an Emotional Buffer",
              action: "If they respond with sharp words or comparison, recognize that their reaction stems from their own anxieties about your security. Let the storm blow over without absorbing it into your identity."
            }
          ],
          recommendedTool: {
            id: 'parent_dialogue_script',
            title: 'Parent & Family Conversation Builder',
            type: 'action_tool',
            description: 'Constructive scripts for honest, de-escalating dialogue with parents about marks.'
          },
          actionItem: "Write down the 2 biggest reasons marks were lost so you have factual solutions ready."
        },
        motivation: {
          pepTalk: `${studentName}, hold your head high. Every remarkable scientist, doctor, entrepreneur, and artist has experienced painful test scores and disappointed teachers or parents. What defines your destiny is not avoiding stumbling, but how gracefully and stubbornly you rise back up. You are loved, you are capable, and this test will be a tiny footnote in your incredible life story.`,
          affirmation: `I am infinitely greater than any exam score. A setback is just the setup for my comeback.`,
          mindsetShift: {
            from: "I got bad marks, so I am a disappointment and a failure.",
            to: "This test pointed out specific tactical gaps. I will fix the gaps and come back stronger."
          },
          audioScript: `${studentName}, hold your head up. You are so much more than a number on an exam paper. Take a deep breath. We will learn from this and move forward.`
        }
      };
    }
  },

  // 4. Careless Mistakes & Silly Errors in Exams
  {
    id: 'silly_mistakes_carelessness',
    category: 'academic',
    title: 'Careless Calculation Errors & Rushing',
    match: (text) => (
      /(\b(silly|careless)\b.*\b(mistakes?|errors?)\b)|\b(calculation\s+(errors?|mistakes?)|misread(ing)?|rushing|minus\s+sign|unit\s+error)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your calculations';
      return {
        domainLabel: 'Cognitive Precision & Error Prevention Protocol',
        category: 'academic',
        understanding: {
          summary: `You are losing substantial marks in ${subj} despite understanding the concepts, caused by attention lapses, optical rushing, and calculation slips.`,
          rootCause: "Attentional Blinks & Cognitive Rushing Under Pressure. The anxious brain rushes through calculations to escape the discomfort of the test, causing ocular scanning to skip crucial words like 'NOT', negative signs, and units.",
          validation: `Silly mistakes are the most frustrating thing in academics because you actually knew the material. The good news is that careless errors are 100% mechanical—they are solved with procedural protocols, not more textbook memorization.`
        },
        solution: {
          immediate5Min: "Draw a dedicated 2-inch right margin on your study notepad. Title it 'Rough Work / Sanity Check'. Practice the 'Pencil-Under-Word' rule: underline every condition word ('except', 'not', 'units', 'at most') before solving.",
          steps: [
            {
              title: "The Reverse Calculation Audit",
              action: `When checking ${subj} problems, never re-read your steps in the same forward direction (your brain will read what it expects to see). Verify calculations in reverse: check signs first, units second, arithmetic third.`
            },
            {
              title: "Build a Personal 'Red Flag Mistake' Sheet",
              action: "Maintain a single-page index of your personal top 5 silly mistakes (e.g. forgot negative sign in algebra, didn't convert minutes to seconds). Re-read this sheet 10 minutes before every test."
            },
            {
              title: "Budget an Unbreakable 7-Minute Review Reserve",
              action: "Treat the last 7 minutes of any exam paper as mandatory inspection time. Stop writing new answers and do an exclusive audit of questions you felt were 'too easy'."
            }
          ],
          recommendedTool: {
            id: 'cbt_thought_flip',
            title: 'CBT Thought Flip Reality Check',
            type: 'cbt_tool',
            description: 'Reframe frustration into methodical procedural discipline.'
          },
          actionItem: "Write down your top 3 recurring silly mistakes on a sticky note for your desk."
        },
        motivation: {
          pepTalk: `${studentName}, you already possess the most difficult ingredient: you understand the concepts! Now all you need is the pilot's pre-flight checklist. Great engineers and surgeons don't avoid mistakes through luck; they use checklists. Slow down by just 5% during calculations and watch your marks jump immediately. You have the intellect—now let's add the precision!`,
          affirmation: `I study with calm precision. Speed comes naturally when I am methodical and steady.`,
          mindsetShift: {
            from: "I am inherently careless and always mess up easy questions.",
            to: "I have the knowledge. By using deliberate checks and margins, I protect every hard-earned mark."
          },
          audioScript: `${studentName}, you already know the concepts. Slow down by five percent, underline the key conditions, and let your methodical precision shine through.`
        }
      };
    }
  },

  // 5. Dopamine Loop & Social Media Procrastination
  {
    id: 'phone_dopamine_procrastination',
    category: 'focus',
    title: 'Phone Doomscrolling & Dopamine Hijack',
    match: (text) => (
      /\b(scroll|reels|shorts|tiktok|instagram|youtube|phone|social media)\b/i.test(text) &&
      /\b(hours|time|wasting|guilt|procrastinat|put off|can't stop|addict|addiction|can't start|can't focus)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const task = context.subjectName || 'your academic assignments';
      return {
        domainLabel: 'Dopamine Detachment & Focus Restoration',
        category: 'focus',
        understanding: {
          summary: `You are trapped in an automated dopamine loop scrolling social feeds instead of tackling ${task}, followed by deep self-guilt.`,
          rootCause: "Friction-Avoidance & Algorithmic Hijack. Studying requires high cognitive friction for delayed rewards, whereas short-form video offers frictionless micro-rewards every 7 seconds. Your brain is not lazy; it is succumbing to multi-billion-dollar algorithmic engineering.",
          validation: `Forgive yourself for the last few hours immediately. Self-blame and guilt actually increase cortisol, which drives your brain right back to your phone for comfort. The past hours are gone—your reset starts this very second.`
        },
        solution: {
          immediate5Min: "Physically stand up right now. Put your phone inside another room, a closet, or your backpack. Drink 1 large glass of cold water. Sit at your desk and open your notebook without writing a word yet.",
          steps: [
            {
              title: "The 20-Second Friction Barrier",
              action: "Behavioral science shows that adding just 20 seconds of physical effort (phone in another room + grayscale display mode) cuts impulsive checking by over 70%."
            },
            {
              title: "The BJ Fogg 'Ridiculously Low' 5-Minute Start",
              action: `Promise your brain: 'I am only going to work on ${task} for 5 minutes. If I still want to stop after 5 minutes, I have full permission.' (90% of the time, the Zeigarnik effect kicks in and you continue).`
            },
            {
              title: "Scheduled Dopamine Window",
              action: "Do not try to be a monk forever. Tell yourself: 'After 45 minutes of real focused work, I get 10 minutes of completely guilt-free browsing.'"
            }
          ],
          recommendedTool: {
            id: 'five_minute_start',
            title: 'BJ Fogg 5-Minute Study Start',
            type: 'timer',
            description: 'Overcome starting inertia with a low-pressure 5-minute focus sprint with binaural audio.'
          },
          actionItem: "Put your phone in another room and launch the 5-Minute Focus Sprint right now."
        },
        motivation: {
          pepTalk: `${studentName}, stop beating yourself up for getting caught in the scroll trap. You are fighting supercomputers designed to capture your attention. But your dreams and your intellect are far greater than an algorithm. You don't need a whole productive day to feel good—you just need one focused 20-minute block. Take back the steering wheel right now!`,
          affirmation: `I am the master of my attention. My goals are worth infinitely more than cheap digital distractions.`,
          mindsetShift: {
            from: "I wasted half the day, today is already ruined.",
            to: "Momentum resets in 5 seconds. My victory starts with the very next sentence I write."
          },
          audioScript: `${studentName}, put the phone away. Forgive the hours already passed. Your momentum begins right now with one small 5-minute action.`
        }
      };
    }
  },

  // 6. Perfectionism Paralysis & Starting Block
  {
    id: 'perfectionism_paralysis',
    category: 'focus',
    title: 'Perfectionism Paralysis & Fear of Starting',
    match: (text) => (
      /\b(perfection|perfect|not good enough|overthinking|fear of making mistakes|re-writing|blank page|can't bring myself)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const task = context.subjectName || 'your work';
      return {
        domainLabel: 'Perfectionism Deconstruction & Creative Velocity',
        category: 'focus',
        understanding: {
          summary: `You are experiencing perfectionist freeze where high standards and fear of producing mediocre work prevent you from starting ${task}.`,
          rootCause: "Ego Protection via Task Avoidance. Perfectionism is not high standards; it is a fear shield. Your brain believes that as long as the page stays empty, it cannot be judged or deemed inadequate.",
          validation: `You care deeply about doing quality work, which is admirable. But remember: 'Done' is always better than 'perfect in your head'. A messy draft can be polished, but an empty page cannot be edited.`
        },
        solution: {
          immediate5Min: "Give yourself explicit psychological permission to write an 'ugly, messy first draft'. Set a timer for 5 minutes and write out terrible, unfiltered thoughts without fixing a single typo.",
          steps: [
            {
              title: "Lower the Starting Bar to 20%",
              action: `Instead of 'Write the perfect essay/solve all problems in ${task}', your goal is strictly: 'Type 3 disorganized sentences or solve 1 example problem with an open textbook.'`
            },
            {
              title: "Separate the Creator from the Editor",
              action: "Never edit while generating. When creating, turn off your inner critic completely. Only review and polish during a separate editing session tomorrow."
            },
            {
              title: "Time-Box Every Subtask",
              action: "Give yourself 25 minutes strictly. When the timer rings, stop. Constraint forces execution and eliminates infinite overthinking."
            }
          ],
          recommendedTool: {
            id: 'cbt_thought_flip',
            title: 'CBT Thought Flip Reality Check',
            type: 'cbt_tool',
            description: 'Disarm perfectionist catastrophic beliefs and embrace iterative growth.'
          },
          actionItem: "Write 1 messy paragraph or solve 1 problem without correcting any flaws."
        },
        motivation: {
          pepTalk: `${studentName}, perfectionism is the enemy of greatness. The most brilliant writers, researchers, and engineers produce messy, imperfect first drafts. Greatness is achieved in the second and third pass, never the first. Stop waiting to feel ready or inspired. Put messy words on paper and let momentum carry you forward!`,
          affirmation: `I value progress over perfection. Action breeds clarity, and courage begins with messy starts.`,
          mindsetShift: {
            from: "If it's not flawless, I shouldn't even start.",
            to: "I will make a messy first pass. I can refine anything once it exists in reality."
          },
          audioScript: `${studentName}, give yourself permission to be imperfect today. Just write the first rough draft. You can always improve it later.`
        }
      };
    }
  },

  // 7. Multi-Deadline Chaos & Backlog Paralysis
  {
    id: 'backlog_chaos_overwhelm',
    category: 'focus',
    title: 'Multi-Deadline Chaos & Executive Gridlock',
    match: (text) => (
      /\b(deadlines?|assignments?|everything at once|hitting me at once|too much to do|piled up|backlog|to-do list|overwhelmed by tasks)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const task = context.subjectName ? `including ${context.subjectName}` : 'across your subjects';
      const time = context.timeframe ? `with ${context.timeframe} pressure` : 'hitting all at once';
      return {
        domainLabel: 'Eisenhower Triage & Multi-Deadline Organization',
        category: 'focus',
        understanding: {
          summary: `You are being swamped by simultaneous deadlines and backlogs ${task} ${time}, causing your executive working memory to crash from cognitive gridlock.`,
          rootCause: "Working Memory Saturation. The human working memory can only track 3 to 4 complex items simultaneously. When faced with 10 conflicting deadlines, the prefrontal cortex experiences paralysis by analysis.",
          validation: "It is completely normal to feel paralyzed when 5 different subjects demand your attention at the same moment. You cannot do 5 things at once, but you can conquer them in a sequential domino train."
        },
        solution: {
          immediate5Min: "Dump everything out of your head onto a single sheet of paper (The 'Brain Drain'). Group every item into 2 columns: 'Must Submit Within 24h' vs 'Can Wait 48h'. Circle ONLY ONE top priority item.",
          steps: [
            {
              title: "Apply the 'One-In-Progress' Rule",
              action: "Close all 15 browser tabs except the ONE assignment you circled. Put all other textbooks and notebooks out of physical sight to eliminate visual competing stimuli."
            },
            {
              title: "Work in 35-Minute Dedicated Blocks",
              action: "Dedicate 35 minutes exclusively to Task 1. Do not touch or think about Task 2 until the timer rings. Context-switching wastes up to 30% of your cognitive energy."
            },
            {
              title: "Strategically Negotiate or De-prioritize",
              action: "If deadlines truly collide impossibly, respectfully email one instructor for a 24-hour extension or submit a simplified version to protect your high-stakes subjects."
            }
          ],
          recommendedTool: {
            id: 'exam_chunking_matrix',
            title: 'Syllabus Chunking Matrix',
            type: 'action_tool',
            description: 'Break overwhelming workloads into structured 3-part micro-tasks.'
          },
          actionItem: "Pick the single most urgent deadline and work on it for 30 minutes with zero tab switching."
        },
        motivation: {
          pepTalk: `${studentName}, mountains are climbed one step at a time, and giant backlogs are dismantled one assignment at a time. Do not look at the whole mountain today; just look at the step right under your foot. Knock down the first domino. Once that first task is marked complete, your confidence and energy will surge. You've got this!`,
          affirmation: `I conquer chaos with calm prioritization. One focused task at a time is my superpower.`,
          mindsetShift: {
            from: "Everything is due at once and I am completely drowning.",
            to: "I will line up my tasks in order and conquer them sequentially. One victory at a time."
          },
          audioScript: `${studentName}, take a breath. Put away all your tasks except the single most urgent one. Win this next thirty minutes.`
        }
      };
    }
  },

  // 8. Public Speaking & Class Presentation Panic
  {
    id: 'public_speaking_presentation',
    category: 'confidence',
    title: 'Class Presentation & Stage Fright',
    match: (text) => (
      /\b(presentation|presenting|speech|stage fright|class presentation|speak in front of|oral exam|shaking hands|laughed at)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your class';
      return {
        domainLabel: 'Social Exposure Regulation & Stage Fright Protocol',
        category: 'confidence',
        understanding: {
          summary: `You are experiencing acute stage fright, somatic tremors, and fear of judgment ahead of your ${subj} presentation.`,
          rootCause: "Evolutionary Tribal Scrutiny Alarm. To our ancestral brain, being singled out and watched by a group signaled vulnerability and potential social expulsion, triggering an instantaneous adrenaline rush, vocal cord tightness, and tremors.",
          validation: `Even seasoned world leaders, actors, and TED speakers feel their heart pounding before taking the stage. Physical nervousness does not mean you are going to fail—it means your body is pumping adrenaline to sharpen your senses.`
        },
        solution: {
          immediate5Min: "Stand up and do the Isometric Wall Push: place both palms against a wall and push with full force for 30 seconds (this burns off excess peripheral adrenaline). Then hum gently on exhalations for 1 minute to relax your vocal cords.",
          steps: [
            {
              title: "Over-Learn Only the First 60 Seconds",
              action: "Rehearse only your opening 3 sentences 8 times until they are pure muscle memory. Once you navigate the first 60 seconds of speaking, your nervous system naturally down-regulates."
            },
            {
              title: "Pick 2 Friendly Audience Anchors",
              action: "Identify two supportive classmates sitting on opposite sides of the room. Deliver your presentation by simply having a conversation back and forth between those two friendly faces."
            },
            {
              title: "Reframe Trembling as 'Readiness Energy'",
              action: "When your heart beats fast, tell your brain: 'My heart is pumping oxygen to my brain so I can think fast and speak clearly.' Convert the feeling of fear into focused excitement."
            }
          ],
          recommendedTool: {
            id: 'grounding_54321',
            title: '5-4-3-2-1 Sensory Grounding',
            type: 'guided_interactive',
            description: 'Anchor yourself back in your physical senses to stop catastrophic stage panic.'
          },
          actionItem: "Rehearse your presentation's opening 2 sentences aloud 5 times right now."
        },
        motivation: {
          pepTalk: `${studentName}, the audience is not waiting for you to fail; they are silently rooting for you because almost everyone in that room is terrified of public speaking too! You don't have to be a theatrical actor; you just need to share your message honestly. Speak at a measured, unhurried pace, pause whenever you need to breathe, and own your space with pride. You can do this!`,
          affirmation: `My voice matters. I share my thoughts with calm confidence and authenticity.`,
          mindsetShift: {
            from: "Everyone is waiting to laugh at me and I'll ruin everything.",
            to: "My classmates are supportive. I only need to speak clearly and share what I prepared."
          },
          audioScript: `${studentName}, stand tall and drop your shoulders. Your nervousness is just energy. Rehearse your first sentence and trust yourself.`
        }
      };
    }
  },

  // 9. Imposter Syndrome & Comparing with Toppers
  {
    id: 'imposter_syndrome_comparison',
    category: 'confidence',
    title: 'Imposter Syndrome & Upward Peer Comparison',
    match: (text) => (
      /\b(imposter|compare|comparing|topper|toppers|smarter than me|everyone is ahead|not good enough|feel dumb|lagging behind)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your studies';
      return {
        domainLabel: 'Comparative Detox & Self-Efficacy Rebuild',
        category: 'confidence',
        understanding: {
          summary: `You are caught in exhausting upward social comparison, feeling like an imposter who doesn't measure up to peers in ${subj}.`,
          rootCause: "Asymmetric Information Bias (Comparing Your Inside to Their Outside). You experience every single one of your doubts, messy mistakes, and late-night anxieties, but you only see the polished, public achievements of your peers.",
          validation: `Almost every high-achieving student secretly feels like a fraud who will be discovered any day. The fact that you feel this way proves you care deeply about growth, but comparing your chapter 2 to someone else's chapter 20 will only poison your motivation.`
        },
        solution: {
          immediate5Min: "Write down 3 specific things you understand today that you did not know 6 months ago. Ground yourself in your own historical trajectory.",
          steps: [
            {
              title: "Switch from Outcome Benchmark to Effort Benchmark",
              action: `Stop measuring yourself against someone else's exam score. Measure: 'Did I complete my 3 study intervals today? Did I solve 5 practice questions in ${subj}?' Effort is within your control; peer scores are not.`
            },
            {
              title: "Initiate a Digital / Social Comparison Diet",
              action: "Mute study groups or peer chats where students boast about marks, hours studied, or study schedules. Protect your mental peace like high-value property."
            },
            {
              title: "Celebrate Others Without Diminishing Yourself",
              action: "When a classmate scores high, remember: intellectual success is not a zero-sum game. Their light does not dim yours; there is abundant room for your brilliance too."
            }
          ],
          recommendedTool: {
            id: 'comparison_shield',
            title: 'Comparison Shield & Baseline Audit',
            type: 'action_tool',
            description: 'Insulate yourself against peer comparison and anchor in personal milestones.'
          },
          actionItem: "Write down 1 personal skill or academic breakthrough you achieved this month."
        },
        motivation: {
          pepTalk: `${studentName}, you did not get here by accident. You are in this class, this school, and this journey because you have grit, intelligence, and potential. Flowers do not compare their blooming speed to the flower next to them; they just bloom. Focus all of that brilliant energy on your own growth. In 1 year, you will be amazed at how far you've traveled!`,
          affirmation: `I run my own race at my own pace. My worth is non-negotiable and my growth is unstoppable.`,
          mindsetShift: {
            from: "Everyone else is so much smarter than me; I don't belong here.",
            to: "I belong in this room. My journey is unique, and consistent effort will take me wherever I want to go."
          },
          audioScript: `${studentName}, stop comparing your behind-the-scenes to other people's highlights. You are talented, capable, and exactly where you need to be.`
        }
      };
    }
  },

  // 10. Tough Subject / Concept Confusion (Math, Science, Coding)
  {
    id: 'subject_difficulty_confusion',
    category: 'academic',
    title: 'Difficult Subject Confusion & Conceptual Wall',
    match: (text, context) => (
      /\b(don't understand|can't understand|makes no sense|confused|stuck on|struggling with|feel (stupid|dumb)|too hard)\b/i.test(text) &&
      ((context?.subjects && context.subjects.length > 0) || /\b(concept|math|physics|chemistry|chapter|code|formula|problem|equations?|subject|lesson|topic|derivatives?|integrals?|calculus)\b/i.test(text))
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'this subject';
      return {
        domainLabel: 'Cognitive Scaffolding & Conceptual Mastery',
        category: 'academic',
        understanding: {
          summary: `You have hit a difficult conceptual block in ${subj}, leading to feelings of frustration, cognitive fatigue, and self-doubt.`,
          rootCause: "Missing Prerequisite Scaffolding (The Illusion of Inability). Complex topics in math, science, and coding are hierarchical. If a foundational sub-concept was skipped or unclear, the current chapter will feel like a foreign language—not because you lack intellect, but because a prerequisite brick is missing.",
          validation: `Feeling confused is the active biological state of neuroplasticity! Confusion is your brain struggling to form new synaptic connections. The moment you step back and bridge the prerequisite gap, the fog will clear.`
        },
        solution: {
          immediate5Min: `Step away from the confusing problem for 5 minutes. Find a 5-minute visual explanation on YouTube (e.g. 3Blue1Brown, Khan Academy, or organic chemistry tutor) explaining the core concept in ${subj} using plain analogies.`,
          steps: [
            {
              title: "Trace Back 1 Step to the Prerequisite",
              action: `Ask yourself: 'What earlier concept is this problem assuming I already know?' Go back one lesson in ${subj} and verify the basic definition or formula before tackling the advanced question.`
            },
            {
              title: "Reverse-Engineer 2 Solved Textbook Examples",
              action: "Do not attempt unsolved questions while confused. Copy down 2 completely solved examples line-by-line, writing out the reason for each step in your own words."
            },
            {
              title: "Use the Feynman Rubber-Duck Technique",
              action: "Explain the concept out loud as if teaching it to an 8-year-old. The exact moment your explanation stumbles reveals the precise knowledge gap you need to ask a teacher or friend about."
            }
          ],
          recommendedTool: {
            id: 'five_minute_start',
            title: 'BJ Fogg 5-Minute Study Start',
            type: 'timer',
            description: 'Tackle tough problems with low-friction 5-minute exploratory sprints.'
          },
          actionItem: `Find one 5-minute video explaining this concept in simple visual terms.`
        },
        motivation: {
          pepTalk: `${studentName}, confusion is not defeat—confusion is the doorway to mastery! Every master of ${subj} once stared at the exact same equations and felt lost. Do not let one difficult chapter convince you that you 'aren't a math/science person'. Be patient with yourself, break the concept into smaller legos, and keep going. You will crack this code!`,
          affirmation: `I am capable of understanding difficult things. With patience and curiosity, I master any concept.`,
          mindsetShift: {
            from: "I am too stupid to understand this subject.",
            to: "This is simply a new concept with a missing prerequisite. Once I break it down, it will click."
          },
          audioScript: `${studentName}, confusion is part of learning. Don't quit. Step back, break the problem into smaller pieces, and you will understand it.`
        }
      };
    }
  },

  // 11. Chronic Sleep Deprivation & Burnout Exhaustion
  {
    id: 'sleep_deprivation_exhaustion',
    category: 'burnout',
    title: 'Severe Sleep Debt & Cognitive Burnout',
    match: (text) => (
      /\b(sleep|all-nighter|exhausted|burnout|drained|tired|headache|eyes burn|foggy|zero energy|insomnia|slept 3 hours|slept 4 hours)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const task = context.subjectName ? `while studying for ${context.subjectName}` : 'due to sustained study';
      return {
        domainLabel: 'Somatic Recovery & Sleep Debt Restoration',
        category: 'burnout',
        understanding: {
          summary: `You are suffering from acute nervous system exhaustion and adenosine saturation ${task} on insufficient sleep.`,
          rootCause: "Adenosine Toxicity & Glymphatic Deficit. During prolonged wakefulness, metabolic waste products build up in the brain. Only deep slow-wave sleep activates the glymphatic system to wash away these toxins and solidify memory in the cortex.",
          validation: "Your body is not weak—it is signaling vital survival feedback. Trying to force an exhausted, sleep-deprived brain to memorize new information is like attempting to drive a car with a dry fuel tank."
        },
        solution: {
          immediate5Min: "Lie down flat on your back, place your hands on your belly, and do 10 gentle belly breaths with eyes closed. Drink a large glass of room-temperature water.",
          steps: [
            {
              title: "Execute the 'Sleep-First' Rule Tonight",
              action: "Stop all studying by 10:30 PM or 11 PM tonight. An extra 2 hours of sleep will boost your tomorrow exam recall by far more than 2 hours of delirious midnight cramming."
            },
            {
              title: "Implement a 30-Minute Screen Curfew",
              action: "Turn off blue-light devices 30 minutes before bed. Listen to soft ambient soundscapes or read a leisure book to allow your pineal gland to release natural melatonin."
            },
            {
              title: "Take a 20-Minute Power Nap or NSDR",
              action: "If you must study during the day, do a 20-minute Non-Sleep Deep Rest (NSDR) session to quickly recharge acetylcholine and mental sharpness."
            }
          ],
          recommendedTool: {
            id: 'sleep_hygiene_ritual',
            title: 'Nightly Sleep Reset Checklist',
            type: 'action_tool',
            description: 'Non-negotiable evening routines to restore deep restorative sleep.'
          },
          actionItem: "Set an alarm for an early bedtime tonight and protect a full 8 hours of sleep."
        },
        motivation: {
          pepTalk: `${studentName}, resting is not slacking off—rest is an essential part of the work! Olympic athletes rest to build muscle; student champions sleep to build memory and mental acuity. You have pushed yourself hard and your dedication is inspiring. Now, honor your body by giving it the deep recovery it has earned. A rested you can do in 1 hour what an exhausted you takes 4 hours to do.`,
          affirmation: `Rest is productive. Recharging my mind makes me clear, focused, and powerful.`,
          mindsetShift: {
            from: "If I sleep, I am falling behind and wasting precious study time.",
            to: "Sleep is my superpower. Resting tonight locks in everything I studied and restores my brilliance."
          },
          audioScript: `${studentName}, give yourself permission to rest. You have worked so hard. Sleep is the best study tool you have right now.`
        }
      };
    }
  },

  // 12. Friendship Drama, Bullying & Social Exclusion
  {
    id: 'social_exclusion_drama',
    category: 'social',
    title: 'Social Exclusion, Rumors & Friend Drama',
    match: (text) => (
      /\b(left out|excluding|whispering|rumors?|bully(ing)?|ignoring me|friends? made plans|unfriended|drama in class|lonely in school)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const peers = context.peopleName || 'peers or friends';
      return {
        domainLabel: 'Social Safety Boundaries & Peer Drama Armor',
        category: 'social',
        understanding: {
          summary: `You are dealing with painful peer exclusion, whispers, or interpersonal drama with ${peers}, disrupting your emotional peace and focus.`,
          rootCause: "Interpersonal Belonging Deprivation. Neuro-imaging reveals that social exclusion activates the anterior cingulate cortex—the exact same neural circuitry that registers physical bodily injury. School drama physically hurts.",
          validation: "It is agonizing to feel excluded or talked about by people you considered friends. Your feelings of betrayal and loneliness are completely valid. But remember: other people's unkind behavior reflects their own insecurity, never your value as a person."
        },
        solution: {
          immediate5Min: "Step away from group chats and social feeds right now. Splash cool water on your face to stimulate your vagal response and calm the emotional sting.",
          steps: [
            {
              title: "Apply the 24-Hour Emotional Cooling Rule",
              action: "Never send angry or defensive messages while your heart is racing. Wait 24 hours before responding to any social provocation so you remain in full control."
            },
            {
              title: "Establish Your Academic Sanctuary",
              action: "Declare your study time as sacred and separate from classroom drama. Tell yourself: 'My education is for my future. I will not let temporary hallway drama sabotage my long-term dreams.'"
            },
            {
              title: "Diversify Your Social Connections",
              action: "Do not put all your emotional eggs in one school clique. Connect with an outside friend, a family member, or a peer from a club or library."
            }
          ],
          recommendedTool: {
            id: 'healthy_boundaries_script',
            title: 'Safe Social Boundaries & De-escalation',
            type: 'action_tool',
            description: 'Assertive, dignified scripts to neutralize school drama and protect your peace.'
          },
          actionItem: "Mute drama-heavy group chats for the next 24 hours."
        },
        motivation: {
          pepTalk: `${studentName}, your worth is not up for a popularity vote in a school corridor! The people whispering or acting distant today will not be the authors of your future. You are loyal, intelligent, and deserving of authentic, kind friendships. Walk through school with your chin up and your dignity intact. Your genuine tribe will find and cherish you for who you are!`,
          affirmation: `I don't need everyone's approval. I belong to myself and I guard my inner peace.`,
          mindsetShift: {
            from: "Nobody likes me and I don't fit in anywhere.",
            to: "Their unkindness is a reflection of them, not me. I choose peace and invest in genuine relationships."
          },
          audioScript: `${studentName}, do not let temporary school drama dim your light. You are worthy of authentic respect and true friendship. Stand tall.`
        }
      };
    }
  },

  // 13. Group Project Slackers & Unfair Workload
  {
    id: 'group_project_friction',
    category: 'social',
    title: 'Group Project Slackers & Carrying the Work',
    match: (text) => (
      /\b(group project|partner|teammate|teammates|ghosting|doing all the work|carrying the group|group work)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'the group project';
      return {
        domainLabel: 'Group Accountability & Boundary Diplomacy',
        category: 'social',
        understanding: {
          summary: `You are carrying an unfair burden in ${subj} because group members are slacking or ghosting before the deadline.`,
          rootCause: "Social Loafing & Diffused Responsibility. In team assignments without rigid individual accountability, group members naturally default to the path of least resistance, leaving conscientious students to carry the burden.",
          validation: "It is deeply frustrating to have your grades endangered by other people's lack of effort. You have every right to feel resentful, but we can protect your marks without you having to suffer in silence."
        },
        solution: {
          immediate5Min: "Open your shared project document. Create a clear 'Contribution Log' table on page 1 with 3 columns: Task, Assigned Member, and Status.",
          steps: [
            {
              title: "Send a Clear, Neutral Group Deadline Message",
              action: `Post in the group chat: 'Hey team, to ensure we submit ${subj} on time, everyone needs their completed section in by tomorrow 6 PM so we can proofread. Let me know by 2 PM if you need help with your part.'`
            },
            {
              title: "Create an Unambiguous Paper Trail",
              action: "Save all chat logs and document version histories. Ensure your name is clearly credited on the specific sections and slides you produced."
            },
            {
              title: "Inform Your Instructor Proactively",
              action: "If teammates remain unresponsive, email the professor 24 hours before submission: 'Dear Professor, here is my completed portion of the project. We experienced communication difficulties with the remaining parts, and I wanted to ensure my contribution was received.'"
            }
          ],
          recommendedTool: {
            id: 'healthy_boundaries_script',
            title: 'Safe Social Boundaries & De-escalation',
            type: 'action_tool',
            description: 'Clear, assertive communication frameworks for academic teamwork.'
          },
          actionItem: "Send a factual deadline check-in message to the group chat right now."
        },
        motivation: {
          pepTalk: `${studentName}, your work ethic and responsibility are your greatest superpowers. While it is unfair that you are carrying more than your share today, know that this level of leadership, discipline, and execution is exactly what will make you thrive in higher education and your career. Protect your boundaries, document your work, and shine!`,
          affirmation: `I take responsibility for my excellence while setting clear, respectful boundaries with others.`,
          mindsetShift: {
            from: "I have to suffer in silence and do everyone's work or my grade is ruined.",
            to: "I will complete my part with excellence and communicate transparently with the instructor."
          },
          audioScript: `${studentName}, your integrity and work ethic are admirable. Set clear expectations, document your hard work, and protect your peace.`
        }
      };
    }
  },

  // 14. Teacher Scolding, Criticism & Humiliation
  {
    id: 'teacher_criticism_humiliation',
    category: 'academic',
    title: 'Teacher Criticism & Classroom Humiliation',
    match: (text) => (
      /\b(teacher|professor|instructor|faculty)\b/i.test(text) &&
      /\b(scolded|yelled|harsh|humiliated|rude remarks|in front of the class|unfair grading|hates me)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'the class';
      return {
        domainLabel: 'Academic Resilience & Authority De-Escalation',
        category: 'academic',
        understanding: {
          summary: `You are feeling hurt, embarrassed, and discouraged after receiving harsh public scolding or criticism from your teacher in ${subj}.`,
          rootCause: "Authority-Driven Identity Threat. Teachers represent academic authority. When correction is delivered with harshness or sarcasm in front of peers, the brain interprets it as social humiliation and rejects the subject entirely.",
          validation: "Being scolded publicly or spoken to harshly by an educator is demoralizing. Good teaching requires patience, and when a teacher falls short of that, it is painful. But please remember: their delivery style is about their personality, not your intellectual ceiling."
        },
        solution: {
          immediate5Min: "Draw a line down a blank page. On the left, write: 'Emotional Words (Discard)'. On the right, write: 'Objective Feedback Data (Keep)'. Extract ONLY the actionable study point and ignore the tone.",
          steps: [
            {
              title: "Separate the Delivery from the Data",
              action: `Throw away the sarcasm or anger. Keep only the technical advice: 'Need more citations', 'Revise chapter 3 formulas', or 'Submit on time'. Use their criticism as free fuel to sharpen your work in ${subj}.`
            },
            {
              title: "Seek a Calm, 2-Minute Office Hour Check-in",
              action: "After emotions have cooled, approach the teacher privately: 'I took your comments on my paper seriously and want to ensure I address the gaps for the next test. Could you clarify this one question?'"
            },
            {
              title: "Remember: One Teacher Does Not Define Your Future",
              action: "Countless historic geniuses were told by teachers that they 'would never amount to anything'. Your potential is verified by your ongoing curiosity, not one teacher's bad mood."
            }
          ],
          recommendedTool: {
            id: 'cbt_thought_flip',
            title: 'CBT Thought Flip Reality Check',
            type: 'cbt_tool',
            description: 'Deconstruct harsh external criticism and restore objective self-worth.'
          },
          actionItem: "Write down the 1 objective technical improvement you can make to your work."
        },
        motivation: {
          pepTalk: `${studentName}, do not let anyone's harsh words convince you to abandon your love for learning. You are resilient, intelligent, and capable of proving your capability through quiet excellence. Channel this sting into focus. When you achieve your goals, you will look back on this moment as the turning point where you discovered your true inner strength!`,
          affirmation: `No one's harsh words can define my worth or limit my future. I learn, adapt, and rise higher.`,
          mindsetShift: {
            from: "My teacher thinks I'm hopeless, so I should just give up on this subject.",
            to: "I will extract the technical lessons, ignore the harsh delivery, and let my future results speak for themselves."
          },
          audioScript: `${studentName}, hold your head high. One teacher's harsh words do not define your potential. Channel this energy into your quiet excellence.`
        }
      };
    }
  },

  // 15. Competitive Entrance Exam & Existential Future Dread
  {
    id: 'entrance_exam_future_dread',
    category: 'academic',
    title: 'Entrance Exam Pressure & Future Existential Dread',
    match: (text) => (
      /\b(entrance exam|jee|neet|sat|act|mcat|gre|college admissions?|future|ruin my life|what if i fail in life|career pressure)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'competitive entrance exams';
      return {
        domainLabel: 'Macro Perspective & Existential Future Anxiety',
        category: 'academic',
        understanding: {
          summary: `You are feeling crushing existential dread and panic regarding ${subj} and the terrifying fear of 'ruining your entire future'.`,
          rootCause: "Catastrophic Temporal Forecasting & Hyperbolic Discounting. Society conditions students to believe that life is a single linear train track determined by one exam rank. Your mind tries to solve a 10-year future all at once today, resulting in paralysis.",
          validation: "It is so heavy when the weight of your entire adulthood feels resting on a single entrance test. But that narrative is a cultural myth. There are thousands of roads to a joyful, prosperous, meaningful life, and no single test has the power to destroy your destiny."
        },
        solution: {
          immediate5Min: "Draw the 'Sphere of Control' on paper. Inside the circle, write: 'Today's 3 revision goals, my hydration, my bedtime'. Outside the circle, write: 'College cut-offs, national ranks, other students' scores'. Let go of the outside.",
          steps: [
            {
              title: "Shrink Your Mental Horizon to the Next 24 Hours",
              action: `You cannot live your 20s this afternoon. Focus strictly on winning today: 3 study sessions in ${subj}, 1 review quiz, and 7 hours of restorative sleep.`
            },
            {
              title: "Research Alternative Paths to Disarm Catastrophizing",
              action: "Notice that the majority of successful leaders, innovators, and thinkers did not take the single standard entrance route. Having 2 alternative backup plans instantly eliminates panic."
            },
            {
              title: "Build Transferable Meta-Skills",
              action: "Remind yourself: you are practicing focus, critical thinking, and discipline. Even if the exam format changes, your ability to learn is an asset that stays with you forever."
            }
          ],
          recommendedTool: {
            id: 'cbt_thought_flip',
            title: 'CBT Thought Flip Reality Check',
            type: 'cbt_tool',
            description: 'Disarm catastrophic all-or-nothing thinking about the future.'
          },
          actionItem: "Write down your 2 achievable study targets for today and forget about 5 years from now."
        },
        motivation: {
          pepTalk: `${studentName}, take a massive breath of fresh air. Your life is not a narrow corridor; it is an expansive ocean of possibilities. This exam is simply one door among ten thousand doors. Prepare with all your heart, but remember that your happiness, your intelligence, and your future success will be defined by your curiosity, grit, and kindness—qualities that no test paper can measure!`,
          affirmation: `My future is vast, bright, and secure. I take joyful responsibility for today's effort.`,
          mindsetShift: {
            from: "If I don't clear this entrance exam, my life is completely over.",
            to: "This exam is just one exciting opportunity. I will do my absolute best today, and a great future will unfold regardless."
          },
          audioScript: `${studentName}, your future is big and bright. Stop carrying five years of worries today. Just focus on today's effort.`
        }
      };
    }
  },

  // 16. ADHD, Racing Mind & Restlessness
  {
    id: 'adhd_racing_scattered',
    category: 'focus',
    title: 'ADHD Racing Mind & Restless Fidgeting',
    match: (text) => (
      /\b(adhd|racing mind|20 tabs|can't sit still|fidgety|restless|jumping from thing to thing|scattered brain)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your studies';
      return {
        domainLabel: 'Kinesthetic Regulation & ADHD Focus Scaffolding',
        category: 'focus',
        understanding: {
          summary: `Your brain has multiple racing thought streams at once, making it physically uncomfortable to sit still and maintain focus on ${subj}.`,
          rootCause: "Dopamine-Deficit Executive Filtration. An ADHD or highly scattered brain has lower baseline tonic dopamine in prefrontal circuits. The brain constantly scans for novel sensory input to reach optimal stimulation, making quiet textbook reading feel like sensory deprivation.",
          validation: "A racing, active mind is also the seat of tremendous creativity, rapid lateral thinking, and intense hyperfocus when stimulated properly! You don't have a broken brain; you just need neuro-divergent study strategies instead of boring passive reading."
        },
        solution: {
          immediate5Min: "Do 2 minutes of vigorous movement: 20 jumping jacks, a wall sit, or brisk walking around the room. Put on brown noise or 40Hz binaural beats with headphones.",
          steps: [
            {
              title: "Gamify with Ultra-Short 10-Minute Sprints",
              action: "Forget 1-hour study sessions. Set a timer for 10 minutes and challenge yourself: 'How many flashcards or equations can I solve before the buzzer rings?'"
            },
            {
              title: "Use a Physical 'Parking Lot' Scratchpad",
              action: "Keep a blank notepad next to your book. Every time a random thought or urge pops into your head ('check Wikipedia', 'clean drawer'), scribble it on the scratchpad and immediately return to your task."
            },
            {
              title: "Incorporate Tactile & Physical Movement",
              action: "Study while standing up, pacing the room while reciting flashcards, or holding a textured fidget toy in your non-writing hand."
            }
          ],
          recommendedTool: {
            id: 'five_minute_start',
            title: 'BJ Fogg 5-Minute Study Start',
            type: 'timer',
            description: 'Gamified micro-sprint timer designed to harness quick neuro-divergent energy bursts.'
          },
          actionItem: "Set up a scratchpad for stray thoughts and start a 10-minute micro-sprint."
        },
        motivation: {
          pepTalk: `${studentName}, having a vibrant, fast-moving mind is a tremendous gift when you learn how to ride its waves! You are not lazy, and you are not incapable. You just need high stimulation, physical movement, and bite-sized goals. Work with your brain, not against it. Put on that timer, celebrate every small win, and let your brilliance shine!`,
          affirmation: `My mind is creative, quick, and powerful. I harness my energy in focused micro-bursts.`,
          mindsetShift: {
            from: "My brain is defective because I can't sit still like other students.",
            to: "My mind is fast and creative. With physical movement and short gamified sprints, I learn exceptionally well."
          },
          audioScript: `${studentName}, your mind is vibrant and capable. Do some quick movement, set a ten-minute timer, and ride your natural focus wave.`
        }
      };
    }
  },

  // 17. Campus Loneliness & Social Isolation
  {
    id: 'loneliness_isolation',
    category: 'social',
    title: 'Campus Loneliness & Social Disconnection',
    match: (text) => (
      /\b(lonely|alone|no friends|eating alone|sitting alone|nobody to talk to|invisible|isolated|homesick)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName ? `while managing ${context.subjectName}` : 'in daily student life';
      return {
        domainLabel: 'Micro-Connection & Belonging Anchor',
        category: 'social',
        understanding: {
          summary: `You are experiencing deep loneliness ${subj}, feeling isolated or invisible among peers, which drains your cognitive motivation.`,
          rootCause: "Social Attachment Depletion. Prolonged lack of genuine human connection elevates baseline cortisol and causes the brain to enter a self-protective, low-energy mode that diminishes study focus.",
          validation: "Feeling lonely in a school or college full of people is one of the most painful, silent struggles a student can face. You are not weird or unlikable; building genuine connection takes time, and countless students around you feel the exact same hidden loneliness."
        },
        solution: {
          immediate5Min: "Step outside into natural light for 5 minutes. Smile or say a warm 'thank you' to a librarian, barista, or shopkeeper—micro-interactions trigger immediate oxytocin and reset the isolation loop.",
          steps: [
            {
              title: "Target 'Parallel Presence' Environments",
              action: "Don't study alone in your room. Study in a busy campus library, a study lounge, or a quiet cafe where you are surrounded by the warm ambient presence of others."
            },
            {
              title: "The 'One Low-Stakes Question' Rule",
              action: "Ask one classmate an easy question: 'Hey, did you catch what the homework page was?' or 'Do you mind if I sit here?' Big friendships almost always start with small, low-stakes questions."
            },
            {
              title: "Engage in an Activity-Based Circle",
              action: "Join a campus club, volunteering group, or study circle where human interaction happens naturally around a shared task rather than awkward small talk."
            }
          ],
          recommendedTool: {
            id: 'gratitude_garden',
            title: 'Gratitude Garden Blossom',
            type: 'gratitude_flower',
            description: 'Plant moments of appreciation to reconnect with kindness and warmth.'
          },
          actionItem: "Pack your bag and spend your next study session in the campus library or a coffee shop."
        },
        motivation: {
          pepTalk: `${studentName}, you are not invisible. Your presence in this world matters deeply, and you have so much warmth, empathy, and intellect to offer. School and college seasons can feel intensely lonely at times, but this is a temporary chapter, not your permanent story. Keep showing up with an open heart. The friendships you cultivate in the coming months will cherish you for who you are!`,
          affirmation: `I am worthy of connection and belonging. I take brave small steps to connect with the world around me.`,
          mindsetShift: {
            from: "Nobody cares about me and I will always be isolated.",
            to: "Connection takes patience. I will take small steps to connect, and my authentic people will find me."
          },
          audioScript: `${studentName}, you are not alone, and your presence matters. Take a walk, study in the library around others, and know that brighter connections are ahead.`
        }
      };
    }
  },

  // 18. Relationship Heartbreak & Study Distraction
  {
    id: 'heartbreak_distraction',
    category: 'social',
    title: 'Relationship Heartbreak & Emotional Turmoil',
    match: (text) => (
      /\b(breakup|broken up|ex\b|crush|heartbroken|crying over (him|her|someone)|relationship drama|dating)\b/i.test(text)
    ),
    build: ({ studentName, context }) => {
      const subj = context.subjectName || 'your studies';
      return {
        domainLabel: 'Grief Compartmentalization & Emotional Recovery',
        category: 'social',
        understanding: {
          summary: `You are dealing with painful relationship heartbreak or rejection, making it nearly impossible to focus your thoughts on ${subj}.`,
          rootCause: "Neurochemical Dopamine Withdrawal & Attachment Shock. Neurological studies show that romantic heartbreak activates the exact same brain pathways as physical withdrawal from an addictive substance, causing profound executive dysfunction.",
          validation: "It is completely normal that you cannot easily focus on books while your heart is aching. Your brain is processing real emotional grief. Honor your feelings without judging yourself for being distracted."
        },
        solution: {
          immediate5Min: "Place your right hand gently over your heart. Take 5 slow, comforting breaths and acknowledge: 'This pain is real, but it will not last forever. I am here for myself right now.'",
          steps: [
            {
              title: "Enforce a Strict 30-Day Digital Boundary",
              action: "Mute, unfriend, or archive their profile and old text threads. Constant checking triggers acute neurochemical relapses and resets your healing clock to zero."
            },
            {
              title: "Create a 25-Minute 'Study Sanctuary' Box",
              action: `Tell your heart: 'For the next 25 minutes, I am dedicating my energy strictly to ${subj} for my own future. At 5:00 PM, I will give myself permission to journal and feel sad for 20 minutes.'`
            },
            {
              title: "Anchor in Personal Sovereignty",
              action: "Your education, talents, and mind are assets that belong permanently to you. No one can ever take them away. Let your studies become a stepping stone for your own thriving future."
            }
          ],
          recommendedTool: {
            id: 'self_compassion_reset',
            title: 'Self-Compassion Pep Talk',
            type: 'reflective_prompt',
            description: 'Write a comforting note of resilience and kindness to yourself.'
          },
          actionItem: "Archive old chats and dedicate 20 minutes of focus strictly for your own future."
        },
        motivation: {
          pepTalk: `${studentName}, your story does not end because one chapter closed. You are whole, you are resilient, and you are destined for extraordinary things. Let your focus today become an act of profound self-love. Pour your energy into your dreams, your mind, and your future. You will emerge from this season stronger, wiser, and more magnificent than ever!`,
          affirmation: `I honor my healing heart. My future, my education, and my peace belong to me.`,
          mindsetShift: {
            from: "My world is shattered and I can't function without them.",
            to: "I am healing one day at a time. My studies and my dreams are worthy of my dedication."
          },
          audioScript: `${studentName}, place your hand on your heart and breathe. You are healing, you are whole, and your future is full of beauty and purpose.`
        }
      };
    }
  }
];

/**
 * Dynamic Universal Fallback Generator
 * If the user types a unique, complex, or multi-faceted challenge not covered by a single archetype,
 * this function weaves their exact words, detected subjects, people, timeframe, and emotional markers
 * into a tailored, non-generic psychological diagnosis and roadmap!
 */
function buildUniversalDynamicSolution({ category, studentName, context }) {
  const subj = context.subjectName ? `in ${context.subjectName}` : 'in your current coursework';
  const person = context.peopleName ? `involving ${context.peopleName}` : 'in your current environment';
  const time = context.timeframe ? `with ${context.timeframe} pressure` : 'under current pressures';
  const quote = context.painPointQuote ? `"${context.painPointQuote}"` : `this challenge`;

  return {
    isCrisis: false,
    category: category !== 'all' ? category : 'academic',
    domainLabel: `Personalized Resolution: ${context.subjectName || 'Student Challenge'}`,
    diagnosedArchetype: 'Personalized Contextual Resolution',
    detectedEntities: context,
    understanding: {
      summary: `You are navigating a difficult dilemma ${time} ${person}, specifically reflecting: ${quote}. This has created noticeable friction ${subj}.`,
      rootCause: "Cognitive Bandwidth Depletion & Multitasking Friction. When an unexpected stressor absorbs working memory capacity, the brain experiences an elevated cognitive load that reduces focus and raises emotional distress.",
      validation: `Your reaction to this situation is completely natural. Trying to perform at your best while handling personal friction requires immense energy. Acknowledge your effort—you are taking proactive steps right now to resolve this.`
    },
    solution: {
      immediate5Min: `Pause whatever you are doing. Drink a glass of water and write down on paper: 1) What is the single biggest stressor in this situation? 2) What is 1 thing within my direct physical control over the next 30 minutes?`,
      steps: [
        {
          title: "Isolate the Immediate Next Micro-Victory",
          action: `Don't solve the entire problem today. Pick one discrete, bite-sized action ${subj} that takes less than 15 minutes and complete it without distractions.`
        },
        {
          title: "Build a Physical & Mental Boundary",
          action: `Create an intentional buffer around your work. If interpersonal tension ${person} is distracting you, set a dedicated review time later and keep your current workspace protected.`
        },
        {
          title: "Review and Adapt Tomorrow Morning",
          action: "Check in with yourself after a good night's sleep. Sleep reorganizes cognitive perspective and makes obstacles that felt massive today feel manageable tomorrow."
        }
      ],
      recommendedTool: {
        id: 'five_minute_start',
        title: 'BJ Fogg 5-Minute Study Start',
        type: 'timer',
        description: 'Bypass friction and start with zero pressure.'
      },
      actionItem: `Focus on the single micro-action you can control right now for the next 15 minutes.`
    },
    motivation: {
      pepTalk: `${studentName}, life as a student throws unpredictable situations your way, but you have the resilience and intelligence to steer through this. Do not demand perfection from yourself today—simply aim for steady, calm progress. Take this one step at a time, celebrate your small wins, and trust in your ability to handle whatever comes next!`,
      affirmation: `I have what it takes to navigate this challenge. I stay grounded in what I can control.`,
      mindsetShift: {
        from: "This situation is completely overwhelming and I don't know what to do.",
        to: "I will focus on the single step in front of me right now and navigate this with steady confidence."
      },
      audioScript: `${studentName}, take a deep breath. Focus strictly on what is in your control right now. You have the resilience and intelligence to handle this step by step.`
    }
  };
}

/**
 * Main Problem Analysis & Solving Pipeline
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

  // 1. Critical Safety Check
  const isCrisis = CRISIS_PATTERNS.some(p => p.test(lower));
  if (isCrisis) {
    return {
      isCrisis: true,
      category: 'safety',
      domainLabel: 'Crisis & Immediate Safety Support',
      diagnosedArchetype: 'Immediate Compassionate Safety Protocol',
      detectedEntities: { subjects: [], people: [], symptoms: ['Critical Emotional Distress'] },
      understanding: {
        summary: "We hear the immense weight, exhaustion, and pain you are carrying right now.",
        rootCause: "Acute Emotional Overwhelm signaling that you need immediate compassionate human connection, not academic pressure.",
        validation: "Your life, safety, and well-being are infinitely more valuable than any school test, grade, or expectation. You do not have to carry this heavy burden alone."
      },
      solution: {
        immediate5Min: "Step away from all study materials immediately. Sit in a comfortable, safe spot, drink a glass of water, and connect with a trusted person or free confidential helpline right now.",
        steps: [
          {
            title: "Ground your physical body with slow exhalations",
            action: "Take 4 slow, long exhalations. Remind yourself: 'I am safe in this physical moment, and help is here.'"
          },
          {
            title: "Connect with a trained, compassionate counselor for free",
            action: "Call 988 (USA/Canada), Tele-MANAS at 14416 (India), Childline 1098, or text HOME to 741741 for 100% confidential, free support."
          },
          {
            title: "Reach out to someone who cares about you",
            action: "Tell a parent, trusted teacher, sibling, or school counselor: 'I am having a very hard time right now and need support.'"
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
        pepTalk: `${displayName}, please know this deeply: You matter, your presence in this world is precious, and this painful moment will pass. Pain lies to us and makes struggles seem permanent, but tomorrow holds healing, relief, and new possibilities. Please let someone help you carry this weight today.`,
        affirmation: "My life is precious, my story is not finished, and I deserve support and care.",
        mindsetShift: {
          from: "I have to suffer through this alone.",
          to: "Reaching out for help is an act of supreme courage, not weakness."
        },
        audioScript: `${displayName}, you are not alone. Please pause, take a deep breath, and reach out to a trusted adult or counselor. Your life has immense value.`
      }
    };
  }

  // 2. Extract Entities, Subject, Urgency, People, Symptoms
  const context = extractEntitiesAndContext(cleanText);

  // 3. Score & Match Best Archetype
  let matchedArchetype = null;
  for (const arc of STRESS_ARCHETYPES) {
    // If user filtered by a specific category, prefer archetypes matching that category
    if (category !== 'all' && arc.category !== category) {
      continue;
    }
    if (arc.match(lower, context)) {
      matchedArchetype = arc;
      break;
    }
  }

  // If no match under filtered category, check all archetypes
  if (!matchedArchetype && category !== 'all') {
    for (const arc of STRESS_ARCHETYPES) {
      if (arc.match(lower, context)) {
        matchedArchetype = arc;
        break;
      }
    }
  }

  // 4. Build Structured Result
  if (matchedArchetype) {
    const built = matchedArchetype.build({
      studentName: displayName,
      context,
      intensity,
      rawText: cleanText
    });

    return {
      isCrisis: false,
      diagnosedArchetype: matchedArchetype.title,
      detectedEntities: context,
      ...built
    };
  }

  // 5. Universal Contextual Fallback for nuanced/hybrid dilemmas
  return buildUniversalDynamicSolution({
    category,
    studentName: displayName,
    context
  });
}
