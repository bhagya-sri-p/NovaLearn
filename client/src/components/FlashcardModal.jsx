import React, { useState, useEffect } from 'react';
import { X, Layers, ArrowLeft, ArrowRight, RotateCw, Lightbulb, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function FlashcardModal({ isOpen, onClose, topic, subject }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isOpen && topic) {
      setLoading(true);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
      api.getFlashcards({ topic, subject })
        .then(res => {
          setCards(res.flashcards || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, topic, subject]);

  if (!isOpen) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '28px', maxWidth: '580px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Layers size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Active Recall Flashcards</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{topic}</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="animate-spin-slow" style={{ width: '32px', height: '32px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Synthesizing flashcard memory anchors...</p>
          </div>
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>No flashcards could be generated. Please try again.</p>
          </div>
        ) : (
          <div>
            {/* Progress Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge badge-indigo">Card {currentIndex + 1} of {cards.length}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click card to flip</span>
            </div>

            {/* 3D Flip Card Container */}
            <div className="perspective-container" style={{ marginBottom: '20px' }}>
              <div 
                className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front Side */}
                <div className="flashcard-front">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                    QUESTION / PROMPT
                  </span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'center', lineHeight: '1.5' }}>
                    {currentCard?.front}
                  </h4>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <RotateCw size={13} />
                    <span>Click to reveal answer</span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="flashcard-back">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#10b981', textTransform: 'uppercase', marginBottom: '12px' }}>
                    ANSWER & KEY TAKEAWAY
                  </span>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', textAlign: 'center', lineHeight: '1.6', margin: 0 }}>
                    {currentCard?.back}
                  </p>
                </div>
              </div>
            </div>

            {/* Hint Box */}
            {currentCard?.hint && (
              <div style={{ marginBottom: '20px' }}>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="btn-ghost"
                    style={{ fontSize: '0.8rem', color: '#f59e0b', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Lightbulb size={14} />
                    <span>Need a clue? Show hint</span>
                  </button>
                ) : (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: '#fcd34d',
                    textAlign: 'center'
                  }}>
                    💡 Hint: {currentCard.hint}
                  </div>
                )}
              </div>
            )}

            {/* Prev / Next Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="btn-ghost"
                style={{ fontSize: '0.85rem' }}
              >
                <RotateCw size={14} />
                <span>Flip Card</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
