import React from 'react';
import { Check } from 'lucide-react';

export default function WordList({ placedWords, onSelectWordHint }) {
  return (
    <div className="w-full lg:w-96 flex flex-col justify-between items-start h-full max-h-[760px] my-auto py-1">
      {/* Target Word Cards List */}
      <div className="flex flex-col gap-2 w-full">
        {placedWords.map((item, idx) => {
          const isFound = item.found;
          return (
            <div
              key={idx}
              onClick={() => !isFound && onSelectWordHint && onSelectWordHint(item)}
              className={`w-full px-6 py-3 rounded-2xl text-base md:text-lg font-bold tracking-wide transition-all duration-300 flex items-center justify-between shadow-md select-none cursor-pointer border ${
                isFound
                  ? 'bg-emerald-50/95 border-emerald-300 text-emerald-700 shadow-inner'
                  : 'bg-white text-slate-700 border-slate-100 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <span
                className={`transition-all ${
                  isFound ? 'line-through opacity-85 font-semibold' : ''
                }`}
              >
                {item.word.toLowerCase()}
              </span>

              {isFound && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Brand Logo: KEC An RPG Company */}
      <div className="flex items-center justify-start pt-1">
        <img
          src="/KEC Logo-01.png"
          alt="KEC An RPG Company"
          className="w-60 md:w-72 object-contain drop-shadow-xl"
        />
      </div>
    </div>
  );
}
