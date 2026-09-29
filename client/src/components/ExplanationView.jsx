import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  VolumeX, 
  BrainCircuit, 
  Layers, 
  Copy, 
  Check, 
  AlertTriangle, 
  Quote, 
  Sparkles,
  Send,
  HelpCircle,
  Share2
} from 'lucide-react';

export default function ExplanationView({ 
  explanationData, 
  onToggleBookmark, 
  onStartQuiz, 
  onOpenFlashcards,
  onAskFollowUp,
  isFollowUpLoading = false
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState('');

  if (!explanationData) return null;

  const {
    id,
    topic,
    subject,
    difficulty,
    style,
    summary,
    explanation,
    analogy,
    keyConcepts = [],
    commonMistakes = [],
    bookmarked = false
  } = explanationData;

  // Copy to clipboard
  const handleCopy = () => {
    const textToCopy = `# ${topic} (${subject})\n\n## Summary\n${summary}\n\n## Analogy\n${analogy}\n\n## Explanation\n${explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text to Speech
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = `${topic}. ${summary}. Real world analogy: ${analogy}. ${explanation.replace(/#/g, '').replace(/\*/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (!followUpQuery.trim() || isFollowUpLoading) return;
    onAskFollowUp(`Regarding "${topic}": ${followUpQuery.trim()}`, subject, difficulty);
    setFollowUpQuery('');
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', marginBottom: '32px' }}>
      {/* Top Meta Header & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className="badge badge-indigo">{subject || 'General'}</span>
            <span className="badge badge-cyan">{difficulty || 'High School'}</span>
            {style && <span className="badge badge-emerald">{style}</span>}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {topic}
          </h2>
        </div>

        {/* Action Buttons Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Read Aloud Button */}
          <button
            onClick={handleToggleSpeech}
            className="btn-secondary"
            title={isSpeaking ? "Stop Read Aloud" : "Read Explanation Aloud"}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {isSpeaking ? <VolumeX size={16} color="#f43f5e" /> : <Volume2 size={16} color="#38bdf8" />}
            <span>{isSpeaking ? "Stop Audio" : "Listen"}</span>
          </button>

          {/* Flashcards Button */}
          <button
            onClick={() => onOpenFlashcards(topic, subject)}
            className="btn-secondary"
            title="Generate Study Flashcards"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <Layers size={16} color="#a855f7" />
            <span>Flashcards</span>
          </button>

          {/* Practice Quiz Button */}
          <button
            onClick={() => onStartQuiz(topic, subject, difficulty)}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <BrainCircuit size={16} />
            <span>Take Quiz</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(id)}
            className="btn-secondary"
            title={bookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
            style={{ padding: '8px 10px' }}
          >
            {bookmarked ? (
              <BookmarkCheck size={18} color="#10b981" />
            ) : (
              <Bookmark size={18} color="var(--text-secondary)" />
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="btn-secondary"
            title="Copy Notes to Clipboard"
            style={{ padding: '8px 10px' }}
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} color="var(--text-secondary)" />}
          </button>
        </div>
      </div>

      {/* 1. Executive Summary Box */}
      <div style={{
        marginTop: '24px',
        background: 'rgba(99, 102, 241, 0.08)',
        borderLeft: '4px solid var(--accent-primary)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        padding: '18px 22px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
            Executive Overview
          </h4>
        </div>
        <p style={{ fontSize: '1.02rem', lineHeight: '1.65', color: 'var(--text-main)', margin: 0 }}>
          {summary}
        </p>
      </div>

      {/* 2. Real-World Analogy Spotlight */}
      {analogy && (
        <div style={{
          marginTop: '22px',
          background: 'rgba(6, 182, 212, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Quote size={18} color="var(--cyan-accent)" />
            <h4 style={{ fontSize: '0.9rem', color: '#67e8f9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Intuitive Metaphor & Analogy
            </h4>
          </div>
          <p style={{
            fontSize: '0.98rem',
            fontStyle: 'italic',
            lineHeight: '1.7',
            color: 'var(--text-main)',
            margin: 0
          }}>
            "{analogy}"
          </p>
        </div>
      )}

      {/* 3. Deep Step-by-Step Breakdown (Markdown) */}
      <div style={{ marginTop: '28px' }}>
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {explanation}
          </ReactMarkdown>
        </div>
      </div>

      {/* 4. Core Concepts Tags */}
      {keyConcepts && keyConcepts.length > 0 && (
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <label style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: '10px'
          }}>
            Key Mastery Pillars
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {keyConcepts.map((kc, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: 'var(--text-main)'
                }}
              >
                ✦ {kc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Common Misconceptions & Traps */}
      {commonMistakes && commonMistakes.length > 0 && (
        <div style={{
          marginTop: '24px',
          background: 'rgba(244, 63, 94, 0.05)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertTriangle size={18} color="var(--danger)" />
            <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fda4af' }}>
              Common Pitfalls to Avoid in Exams
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {commonMistakes.map((cm, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {cm}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Ask Follow-up Question Box */}
      <div style={{
        marginTop: '32px',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <HelpCircle size={16} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
            Have a follow-up question on this topic?
          </h4>
        </div>
        <form onSubmit={handleFollowUpSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            disabled={isFollowUpLoading}
            placeholder="e.g. Can you clarify step 2? Or what happens if resistance is doubled?"
            style={{
              flex: '1',
              minWidth: '240px',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '0.92rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!followUpQuery.trim() || isFollowUpLoading}
            className="btn-primary"
            style={{ padding: '10px 18px' }}
          >
            {isFollowUpLoading ? (
              <span>Thinking...</span>
            ) : (
              <>
                <Send size={15} />
                <span>Ask Follow-up</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
