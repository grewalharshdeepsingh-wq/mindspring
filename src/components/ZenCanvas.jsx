import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, Download, Palette, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const PALETTE = [
  { name: 'Sage Green', color: '#10b981' },
  { name: 'Ocean Teal', color: '#06b6d4' },
  { name: 'Lavender Calm', color: '#8b5cf6' },
  { name: 'Sunset Amber', color: '#f59e0b' },
  { name: 'Soft Rose', color: '#f43f5e' },
  { name: 'Midnight Charcoal', color: '#1e293b' },
];

export default function ZenCanvas({ onComplete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#10b981');
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Handle retina display crispness
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `MindSpring_ZenDoodle_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    try {
      confetti({ particleCount: 40 });
    } catch (e) {}
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 bg-gradient-to-b from-teal-50/40 via-white to-emerald-50/30 dark:from-slate-900 dark:to-slate-950 rounded-3xl min-h-[520px]">
      {/* Top Banner */}
      <div className="text-center max-w-md mb-2">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-300 dark:border-teal-700">
          Mindful Expression
        </span>
        <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mt-1.5">
          Zen Doodle & Free Canvas
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          No artistic skill required. Draw swirls, waves, or abstract geometry to quieten your chatter.
        </p>
      </div>

      {/* Canvas Tool Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-xl bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm my-2">
        {/* Colors */}
        <div className="flex items-center space-x-1.5">
          {PALETTE.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setColor(p.color);
                setIsEraser(false);
              }}
              style={{ backgroundColor: p.color }}
              className={`w-6 h-6 rounded-full transition transform hover:scale-110 ${
                color === p.color && !isEraser ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
              }`}
              title={p.name}
            />
          ))}
        </div>

        {/* Thickness */}
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
          <span>Size:</span>
          <input
            type="range"
            min="2"
            max="18"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-16 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Utility buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded-xl transition ${
              isEraser ? 'bg-rose-100 text-rose-600 font-bold' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={downloadCanvas}
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition"
            title="Save Image"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Drawing Surface */}
      <div className="w-full max-w-xl h-72 sm:h-80 bg-white rounded-3xl border-2 border-dashed border-teal-200 dark:border-slate-700 shadow-inner overflow-hidden relative cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block bg-white"
        />
        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-slate-300 select-none">
          MindSpring Zen Space
        </div>
      </div>

      {/* Done button */}
      <div className="mt-4">
        <button
          onClick={() => {
            if (onComplete) onComplete(5);
          }}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>I feel refreshed (Complete Doodle)</span>
        </button>
      </div>
    </div>
  );
}
