// Client-side secure storage & privacy manager for MindSpring
// Follows strict data minimization principles (no public data, no leaderboards)

const STORAGE_KEY = 'mindspring_student_vault_v2';

const DEFAULT_DATA = {
  studentProfile: {
    name: '',
    studentId: '',
    school: '',
    grade: '',
    counselorContact: '',
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
    { id: 1, text: 'Had a warm cup of cocoa while studying science', date: 'Yesterday', colorName: 'Rose', petalColor: '#f43f5e' },
    { id: 2, text: 'Solved 3 tricky algebra problems without giving up', date: '2 days ago', colorName: 'Sunflower', petalColor: '#f59e0b' },
    { id: 3, text: 'Friend smiled and shared their colorful notes', date: '3 days ago', colorName: 'Emerald', petalColor: '#10b981' },
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
      date: new Date().toISOString().split('T')[0],
      moodBefore: 'Overwhelmed',
      moodAfter: 'Calm & Grounded',
      summary: 'Box breathing slowed down my heartbeat before revision. Felt way more in control.',
      rating: 5
    }
  ],
  // Progress log entries table
  progressRecords: [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      studentName: '',
      school: '',
      mood: 'Anxious ➔ Calm',
      stressor: 'Exam & Revision Overwhelm',
      goal: 'Break a scary chapter into 3 small micro-steps',
      tasksCompleted: '4/4 Completed',
      rating: 5,
      reflection: 'The 5-minute study start helped me overcome procrastination on Math Chapter 3.',
      status: 'Completed'
    }
  ],
  mindfulDaysCount: 1,
  completedActivitiesTotal: 4,
  problemHistory: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export function loadMindSpringVault() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy storage key to carry over without pre-filled names
      const oldRaw = localStorage.getItem('mindspring_student_vault_v1');
      if (oldRaw) {
        try {
          const parsedOld = JSON.parse(oldRaw);
          const cleaned = {
            ...DEFAULT_DATA,
            ...parsedOld,
            studentProfile: {
              ...DEFAULT_DATA.studentProfile,
              name: parsedOld.studentProfile?.name === 'Eshaandeep Singh Grewal' ? '' : (parsedOld.studentProfile?.name || ''),
              school: parsedOld.studentProfile?.school === 'Drishti Dr RC Jain Innovative Public School' ? '' : (parsedOld.studentProfile?.school || ''),
              studentId: '',
              grade: '',
              counselorContact: '',
            }
          };
          saveMindSpringVault(cleaned);
          return cleaned;
        } catch (e) {}
      }
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

export function exportProgressTableCSV(records) {
  if (!records || records.length === 0) return;
  const headers = ['ID', 'Date', 'Student Name', 'School', 'Mood Shift', 'Stressor', 'Micro-Goal', 'Tasks Done', 'Rating (1-5)', 'Reflection Note', 'Status'];
  const rows = records.map(r => [
    `"${r.id}"`,
    `"${r.date}"`,
    `"${(r.studentName || 'Self').replace(/"/g, '""')}"`,
    `"${(r.school || 'Unspecified').replace(/"/g, '""')}"`,
    `"${(r.mood || '').replace(/"/g, '""')}"`,
    `"${(r.stressor || '').replace(/"/g, '""')}"`,
    `"${(r.goal || '').replace(/"/g, '""')}"`,
    `"${(r.tasksCompleted || '').replace(/"/g, '""')}"`,
    r.rating || 5,
    `"${(r.reflection || '').replace(/"/g, '""')}"`,
    `"${(r.status || 'Completed').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MindSpring_Progress_Data_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function wipeVaultData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('mindspring_student_vault_v1');
}
