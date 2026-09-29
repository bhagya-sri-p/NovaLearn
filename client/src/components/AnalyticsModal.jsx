import React, { useState, useEffect } from 'react';
import { X, BarChart3, Flame, Award, Clock, BookOpen, BrainCircuit, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getAnalytics()
        .then(res => {
          setStats(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px', maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Study Analytics & Mastery</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Continuous Learning Progress</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="animate-spin-slow" style={{ width: '28px', height: '28px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Calculating metrics...</p>
          </div>
        ) : !stats ? (
          <p>Could not load metrics.</p>
        ) : (
          <div>
            {/* 4 Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
              {/* Streak */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginBottom: '6px' }}>
                  <Flame size={16} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Daily Streak</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.studyStreakDays} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>days</span>
                </div>
              </div>

              {/* Average Quiz Score */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', marginBottom: '6px' }}>
                  <Award size={16} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg Quiz Score</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.averageQuizScore}%
                </div>
              </div>

              {/* Total Explanations */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', marginBottom: '6px' }}>
                  <BookOpen size={16} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Topics Studied</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.totalQuestions}
                </div>
              </div>

              {/* Quizzes Taken */}
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', marginBottom: '6px' }}>
                  <BrainCircuit size={16} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Quizzes Passed</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.totalQuizzes}
                </div>
              </div>
            </div>

            {/* Subject Mastery Distribution */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                Subject Focus Breakdown
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(stats.subjectBreakdown || []).map((sb, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{sb.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{sb.count} topics ({sb.percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{
                          height: '100%',
                          background: 'var(--accent-gradient)',
                          width: `${sb.percentage}%`,
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Habit Tip */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Pro Tip:</strong> Re-taking quizzes after 48 hours leverages the <em>Spacing Effect</em>, increasing long-term concept retention by over 200%.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
