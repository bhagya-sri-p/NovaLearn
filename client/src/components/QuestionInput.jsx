import React, { useState } from 'react';
import { Send, Sparkles, Lightbulb, BookOpen, Layers, GraduationCap, Cpu, Atom, Dna, Calculator, Landmark, BookText } from 'lucide-react';

const SUBJECTS = [
  { name: 'Physics', icon: Atom },
  { name: 'Math', icon: Calculator },
  { name: 'Computer Science', icon: Cpu },
  { name: 'Biology', icon: Dna },
  { name: 'Chemistry', icon: Sparkles },
  { name: 'History', icon: Landmark },
  { name: 'Literature', icon: BookText },
  { name: 'General', icon: BookOpen },
];

const DIFFICULTIES = [
  { value: 'Middle School', label: 'Middle School' },
  { value: 'High School', label: 'High School' },
  { value: 'College', label: 'College / Undergrad' },
  { value: 'Expert', label: 'Advanced / Research' }
];

const STYLES = [
  { value: 'Intuitive & Visual', label: 'Intuitive & Analogies' },
  { value: 'Simple ELI5', label: 'Explain Like I\'m 5' },
  { value: 'Academic & Rigorous', label: 'Academic & Mathematical' },
  { value: 'Socratic/Inquisitive', label: 'Socratic & Interactive' }
];

const INSPIRATION_QUESTIONS = [
  { text: "Explain Quantum Entanglement with a real-world analogy", subject: "Physics" },
  { text: "How does Photosynthesis convert light into energy in chloroplasts?", subject: "Biology" },
  { text: "Derive the Quadratic Formula from ax² + bx + c = 0 step-by-step", subject: "Math" },
  { text: "Explain Dijkstra's Shortest Path Algorithm with an example graph", subject: "Computer Science" },
  { text: "Why does the Second Law of Thermodynamics dictate the Arrow of Time?", subject: "Physics" },
  { text: "What were the immediate catalysts leading to World War I?", subject: "History" }
];

export default function QuestionInput({ onSubmit, isLoading, loadingStep = '' }) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [difficulty, setDifficulty] = useState('College');
  const [style, setStyle] = useState('Intuitive & Visual');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmit({ topic: topic.trim(), subject, difficulty, style });
  };

  const handleInspirationClick = (q) => {
    setTopic(q.text);
    setSubject(q.subject);
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
      <form onSubmit={handleSubmit}>
        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Ask Your AI Study Companion</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Adaptive AI</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Type any concept, homework question, or scientific theory to get tailored multi-layer explanations.
            </p>
          </div>

          {/* Difficulty Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="var(--accent-primary)" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isLoading}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject Pills */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Select Subject Area
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SUBJECTS.map((s) => {
              const Icon = s.icon;
              const isSelected = subject === s.name;
              return (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => setSubject(s.name)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 0 14px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  <Icon size={14} />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Style Pills */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Explanation Tone & Style
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {STYLES.map((st) => {
              const isSelected = style === st.value;
              return (
                <button
                  type="button"
                  key={st.value}
                  onClick={() => setStyle(st.value)}
                  disabled={isLoading}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: isSelected ? '#a5b4fc' : 'var(--text-muted)',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent'
                  }}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Input Box */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
            placeholder="e.g. How does Heisenberg's Uncertainty Principle work? Or paste a math theorem, biology pathway, or historical event..."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
              resize: 'vertical',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-focus)';
              e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2)';
            }}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tip: Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>Ctrl + Enter</kbd> to submit
            </span>

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="btn-primary"
              style={{ minWidth: '150px' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin-slow" style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Explain Concept</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div className="animate-spin-slow" style={{ width: '20px', height: '20px', border: '2.5px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#c7d2fe' }}>
                {loadingStep || 'AI Assistant is generating your comprehensive explanation...'}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Constructing conceptual analogies, structured breakdown, and interactive practice checks.
              </p>
            </div>
          </div>
        )}

        {/* Quick Inspiration Pills */}
        {!isLoading && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Lightbulb size={14} color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Need ideas? Try asking:
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {INSPIRATION_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInspirationClick(q)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                    e.currentTarget.style.color = '#c7d2fe';
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  "{q.text}"
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
