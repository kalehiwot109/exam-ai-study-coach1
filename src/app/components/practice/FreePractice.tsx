import { useState } from 'react';
import {
  ChevronDown, ChevronUp, CheckCircle2, XCircle,
  ArrowRight, ArrowLeft, ChevronRight, Flag, Sparkles,
} from 'lucide-react';

// ─── Shared question bank questions ──────────────────────────────────────────
// These are the same physics questions used in Practice.tsx

interface Question {
  id: number;
  topic: string;
  text: string;
  options: { letter: string; text: string }[];
  correct: string;
  explanation: string;
  misconception: string;
  takeaway: string;
}

const bankQuestions: Question[] = [
  {
    id: 1,
    topic: 'Electricity',
    text: 'A charge of 6 coulombs passes through a wire in 3 seconds. What is the electric current?',
    options: [
      { letter: 'A', text: '18 A' },
      { letter: 'B', text: '0.5 A' },
      { letter: 'C', text: '2 A' },
      { letter: 'D', text: '3 A' },
    ],
    correct: 'C',
    explanation: 'Electric current I = Q ÷ t = 6 ÷ 3 = 2 A. Current is the rate at which charge flows through a conductor.',
    misconception: 'Students often multiply Q × t instead of dividing. Remember: current measures how fast charge flows, so you divide charge by time.',
    takeaway: 'I = Q / t — Current equals charge divided by time.',
  },
  {
    id: 2,
    topic: 'Resistance',
    text: 'A resistor has 12 V across it and 0.5 A flowing through it. What is its resistance?',
    options: [
      { letter: 'A', text: '6 Ω' },
      { letter: 'B', text: '24 Ω' },
      { letter: 'C', text: '0.04 Ω' },
      { letter: 'D', text: '12 Ω' },
    ],
    correct: 'B',
    explanation: "Using Ohm's Law: R = V ÷ I = 12 ÷ 0.5 = 24 Ω.",
    misconception: 'Students often write R = I / V instead of R = V / I. Voltage always goes in the numerator.',
    takeaway: "R = V / I — Resistance equals voltage divided by current (Ohm's Law).",
  },
  {
    id: 3,
    topic: 'Circuits',
    text: 'Two resistors of 4 Ω and 6 Ω are connected in series. What is the total resistance?',
    options: [
      { letter: 'A', text: '2.4 Ω' },
      { letter: 'B', text: '24 Ω' },
      { letter: 'C', text: '10 Ω' },
      { letter: 'D', text: '5 Ω' },
    ],
    correct: 'C',
    explanation: 'In a series circuit, total resistance R = R₁ + R₂ = 4 + 6 = 10 Ω.',
    misconception: 'Students confuse series and parallel. In parallel you use the reciprocal formula. In series you simply add all resistances.',
    takeaway: 'Series: R_total = R₁ + R₂ — just add all resistances together.',
  },
  {
    id: 4,
    topic: 'Circuits',
    text: 'Two resistors of 6 Ω and 3 Ω are connected in parallel. What is the equivalent resistance?',
    options: [
      { letter: 'A', text: '9 Ω' },
      { letter: 'B', text: '0.5 Ω' },
      { letter: 'C', text: '18 Ω' },
      { letter: 'D', text: '2 Ω' },
    ],
    correct: 'D',
    explanation: '1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6, so R = 2 Ω.',
    misconception: 'Students add resistances directly. For parallel circuits always use the reciprocal formula.',
    takeaway: '1/R_total = 1/R₁ + 1/R₂ for parallel circuits.',
  },
  {
    id: 5,
    topic: 'Electricity',
    text: 'A 60 W bulb is connected to a 120 V supply. What current flows through it?',
    options: [
      { letter: 'A', text: '2 A' },
      { letter: 'B', text: '7200 A' },
      { letter: 'C', text: '0.5 A' },
      { letter: 'D', text: '60 A' },
    ],
    correct: 'C',
    explanation: 'P = V × I, so I = P ÷ V = 60 ÷ 120 = 0.5 A.',
    misconception: 'Students multiply P × V instead of dividing. Always rearrange P = VI to get I = P / V.',
    takeaway: 'I = P / V — Power divided by voltage gives current.',
  },
];

type FPStep = 'question' | 'correct' | 'incorrect';

interface FreePracticeProps {
  subject: string;
  year: string;
  startIndex: number;  // 0-based index into the grid (e.g. 17 for Q18)
  totalInYear: number; // total questions in this year set
  onBack: () => void;
}

// ─── FreePractice ─────────────────────────────────────────────────────────────

