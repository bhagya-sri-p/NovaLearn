import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Bell, X } from 'lucide-react';

export default function PomodoroTimer({ isOpen, onClose }) {
  const [mode, setMode] = useState('focus'); // 'focus' (25m) or 'break' (5m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play gentle notification sound
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = mode === 'focus' ? 587.33 : 880; // D5 or A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (err) {
        console.warn('Audio chime unavailable', err);
      }
      alert(mode === 'focus' ? "🎉 Great job! 25-minute study sprint complete. Time for a 5-minute break!" : "⚡ Break's over! Ready to dive back into your learning session?");
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPct = ((totalTime - timeLeft) / totalTime) * 100;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{ padding: '28px', maxWidth: '420px', textAlign: 'center' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Pomodoro Study Sprint</h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div style={{
          display: 'inline-flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => switchMode('focus')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'focus' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'focus' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            25m Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'break' ? 'var(--cyan-accent)' : 'transparent',
              color: mode === 'break' ? '#0f172a' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            5m Break
          </button>
        </div>

        {/* Big Timer Display */}
        <div style={{
          fontSize: '3.8rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '-0.02em',
          color: mode === 'focus' ? 'var(--text-main)' : 'var(--cyan-accent)',
          marginBottom: '16px'
        }}>
          {formatTime(timeLeft)}
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '28px' }}>
          <div
            style={{
              height: '100%',
              background: mode === 'focus' ? 'var(--accent-gradient)' : 'linear-gradient(90deg, #06b6d4, #10b981)',
              width: `${progressPct}%`,
              transition: 'width 0.5s ease'
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          <button
            onClick={handleReset}
            className="btn-secondary"
            title="Reset Timer"
            style={{ padding: '10px 16px' }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-primary"
            style={{ padding: '10px 24px', minWidth: '120px' }}
          >
            {isRunning ? (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
