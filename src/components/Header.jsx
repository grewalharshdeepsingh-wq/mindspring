import React from 'react';
import { 
  Sparkles, 
  HeartHandshake, 
  ShieldAlert, 
  Compass, 
  Calendar, 
  Headphones, 
  BarChart3, 
  Lock, 
  Users,
  Feather,
  Info
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenCheckIn, 
  onOpenCrisis, 
  onOpenAbout,
  studentName,
  schoolName
}) {
  const navItems = [
    { id: 'plan', label: 'Daily Wellness Plan', icon: Calendar },
    { id: 'studio', label: 'Wellness Studio', icon: Feather },
    { id: 'soundscapes', label: 'Soundscapes', icon: Headphones },
    { id: 'growth', label: 'Growth & Insights', icon: BarChart3 },
    { id: 'counselor', label: 'Counselor & Safety', icon: HeartHandshake },
    { id: 'privacy', label: 'Privacy & Data', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top micro-bar for psychological safety & School details */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-medium truncate">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] tracking-wide uppercase font-semibold">
            Bal Bharati AIDEATION 2.0
          </span>
          <span className="hidden sm:inline text-white/90">
            {schoolName} • Student Portal
          </span>
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

          <button
            onClick={onOpenAbout}
            className="text-white/80 hover:text-white flex items-center space-x-1 underline decoration-white/40"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Project MindSpring</span>
          </button>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('plan')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* MindSpring Logo - Stylized Brain & Sprout Emblem */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-200/50 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.7 2.8-1.7 3.7.8.4 1.5 1 2 1.8 1.4 2.1 1 5-1 6.8-.7.7-1.7 1.2-2.8 1.4" />
                <path d="M12 2a5 5 0 0 0-5 5c0 1.5.7 2.8 1.7 3.7-.8.4-1.5 1-2 1.8-1.4 2.1-1 5 1 6.8.7.7 1.7 1.2 2.8 1.4" />
                <path d="M12 2v20" />
                <path d="M12 9c2.5 0 4-1 4-3" />
                <path d="M12 15c-2.5 0-4-1-4-3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">
                  MIND<span className="text-emerald-600 dark:text-emerald-400">SPRING</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Personalised Student Wellness & Emotional Growth
              </p>
            </div>
          </div>

          {/* Quick Check-In CTA for mobile */}
          <button
            onClick={onOpenCheckIn}
            className="md:hidden flex items-center space-x-1.5 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow hover:bg-emerald-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check-In</span>
          </button>
        </div>

        {/* Tab Navigation items */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-600/40 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenCheckIn}
            className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Quick Check-In</span>
          </button>
        </div>
      </div>
    </header>
  );
}
