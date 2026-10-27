import React from 'react';
import { 
  X, 
  Award, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Globe, 
  Leaf, 
  DollarSign, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const teamMembers = [
    {
      role: 'Team Leader',
      name: 'Eshaandeep Singh Grewal',
      studentId: 'MND-01',
      grade: 'Class VII',
      email: 'grewaleshaandeep@gmail.com',
      phone: '+91-9781009040',
      avatar: '👨‍🎓'
    },
    {
      role: 'Core Member',
      name: 'Shivteg Singh Grewal',
      studentId: 'MND-02',
      grade: 'Class VII',
      email: 'info@shivteg.com',
      phone: '+91-8054830509',
      avatar: '👨‍🎓'
    },
    {
      role: 'Core Member',
      name: 'Hargun Kaur',
      studentId: 'MND-03',
      grade: 'Class VII',
      email: 'hargunkaur@gmail.com',
      phone: '+91-8872441101',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Award className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-extrabold text-xl leading-tight">
                  MINDSPRING
                </h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Bal Bharati AIDEATION 2.0
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Personalised Student Wellness & Emotional Growth Platform
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Project Summary */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>The MindSpring Mission</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              MindSpring is an evidence-based digital platform engineered to overcome generic, ineffective wellness advice. Instead of one-size-fits-all meditation, it deterministically maps student-identified causes (exam panic, procrastination, low confidence, peer comparison, family expectations) into bite-sized 2–10 minute micro-growth tasks without punitive streaks or toxic social competition.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Team MindSpring (Drishti Dr RC Jain Innovative Public School)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{member.avatar}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {member.role}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">
                    {member.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {member.grade} • ID: {member.studentId}
                  </p>
                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <div>{member.email}</div>
                    <div>{member.phone}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mentor Card */}
            <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                  👩‍🏫
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300">Project Mentor</span>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Seema Rani (UID: MNT-01)</h5>
                  <p className="text-[11px] text-slate-500">Drishti Dr RC Jain Innovative Public School</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <div>Email: kumarseema03@gmail.com</div>
                <div>Contact: +91-9814107100</div>
              </div>
            </div>
          </div>

          {/* 3 Impact Pillars */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Pillars of Impact
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Social Impact</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Democratized, stigma-free wellness tools for daily emotional self-regulation and healthy peer culture.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Economic Impact</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  100% free student access, removing financial barriers while lowering institutional crisis and dropout costs.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Environmental Impact</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Completely eliminates physical wellness workbooks, surveys, and paper logs with paperless eco-friendly tech.
                </p>
              </div>
            </div>
          </div>

          {/* Research & Citations */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scientific Research & Citations:</span>
            </h5>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
              <li>WHO Adolescent Mental Health Guidelines (who.int/news-room/fact-sheets/detail/adolescent-mental-health)</li>
              <li>UNICEF Mental Health and Wellbeing Framework (unicef.org/parenting/mental-health)</li>
              <li>BJ Fogg Behavior Model on micro-habits & friction elimination</li>
              <li>Cognitive Behavioral Therapy (CBT) self-directed cognitive reframing techniques</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
