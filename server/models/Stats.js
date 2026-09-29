import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  key: { type: String, default: 'global_stats', unique: true },
  studyStreakDays: { type: Number, default: 5 },
  totalMinutesStudied: { type: Number, default: 142 },
  quizzesTaken: { type: Number, default: 0 },
  averageQuizScore: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Stats = mongoose.model('Stats', statsSchema);
