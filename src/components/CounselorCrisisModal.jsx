import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  HeartHandshake, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Info
} from 'lucide-react';

export default function CounselorCrisisModal({ isOpen, onClose, counselorEmail = 'counselor@drishtischool.edu.in' }) {
  const [copied, setCopied] = useState(false);
  const [draftMessage, setDraftMessage] = useState(
    'Dear School Counselor,\n\nI am reaching out through the MindSpring wellness portal because I have been feeling overwhelmed with academic pressure and stress recently. I would like to schedule a private, confidential appointment to talk whenever you have time available.\n\nThank you,\nStudent (MindSpring Portal)'
  );

  if (!isOpen) return null;

  const helplines = [
    {
      name: 'Tele-MANAS (Govt of India)',
      number: '14416 / 1800-891-4416',
      desc: 'Free, 24/7 comprehensive national mental health helpline offering confidential psychological first-aid in multi-languages.',
      highlight: true
    },
    {
      name: 'Childline India (National Helpline for Students)',
      number: '1098',
      desc: '24/7 toll-free emergency phone outreach service for children and adolescents in distress.',
      highlight: false
    },
    {
      name: 'KIRAN Mental Health Helpline',
      number: '1800-599-0019',
      desc: 'Ministry of Social Justice 24x7 toll-free helpline providing clinical psychological guidance.',
      highlight: false
    },
    {
      name: 'Vandrevala Foundation Helpline',
      number: '+91 9999 666 555',
      desc: '24x7 crisis intervention and confidential counseling support over phone and WhatsApp.',
      highlight: false
    }
  ];

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg leading-tight">
                Immediate Support & Ethical Safety Portal
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Confidential pathways to school counselors & certified professionals
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Explicit Non-Diagnostic Medical Boundary Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
            <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Ethical Safety Boundary & Non-Diagnostic Notice</span>
            </div>
            <p className="leading-relaxed">
              MindSpring is an educational and self-care platform designed to build healthy daily study habits and stress management. <strong>It does not provide medical or psychiatric diagnoses, therapy, or emergency crisis care.</strong> If you or someone you know is feeling unsafe, overwhelmed, or in severe emotional distress, please reach out directly to a trusted adult, counselor, or one of the 24/7 helplines below.
            </p>
          </div>

          {/* School Counselor Direct Route */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                  Connect with School Counselor (Confidential)
                </h4>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                Safe & Private
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your school counselor is available to support you through academic pressure, exam anxiety, and interpersonal conflicts. You can send this pre-drafted message directly:
            </p>

            <textarea
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-24 resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono text-slate-500">
                School Counselor: <strong className="text-slate-800 dark:text-slate-200">{counselorEmail}</strong>
              </span>
              <button
                onClick={handleCopyDraft}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
              </button>
            </div>
          </div>

          {/* National 24/7 Crisis Helplines */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Verified 24/7 Student Helplines (Toll-Free)</span>
            </h4>

            <div className="space-y-2.5">
              {helplines.map((hl, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    hl.highlight 
                      ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{hl.name}</h5>
                      {hl.highlight && (
                        <span className="text-[10px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded">
                          National
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{hl.desc}</p>
                  </div>

                  <a
                    href={`tel:${hl.number.split('/')[0].trim().replace(/[^0-9+]/g, '')}`}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {hl.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-300 transition"
          >
            Close Support Window
          </button>
        </div>
      </div>
    </div>
  );
}
