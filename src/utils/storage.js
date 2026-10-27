// Client-side secure storage & privacy manager for MindSpring
// Follows strict data minimization principles (no public data, no leaderboards)

const STORAGE_KEY = 'mindspring_student_vault_v1';

const DEFAULT_DATA = {
  studentProfile: {
    name: 'Eshaandeep Singh Grewal',
    studentId: 'MND-01',
    school: 'Drishti Dr RC Jain Innovative Public School',
    grade: 'Class VII',
    counselorContact: 'counselor@drishtischool.edu.in',
    privacyEncryptionEnabled: true,
    highContrastMode: false,
    fontSize: 'normal',
  },
  currentCheckIn: {
    date: new Date().toISOString().split('T')[0],
    mood: 'anxious',
    stressor: 'exam_stress',
    goal: 'Break a scary chapter into 3 small micro-steps',
    preMoodScore: 2,
    postMoodScore: null,
  },
  dailyPlan: [],
  gardenFlowers: [
    { id: 1, text: 'Had a warm cup of cocoa while studying science', date: 'Yesterday', color: 'rose' },
    { id: 2, text: 'Solved 3 tricky algebra problems without giving up', date: '2 days ago', color: 'amber' },
    { id: 3, text: 'Friend smiled and shared their colorful pen', date: '3 days ago', color: 'emerald' },
  ],
  thoughtFlips: [
    {
      id: 1,
      negativeThought: 'If I don’t score above 90% in this mock test, my whole term is ruined.',
      distortion: 'Catastrophizing & All-or-Nothing Thinking',
      realityCheck: 'A mock test is just practice diagnostic data. Mistakes show me exactly where to revise before finals.',
      reframedThought: 'One mock test does not determine my future. Every error is just a free lesson.',
      date: 'Yesterday'
    }
  ],
  reflectionJournal: [
    {
      id: 1,
      date: '2026-10-25',
      moodBefore: 'Overwhelmed',
      moodAfter: 'Calm & Grounded',
      summary: 'Box breathing slowed down my heartbeat before the chemistry quiz. Felt way more in control.',
      rating: 5
    }
  ],
  // Non-punitive engagement metric: counts total active mindful days, never resets or punishes missed days!
  mindfulDaysCount: 12,
  completedActivitiesTotal: 28,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export function loadMindSpringVault() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveMindSpringVault(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed };
  } catch (err) {
    console.error('Error loading vault:', err);
    return DEFAULT_DATA;
  }
}

export function saveMindSpringVault(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving vault:', err);
  }
}

export function exportVaultJSON() {
  const data = loadMindSpringVault();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MindSpring_Confidential_Log_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function wipeVaultData() {
  localStorage.removeItem(STORAGE_KEY);
}