export function FreePractice({ subject, year, startIndex, totalInYear, onBack }: FreePracticeProps) {
  const [qIndex, setQIndex] = useState(startIndex);           // position in full year set
  const [step, setStep]     = useState<FPStep>('question');
  const [selected, setSelected] = useState<string | null>(null);
  const [flagged, setFlagged]   = useState<Set<number>>(new Set());

  // Map grid position to our demo question pool (cyclic)
  const q = bankQuestions[qIndex % bankQuestions.length];
  const displayNumber = qIndex + 1;
  const isFlagged = flagged.has(qIndex);

  function handleSubmit() {
    if (!selected) return;
    setStep(selected === q.correct ? 'correct' : 'incorrect');
  }

  function handleNext() {
    setSelected(null);
    setStep('question');
    setQIndex(i => Math.min(i + 1, totalInYear - 1));
  }

  function handlePrev() {
    setSelected(null);
    setStep('question');
    setQIndex(i => Math.max(i - 1, 0));
  }

  function toggleFlag() {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(qIndex) ? next.delete(qIndex) : next.add(qIndex);
      return next;
    });
  }

  const yearLabel = year === 'Mixed Years' ? 'Ethiopian University Entrance Examination' : `${year} Ethiopian University Entrance Examination`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">

        {/* Breadcrumb + back link */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1.5 text-sm">
            <button
              onClick={onBack}
              className="font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              Question Bank
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />
            <span className="text-gray-400">{subject}</span>
            {year !== 'Mixed Years' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />
                <span className="text-gray-400">{year}</span>
              </>
            )}
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Back to Question Bank
          </button>
        </div>

        {/* Context header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">{subject}</p>
          <h2 className="text-lg font-bold text-gray-900">{yearLabel}</h2>
        </div>

        {/* Question number + nav row */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-400">
            Question {displayNumber} of {totalInYear}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={qIndex === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={qIndex >= totalInYear - 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                ${isFlagged
                  ? 'border-amber-300 bg-amber-50 text-amber-600'
                  : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                }`}
            >
              <Flag className="w-3.5 h-3.5" strokeWidth={2} />
              {isFlagged ? 'Flagged' : 'Flag'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${((qIndex + 1) / totalInYear) * 100}%` }}
          />
        </div>

        {/* ── Question state ── */}
        {step === 'question' && (
          <>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">{q.topic}</p>
            <h3 className="text-xl font-semibold text-gray-900 leading-relaxed mb-8">{q.text}</h3>

            <div className="space-y-3 mb-8">
              {q.options.map(({ letter, text }) => {
                const active = selected === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => setSelected(letter)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150
                      ${active
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                      ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {letter}
                    </span>
                    <span className={`text-sm font-medium transition-colors ${active ? 'text-blue-700' : 'text-gray-700'}`}>
                      {text}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
            >
              Submit Answer
            </button>
          </>
        )}

        {/* ── Correct state ── */}
        {step === 'correct' && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Correct!</h3>
                <p className="text-sm text-gray-500">Excellent work.</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {q.options.map(({ letter, text }) => {
                const isCorrect = letter === q.correct;
                return (
                  <div
                    key={letter}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border
                      ${isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-white opacity-50'}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> : letter}
                    </span>
                    <span className={`text-sm font-medium ${isCorrect ? 'text-green-800' : 'text-gray-400'}`}>{text}</span>
                    {isCorrect && <span className="ml-auto text-xs font-semibold text-green-600">Correct</span>}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={qIndex >= totalInYear - 1}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
            >
              Next Question <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </>
        )}

        {/* ── Incorrect state ── */}
        {step === 'incorrect' && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-400" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Incorrect</h3>
                <p className="text-sm text-gray-500">That's okay — let's learn from it.</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {q.options.map(({ letter, text }) => {
                const isCorrect = letter === q.correct;
                const isWrong   = letter === selected && !isCorrect;
                let containerClass = 'border-gray-100 bg-white opacity-40';
                let badgeClass     = 'bg-gray-100 text-gray-400';
                let textClass      = 'text-gray-400';
                let label          = '';
                if (isWrong)    { containerClass = 'border-red-300 bg-red-50';   badgeClass = 'bg-red-500 text-white';   textClass = 'text-red-800';   label = 'Your answer'; }
                if (isCorrect)  { containerClass = 'border-green-300 bg-green-50'; badgeClass = 'bg-green-500 text-white'; textClass = 'text-green-800'; label = 'Correct answer'; }
                return (
                  <div key={letter} className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${containerClass}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${badgeClass}`}>{letter}</span>
                    <span className={`text-sm font-medium flex-1 ${textClass}`}>{text}</span>
                    {label && <span className={`text-xs font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>{label}</span>}
                  </div>
                );
              })}
            </div>

            {/* Expandable AI explanation */}
            <ExpandableExplanation question={q} />

            <button
              onClick={handleNext}
              disabled={qIndex >= totalInYear - 1}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
            >
              Continue
            </button>
          </>
        )}

      </div>
    </div>
  );
}

// ─── Expandable AI Explanation (same as Practice.tsx IncorrectScreen) ─────────

function ExpandableExplanation({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-500" strokeWidth={1.75} />
          <span className="text-sm font-semibold text-gray-800">AI Explanation</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" strokeWidth={2} />
          : <div className="flex items-center gap-1 text-gray-400">
              <span className="text-xs font-medium">Show Explanation</span>
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            </div>
        }
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Explanation</p>
            <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Why Students Often Get This Wrong</p>
            <p className="text-sm text-gray-700 leading-relaxed">{question.misconception}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Key Takeaway</p>
            <p className="text-sm font-semibold text-blue-800">{question.takeaway}</p>
          </div>
        </div>
      )}
    </div>
  );
}
