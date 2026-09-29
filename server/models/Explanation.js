import mongoose from 'mongoose';

const explanationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  subject: { type: String, default: 'General' },
  difficulty: { type: String, default: 'High School' },
  style: { type: String, default: 'Intuitive & Visual' },
  summary: { type: String, required: true },
  explanation: { type: String, required: true },
  analogy: { type: String },
  keyConcepts: [{ type: String }],
  commonMistakes: [{ type: String }],
  bookmarked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Explanation = mongoose.model('Explanation', explanationSchema);
