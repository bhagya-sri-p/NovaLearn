import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  ArrowRight, 
  BrainCircuit, 
  Calendar, 
  Download, 
  FileText,
  Filter,
  CheckCircle2,
  Trophy,
  Sparkles
} from 'lucide-react';

export default function LearningHistory({
  historyItems = [],
  quizHistory = [],
  onSelectTopic,
  onStartQuiz,
  onToggleBookmark,
  onDeleteItem,
  onClearHistory
}) {
  const [activeSubTab, setActiveSubTab] = useState('explanations'); // 'explanations' or 'quizzes'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Subject list
  const subjects = ['All', ...new Set(historyItems.map(i => i.subject).filter(Boolean))];

  // Filter explanations
  const filteredExplanations = historyItems.filter(item => {
    const matchesSearch = item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesBookmark = !showBookmarksOnly || item.bookmarked;
    return matchesSearch && matchesSubject && matchesBookmark;
  });

  // Export Markdown Notes
  const handleExportNotes = () => {
    if (historyItems.length === 0) return;
    let md = `# NovaLearn AI - My Learning Study Notes\nGenerated on: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    historyItems.forEach((item, idx) => {
      md += `## ${idx + 1}. ${item.topic} (${item.subject || 'General'} - ${item.difficulty || 'High School'})\n`;
      md += `*Date: ${new Date(item.timestamp).toLocaleString()}*\n\n`;
      md += `### Summary\n${item.summary}\n\n`;
      if (item.analogy) md += `### Analogy\n> ${item.analogy}\n\n`;
      md += `### Detailed Notes\n${item.explanation}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NovaLearn_Study_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
      {/* Top Header & Sub-Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
            Learning History & Study Log
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Review past concepts, export study summaries, and track completed quizzes.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportNotes}
            disabled={historyItems.length === 0}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Download size={15} />
            <span>Export Notes (.md)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your study history?")) {
                onClearHistory();
              }
            }}
            disabled={historyItems.length === 0 && quizHistory.length === 0}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', color: '#f43f5e' }}
          >
            <Trash2 size={15} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Explanations vs Quiz History */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveSubTab('explanations')}
          className={activeSubTab === 'explanations' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <FileText size={16} />
          <span>Explanations Log ({historyItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={activeSubTab === 'quizzes' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <Trophy size={16} />
          <span>Quiz Attempts ({quizHistory.length})</span>
        </button>
      </div>

      {/* Explanations View */}
      {activeSubTab === 'explanations' && (
        <>
          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search past topics or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px 8px 36px',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Subject Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 12px',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className="btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                background: showBookmarksOnly ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                borderColor: showBookmarksOnly ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
                color: showBookmarksOnly ? '#6ee7b7' : 'var(--text-secondary)'
              }}
            >
              <Bookmark size={14} />
              <span>Bookmarked Only</span>
            </button>
          </div>

          {/* List of Explanations */}
          {filteredExplanations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No matching learning topics found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try adjusting your search query or ask a new question above.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredExplanations.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'border-color 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{item.subject || 'General'}</span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{item.difficulty || 'High School'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={() => onToggleBookmark(item.id)}
                          title="Toggle Bookmark"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: item.bookmarked ? '#10b981' : 'var(--text-muted)' }}
                        >
                          {item.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          title="Delete from History"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Topic Title */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                      {item.topic}
                    </h3>

                    {/* Summary preview */}
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.summary}
                    </p>
                  </div>

                  {/* Bottom Footer Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {formatDate(item.timestamp)}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => onStartQuiz(item.topic, item.subject, item.difficulty)}
                        className="btn-ghost"
                        title="Take quiz on this topic"
                        style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                      >
                        <BrainCircuit size={14} color="#a855f7" />
                        <span>Quiz</span>
                      </button>

                      <button
                        onClick={() => onSelectTopic(item)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      >
                        <span>Study</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Quiz History View */}
      {activeSubTab === 'quizzes' && (
        <div>
          {quizHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <Trophy size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No completed quizzes yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate and take your first quiz to track your mastery scores here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizHistory.map((q) => {
                const isPassing = q.percentage >= 60;
                return (
                  <div
                    key={q.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: isPassing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: isPassing ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPassing ? '#10b981' : '#f59e0b',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}>
                        {q.percentage}%
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>{q.subject || 'General'}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(q.timestamp)}</span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                          {q.topic}
                        </h4>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Score: <strong>{q.score}</strong> / {q.total} questions
                      </span>
                      <button
                        onClick={() => onStartQuiz(q.topic, q.subject, q.difficulty)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <BrainCircuit size={14} />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
