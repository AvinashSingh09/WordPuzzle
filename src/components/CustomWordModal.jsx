import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Grid } from 'lucide-react';

export default function CustomWordModal({
  isOpen,
  onClose,
  onSubmitCustomGame
}) {
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [gridSize, setGridSize] = useState(14);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Parse words separated by commas, newlines, or spaces
    const parsed = customWordsInput
      .split(/[\n,]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (parsed.length < 3) {
      setErrorMsg('Please enter at least 3 valid words.');
      return;
    }

    // Ensure words fit in the specified grid size
    const overlong = parsed.find(w => w.length > gridSize);
    if (overlong) {
      setErrorMsg(`Word "${overlong}" exceeds maximum grid size (${gridSize}).`);
      return;
    }

    onSubmitCustomGame(parsed, gridSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-sky-400/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-wide">
              Create Custom Word Search
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-sky-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">
              Enter Words (separated by comma or new lines)
            </label>
            <textarea
              rows={5}
              value={customWordsInput}
              onChange={(e) => setCustomWordsInput(e.target.value)}
              placeholder="e.g. tendering, surveying, subcontract, substation, engineering, procurement"
              className="w-full bg-slate-950 border border-sky-400/30 rounded-xl p-3.5 text-sm text-sky-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 font-mono resize-none"
            />
            <p className="text-xs text-sky-300/60 mt-1">
              Enter 3 to 12 words. Words will be converted to uppercase.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">
              Grid Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[12, 14, 16].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    gridSize === size
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-950 text-sky-300 border-sky-500/20 hover:bg-slate-800'
                  }`}
                >
                  {size} x {size}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-black transition shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Grid className="w-4 h-4" />
              Generate Puzzle
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
