import React from 'react';

export default function RightPanel({ timerSeconds, onHomeClick, totalTimeLimit = 300 }) {
  const remaining = Math.max(0, totalTimeLimit - timerSeconds);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="w-full lg:w-[360px] flex flex-col justify-between items-center lg:items-end gap-4 h-full max-h-[760px] my-auto py-1">
      {/* Top: Time Remaining Display */}
      <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
          Time
        </h2>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md -mt-1">
          Remaining
        </h2>
        <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-mono tracking-wider mt-1 drop-shadow-lg">
          {formattedTime}
        </div>
      </div>

      {/* Middle: RPG Logo (Increased size) */}
      <div className="flex items-center justify-center lg:justify-end w-full my-2">
        <img
          src="/RPG Logo PNG.png"
          alt="RPG Logo"
          className="w-72 md:w-80 lg:w-[340px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Bottom: Home Return Button with Classic Solid Home SVG */}
      <div className="flex items-center justify-center lg:justify-end w-full">
        <button
          onClick={onHomeClick}
          className="w-32 h-20 md:w-36 md:h-22 bg-[#3b71f3] hover:bg-[#2a62e5] active:scale-95 transition-all duration-200 rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 border-white/50 cursor-pointer"
          title="Return to Home"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-12 h-12 md:w-14 md:h-14 fill-white drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
