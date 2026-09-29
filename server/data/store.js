import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoConnected } from '../config/db.js';
import { Explanation } from '../models/Explanation.js';
import { Quiz } from '../models/Quiz.js';
import { Stats } from '../models/Stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  history: [
    {
      id: "seed-1",
      topic: "Quantum Entanglement & Superposition",
      subject: "Physics",
      difficulty: "College",
      style: "Intuitive & Visual",
      timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      summary: "Quantum entanglement is a phenomenon where quantum particles become inextricably linked, such that the state of one instantly dictates the state of another, regardless of distance.",
      explanation: "### 1. Core Principle\nWhen two particles interact in specific ways, their quantum states become intertwined. Until measured, both particles exist in a **superposition** of states—a probability wave containing all potential outcomes.\n\n### 2. The Measurement Shock\nThe moment you measure Particle A (for example, finding it has 'spin up'), the wave function instantly collapses, and Particle B will immediately measure 'spin down', even if separated by light-years.\n\n### 3. Einstein's Skepticism\nAlbert Einstein famously termed this *'spooky action at a distance'* because it seemed to violate the principle of locality and the cosmic speed limit (speed of light).\n\n### 4. Key Takeaways\n- Entanglement does **not** allow faster-than-light communication because the outcome of the first measurement is completely random.\n- It forms the core foundation of **Quantum Computing** (qubits) and **Quantum Cryptography** (QKD).",
      analogy: "Imagine a magical pair of shoes placed into two sealed boxes. One box stays on Earth, and the other is flown to Mars. Before opening either box, neither shoe is definitively 'left' or 'right'—they exist in indeterminate state. The microsecond an astronaut on Mars opens their box and sees a Left Shoe, your box on Earth instantaneously becomes a Right Shoe.",
      keyConcepts: [
        "Wavefunction Collapse",
        "Bell's Inequality",
        "Superposition (Schrödinger)",
        "Quantum Teleportation & Qubits"
      ],
      commonMistakes: [
        "Believing quantum entanglement allows instantaneous Morse code or data transmission.",
        "Assuming the particles had hidden definite states all along (disproven by Bell's theorem)."
      ],
      bookmarked: true
    },
    {
      id: "seed-2",
      topic: "Dijkstra's Shortest Path Algorithm",
      subject: "Computer Science",
      difficulty: "College",
      style: "Academic & Rigorous",
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      summary: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights using a greedy priority queue approach.",
      explanation: "### 1. Algorithm Overview\nDijkstra operates by progressively visiting vertices in order of their cumulative distance from the starting source vertex $S$.\n\n### 2. Step-by-Step Execution\n1. **Initialization:** Set `dist[S] = 0` and `dist[v] = ∞` for all other vertices. Insert all nodes into a Min-Priority Queue.\n2. **Extract Minimum:** Pop node $u$ with the minimum tentative distance.\n3. **Edge Relaxation:** For each neighbor $v$ of $u$:\n   $$\\text{if } dist[u] + \\text{weight}(u, v) < dist[v] \\implies dist[v] = dist[u] + \\text{weight}(u, v)$$\n4. **Repeat** until queue is empty or target node is reached.\n\n### 3. Time Complexity\n- With Min-Heap/Priority Queue: $O((V + E) \\log V)$\n- With Fibonacci Heap: $O(E + V \\log V)$",
      analogy: "Picture water spreading uniformly through a network of pipes from a single faucet. The water always reaches the nearest junction first before flowing into longer or more congested branches.",
      keyConcepts: [
        "Greedy Choice Property",
        "Edge Relaxation",
        "Priority Queue / Min-Heap",
        "Non-negative Edge Constraint"
      ],
      commonMistakes: [
        "Using Dijkstra on graphs with negative weights (use Bellman-Ford instead).",
        "Forgetting to update the priority queue key during relaxation."
      ],
      bookmarked: false
    }
  ],
  quizzes: [
    {
      id: "quiz-seed-1",
      topic: "Quantum Entanglement & Superposition",
      subject: "Physics",
      difficulty: "College",
      score: 3,
      total: 3,
      percentage: 100,
      timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      questions: [
        {
          id: 1,
          question: "Can quantum entanglement be utilized to send instant data signals faster than the speed of light?",
          options: [
            "Yes, because wavefunction collapse occurs instantly across any distance.",
            "No, because the measured state of each individual particle is completely random without a classical channel comparison.",
            "Yes, but only within quantum vacuum chambers.",
            "No, because particles lose entanglement immediately when separated."
          ],
          correctIndex: 1,
          userSelected: 1,
          explanation: "Even though collapse is instantaneous, an observer cannot know what the other measured without sending a signal via a classical channel (bounded by the speed of light)."
        }
      ]
    }
  ],
  stats: {
    studyStreakDays: 5,
    totalMinutesStudied: 142,
    quizzesTaken: 1,
    averageQuizScore: 100
  }
};

function ensureLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local DB file:', err);
  }
}

export const dbStore = {
  // Get all history
  async getHistory() {
    if (isMongoConnected()) {
      try {
        const items = await Explanation.find().sort({ timestamp: -1 }).lean();
        return items.map(doc => ({ ...doc, id: doc.id || doc._id.toString() }));
      } catch (err) {
        console.warn('MongoDB getHistory error, using local fallback:', err.message);
      }
    }
    const data = ensureLocalDb();
    return data.history || [];
  },

  // Get single history item
  async getHistoryById(id) {
    if (isMongoConnected()) {
      try {
        const item = await Explanation.findOne({ id }).lean();
        if (item) return { ...item, id: item.id || item._id.toString() };
      } catch (err) {
        console.warn('MongoDB getHistoryById error:', err.message);
      }
    }
    const data = ensureLocalDb();
    return (data.history || []).find(item => item.id === id);
  },

  // Add new explanation
  async addExplanation(item) {
    if (isMongoConnected()) {
      try {
        const created = await Explanation.create(item);
        // update stats in Mongo
        await Stats.findOneAndUpdate(
          { key: 'global_stats' },
          { $inc: { totalMinutesStudied: 12 } },
          { upsert: true, new: true }
        );
        return created.toObject();
      } catch (err) {
        console.warn('MongoDB addExplanation error, using local fallback:', err.message);
      }
    }
    const data = ensureLocalDb();
    if (!data.history) data.history = [];
    data.history.unshift(item);
    if (!data.stats) data.stats = { studyStreakDays: 5, totalMinutesStudied: 142, quizzesTaken: 0, averageQuizScore: 0 };
    data.stats.totalMinutesStudied = (data.stats.totalMinutesStudied || 0) + 12;
    writeLocalDb(data);
    return item;
  },

  // Delete history item
  async deleteHistory(id) {
    if (isMongoConnected()) {
      try {
        await Explanation.deleteOne({ id });
        return { success: true };
      } catch (err) {
        console.warn('MongoDB delete error:', err.message);
      }
    }
    const data = ensureLocalDb();
    data.history = (data.history || []).filter(item => item.id !== id);
    writeLocalDb(data);
    return { success: true };
  },

  // Toggle bookmark
  async toggleBookmark(id) {
    if (isMongoConnected()) {
      try {
        const item = await Explanation.findOne({ id });
        if (item) {
          item.bookmarked = !item.bookmarked;
          await item.save();
          return item.toObject();
        }
      } catch (err) {
        console.warn('MongoDB bookmark error:', err.message);
      }
    }
    const data = ensureLocalDb();
    const item = (data.history || []).find(i => i.id === id);
    if (item) {
      item.bookmarked = !item.bookmarked;
      writeLocalDb(data);
      return item;
    }
    return null;
  },

  // Clear all history
  async clearHistory() {
    if (isMongoConnected()) {
      try {
        await Explanation.deleteMany({});
        await Quiz.deleteMany({});
        return { success: true };
      } catch (err) {
        console.warn('MongoDB clear error:', err.message);
      }
    }
    const data = ensureLocalDb();
    data.history = [];
    data.quizzes = [];
    writeLocalDb(data);
    return { success: true };
  },

  // Get quizzes
  async getQuizzes() {
    if (isMongoConnected()) {
      try {
        const quizzes = await Quiz.find().sort({ timestamp: -1 }).lean();
        return quizzes.map(q => ({ ...q, id: q.id || q._id.toString() }));
      } catch (err) {
        console.warn('MongoDB getQuizzes error:', err.message);
      }
    }
    const data = ensureLocalDb();
    return data.quizzes || [];
  },

  // Save quiz result
  async saveQuizResult(quizResult) {
    if (isMongoConnected()) {
      try {
        const created = await Quiz.create(quizResult);
        const allQuizzes = await Quiz.find().lean();
        const totalScorePct = allQuizzes.reduce((acc, q) => acc + (q.percentage || 0), 0);
        const avg = Math.round(totalScorePct / allQuizzes.length);

        await Stats.findOneAndUpdate(
          { key: 'global_stats' },
          { 
            $inc: { quizzesTaken: 1, totalMinutesStudied: 8 },
            $set: { averageQuizScore: avg }
          },
          { upsert: true }
        );
        return created.toObject();
      } catch (err) {
        console.warn('MongoDB saveQuizResult error, using local fallback:', err.message);
      }
    }
    const data = ensureLocalDb();
    if (!data.quizzes) data.quizzes = [];
    data.quizzes.unshift(quizResult);

    if (!data.stats) data.stats = { studyStreakDays: 5, totalMinutesStudied: 142, quizzesTaken: 0, averageQuizScore: 0 };
    data.stats.quizzesTaken = data.quizzes.length;
    const totalScorePct = data.quizzes.reduce((acc, q) => acc + (q.percentage || 0), 0);
    data.stats.averageQuizScore = Math.round(totalScorePct / data.quizzes.length);
    data.stats.totalMinutesStudied = (data.stats.totalMinutesStudied || 0) + 8;
    writeLocalDb(data);
    return quizResult;
  },

  // Analytics
  async getAnalytics() {
    let history = [];
    let quizzes = [];
    let statsData = { studyStreakDays: 5, totalMinutesStudied: 142, averageQuizScore: 0 };

    if (isMongoConnected()) {
      try {
        history = await Explanation.find().lean();
        quizzes = await Quiz.find().lean();
        const doc = await Stats.findOne({ key: 'global_stats' }).lean();
        if (doc) {
          statsData = {
            studyStreakDays: doc.studyStreakDays || 5,
            totalMinutesStudied: doc.totalMinutesStudied || 142,
            averageQuizScore: doc.averageQuizScore || 0
          };
        }
      } catch (err) {
        console.warn('MongoDB analytics error, using fallback:', err.message);
      }
    }

    if (history.length === 0 && !isMongoConnected()) {
      const data = ensureLocalDb();
      history = data.history || [];
      quizzes = data.quizzes || [];
      statsData = data.stats || statsData;
    }

    const subjectMap = {};
    history.forEach(item => {
      const s = item.subject || 'General';
      subjectMap[s] = (subjectMap[s] || 0) + 1;
    });

    const subjects = Object.entries(subjectMap).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / (history.length || 1)) * 100)
    }));

    return {
      database: isMongoConnected() ? 'MongoDB' : 'Local File Storage',
      isMongoConnected: isMongoConnected(),
      totalQuestions: history.length,
      totalQuizzes: quizzes.length,
      averageQuizScore: statsData.averageQuizScore || 0,
      studyStreakDays: statsData.studyStreakDays || 5,
      totalMinutesStudied: statsData.totalMinutesStudied || 142,
      bookmarkedCount: history.filter(h => h.bookmarked).length,
      subjectBreakdown: subjects
    };
  }
};
