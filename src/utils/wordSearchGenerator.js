// Word Search Grid Generator & Math Helpers

export const WORD_POOLS = {
  easy: [
    'Team', 'Goal', 'Grid', 'Care', 'Safe', 'Lead', 
    'Grow', 'Learn', 'Build', 'Tower', 'Cable', 'Power'
  ],
  medium: [
    'Project', 'Quality', 'Safety', 'Future', 'Global', 'Energy', 
    'Railway', 'Utility', 'Design', 'Survey', 'Mentor', 'Buddy', 
    'Career', 'Success', 'Progress', 'Respect', 'Support', 'Customer', 
    'Deliver', 'Partner'
  ],
  difficult: [
    'Innovation', 'Excellence', 'Leadership', 'Engineering', 'Infrastructure', 
    'Construction', 'Transmission', 'Distribution', 'Sustainability', 
    'Collaboration', 'Accountability', 'Manufacturing', 'Commissioning', 
    'Reliability', 'Connectivity'
  ]
};

// Returns a balanced sample of 10 random words (e.g. 3 Easy, 4 Medium, 3 Difficult) for each game session
export function getSampledGameWords(totalCount = 10) {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const easySample = shuffle(WORD_POOLS.easy).slice(0, 3);
  const mediumSample = shuffle(WORD_POOLS.medium).slice(0, 4);
  const difficultSample = shuffle(WORD_POOLS.difficult).slice(0, 3);

  const combined = [...easySample, ...mediumSample, ...difficultSample];
  
  // Return shuffled 10 words
  return shuffle(combined);
}

export const PRESET_CATEGORIES = {
  construction: {
    id: 'construction',
    name: 'RPG & KEC Infrastructure',
    description: 'Corporate values, engineering & infrastructure',
    words: WORD_POOLS.easy.concat(WORD_POOLS.medium, WORD_POOLS.difficult),
  }
};

// Forward directions only: Left-to-Right, Top-to-Bottom, and Top-to-Bottom Diagonals (No bottom-to-top)
const DIRECTIONS = [
  { dr: 0, dc: 1 },   // Horizontal Right (Left to Right)
  { dr: 1, dc: 0 },   // Vertical Down (Top to Bottom)
  { dr: 1, dc: 1 },   // Diagonal Down-Right (Top-Left to Bottom-Right)
  { dr: 1, dc: -1 }   // Diagonal Down-Left (Top-Right to Bottom-Left)
];

export function generateWordSearchGrid(rawWords, size = 14) {
  const cleanWords = rawWords
    .map(w => w.trim().toUpperCase())
    .filter(w => w.length > 0 && w.length <= size);

  // Sort by length descending for better placement efficiency
  cleanWords.sort((a, b) => b.length - a.length);

  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placedWords = [];

  for (const word of cleanWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 500;

    // Shuffle directions for variety
    const dirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const startR = Math.floor(Math.random() * size);
      const startC = Math.floor(Math.random() * size);

      // Check boundary
      const endR = startR + dir.dr * (word.length - 1);
      const endC = startC + dir.dc * (word.length - 1);

      if (endR < 0 || endR >= size || endC < 0 || endC >= size) {
        continue;
      }

      // Check collision
      let canPlace = true;
      const positions = [];

      for (let i = 0; i < word.length; i++) {
        const r = startR + dir.dr * i;
        const c = startC + dir.dc * i;
        const currentChar = grid[r][c];

        if (currentChar !== '' && currentChar !== word[i]) {
          canPlace = false;
          break;
        }
        positions.push({ r, c });
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const { r, c } = positions[i];
          grid[r][c] = word[i];
        }
        placedWords.push({
          word,
          original: word,
          positions,
          found: false
        });
        placed = true;
      }
    }
  }

  // Fill remaining empty cells with random uppercase letters
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return { grid, size, placedWords };
}

// Calculate straight line cells between start (r1, c1) and end (r2, c2)
// Allows Horizontal, Vertical, and Top-to-Bottom Diagonals (disallows Bottom-to-Top)
export function getCellsInLine(start, end) {
  if (!start || !end) return [];

  const dr = end.r - start.r;
  const dc = end.c - start.c;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  const isHorizontal = dr === 0;
  const isVertical = dc === 0;
  const isTopToBottomDiagonal = absDr === absDc && dr >= 0;

  if (!isHorizontal && !isVertical && !isTopToBottomDiagonal) {
    return [];
  }

  const stepR = dr === 0 ? 0 : dr / absDr;
  const stepC = dc === 0 ? 0 : dc / absDc;

  const length = Math.max(absDr, absDc) + 1;
  const cells = [];

  for (let i = 0; i < length; i++) {
    cells.push({
      r: start.r + stepR * i,
      c: start.c + stepC * i
    });
  }

  return cells;
}

// Color palette for found words to render glowing background highlight pills across the grid!
export const HIGHLIGHT_COLORS = [
  { bg: 'bg-emerald-500/80', text: 'text-white', border: 'border-emerald-400', pill: 'bg-emerald-500' },
  { bg: 'bg-indigo-500/80', text: 'text-white', border: 'border-indigo-400', pill: 'bg-indigo-500' },
  { bg: 'bg-amber-500/80', text: 'text-white', border: 'border-amber-400', pill: 'bg-amber-500' },
  { bg: 'bg-rose-500/80', text: 'text-white', border: 'border-rose-400', pill: 'bg-rose-500' },
  { bg: 'bg-purple-500/80', text: 'text-white', border: 'border-purple-400', pill: 'bg-purple-500' },
  { bg: 'bg-cyan-500/80', text: 'text-white', border: 'border-cyan-400', pill: 'bg-cyan-500' },
  { bg: 'bg-pink-500/80', text: 'text-white', border: 'border-pink-400', pill: 'bg-pink-500' },
  { bg: 'bg-teal-500/80', text: 'text-white', border: 'border-teal-400', pill: 'bg-teal-500' },
  { bg: 'bg-blue-500/80', text: 'text-white', border: 'border-blue-400', pill: 'bg-blue-500' },
  { bg: 'bg-lime-500/80', text: 'text-white', border: 'border-lime-400', pill: 'bg-lime-500' },
];
