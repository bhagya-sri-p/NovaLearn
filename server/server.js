import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { connectDB, isMongoConnected } from './config/db.js';
import { dbStore } from './data/store.js';
import { getAIExplanation, getGeneratedQuiz, getGeneratedFlashcards } from './services/aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Student Learning Assistant API',
    database: isMongoConnected() ? 'MongoDB (Mongoose)' : 'Local File Storage (Fallback)',
    isMongoConnected: isMongoConnected(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Explain a Question / Topic
app.post('/api/explain', async (req, res) => {
  try {
    const { topic, subject = 'General', difficulty = 'High School', style = 'Intuitive & Visual' } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic or question is required.' });
    }

    const apiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
    const aiResult = await getAIExplanation({
      topic: topic.trim(),
      subject,
      difficulty,
      style,
      apiKey
    });

    const newRecord = {
      id: uuidv4(),
      ...aiResult,
      timestamp: new Date().toISOString(),
      bookmarked: false
    };

    const saved = await dbStore.addExplanation(newRecord);
    res.json(saved);
  } catch (err) {
    console.error('Error generating explanation:', err);
    res.status(500).json({ error: 'Failed to generate explanation. Please try again.' });
  }
});

// Get Learning History
app.get('/api/history', async (req, res) => {
  try {
    const history = await dbStore.getHistory();
    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// Get History Detail by ID
app.get('/api/history/:id', async (req, res) => {
  try {
    const item = await dbStore.getHistoryById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching history item:', err);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
});

// Bookmark / Unbookmark item
app.post('/api/history/:id/bookmark', async (req, res) => {
  try {
    const updated = await dbStore.toggleBookmark(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating bookmark:', err);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// Delete history item
app.delete('/api/history/:id', async (req, res) => {
  try {
    const result = await dbStore.deleteHistory(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Clear all history
app.delete('/api/history', async (req, res) => {
  try {
    const result = await dbStore.clearHistory();
    res.json(result);
  } catch (err) {
    console.error('Error clearing history:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// Generate Quiz on Topic
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { topic, subject = 'General', difficulty = 'High School', count = 5 } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required to generate quiz.' });
    }

    const apiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
    const questions = await getGeneratedQuiz({
      topic: topic.trim(),
      subject,
      difficulty,
      count: Math.min(Math.max(parseInt(count) || 5, 2), 10),
      apiKey
    });

    res.json({
      topic: topic.trim(),
      subject,
      difficulty,
      questions
    });
  } catch (err) {
    console.error('Error generating quiz:', err);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

// Submit and Grade Quiz
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { topic, subject = 'General', difficulty = 'High School', questions = [], userAnswers = {} } = req.body;

    let score = 0;
    const gradedQuestions = questions.map((q, idx) => {
      const selected = userAnswers[q.id || idx];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score++;

      return {
        ...q,
        userSelected: selected !== undefined ? selected : null,
        isCorrect
      };
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const quizRecord = {
      id: uuidv4(),
      topic,
      subject,
      difficulty,
      score,
      total,
      percentage,
      timestamp: new Date().toISOString(),
      questions: gradedQuestions
    };

    const saved = await dbStore.saveQuizResult(quizRecord);
    res.json(saved);
  } catch (err) {
    console.error('Error scoring quiz:', err);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get Quiz History
app.get('/api/quiz/history', async (req, res) => {
  try {
    const quizzes = await dbStore.getQuizzes();
    res.json(quizzes);
  } catch (err) {
    console.error('Error getting quiz history:', err);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

// Generate Flashcards
app.post('/api/flashcards', async (req, res) => {
  try {
    const { topic, subject = 'General' } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required.' });

    const apiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
    const flashcards = await getGeneratedFlashcards({ topic, subject, apiKey });
    res.json({ topic, flashcards });
  } catch (err) {
    console.error('Error generating flashcards:', err);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

// Learning Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await dbStore.getAnalytics();
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI Student Learning Assistant Server running on http://localhost:${PORT}`);
});
