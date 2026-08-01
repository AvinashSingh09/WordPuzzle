import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function StartScreen() {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Clear any stored player name when landing on the start screen
  useEffect(() => {
    sessionStorage.removeItem('playerName');
  }, []);

  const handlePlay = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError(true);
      return;
    }
    sessionStorage.setItem('playerName', playerName.trim());
    navigate('/game');
  };

  return (
    <div className="min-h-screen w-full blueprint-bg flex items-center justify-center p-6 md:p-12 select-none relative overflow-hidden">
      {/* Container holding controls on left and scaled 1word-search.png image on right */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
        
        {/* Left Side Controls (Name Input & Centered Play Button) */}
        <div className="flex flex-col items-center justify-center gap-6 w-full md:w-5/12 max-w-md">
          
          {/* Name Input Row */}
          <form onSubmit={handlePlay} className="w-full flex flex-col items-center">
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter text..."
              className={`w-full bg-[#2a68e8]/90 hover:bg-[#2a68e8] focus:bg-[#2a68e8] border ${
                error ? 'border-rose-400 ring-2 ring-rose-400' : 'border-blue-400/80 focus:ring-2 focus:ring-cyan-300'
              } text-white text-center placeholder-blue-100/80 px-6 py-4 rounded-xl text-lg font-medium outline-none transition-all shadow-2xl backdrop-blur-md`}
              autoFocus
            />
          </form>

          {error && (
            <p className="text-xs font-semibold text-rose-300 bg-slate-950/80 border border-rose-500/40 px-3.5 py-1.5 rounded-lg -mt-2">
              Please enter your name to start playing!
            </p>
          )}

          {/* Centered Clean Play Button */}
          <button
            onClick={handlePlay}
            className="group relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-[#3b71f3] via-[#4d7df6] to-[#709bf9] rounded-3xl flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/50"
            title="Start Game"
          >
            <Play className="w-14 h-14 md:w-16 md:h-16 fill-white text-white translate-x-1 drop-shadow-xl" />
          </button>
        </div>

        {/* Right Side: Scaled WordSearch Image */}
        <div className="w-full md:w-7/12 flex items-center justify-center p-2">
          <img
            src="/1word-search.png"
            alt="Word Search Illustration"
            className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl scale-105 md:scale-115 object-contain drop-shadow-2xl transition-transform duration-300"
          />
        </div>

      </div>
    </div>
  );
}
