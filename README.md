# NovaLearn AI — AI Student Learning Assistant 🎓⚡

A modern, full-stack educational web application designed to accelerate student learning with adaptive conceptual explanations, interactive quiz generation with instant rationale, active-recall flashcards, and personalized study history analytics.

---

## 🌟 Key Features

1. **Question Input & Concept Exploration**:
   - Multi-subject selector pills (Physics, Mathematics, Computer Science, Biology, Chemistry, History, Literature, General).
   - Grade & rigor selector (Middle School, High School, College / Undergrad, Advanced Research).
   - Pedagogical tone styles (Intuitive & Visual, Explain Like I'm 5, Academic & Rigorous, Socratic).
   - Quick inspiration prompts to explore complex topics in one click.

2. **Multi-Layered AI Explanations**:
   - **Executive Overview**: High-yield 2-sentence concept synthesis.
   - **Intuitive Metaphor & Analogy**: Real-world visual model that makes difficult concepts immediately graspable.
   - **KaTeX Mathematical Proofs**: Native LaTeX math formulas ($...$ and $$...$$) rendered via KaTeX.
   - **Structured Markdown Breakdown**: Deep step-by-step principles and scientific mechanics.
   - **Key Mastery Pillars**: Core concept tags.
   - **Exam Pitfalls & Traps**: Common misconceptions that lead students to lose marks.
   - **Audio Tutor (Read Aloud)**: Web Speech API synthesis for hands-free audio listening.
   - **Interactive Follow-up Questions**: Continue asking specific questions directly attached to the topic.

3. **Pomodoro Study Sprint Timer**:
   - Built-in 25-minute Focus and 5-minute Break cycles.
   - Interactive progress bar, time formatting, and auditory chimes.

4. **Interactive Quiz Generator & Runner**:
   - Generates customized multiple-choice practice quizzes (3, 5, or 8 questions).
   - Live question progress tracker & elapsed study timer.
   - Instant answer feedback with color-coded evaluation and comprehensive explanations for every option.
   - Score scorecard with celebration confetti animations for high scores (>= 70%).

4. **Active Recall Flashcards (3D Flip Cards)**:
   - 3D interactive flip cards with concept prompts on the front, key takeaways on the back, and optional hints.

5. **Learning History & Study Log**:
   - Complete persistent history of past asked questions, lessons, and quiz attempts.
   - Search by keyword or filter by subject and bookmarked topics.
   - One-click **Markdown Export** (`.md`) to download study notes for offline revision.

6. **Study Analytics & Mastery Dashboard**:
   - Daily study streak counter (🔥).
   - Average quiz mastery score gauge.
   - Subject focus breakdown chart.

7. **Flexible AI Engine (Google Gemini Cloud + Fallback)**:
   - Built-in curriculum-aligned knowledge engine for instant offline/zero-config operation.
   - Optional custom Google Gemini API Key input (stored locally in browser `localStorage`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Run Both Servers Locally

Both servers are currently configured and running:
- **Backend Server**: `http://localhost:5000`
- **Frontend Client**: `http://localhost:5173`

To start manually in the future:
```bash
# Terminal 1: Start Backend (Port 5000)
npm run server

# Terminal 2: Start Frontend (Port 5173)
npm run client
```

Or run both concurrently:
```bash
npm run dev
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Vanilla CSS Design System, Lucide React, React Markdown, Remark GFM, Canvas Confetti.
- **Backend**: Node.js, Express 4, CORS, Dotenv, Google Generative AI SDK (`@google/generative-ai`), UUID, file-based persistent JSON storage.
