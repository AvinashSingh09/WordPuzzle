import React, { useState, useEffect, useRef } from 'react';
import { getCellsInLine, HIGHLIGHT_COLORS } from '../utils/wordSearchGenerator';
import { sound } from '../utils/sound';

export default function Grid({
  grid,
  size,
  placedWords,
  onWordFound,
  hintedWord
}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentCell, setCurrentCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  
  const gridRef = useRef(null);

  // Map found word positions to highlight styles
  const foundCellMap = React.useMemo(() => {
    const map = {};
    placedWords.forEach((pw, wordIdx) => {
      if (pw.found) {
        const color = HIGHLIGHT_COLORS[wordIdx % HIGHLIGHT_COLORS.length];
        pw.positions.forEach(({ r, c }) => {
          const key = `${r}-${c}`;
          if (!map[key]) map[key] = [];
          map[key].push(color);
        });
      }
    });
    return map;
  }, [placedWords]);

  useEffect(() => {
    if (isSelecting && startCell && currentCell) {
      const line = getCellsInLine(startCell, currentCell);
      setSelectedCells(line);
    } else if (!isSelecting) {
      setSelectedCells([]);
    }
  }, [isSelecting, startCell, currentCell]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        finishSelection();
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting, selectedCells]);

  const getCellFromElement = (el) => {
    if (!el) return null;
    const tile = el.closest('[data-row]');
    if (!tile) return null;
    const r = parseInt(tile.getAttribute('data-row'), 10);
    const c = parseInt(tile.getAttribute('data-col'), 10);
    if (isNaN(r) || isNaN(c)) return null;
    return { r, c };
  };

  const handleMouseDown = (r, c) => {
    sound.playPop();
    setIsSelecting(true);
    setStartCell({ r, c });
    setCurrentCell({ r, c });
  };

  const handleMouseEnter = (r, c) => {
    if (isSelecting) {
      if (!currentCell || currentCell.r !== r || currentCell.c !== c) {
        sound.playPop();
        setCurrentCell({ r, c });
      }
    }
  };

  const finishSelection = () => {
    if (!isSelecting) return;

    if (selectedCells.length > 0) {
      const forwardStr = selectedCells.map(({ r, c }) => grid[r][c]).join('');
      const backwardStr = [...forwardStr].reverse().join('');
      onWordFound(forwardStr, backwardStr, selectedCells);
    }

    setIsSelecting(false);
    setStartCell(null);
    setCurrentCell(null);
    setSelectedCells([]);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = getCellFromElement(el);
    if (cell) {
      sound.playPop();
      setIsSelecting(true);
      setStartCell(cell);
      setCurrentCell(cell);
    }
  };

  const handleTouchMove = (e) => {
    if (!isSelecting) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = getCellFromElement(el);
    if (cell && (!currentCell || currentCell.r !== cell.r || currentCell.c !== cell.c)) {
      sound.playPop();
      setCurrentCell(cell);
    }
  };

  const handleTouchEnd = () => {
    finishSelection();
  };

  const isCellSelected = (r, c) => {
    return selectedCells.some(cell => cell.r === r && cell.c === c);
  };

  const isCellHinted = (r, c) => {
    if (!hintedWord) return false;
    return hintedWord.positions.some(pos => pos.r === r && pos.c === c);
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full h-full max-w-[760px]">
      <div 
        ref={gridRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full aspect-square flex flex-col justify-between select-none touch-none p-1"
      >
        <div 
          className="grid gap-1 md:gap-1.5 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
          }}
        >
          {grid.map((row, r) =>
            row.map((char, c) => {
              const cellKey = `${r}-${c}`;
              const foundColors = foundCellMap[cellKey];
              const isSelected = isCellSelected(r, c);
              const isHinted = isCellHinted(r, c);

              let tileClass = 'bg-white text-slate-800 border-slate-300 shadow-sm hover:bg-sky-50';

              if (isSelected) {
                tileClass = 'bg-cyan-400 text-slate-950 font-black border-cyan-300 scale-95 shadow-md shadow-cyan-400/50 z-10';
              } else if (foundColors && foundColors.length > 0) {
                const primaryColor = foundColors[foundColors.length - 1];
                tileClass = `${primaryColor.bg} ${primaryColor.text} ${primaryColor.border} font-black shadow-sm scale-100`;
              } else if (isHinted) {
                tileClass = 'bg-amber-400 text-slate-950 font-black border-amber-300 animate-bounce scale-105 z-20 shadow-lg shadow-amber-400/50';
              }

              return (
                <div
                  key={cellKey}
                  data-row={r}
                  data-col={c}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  className={`relative aspect-square rounded-md md:rounded-lg border flex items-center justify-center text-base sm:text-lg md:text-2xl font-black tracking-tight transition-all duration-150 cursor-pointer ${tileClass}`}
                >
                  <span>{char}</span>

                  {foundColors && foundColors.length > 1 && (
                    <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
                      {foundColors.map((col, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${col.pill}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
