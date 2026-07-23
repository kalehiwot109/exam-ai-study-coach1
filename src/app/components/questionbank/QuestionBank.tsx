import { useState } from 'react';
import {
  Search, ChevronRight, ArrowLeft,
  Flame, PlayCircle, Flag, Target,
} from 'lucide-react';

// ─── Topic data ───────────────────────────────────────────────────────────────

interface TopicEntry { name: string; pct: number; questions: number }
interface SubjectTopics { subject: string; color: string; topics: TopicEntry[] }

const highImpactTopics: SubjectTopics[] = [
  {
    subject: 'Physics',
    color: 'bg-blue-500',
    topics: [
      { name: 'Electricity', pct: 18, questions: 46 },
      { name: 'Mechanics',   pct: 15, questions: 38 },
      { name: 'Optics',      pct: 12, questions: 30 },
    ],
  },
  {
    subject: 'Chemistry',
    color: 'bg-purple-500',
    topics: [
      { name: 'Organic Chemistry',    pct: 21, questions: 54 },
      { name: 'Stoichiometry',        pct: 16, questions: 41 },
      { name: 'Chemical Equilibrium', pct: 11, questions: 28 },
    ],
  },
  {
    subject: 'Mathematics',
    color: 'bg-green-500',
    topics: [
      { name: 'Calculus',    pct: 24, questions: 61 },
      { name: 'Functions',   pct: 17, questions: 43 },
      { name: 'Probability', pct: 10, questions: 26 },
    ],
  },
];
import { FreePractice } from '../practice/FreePractice';

// ─── Types ────────────────────────────────────────────────────────────────────

type QStatus = 'unattempted' | 'correct' | 'incorrect' | 'flagged';
type BrowseStep = 'subjects' | 'years' | 'grid';
type QBFrame = 'browse' | 'smart';

// ─── Subject data ─────────────────────────────────────────────────────────────

const subjects = [
  { name: 'Physics',     emoji: '⚡', total: 412 },
  { name: 'Chemistry',   emoji: '🧪', total: 388 },
  { name: 'Biology',     emoji: '🧬', total: 356 },
  { name: 'Mathematics', emoji: '📐', total: 520 },
  { name: 'English',     emoji: '📖', total: 298 },
  { name: 'History',     emoji: '🏛️', total: 244 },
  { name: 'Geography',   emoji: '🌍', total: 216 },
  { name: 'Civics',      emoji: '⚖️', total: 180 },
];

const years = [
  { label: 'Mixed Years', sub: 'All years combined', count: 412 },
  { label: '2024',        sub: '2024 Entrance Exam', count: 65 },
  { label: '2023',        sub: '2023 Entrance Exam', count: 60 },
  { label: '2022',        sub: '2022 Entrance Exam', count: 58 },
  { label: '2021',        sub: '2021 Entrance Exam', count: 55 },
  { label: '2020',        sub: '2020 Entrance Exam', count: 52 },
  { label: '2019',        sub: '2019 Entrance Exam', count: 50 },
  { label: '2018',        sub: '2018 Entrance Exam', count: 48 },
];

// Generate a realistic grid of 60 questions with mixed statuses
function generateGrid(subject: string, year: string): QStatus[] {
  const seed = subject.length + year.length;
  const patterns: QStatus[] = ['unattempted', 'correct', 'incorrect', 'flagged'];
  return Array.from({ length: 60 }, (_, i) => {
    const v = (i * 7 + seed * 3 + i * seed) % 17;
    if (i > 28) return 'unattempted';                 // beyond progress
    if (v === 0) return 'flagged';
    if (v <= 2)  return 'incorrect';
    if (v <= 9)  return 'correct';
    return 'unattempted';
  });
}


// ─── Browse: Frame 1 — Subject Selection ─────────────────────────────────────

