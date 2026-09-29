import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QuestionInput from './components/QuestionInput';
import ExplanationView from './components/ExplanationView';
import QuizRunner from './components/QuizRunner';
import LearningHistory from './components/LearningHistory';
import FlashcardModal from './components/FlashcardModal';
import AnalyticsModal from './components/AnalyticsModal';
import SettingsModal from './components/SettingsModal';
import PomodoroTimer from './components/PomodoroTimer';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('ask'); // 'ask' | 'quiz' | 'history'
  const [theme, setTheme] = useState(() => localStorage.getItem('novalearn_theme') || 'dark');
  
  const [historyItems, setHistoryItems] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  
  const [isExplaining, setIsExplaining] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  // Modals state
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcardSubject, setFlashcardSubject] = useState('General');
  
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  // Target for Quiz tab
  const [quizTarget, setQuizTarget] = useState({
    topic: '',
    subject: 'Physics',
    difficulty: 'High School'
  });

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('novalearn_theme', theme);
  }, [theme]);

  // Load initial history & initial explanation
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const history = await api.getHistory();
      setHistoryItems(history);
      if (history.length > 0 && !currentExplanation) {
        setCurrentExplanation(history[0]);
      }

      const quizzes = await api.getQuizHistory();
      setQuizHistory(quizzes);
    } catch (err) {
      console.warn('Could not connect to backend, ensure server is running:', err);
    }
  };

  // Submit Question / Concept
  const handleQuestionSubmit = async ({ topic, subject, difficulty, style }) => {
    setIsExplaining(true);
    setLoadingStep('Synthesizing pedagogical framework...');

    const timer1 = setTimeout(() => {
      setLoadingStep('Crafting intuitive real-world analogies & models...');
    }, 900);

    const timer2 = setTimeout(() => {
      setLoadingStep('Assembling step-by-step breakdown & formulas...');
    }, 1800);

    try {
      const newExplanation = await api.explainTopic({ topic, subject, difficulty, style });
      clearTimeout(timer1);
      clearTimeout(timer2);

      setCurrentExplanation(newExplanation);
      setHistoryItems(prev => [newExplanation, ...prev]);
      setActiveTab('ask');

      // Scroll smoothly down to the explanation
      setTimeout(() => {
        const el = document.getElementById('explanation-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      alert(`Error generating explanation: ${err.message}`);
    } finally {
      setIsExplaining(false);
      setLoadingStep('');
    }
  };

  // Follow-up Question
  const handleAskFollowUp = async (fullQuery, subject, difficulty) => {
    setIsFollowUpLoading(true);
    try {
      const followUpResult = await api.explainTopic({
        topic: fullQuery,
        subject,
        difficulty,
        style: currentExplanation?.style || 'Intuitive & Visual'
      });
      setCurrentExplanation(followUpResult);
      setHistoryItems(prev => [followUpResult, ...prev]);
    } catch (err) {
      alert(`Follow-up error: ${err.message}`);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Launch Quiz on Topic
  const handleStartQuiz = (topic, subject, difficulty) => {
    setQuizTarget({
      topic: topic || 'General Knowledge',
      subject: subject || 'Physics',
      difficulty: difficulty || 'High School'
    });
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Flashcards
  const handleOpenFlashcards = (topic, subject) => {
    setFlashcardTopic(topic);
    setFlashcardSubject(subject);
    setIsFlashcardsOpen(true);
  };

  // Bookmark Toggle
  const handleToggleBookmark = async (id) => {
    try {
      const updated = await api.toggleBookmark(id);
      setHistoryItems(prev => prev.map(item => item.id === id ? updated : item));
      if (currentExplanation?.id === id) {
        setCurrentExplanation(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete History Item
  const handleDeleteItem = async (id) => {
    try {
      await api.deleteHistory(id);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
      if (currentExplanation?.id === id) {
        const remaining = historyItems.filter(item => item.id !== id);
        setCurrentExplanation(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Clear History
  const handleClearHistory = async () => {
    try {
      await api.clearHistory();
      setHistoryItems([]);
      setQuizHistory([]);
      setCurrentExplanation(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Select Topic from History
  const handleSelectTopicFromHistory = (item) => {
    setCurrentExplanation(item);
    setActiveTab('ask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quiz Completed Callback
  const handleQuizCompleted = (result) => {
    setQuizHistory(prev => [result, ...prev]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        streak={5}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        flex: 1
      }}>
        {/* Tab 1: Ask & Learn */}
        {activeTab === 'ask' && (
          <div>
            {/* Input Form */}
            <QuestionInput
              onSubmit={handleQuestionSubmit}
              isLoading={isExplaining}
              loadingStep={loadingStep}
            />

            {/* Explanation View */}
            <div id="explanation-section">
              {currentExplanation ? (
                <ExplanationView
                  explanationData={currentExplanation}
                  onToggleBookmark={handleToggleBookmark}
                  onStartQuiz={handleStartQuiz}
                  onOpenFlashcards={handleOpenFlashcards}
                  onAskFollowUp={handleAskFollowUp}
                  isFollowUpLoading={isFollowUpLoading}
                />
              ) : (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
                    Ask any question or pick an inspiration topic above to generate your first adaptive lesson!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Quiz */}
        {activeTab === 'quiz' && (
          <div>
            <QuizRunner
              initialTopic={quizTarget.topic || currentExplanation?.topic || 'Quantum Entanglement & Superposition'}
              initialSubject={quizTarget.subject || currentExplanation?.subject || 'Physics'}
              initialDifficulty={quizTarget.difficulty || currentExplanation?.difficulty || 'College'}
              onQuizCompleted={handleQuizCompleted}
            />
          </div>
        )}

        {/* Tab 3: Learning History */}
        {activeTab === 'history' && (
          <div>
            <LearningHistory
              historyItems={historyItems}
              quizHistory={quizHistory}
              onSelectTopic={handleSelectTopicFromHistory}
              onStartQuiz={handleStartQuiz}
              onToggleBookmark={handleToggleBookmark}
              onDeleteItem={handleDeleteItem}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          NovaLearn AI — Intelligent Adaptive Student Learning Assistant • React & Node.js
        </p>
      </footer>

      {/* Modals */}
      <FlashcardModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        topic={flashcardTopic}
        subject={flashcardSubject}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />
    </div>
  );
}
