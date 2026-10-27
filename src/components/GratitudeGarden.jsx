import React, { useState } from 'react';
import { Heart, Sparkles, Plus, Flower2, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const FLOWER_COLORS = [
  { name: 'Rose', bg: 'bg-rose-100 text-rose-700 border-rose-300', petal: '#f43f5e' },
  { name: 'Sunflower', bg: 'bg-amber-100 text-amber-700 border-amber-300', petal: '#f59e0b' },
  { name: 'Lavender', bg: 'bg-purple-100 text-purple-700 border-purple-300', petal: '#a855f7' },
  { name: 'Emerald', bg: 'bg-emerald-100 text-emerald-700 border-emerald-300', petal: '#10b981' },
];

export default function GratitudeGarden({ flowers = [], onAddFlower, onComplete }) {
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedColor, setSelectedColor] = useState(FLOWER_COLORS[0]);

  const handlePlantFlower = (e) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;

    onAddFlower({
      id: Date.now(),
      text: gratitudeText.trim(),
      date: 'Today',
      colorName: selectedColor.name,
      petalColor: selectedColor.petal
    });

    setGratitudeText('');
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#f43f5e', '#f59e0b', '#a855f7', '#10b981']
      });
    } catch (err) {}
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-rose-50/40 via-white to-amber-50/40 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[520px]">
      {/* Top Banner */}
      <div className="text-center max-w-md">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-300 dark:border-rose-700">
          Positive Psychology Habit
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-1.5">
          Student Gratitude Garden
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Notice one small blessing today. Gratitude rewires neural pathways away from exam anxiety toward hope and emotional balance.
        </p>
      </div>

      {/* Input to plant a flower */}
      <form onSubmit={handlePlantFlower} className="w-full max-w-lg my-3 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="Today I am genuinely grateful for..."
            className="w-full px-4 py-3 pr-28 text-xs sm:text-sm rounded-2xl border border-rose-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plant</span>
          </button>
        </div>

        {/* Color picker */}
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Flower Color:</span>
          <div className="flex items-center space-x-2">
            {FLOWER_COLORS.map((fc) => (
              <button
                key={fc.name}
                type="button"
                onClick={() => setSelectedColor(fc)}
                style={{ backgroundColor: fc.petal }}
                className={`w-4 h-4 rounded-full transition transform ${
                  selectedColor.name === fc.name ? 'scale-125 ring-2 ring-slate-400' : 'opacity-70'
                }`}
              />
            ))}
          </div>
        </div>
      </form>

      {/* Garden Soil & Flowers Display */}
      <div className="w-full max-w-xl bg-gradient-to-t from-emerald-100/70 via-emerald-50/40 to-sky-50/30 dark:from-emerald-950/40 dark:to-slate-900 rounded-3xl p-5 border border-emerald-200 dark:border-slate-800 shadow-inner min-h-[220px]">
        <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Flower2 className="w-4 h-4 text-emerald-600 animate-spin-slow" />
          <span>Blooming Gratitudes ({flowers.length} blossoms planted)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
          {flowers.map((f, idx) => (
            <div
              key={f.id || idx}
              className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-3 border border-emerald-100 dark:border-slate-700 shadow-sm hover:shadow transition flex items-start space-x-2.5 animate-slide-up"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: f.petalColor || '#10b981' }}
              >
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                  "{f.text}"
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                  {f.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Done button */}
      <div className="mt-4">
        <button
          onClick={() => {
            if (onComplete) onComplete(5);
          }}
          className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Claim Gratitude Spark</span>
        </button>
      </div>
    </div>
  );
}
