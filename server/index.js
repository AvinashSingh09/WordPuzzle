import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from Vite build output (dist)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// MongoDB Schema & Model
const gameResultSchema = new mongoose.Schema({
  playerName: { type: String, required: true, trim: true },
  timeTaken: { type: Number, required: true }, // duration in seconds
  totalWords: { type: Number, default: 8 },
  category: { type: String, default: 'construction' },
  createdAt: { type: Date, default: Date.now }
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

// Connect to MongoDB
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully!');
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });
} else {
  console.warn('⚠️ MONGODB_URI is not defined in environment variables.');
}

// API Routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WordSearch API is running' });
});

// Save game result
app.post('/api/results', async (req, res) => {
  try {
    const { playerName, timeTaken, totalWords, category } = req.body;

    if (!playerName || typeof timeTaken !== 'number') {
      return res.status(400).json({ success: false, error: 'Missing playerName or timeTaken' });
    }

    const newResult = new GameResult({
      playerName,
      timeTaken,
      totalWords: totalWords || 8,
      category: category || 'construction'
    });

    await newResult.save();
    console.log(`🏆 Game result saved for ${playerName}: ${timeTaken}s`);

    res.status(201).json({
      success: true,
      message: 'Game result saved successfully!',
      data: newResult
    });
  } catch (error) {
    console.error('Error saving result:', error.message);
    res.status(500).json({ success: false, error: 'Failed to save game result' });
  }
});

// Get all participant results
app.get('/api/results', async (req, res) => {
  try {
    const results = await GameResult.find()
      .sort({ timeTaken: 1, createdAt: -1 });

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Error fetching results:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch results' });
  }
});

// Delete single result by ID
app.delete('/api/results/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await GameResult.findByIdAndDelete(id);
    res.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete result' });
  }
});

// Delete all results (Clear leaderboard)
app.delete('/api/results', async (req, res) => {
  try {
    await GameResult.deleteMany({});
    res.json({ success: true, message: 'All results cleared' });
  } catch (error) {
    console.error('Error clearing results:', error.message);
    res.status(500).json({ success: false, error: 'Failed to clear results' });
  }
});

// React Router wildcard fallback - serve index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
