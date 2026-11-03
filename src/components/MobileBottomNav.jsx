import React, { useState } from 'react';
import { 
  Calendar, 
  Lightbulb, 
  Feather, 
  Gamepad2, 
  Menu, 
  X, 
  Table, 
  Headphones, 
  BarChart3, 
  HeartHandshake, 
  Lock, 
  Smartphone, 
  Sun, 
  Moon,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenCheckIn,
  onOpenCrisis,
  onOpenDownloadApp,
  darkMode,
  onToggleTheme,
  completedCount = 0,
  totalPlanCount = 4
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryTabs = [
    { id: 'plan', label: 'Plan', icon: Calendar, badge: `${completedCount}/${totalPlanCount}` },
    { id: 'solver', label: 'Solver', icon: Lightbulb, isNew: true },
    { id: 'studio', label: 'Studio', icon: Feather },
    { id: 'minigame', label: 'Arcade', icon: Gamepad2 }
  ];

  const moreItems = [
    { id: 'table', label: 'Data & Progress Table', desc: 'View records & export CSV', icon: Table, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' },
    { id: 'soundscapes', label: 'Ambient Soundscapes', desc: 'Rain, lo-fi & focus audio', icon: Headphones, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60' },
    { id: 'growth', label: 'Growth Insights & Journal', desc: 'Streaks & reflection history', icon: BarChart3, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60' },
    { id: 'counselor', label: 'Counselor & Safety Center', desc: 'Confidential school contacts', icon: HeartHandshake, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60' },
    { id: 'privacy', label: 'Profile & Privacy Settings', desc: 'Name, school & theme options', icon: Lock, color: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
  ];

  const handleSelectMoreTab = (id) => {
    setActiveTab(id);
    setIsMoreOpen(false);
  };

  const isMoreActive = moreItems.some(item => item.id === activeTab);

  return (
    <>
      {/* Mobile Slide-Up "More" Sheet */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="flex-1 w-full"
            onClick={() => setIsMoreOpen(false)}
          />

          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 pb-safe space-y-4 max-h-[82vh] overflow-y-auto animate-slide-up">
            
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white">
                  More MindSpring Tools
                </h3>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Row in Drawer */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onToggleTheme();
                }}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-2 text-left active:scale-98"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">
                    {darkMode ? 'Light Theme' : 'Dark Theme'}
                  </div>
                  <div className="text-[10px] text-slate-400">Toggle display</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenDownloadApp();
                }}
                className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center space-x-2 text-left active:scale-98"
              >
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Get APK / App
                  </div>
                  <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Install on phone</div>
                </div>
              </button>
            </div>

            {/* Navigation List in Drawer */}
            <div className="space-y-1.5 pt-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMoreTab(item.id)}
                    className={`w-full p-3 rounded-2xl border transition flex items-center justify-between text-left active:scale-99 ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800/70 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                          {item.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* Crisis Hotline Direct Banner */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenCrisis();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center space-x-2 text-xs font-bold active:scale-98 shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>24/7 Crisis Helplines & Support</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Mobile ONLY (md:hidden) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe transition-all"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
          
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMoreOpen(false);
                }}
                className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all active:scale-90 ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  
                  {/* Badge */}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold px-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                      {tab.badge}
                    </span>
                  )}
                  {tab.isNew && (
                    <span className="absolute -top-1.5 -right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                <span className="text-[10px] tracking-tight mt-1 leading-none">
                  {tab.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* "More" Menu Toggle Button */}
          <button
            onClick={() => setIsMoreOpen(prev => !prev)}
            className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all active:scale-90 ${
              isMoreOpen || isMoreActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Menu className={`w-5 h-5 transition-transform ${isMoreOpen || isMoreActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {isMoreActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </div>

            <span className="text-[10px] tracking-tight mt-1 leading-none">
              More
            </span>

            {(isMoreOpen || isMoreActive) && (
              <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
            )}
          </button>

        </div>
      </nav>
    </>
  );
}
