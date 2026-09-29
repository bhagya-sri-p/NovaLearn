import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Sparkles,
  ChevronRight,
  ListRestart
} from 'lucide-react';
import { api } from '../services/api';

export default function QuizRunner({ 
  initialTopic = '', 
  initialSubject = 'Physics', 
  initialDifficulty = 'High School',
  onQuizCompleted
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [questionCount, setQuestionCount] = useState(3);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sync if props change
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialSubject) setSubject(initialSubject);
    if (initialDifficulty) setDifficulty(initialDifficulty);
  }, [initialTopic, initialSubject, initialDifficulty]);

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format timer seconds
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Generate Quiz
  const handleStartQuiz = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const data = await api.generateQuiz({
        topic: topic.trim(),
        subject,
        difficulty,
        count: questionCount
      });

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setUserAnswers({});
        setShowFeedback(false);
        setQuizFinished(false);
        setFinalResult(null);
        setTimerSeconds(0);
        setIsTimerRunning(true);
      }
    } catch (err) {
      alert(`Could not generate quiz: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle option select
  const handleSelectOption = (optionIndex) => {
    if (showFeedback) return; // Prevent changing after checking
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: optionIndex
    });
  };

  // Check current answer
  const handleCheckAnswer = () => {
    if (userAnswers[currentIndex] === undefined) return;
    setShowFeedback(true);
  };

  // Next question or finish
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else {
      // Finish quiz
      setIsTimerRunning(false);
      try {
        const result = await api.submitQuiz({
          topic,
          subject,
          difficulty,
          questions,
          userAnswers
        });
        setFinalResult(result);
        setQuizFinished(true);

        // Celebration confetti if score >= 70%
        if (result.percentage >= 70) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        if (onQuizCompleted) {
          onQuizCompleted(result);
        }
      } catch (err) {
        console.error('Error submitting quiz:', err);
      }
    }
  };

  // Reset to create another quiz
  const handleReset = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowFeedback(false);
    setQuizFinished(false);
    setFinalResult(null);
    setIsTimerRunning(false);
  };

  const currentQ = questions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];
  const isAnswerSelected = selectedAnswer !== undefined;

  // View: 1. Quiz Config Setup (If not started yet)
  if (questions.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '36px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: 'var(--accent-glow)'
          }}>
            <BrainCircuit size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            Interactive AI Quiz Generator
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
            Generate curriculum-tailored multiple choice questions with comprehensive explanations for every choice.
          </p>
        </div>

        <form onSubmit={handleStartQuiz}>
          {/* Topic Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              QUIZ TOPIC / CONCEPT
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Thermodynamics & Entropy, Linear Algebra Eigenvalues, Mitosis vs Meiosis..."
              required
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Grid of Subject, Difficulty, Count */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                SUBJECT
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="Physics">Physics</option>
                <option value="Math">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="History">History</option>
                <option value="Literature">Literature</option>
                <option value="General">General Science</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                TARGET DIFFICULTY
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College / Undergrad</option>
                <option value="Expert">Advanced / Master</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                NUMBER OF QUESTIONS
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value={3}>3 Questions (Quick Sprint)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={8}>8 Questions (Deep Assessment)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!topic.trim() || isGenerating}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin-slow" style={{ width: '18px', height: '18px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                <span>Crafting Challenging Questions...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate & Launch Quiz</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // View: 2. Quiz Finished Completion Screen
  if (quizFinished && finalResult) {
    const isPassing = finalResult.percentage >= 60;
    const isPerfect = finalResult.percentage === 100;

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '36px', maxWidth: '850px', margin: '0 auto' }}>
        {/* Score Header Card */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: isPerfect ? 'linear-gradient(135deg, #10b981, #06b6d4)' : isPassing ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b, #f43f5e)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Trophy size={34} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            {isPerfect ? "Flawless Performance!" : isPassing ? "Great Job! Quiz Completed" : "Knowledge Check Finished"}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Topic: <strong>{finalResult.topic}</strong> ({finalResult.subject})
          </p>

          {/* Score Circle & Stats */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 28px',
            marginTop: '16px'
          }}>
            <div>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: isPassing ? '#10b981' : '#f59e0b' }}>
                {finalResult.percentage}%
              </span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mastery Rating</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {finalResult.score} / {finalResult.total}
              </span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct Answers</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#38bdf8' }}>
                {formatTime(timerSeconds)}
              </span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time Elapsed</p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Answer Breakdown & Explanations</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {finalResult.questions.map((q, idx) => {
            const isCorrect = q.isCorrect;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: isCorrect ? '1px solid var(--success-border)' : '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {isCorrect ? (
                      <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <XCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {idx + 1}. {q.question}
                    </h4>
                  </div>
                  <span className={`badge ${isCorrect ? 'badge-emerald' : 'badge-rose'}`}>
                    {isCorrect ? '+1 Mark' : '0 Mark'}
                  </span>
                </div>

                <div style={{ marginLeft: '30px' }}>
                  <p style={{ fontSize: '0.88rem', margin: '4px 0', color: isCorrect ? '#6ee7b7' : '#fda4af' }}>
                    <strong>Your Choice:</strong> {q.userSelected !== null ? q.options[q.userSelected] : 'Skipped'}
                  </p>
                  {!isCorrect && (
                    <p style={{ fontSize: '0.88rem', margin: '4px 0', color: '#6ee7b7' }}>
                      <strong>Correct Choice:</strong> {q.options[q.correctIndex]}
                    </p>
                  )}
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    💡 <em>{q.explanation}</em>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={handleStartQuiz} className="btn-primary" style={{ padding: '12px 24px' }}>
            <RotateCcw size={16} />
            <span>Retake This Quiz</span>
          </button>
          <button onClick={handleReset} className="btn-secondary" style={{ padding: '12px 24px' }}>
            <ListRestart size={16} />
            <span>Design New Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  // View: 3. Active Quiz Question View
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', maxWidth: '850px', margin: '0 auto' }}>
      {/* Top Header with Progress and Timer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-indigo">Question {currentIndex + 1} of {questions.length}</span>
          <span className="badge badge-cyan">{subject}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <Clock size={16} />
          <span>{formatTime(timerSeconds)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '28px', overflow: 'hidden' }}>
        <div 
          style={{
            height: '100%',
            background: 'var(--accent-gradient)',
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Question Prompt */}
      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px', lineHeight: '1.4' }}>
        {currentQ.question}
      </h3>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {currentQ.options.map((opt, optIdx) => {
          const isSelected = selectedAnswer === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;

          let optionStyle = {
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)',
            color: 'var(--text-main)',
            cursor: showFeedback ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.98rem',
            transition: 'all 0.2s ease'
          };

          if (showFeedback) {
            if (isCorrect) {
              optionStyle.background = 'var(--success-bg)';
              optionStyle.borderColor = 'var(--success-border)';
              optionStyle.color = '#6ee7b7';
            } else if (isSelected && !isCorrect) {
              optionStyle.background = 'var(--danger-bg)';
              optionStyle.borderColor = 'var(--danger-border)';
              optionStyle.color = '#fda4af';
            }
          } else if (isSelected) {
            optionStyle.background = 'rgba(99, 102, 241, 0.15)';
            optionStyle.borderColor = 'var(--accent-primary)';
            optionStyle.boxShadow = '0 0 15px rgba(99, 102, 241, 0.3)';
          }

          return (
            <div
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              style={optionStyle}
              onMouseEnter={(e) => {
                if (!showFeedback && !isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showFeedback && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span>{opt}</span>
              </div>

              {showFeedback && isCorrect && <CheckCircle2 size={20} color="#10b981" />}
              {showFeedback && isSelected && !isCorrect && <XCircle size={20} color="#f43f5e" />}
            </div>
          );
        })}
      </div>

      {/* Explanation Feedback Card */}
      {showFeedback && (
        <div className="animate-fade-in" style={{
          background: selectedAnswer === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
          borderLeft: `4px solid ${selectedAnswer === currentQ.correctIndex ? '#10b981' : '#f43f5e'}`,
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          padding: '16px 20px',
          marginBottom: '28px'
        }}>
          <h4 style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: selectedAnswer === currentQ.correctIndex ? '#6ee7b7' : '#fda4af',
            marginBottom: '4px'
          }}>
            {selectedAnswer === currentQ.correctIndex ? '✓ Correct Answer!' : '✗ Not quite right'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <button
          onClick={handleReset}
          className="btn-ghost"
          style={{ fontSize: '0.85rem' }}
        >
          Cancel Quiz
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!showFeedback ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!isAnswerSelected}
              className="btn-primary"
              style={{ minWidth: '140px' }}
            >
              <span>Check Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary"
              style={{ minWidth: '140px' }}
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
