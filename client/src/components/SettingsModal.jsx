import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Sparkles, Check, Info } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('novalearn_gemini_key') || '';
      setApiKey(stored);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('novalearn_gemini_key', apiKey.trim());
    } else {
      localStorage.removeItem('novalearn_gemini_key');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem('novalearn_gemini_key');
    setApiKey('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1200);
  };

  const hasKey = Boolean(apiKey.trim());

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px', maxWidth: '540px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>AI Provider Settings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Google Gemini Configuration</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Status Indicator */}
        <div style={{
          background: hasKey ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)',
          border: `1px solid ${hasKey ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {hasKey ? (
            <ShieldCheck size={22} color="#10b981" style={{ flexShrink: 0 }} />
          ) : (
            <Sparkles size={22} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          )}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: hasKey ? '#6ee7b7' : '#c7d2fe', margin: '0 0 2px 0' }}>
              {hasKey ? 'Active: Google Gemini Cloud API' : 'Active: Smart Educational Knowledge Engine'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              {hasKey ? 'Your personal API key will be used for all question explanations and quizzes.' : 'Zero setup required. The assistant operates with complete curricula synthesis.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
              Key is stored locally in your browser session for maximum security.
            </span>
          </div>

          {/* AI Studio Link */}
          <div style={{ marginBottom: '24px' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: 'var(--accent-primary)',
                fontWeight: 600
              }}
            >
              <span>Get a free Gemini API key from Google AI Studio</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={handleClear}
              className="btn-ghost"
              style={{ fontSize: '0.85rem' }}
            >
              Clear Key
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{ minWidth: '120px' }}
            >
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
