import React from 'react';
import { Sparkles, BookOpen, BrainCircuit, History, BarChart3, Sun, Moon, Key, Flame, Timer } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, setTheme, onOpenSettings, onOpenAnalytics, onOpenPomodoro, streak = 5 }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('ask')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-main)'
              }}>
                Nova<span className="gradient-text">Learn</span>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>AI</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              AI Student Learning Assistant
            </p>
          </div>
        </div>

        {/* Center Nav Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.4)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('ask')}
            className={activeTab === 'ask' ? 'btn-primary' : 'btn-ghost'}
            style={{
              padding: '7px 14px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <BookOpen size={16} />
            <span>Ask & Learn</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={activeTab === 'quiz' ? 'btn-primary' : 'btn-ghost'}
            style={{
              padding: '7px 14px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <BrainCircuit size={16} />
            <span>Interactive Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? 'btn-primary' : 'btn-ghost'}
            style={{
              padding: '7px 14px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <History size={16} />
            <span>Learning History</span>
          </button>
        </nav>

        {/* Right Tools & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Study Streak Badge */}
          <div 
            onClick={onOpenAnalytics}
            title="View Study Streak & Analytics"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Flame size={15} />
            <span>{streak}d Streak</span>
          </div>

          {/* Pomodoro Timer Button */}
          <button
            onClick={onOpenPomodoro}
            className="btn-ghost"
            title="Pomodoro Study Sprint Timer"
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            <Timer size={18} color="var(--accent-primary)" />
          </button>

          {/* Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            className="btn-ghost"
            title="Learning Analytics & Mastery"
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            <BarChart3 size={18} />
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenSettings}
            className="btn-ghost"
            title="AI Settings & Gemini Key"
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            <Key size={18} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-ghost"
            title="Toggle Light/Dark Theme"
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
