import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowDownToLine
} from 'lucide-react';

export default function DownloadAppModal({ isOpen, onClose }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      alert("To install directly on Android:\n1. Tap the three dots (⋮) menu in Chrome/Edge.\n2. Tap 'Add to Home screen' or 'Install App'.");
    }
  };

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    // Link to the apk located in public/assets or release
    const link = document.createElement('a');
    link.href = './mindspring.apk';
    link.download = 'mindspring.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-200 dark:border-emerald-900/60 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg leading-tight flex items-center space-x-2">
                <span>Download MindSpring App</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  APK / Mobile
                </span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Install on Android devices, phones & tablets for offline wellness
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-xl transition text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
          
          {/* Main APK Download Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border-2 border-emerald-300 dark:border-emerald-700/60 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  Recommended For Android
                </span>
                <h4 className="font-heading font-bold text-base text-slate-800 dark:text-white mt-1">
                  MindSpring Android Package (.APK)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full standalone Android app package with offline student tools, soundscapes & mini-games.
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/40">✓ Android 7.0+</span>
              <span className="px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/40">✓ 100% Free & Ad-Free</span>
              <span className="px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/40">✓ No Accounts Needed</span>
            </div>

            <div className="pt-1">
              <button
                onClick={handleDownloadApk}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                {downloadStarted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                    <span>Download Started! Check Notifications</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download APK (mindspring.apk)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sideload Guide */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
            <h5 className="font-bold text-slate-800 dark:text-white flex items-center space-x-1.5 text-xs">
              <Info className="w-4 h-4 text-teal-600" />
              <span>How to Install the APK on Android</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed pl-1 text-[11px]">
              <li>Click <strong>Download APK</strong> above to download the file to your device.</li>
              <li>When the download finishes, tap <strong>Open</strong> from your notification bar or file manager.</li>
              <li>If Android asks to <em>"Install unknown apps"</em>, tap <strong>Settings</strong> and allow permission for your browser.</li>
              <li>Tap <strong>Install</strong>. Once completed, launch MindSpring anytime from your home screen!</li>
            </ol>
          </div>

          {/* Instant 1-Tap Web App Alternative */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h5 className="font-bold text-xs text-slate-800 dark:text-white flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Instant 1-Tap Home Screen WebAPK</span>
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Install as a lightweight app directly through your mobile browser without file downloads.
              </p>
            </div>
            <button
              onClick={handleInstallPWA}
              disabled={isInstalled}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center justify-center space-x-1.5 ${
                isInstalled
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
              }`}
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Already Installed</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{installPrompt ? 'Install App' : 'Add to Home Screen'}</span>
                </>
              )}
            </button>
          </div>

          {/* GitHub Source & Releases link */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/40 text-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>Also available on GitHub Releases: </span>
            <a 
              href="https://github.com/grewalharshdeepsingh-wq/mindspring/releases" 
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-600 dark:text-emerald-400 font-bold underline hover:text-emerald-700 inline-flex items-center space-x-0.5"
            >
              <span>View Releases</span>
              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-300 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
