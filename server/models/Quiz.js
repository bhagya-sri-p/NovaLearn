import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { type: Number },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  userSelected: { type: Number, default: null },
  isCorrect: { type: Boolean, default: false },
  explanation: { type: String }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  subject: { type: String, default: 'General' },
  difficulty: { type: String, default: 'High School' },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  questions: [questionSchema],
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Quiz = mongoose.model('Quiz', quizSchema);
