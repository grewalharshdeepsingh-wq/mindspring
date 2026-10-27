import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Sun, 
  Moon, 
  Eye, 
  Sliders, 
  CheckCircle2, 
  AlertOctagon,
  User
} from 'lucide-react';
import { exportVaultJSON, wipeVaultData } from '../utils/storage';

export default function PrivacySettingsModal({ 
  profile, 
  onUpdateProfile, 
  darkMode, 
  setDarkMode,
  highContrast,
  setHighContrast,
  onResetApp
}) {
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [studentName, setStudentName] = useState(profile?.name || 'Eshaandeep Singh Grewal');
  const [school, setSchool] = useState(profile?.school || 'Drishti Dr RC Jain Innovative Public School');
  const [encryptionOn, setEncryptionOn] = useState(profile?.privacyEncryptionEnabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: studentName,
      school,
      privacyEncryptionEnabled: encryptionOn,
      highContrastMode: highContrast
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleWipeData = () => {
    wipeVaultData();
    onResetApp();
    setShowWipeConfirm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              Privacy-by-Design Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Data Protection & Student Privacy Controls
          </h2>
          <p className="text-xs text-slate-300">
            Strict data minimization. Your personal check-ins, journal reflections, and stress triggers are saved directly in your browser's private sandbox and never broadcasted to public leaderboards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile & Privacy Configuration */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Student Profile & Settings</span>
            </h3>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Student Name:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                School / Institution:
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>

            {/* Client-side encryption toggle */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Client-Side Reflection Encryption</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Obfuscates journal reflections in local storage.
                </p>
              </div>
              <input
                type="checkbox"
                checked={encryptionOn}
                onChange={(e) => setEncryptionOn(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Update Preferences
            </button>
          </form>
        </div>

        {/* Accessibility & Display Controls */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Accessibility & Display Modes</span>
          </h3>

          <div className="space-y-3 pt-2">
            {/* Dark mode */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-amber-400">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Dark / Calming Night Theme</h4>
                  <p className="text-[11px] text-slate-500">Reduces screen glare during evening revision</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  darkMode ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {darkMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* High Contrast Mode */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-cyan-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">High Contrast & Visual Legibility</h4>
                  <p className="text-[11px] text-slate-500">Increases contrast ratios for accessible reading</p>
                </div>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  highContrast ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {highContrast ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Zero public ranking notice */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              🛡️ <strong>Zero Social Comparison:</strong> No leaderboards, public ranking, or follower counts will ever be introduced into this platform.
            </div>
          </div>
        </div>
      </div>

      {/* Data Management: Export & Purge */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white flex items-center space-x-2">
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Data Portability & One-Click Purge</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Export Your Data</h4>
            <p className="text-[11px] text-slate-500">
              Download all your check-ins, journal reflections, and gratitude records as a portable JSON file.
            </p>
            <button
              onClick={exportVaultJSON}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Data File (.json)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-2 bg-rose-50/30 dark:bg-rose-950/20">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">One-Click Data Purge</h4>
            <p className="text-[11px] text-slate-500">
              Instantly wipe all check-ins, garden notes, and reflections stored in this browser session.
            </p>
            {!showWipeConfirm ? (
              <button
                onClick={() => setShowWipeConfirm(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Local Data</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 animate-fade-in">
                <button
                  onClick={handleWipeData}
                  className="px-3 py-1.5 bg-rose-700 text-white font-bold text-xs rounded-lg shadow"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowWipeConfirm(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
