import React, { useState } from 'react';
import { 
  Table, 
  Plus, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Calendar, 
  User, 
  School,
  FileSpreadsheet,
  Layers,
  Heart
} from 'lucide-react';
import { exportProgressTableCSV } from '../utils/storage';
import { MOODS, STRESSORS } from '../data/stressors';
import confetti from 'canvas-confetti';

export default function ProgressTable({ 
  records = [], 
  onAddRecord, 
  onDeleteRecord, 
  currentStudent = '',
  currentSchool = ''
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStressor, setFilterStressor] = useState('all');

  // Form states
  const [formName, setFormName] = useState(currentStudent || '');
  const [formSchool, setFormSchool] = useState(currentSchool || '');
  const [formMood, setFormMood] = useState('Anxious ➔ Calm');
  const [formStressor, setFormStressor] = useState(STRESSORS[0].title);
  const [formGoal, setFormGoal] = useState('');
  const [formTasks, setFormTasks] = useState('4/4 Tasks Completed');
  const [formRating, setFormRating] = useState(5);
  const [formReflection, setFormReflection] = useState('');

  const handleCreateEntry = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      studentName: formName.trim() || currentStudent || 'Student',
      school: formSchool.trim() || currentSchool || 'School',
      mood: formMood,
      stressor: formStressor,
      goal: formGoal.trim() || 'Daily Mindful Progress',
      tasksCompleted: formTasks,
      rating: Number(formRating),
      reflection: formReflection.trim() || 'Felt calmer and more focused after completing session.',
      status: 'Completed'
    };

    onAddRecord(newRecord);
    setFormGoal('');
    setFormReflection('');
    setShowAddForm(false);

    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch (err) {}
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      (r.studentName && r.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.school && r.school.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.goal && r.goal.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.reflection && r.reflection.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.stressor && r.stressor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStressor = filterStressor === 'all' || r.stressor === filterStressor;
    return matchesSearch && matchesStressor;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
              Confidential Progress Ledger
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Data & Progress Tracking Table
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Save, review, and export all your personal daily check-ins, micro-habit completions, and reflections. Saved securely in your browser's private vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow transition transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Hide Form' : 'Log New Entry'}</span>
            </button>

            <button
              onClick={() => exportProgressTableCSV(records)}
              className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/30 transition shadow"
              title="Download spreadsheet table in CSV format"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form: Add New Progress Entry */}
      {showAddForm && (
        <form 
          onSubmit={handleCreateEntry}
          className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-emerald-300 dark:border-emerald-700 shadow-lg space-y-4 animate-slide-up"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Record New Progress Entry to Table</span>
            </h3>
            <span className="text-xs text-slate-400">Autosaved locally</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Student Name:
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter student name..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                School Name:
              </label>
              <input
                type="text"
                value={formSchool}
                onChange={(e) => setFormSchool(e.target.value)}
                placeholder="Enter school name..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Stressor / Identified Cause:
              </label>
              <select
                value={formStressor}
                onChange={(e) => setFormStressor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              >
                {STRESSORS.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Mood Shift Experienced:
              </label>
              <select
                value={formMood}
                onChange={(e) => setFormMood(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              >
                <option value="Anxious ➔ Calm">Anxious ➔ Calm 🌿</option>
                <option value="Overwhelmed ➔ Focused">Overwhelmed ➔ Focused 🎯</option>
                <option value="Scattered ➔ Productive">Scattered ➔ Productive ✨</option>
                <option value="Exhausted ➔ Restored">Exhausted ➔ Restored 🌙</option>
                <option value="Low Confidence ➔ Empowered">Low Confidence ➔ Empowered 🛡️</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Micro-Goal Worked On:
              </label>
              <input
                type="text"
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value)}
                placeholder="e.g., Read 3 pages of physics / 5-min start"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Tasks Completed:
              </label>
              <select
                value={formTasks}
                onChange={(e) => setFormTasks(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              >
                <option value="4/4 Tasks Completed">4/4 Full Regimen Completed</option>
                <option value="3/4 Tasks Completed">3/4 Tasks Completed</option>
                <option value="2/4 Tasks Completed">2/4 Tasks Completed</option>
                <option value="1/4 Tasks Completed">1/4 Quick Win Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Effectiveness Rating:
              </label>
              <div className="flex items-center space-x-1 pt-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormRating(num)}
                    className="p-1 hover:scale-125 transition"
                  >
                    <Star className={`w-5 h-5 ${num <= formRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">{formRating}/5</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Reflection / Personal Takeaway:
            </label>
            <input
              type="text"
              value={formReflection}
              onChange={(e) => setFormReflection(e.target.value)}
              placeholder="e.g., Felt less panicked after 4-7-8 breathing; math equations looked manageable"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Save to Progress Table
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records, reflections..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStressor}
            onChange={(e) => setFilterStressor(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
          >
            <option value="all">All Stressors ({records.length})</option>
            {STRESSORS.map((s) => (
              <option key={s.id} value={s.title}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Student & School</th>
                <th className="py-3.5 px-4">Stressor & Mood Shift</th>
                <th className="py-3.5 px-4">Micro-Goal</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Reflection</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr 
                    key={r.id} 
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {r.date}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800 dark:text-white">
                        {r.studentName || <span className="text-slate-400 italic font-normal">Self</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {r.school || <span className="text-slate-400 italic">User School</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {r.stressor}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        {r.mood}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-300">
                      "{r.goal || 'General study reset'}"
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-[11px] font-bold">
                        {r.tasksCompleted || 'Completed'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <span>{r.rating || 5}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm text-slate-600 dark:text-slate-300 italic text-[11px]">
                      "{r.reflection}"
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No progress entries match your filter. Click "Log New Entry" above to add your first record!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
