import React from 'react';
import { 
  Sparkles, 
  HeartHandshake, 
  ShieldAlert, 
  Calendar, 
  Headphones, 
  BarChart3, 
  Lock, 
  Feather,
  Table,
  User,
  Gamepad2
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenCheckIn, 
  onOpenCrisis, 
  onOpenProfile,
  studentName = '',
  schoolName = ''
}) {
  const navItems = [
    { id: 'plan', label: 'Daily Plan', icon: Calendar },
    { id: 'studio', label: 'Wellness Studio', icon: Feather },
    { id: 'minigame', label: 'Zen Arcade 🎮', icon: Gamepad2 },
    { id: 'table', label: 'Data & Progress', icon: Table },
    { id: 'soundscapes', label: 'Soundscapes', icon: Headphones },
    { id: 'growth', label: 'Growth Insights', icon: BarChart3 },
    { id: 'counselor', label: 'Counselor & Safety', icon: HeartHandshake },
    { id: 'privacy', label: 'Profile & Privacy', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
      {/* Clean top micro-bar without competition/school slang */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-medium truncate">
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] tracking-wide font-semibold">
            🌱 Student Wellness & Emotional Growth Portal
          </span>
          {studentName ? (
            <span className="hidden sm:inline text-white/90">
              • Welcome, <strong>{studentName}</strong> {schoolName ? `(${schoolName})` : ''}
            </span>
          ) : (
            <button 
              onClick={onOpenProfile}
              className="hidden sm:inline text-white/80 hover:text-white underline decoration-white/40 cursor-pointer text-xs"
            >
              • Click to set your name & school
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCrisis}
            className="flex items-center space-x-1 bg-rose-500/90 hover:bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-semibold transition shadow-sm animate-pulse"
            title="Instant crisis support & verified helplines"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Need Help Now?</span>
          </button>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-2">
        {/* Brand identity & Quick Check-In Header Row */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div 
            onClick={() => setActiveTab('plan')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* MindSpring Logo */}
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-200/50 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.7 2.8-1.7 3.7.8.4 1.5 1 2 1.8 1.4 2.1 1 5-1 6.8-.7.7-1.7 1.2-2.8 1.4" />
                <path d="M12 2a5 5 0 0 0-5 5c0 1.5.7 2.8 1.7 3.7-.8.4-1.5 1-2 1.8-1.4 2.1-1 5 1 6.8.7.7 1.7 1.2 2.8 1.4" />
                <path d="M12 2v20" />
                <path d="M12 9c2.5 0 4-1 4-3" />
                <path d="M12 15c-2.5 0-4-1-4-3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                  MIND<span className="text-emerald-600 dark:text-emerald-400">SPRING</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block leading-none">
                Personalised Student Wellness & Emotional Growth
              </p>
            </div>
          </div>

          {/* Quick Check-In CTA Button */}
          <button
            onClick={onOpenCheckIn}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-md hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition ring-2 ring-emerald-400/30 whitespace-nowrap"
            title="Start your daily 30-second mood & stress check-in"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Quick Check-In</span>
            <span className="hidden sm:inline bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">30s</span>
          </button>
        </div>

        {/* Full-Width Navigation Bar: Fits all 8 options on laptop without side scrolling */}
        <nav className="pt-2">
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-1 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 min-w-fit flex items-center justify-center space-x-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition text-center whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-600/40 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
