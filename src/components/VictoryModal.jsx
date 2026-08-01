import React from 'react';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

export default function VictoryModal({
  isOpen,
  playerName,
  timeTaken,
  totalWords,
  onHome
}) {
  if (!isOpen) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0b2847] to-slate-950 border border-sky-400/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-500/20 flex flex-col items-center text-center gap-6">
        
        {/* Glow Trophy Badge */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-4 rounded-full text-slate-950 shadow-xl shadow-amber-500/40">
            <Trophy className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            PUZZLE SOLVED!
          </h2>
          <p className="text-sky-200/90 text-base mt-1.5 font-medium">
            Outstanding, <span className="text-cyan-300 font-bold">{playerName || 'Player'}</span>!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 bg-slate-950/70 border border-sky-400/30 rounded-2xl p-4 shadow-inner">
          <div className="flex flex-col items-center gap-1 border-r border-slate-800/80 pr-2">
            <div className="flex items-center gap-1.5 text-xs text-sky-300 font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-400" />
              Completion Time
            </div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              {formatTime(timeTaken)}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 pl-2">
            <div className="flex items-center gap-1.5 text-xs text-sky-300 font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Words Found
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {totalWords} / {totalWords}
            </div>
          </div>
        </div>

        {/* Home Action Button */}
        <button
          onClick={onHome}
          className="w-full bg-[#3b71f3] hover:bg-[#2a62e5] text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-blue-500/30 border border-white/40 transition active:scale-95 flex items-center justify-center gap-3 cursor-pointer mt-1"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-white drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Home
        </button>

      </div>
    </div>
  );
}
