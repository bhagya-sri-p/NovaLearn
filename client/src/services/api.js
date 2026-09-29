const API_BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const customKey = localStorage.getItem('novalearn_gemini_key');
  if (customKey && customKey.trim()) {
    headers['x-gemini-key'] = customKey.trim();
  }
  return headers;
}

export const api = {
  // Check backend health
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend unavailable');
    return res.json();
  },

  // Ask Question / Generate Explanation
  async explainTopic({ topic, subject, difficulty, style }) {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, subject, difficulty, style })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to explain' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  // Get Learning History
  async getHistory() {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  },

  // Toggle Bookmark
  async toggleBookmark(id) {
    const res = await fetch(`${API_BASE}/history/${id}/bookmark`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  // Delete History Item
  async deleteHistory(id) {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
  },

  // Clear History
  async clearHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear');
    return res.json();
  },

  // Generate Quiz
  async generateQuiz({ topic, subject, difficulty, count = 5 }) {
    const res = await fetch(`${API_BASE}/quiz/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, subject, difficulty, count })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to generate quiz' }));
      throw new Error(err.error || 'Failed to generate quiz');
    }
    return res.json();
  },

  // Submit Quiz for Grading
  async submitQuiz({ topic, subject, difficulty, questions, userAnswers }) {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject, difficulty, questions, userAnswers })
    });
    if (!res.ok) throw new Error('Failed to score quiz');
    return res.json();
  },

  // Get Quiz History
  async getQuizHistory() {
    const res = await fetch(`${API_BASE}/quiz/history`);
    if (!res.ok) throw new Error('Failed to load quiz history');
    return res.json();
  },

  // Generate Flashcards
  async getFlashcards({ topic, subject }) {
    const res = await fetch(`${API_BASE}/flashcards`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, subject })
    });
    if (!res.ok) throw new Error('Failed to load flashcards');
    return res.json();
  },

  // Learning Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  }
};
