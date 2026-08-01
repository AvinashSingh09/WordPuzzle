import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import WordList from '../components/WordList';
import Grid from '../components/Grid';
import RightPanel from '../components/RightPanel';
import VictoryModal from '../components/VictoryModal';
import CustomWordModal from '../components/CustomWordModal';
import { 
  getSampledGameWords,
  generateWordSearchGrid 
} from '../utils/wordSearchGenerator';
import { sound } from '../utils/sound';
import { saveGameResult } from '../utils/api';

export default function GamePage() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem('playerName') || 'Player';
  const category = 'construction';
  const [gridSize, setGridSize] = useState(14);
  const [gameState, setGameState] = useState(null);
  
  // Game metrics (3 minutes = 180s)
  const TOTAL_TIME_LIMIT = 180;
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hintedWord, setHintedWord] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Modals
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Redirect to start if no player name is set
  useEffect(() => {
    if (!sessionStorage.getItem('playerName')) {
      navigate('/start');
    }
  }, [navigate]);

  // Initialize or reset game
  const initGame = useCallback((catId = category, size = gridSize, customWords = null) => {
    let wordList = [];
    if (customWords && customWords.length > 0) {
      wordList = customWords;
    } else {
      // Generate 10 balanced random words from Easy, Medium & Difficult pools
      wordList = getSampledGameWords(10);
    }

    const newGameData = generateWordSearchGrid(wordList, size);
    setGameState(newGameData);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setHintedWord(null);
    setIsVictoryOpen(false);
    setIsSaved(false);
  }, [category, gridSize]);

  useEffect(() => {
    initGame(category, gridSize);
  }, [category, gridSize, initGame]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev + 1 >= TOTAL_TIME_LIMIT) {
            setIsTimerRunning(false);
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, TOTAL_TIME_LIMIT]);

  // Word validation logic
  const handleWordFound = (forwardStr, backwardStr, cells) => {
    if (!gameState) return;

    let matchedWordIndex = -1;

    gameState.placedWords.forEach((pw, idx) => {
      if (!pw.found) {
        if (pw.word === forwardStr || pw.word === backwardStr) {
          matchedWordIndex = idx;
        }
      }
    });

    if (matchedWordIndex !== -1) {
      sound.playSuccess();
      const updatedWords = [...gameState.placedWords];
      updatedWords[matchedWordIndex] = {
        ...updatedWords[matchedWordIndex],
        found: true
      };

      const newGameState = {
        ...gameState,
        placedWords: updatedWords
      };
      setGameState(newGameState);

      const remainingUnfound = updatedWords.filter(w => !w.found).length;
      if (remainingUnfound === 0) {
        setIsTimerRunning(false);
        sound.playWin();
        triggerConfetti();

        // Save result to MongoDB backend
        saveGameResult({
          playerName,
          timeTaken: timerSeconds,
          totalWords: updatedWords.length,
          category
        }).then(() => {
          setIsSaved(true);
        });

        setTimeout(() => {
          setIsVictoryOpen(true);
        }, 600);
      }
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Word list card click hint
  const handleSelectWordHint = (item) => {
    if (item && !item.found) {
      setHintedWord(item);
      sound.playPop();
      setTimeout(() => {
        setHintedWord(null);
      }, 2000);
    }
  };

  // Custom game submit
  const handleCustomGameSubmit = (words, size) => {
    setGridSize(size);
    initGame(category, size, words);
  };

  const handleGoHome = () => {
    navigate('/start');
  };

  const totalWords = gameState ? gameState.placedWords.length : 0;

  return (
    <div className="min-h-screen w-full blueprint-bg flex items-center justify-center font-sans select-none text-slate-100 relative p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Full-bleed 3-Column Layout */}
      <main className="w-full max-w-[1800px] h-full lg:h-[90vh] mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-6 lg:gap-8">
        {gameState && (
          <>
            {/* Left Column: Target Word Cards & KEC Logo */}
            <WordList
              placedWords={gameState.placedWords}
              onSelectWordHint={handleSelectWordHint}
            />

            {/* Middle Column: Full Size 14x14 Interactive Grid */}
            <Grid
              grid={gameState.grid}
              size={gameState.size}
              placedWords={gameState.placedWords}
              onWordFound={handleWordFound}
              hintedWord={hintedWord}
            />

            {/* Right Column: Time Remaining (3 Minutes = 180s), RPG Logo & Home Return Button */}
            <RightPanel
              timerSeconds={timerSeconds}
              totalTimeLimit={TOTAL_TIME_LIMIT}
              onHomeClick={handleGoHome}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <VictoryModal
        isOpen={isVictoryOpen}
        playerName={playerName}
        timeTaken={timerSeconds}
        totalWords={totalWords}
        onHome={handleGoHome}
      />

      <CustomWordModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmitCustomGame={handleCustomGameSubmit}
      />
    </div>
  );
}
