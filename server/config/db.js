import mongoose from 'mongoose';
import { Explanation } from '../models/Explanation.js';
import { Quiz } from '../models/Quiz.js';
import { Stats } from '../models/Stats.js';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not defined in .env. Falling back to local storage.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`🍃 [MongoDB] Successfully connected to database: ${conn.connection.name} @ ${conn.connection.host}`);
    
    // Seed initial collections if empty
    await seedMongoIfEmpty();

    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB] Connection failed (${error.message}).`);
    console.warn('💡 Tip: Provide a valid MONGODB_URI in your server/.env file (e.g. MongoDB Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/novalearn).');
    console.warn('🔄 System is operating with local fallback storage so nothing breaks!');
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

// Auto-seed MongoDB with initial lesson data if empty
async function seedMongoIfEmpty() {
  try {
    const count = await Explanation.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding initial learning topics into MongoDB...');
      await Explanation.insertMany([
        {
          id: "seed-1",
          topic: "Quantum Entanglement & Superposition",
          subject: "Physics",
          difficulty: "College",
          style: "Intuitive & Visual",
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
          bookmarked: true,
          timestamp: new Date(Date.now() - 3600000 * 24 * 2)
        },
        {
          id: "seed-2",
          topic: "Dijkstra's Shortest Path Algorithm",
          subject: "Computer Science",
          difficulty: "College",
          style: "Academic & Rigorous",
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
          bookmarked: false,
          timestamp: new Date(Date.now() - 3600000 * 12)
        }
      ]);
      console.log('✅ [MongoDB] Seed complete!');
    }
  } catch (err) {
    console.warn('[MongoDB] Seeding check skipped:', err.message);
  }
}
