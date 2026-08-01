import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Lightbulb, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Grid as GridIcon,
  Palette
} from 'lucide-react';
import { PRESET_CATEGORIES } from '../utils/wordSearchGenerator';

export default function Header({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  timerSeconds,
  foundCount,
  totalWords,
  isMuted,
  toggleMute,
  onRestart,
  onHint,
  hintsRemaining,
  onOpenCustomModal
}) {
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-sky-500/20 text-white py-3 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-sky-500 to-cyan-400 p-2.5 rounded-xl shadow-md shadow-cyan-500/20">
          <GridIcon className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-wide bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
            WORD SEARCH
          </h1>
          <p className="text-xs text-sky-200/80 font-medium">
            Find all hidden words in the grid
          </p>
        </div>
      </div>

      {/* Stats Bar (Timer & Counter) */}
      <div className="flex items-center gap-4 bg-slate-950/60 border border-sky-400/20 rounded-full px-5 py-2">
        <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm md:text-base font-bold">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>{formatTime(timerSeconds)}</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm md:text-base">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{foundCount} / {totalWords}</span>
        </div>
      </div>

      {/* Controls & Actions */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        {/* Category Selector */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-800 border border-sky-400/30 text-sky-100 font-medium text-xs md:text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer appearance-none pr-8 hover:bg-slate-700 transition"
          >
            {Object.values(PRESET_CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Palette className="w-3.5 h-3.5 text-sky-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Custom Words Modal Button */}
        <button
          onClick={onOpenCustomModal}
          className="bg-sky-700/60 hover:bg-sky-600 border border-sky-400/30 text-white text-xs md:text-sm font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 active:scale-95"
          title="Create custom word list"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="hidden sm:inline">Custom Words</span>
        </button>

        {/* Hint Button */}
        <button
          onClick={onHint}
          disabled={hintsRemaining <= 0}
          className={`flex items-center gap-1.5 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg border transition active:scale-95 ${
            hintsRemaining > 0
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
              : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
          }`}
          title={`Get a hint (${hintsRemaining} left)`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Hint ({hintsRemaining})</span>
        </button>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-sky-400/20 text-sky-200 transition active:scale-95"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition active:scale-95 shadow-md shadow-cyan-500/20"
          title="Restart Game"
        >
          <RefreshCw className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
}