function SubjectFrame({ onSelect }: { onSelect: (s: string) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Choose a Subject</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {subjects.map(({ name, emoji, total }) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="group bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <span className="text-2xl mb-3 block">{emoji}</span>
            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
              {name}
            </p>
            <p className="text-xs text-gray-400">{total} questions</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Browse: Frame 2 — Exam Year Selection ────────────────────────────────────

function YearFrame({
  subject,
  onSelect,
  onBack,
}: {
  subject: string;
  onSelect: (y: string) => void;
  onBack: () => void;
}) {
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Subjects', onClick: onBack }, { label: subject }]} />

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Choose an Exam Year
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {years.map(({ label, sub, count }) => {
          const isMixed = label === 'Mixed Years';
          return (
            <button
              key={label}
              onClick={() => onSelect(label)}
              className={`group bg-white border rounded-xl p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all duration-150 active:scale-[0.98]
                ${isMixed ? 'border-blue-200 col-span-2 sm:col-span-1' : 'border-gray-200'}`}
            >
              <p className={`text-xl font-bold mb-1 transition-colors group-hover:text-blue-700
                ${isMixed ? 'text-blue-600' : 'text-gray-900'}`}>
                {label}
              </p>
              <p className="text-xs text-gray-400 mb-3">{sub}</p>
              <p className="text-xs font-medium text-gray-500">{count} questions</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Browse: Frame 3 — Question Grid ─────────────────────────────────────────

const statusStyles: Record<QStatus, { cell: string; label: string; dot: string }> = {
  unattempted: {
    cell:  'bg-white border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600',
    label: 'Not Attempted',
    dot:   'bg-gray-300',
  },
  correct: {
    cell:  'bg-green-50 border-green-300 text-green-700 hover:bg-green-100',
    label: 'Correct',
    dot:   'bg-green-500',
  },
  incorrect: {
    cell:  'bg-red-50 border-red-300 text-red-600 hover:bg-red-100',
    label: 'Incorrect',
    dot:   'bg-red-400',
  },
  flagged: {
    cell:  'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100',
    label: 'Flagged',
    dot:   'bg-amber-400',
  },
};

// ─── Shared: Question Grid (reused across Browse and Smart Practice) ──────────

function QuestionGrid({
  seed,
  onOpenQuestion,
}: {
  seed: string;          // used to generate deterministic status pattern
  onOpenQuestion: (index: number, total: number) => void;
}) {
  const grid = generateGrid(seed, seed);

  const counts = {
    correct:     grid.filter(s => s === 'correct').length,
    incorrect:   grid.filter(s => s === 'incorrect').length,
    flagged:     grid.filter(s => s === 'flagged').length,
    unattempted: grid.filter(s => s === 'unattempted').length,
  };

  return (
    <>
      {/* Progress summary */}
      <div className="flex items-center gap-6 mb-6 flex-wrap">
        {(Object.entries(counts) as [QStatus, number][]).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusStyles[status].dot}`} />
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{count}</span> {statusStyles[status].label}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))' }}>
          {grid.map((status, i) => (
            <button
              key={i}
              onClick={() => onOpenQuestion(i, grid.length)}
              title={`Question ${i + 1} — ${statusStyles[status].label}`}
              className={`relative aspect-square flex items-center justify-center rounded-lg border text-xs font-bold transition-all duration-100 active:scale-95
                ${statusStyles[status].cell}`}
            >
              {status === 'flagged'
                ? <Flag className="w-3 h-3" strokeWidth={2.5} />
                : i + 1
              }
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 flex-wrap">
        {(['unattempted', 'correct', 'incorrect', 'flagged'] as QStatus[]).map(status => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded flex-shrink-0 border
              ${status === 'unattempted' ? 'bg-white border-gray-300'
              : status === 'correct'    ? 'bg-green-50 border-green-300'
              : status === 'incorrect'  ? 'bg-red-50 border-red-300'
              :                           'bg-amber-50 border-amber-300'}`}
            />
            <span className="text-xs text-gray-500">{statusStyles[status].label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function GridFrame({
  subject,
  year,
  onBack,
  onBackToSubjects,
  onOpenQuestion,
}: {
  subject: string;
  year: string;
  onBack: () => void;
  onBackToSubjects: () => void;
  onOpenQuestion: (index: number, total: number) => void;
}) {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Subjects', onClick: onBackToSubjects },
          { label: subject, onClick: onBack },
          { label: year },
        ]}
      />
      <QuestionGrid seed={subject + year} onOpenQuestion={onOpenQuestion} />
    </div>
  );
}

// ─── Topic Grid Frame (entry from Smart Practice → High-Impact Topics) ────────

function TopicGridFrame({
  subject,
  topic,
  questions,
  onBack,
  onOpenQuestion,
}: {
  subject: string;
  topic: string;
  questions: number;
  onBack: () => void;
  onOpenQuestion: (index: number, total: number) => void;
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Back
      </button>
      <Breadcrumb
        items={[
          { label: 'Smart Practice', onClick: onBack },
          { label: 'High-Impact Topics', onClick: onBack },
          { label: subject },
          { label: topic },
        ]}
      />

      {/* Topic header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{topic}</h2>
        <p className="text-sm text-gray-500">
          Questions from Ethiopian University Entrance Exams across multiple years.
        </p>
      </div>

      {/* Summary stats */}
      <div className="flex items-center gap-6 mb-8 flex-wrap">
        {[
          { label: 'Questions',      value: `${questions}` },
          { label: 'Years Included', value: '2018 – 2024' },
          { label: 'Subject',        value: subject },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl px-5 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <QuestionGrid seed={subject + topic} onOpenQuestion={onOpenQuestion} />
    </div>
  );
}

// ─── Shared: Breadcrumb ───────────────────────────────────────────────────────

function Breadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-sm font-semibold text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Smart Practice ───────────────────────────────────────────────────────────

function SmartPracticeFrame({
  onTopicSelect,
}: {
  onTopicSelect: (subject: string, topic: string, questions: number) => void;
}) {
  return (
    <div className="max-w-2xl space-y-4">

      {/* Card 1 — High-Impact Topics */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">🎯 High-Impact Topics</h3>
        </div>
        <p className="text-xs text-gray-400 mb-6 pl-[52px]">Based on multi-year entrance exam trends.</p>

        {/* Subject groups — each topic row is clickable */}
        <div className="space-y-6">
          {highImpactTopics.map(({ subject, color, topics }) => (
            <div key={subject}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{subject}</p>
              <div className="space-y-1">
                {topics.map(({ name, pct, questions }) => (
                  <button
                    key={name}
                    onClick={() => onTopicSelect(subject, name, questions)}
                    className="w-full group text-left rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                        {name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400 tabular-nums">{pct}%</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2 — Review Mistakes */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-200 hover:shadow-sm transition-all duration-150">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-red-500" strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Review Mistakes</h3>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Practice questions you answered incorrectly in previous sessions.
        </p>

        <div className="flex items-center gap-6 mb-7">
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">24</p>
            <p className="text-xs text-gray-400 mt-1">Questions</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">36 min</p>
            <p className="text-xs text-gray-400 mt-1">Est. Study Time</p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors active:scale-[0.98]">
          <PlayCircle className="w-4 h-4" strokeWidth={2} />
          Continue Practice
        </button>
      </div>

    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface FreePracticeState {
  subject: string;
  year: string;
  startIndex: number;
  total: number;
}

interface TopicViewState {
  subject: string;
  topic: string;
  questions: number;
}

export function QuestionBank() {
  const [tab, setTab]                   = useState<QBFrame>('browse');
  const [browseStep, setBrowseStep]     = useState<BrowseStep>('subjects');
  const [selectedSubject, setSubject]   = useState('');
  const [selectedYear, setYear]         = useState('');
  const [search, setSearch]             = useState('');
  const [freePractice, setFreePractice] = useState<FreePracticeState | null>(null);
  const [topicView, setTopicView]       = useState<TopicViewState | null>(null);

  function handleSelectSubject(s: string) { setSubject(s); setBrowseStep('years'); }
  function handleSelectYear(y: string)    { setYear(y); setBrowseStep('grid'); }
  function goToSubjects() { setBrowseStep('subjects'); setSubject(''); setYear(''); }
  function goToYears()    { setBrowseStep('years'); setYear(''); }

  function handleOpenQuestion(index: number, total: number) {
    const subject = topicView ? topicView.topic : selectedSubject;
    const year    = topicView ? topicView.subject : selectedYear;
    setFreePractice({ subject, year, startIndex: index, total });
  }

  // Free Practice takes over the full view
  if (freePractice) {
    return (
      <FreePractice
        subject={freePractice.subject}
        year={freePractice.year}
        startIndex={freePractice.startIndex}
        totalInYear={freePractice.total}
        onBack={() => setFreePractice(null)}
      />
    );
  }

  // Topic Grid (from Smart Practice → High-Impact Topics)
  if (topicView) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-4 lg:p-8 max-w-5xl">
          <TopicGridFrame
            subject={topicView.subject}
            topic={topicView.topic}
            questions={topicView.questions}
            onBack={() => setTopicView(null)}
            onOpenQuestion={handleOpenQuestion}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 lg:p-8 max-w-5xl">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Question Bank</h1>
          <p className="text-sm text-gray-500">
            {tab === 'browse'
              ? 'Choose a subject and exam year to begin practicing.'
              : 'Let StudyStreak recommend the best questions for you.'}
          </p>
        </div>

        {/* Search — only on subjects frame */}
        {tab === 'browse' && browseStep === 'subjects' && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search chapters or concepts..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        )}

        {/* Back button for year/grid frames */}
        {tab === 'browse' && browseStep !== 'subjects' && (
          <button
            onClick={browseStep === 'years' ? goToSubjects : goToYears}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back
          </button>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
          {([
            { key: 'browse', label: 'Browse' },
            { key: 'smart',  label: '🎯 Smart Practice' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                ${tab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'browse' && browseStep === 'subjects' && (
          <SubjectFrame onSelect={handleSelectSubject} />
        )}
        {tab === 'browse' && browseStep === 'years' && (
          <YearFrame
            subject={selectedSubject}
            onSelect={handleSelectYear}
            onBack={goToSubjects}
          />
        )}
        {tab === 'browse' && browseStep === 'grid' && (
          <GridFrame
            subject={selectedSubject}
            year={selectedYear}
            onBack={goToYears}
            onBackToSubjects={goToSubjects}
            onOpenQuestion={handleOpenQuestion}
          />
        )}
        {tab === 'smart' && (
          <SmartPracticeFrame
            onTopicSelect={(subject, topic, questions) =>
              setTopicView({ subject, topic, questions })
            }
          />
        )}

      </main>
    </div>
  );
}
