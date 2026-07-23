import { useState } from "react";
import {
  Clock,
  Zap,
  BarChart2,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Play,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step =
  | "overview"
  | "question"
  | "correct"
  | "incorrect"
  | "complete"
  | "report"
  | "reflection";

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

interface Answer {
  questionId: number;
  selected: string;
  correct: boolean;
  topic: string;
}

interface PracticeProps {
  onExit: () => void;
}

// ─── Questions ────────────────────────────────────────────────────────────────

const questions: Question[] = [
  {
    id: 1,
    topic: "Electricity",
    text: "A charge of 6 coulombs passes through a wire in 3 seconds. What is the electric current?",
    options: [
      { letter: "A", text: "18 A" },
      { letter: "B", text: "0.5 A" },
      { letter: "C", text: "2 A" },
      { letter: "D", text: "3 A" },
    ],
    correct: "C",
    explanation:
      "Electric current I = Q ÷ t = 6 ÷ 3 = 2 A. Current is the rate at which charge flows through a conductor.",
    misconception:
      "Students often multiply Q × t instead of dividing. Remember: current measures how fast charge flows, so you divide charge by time.",
    takeaway:
      "I = Q / t — Current equals charge divided by time.",
  },
  {
    id: 2,
    topic: "Resistance",
    text: "A resistor has 12 V across it and 0.5 A flowing through it. What is its resistance?",
    options: [
      { letter: "A", text: "6 Ω" },
      { letter: "B", text: "24 Ω" },
      { letter: "C", text: "0.04 Ω" },
      { letter: "D", text: "12 Ω" },
    ],
    correct: "B",
    explanation:
      "Using Ohm's Law: R = V ÷ I = 12 ÷ 0.5 = 24 Ω.",
    misconception:
      "Students often write R = I / V instead of R = V / I. Voltage always goes in the numerator.",
    takeaway:
      "R = V / I — Resistance equals voltage divided by current (Ohm's Law).",
  },
  {
    id: 3,
    topic: "Circuits",
    text: "Two resistors of 4 Ω and 6 Ω are connected in series. What is the total resistance?",
    options: [
      { letter: "A", text: "2.4 Ω" },
      { letter: "B", text: "24 Ω" },
      { letter: "C", text: "10 Ω" },
      { letter: "D", text: "5 Ω" },
    ],
    correct: "C",
    explanation:
      "In a series circuit, total resistance R = R₁ + R₂ = 4 + 6 = 10 Ω.",
    misconception:
      "Students confuse series and parallel. In parallel you use the reciprocal formula. In series you simply add all resistances.",
    takeaway:
      "Series: R_total = R₁ + R₂ — just add all resistances together.",
  },
  {
    id: 4,
    topic: "Circuits",
    text: "Two resistors of 6 Ω and 3 Ω are connected in parallel. What is the equivalent resistance?",
    options: [
      { letter: "A", text: "9 Ω" },
      { letter: "B", text: "0.5 Ω" },
      { letter: "C", text: "18 Ω" },
      { letter: "D", text: "2 Ω" },
    ],
    correct: "D",
    explanation:
      "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6, so R = 2 Ω.",
    misconception:
      "Students add resistances directly. For parallel circuits always use the reciprocal formula.",
    takeaway: "1/R_total = 1/R₁ + 1/R₂ for parallel circuits.",
  },
  {
    id: 5,
    topic: "Electricity",
    text: "A 60 W bulb is connected to a 120 V supply. What current flows through it?",
    options: [
      { letter: "A", text: "2 A" },
      { letter: "B", text: "7200 A" },
      { letter: "C", text: "0.5 A" },
      { letter: "D", text: "60 A" },
    ],
    correct: "C",
    explanation: "P = V × I, so I = P ÷ V = 60 ÷ 120 = 0.5 A.",
    misconception:
      "Students multiply P × V instead of dividing. Always rearrange P = VI to get I = P / V.",
    takeaway:
      "I = P / V — Power divided by voltage gives current.",
  },
];

const DISPLAYED_TOTAL = 20;

// ─── Shared Layout ────────────────────────────────────────────────────────────

function Screen({
  children,
  centered = true,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={`min-h-screen bg-gray-50 flex ${centered ? "items-center justify-center" : "items-start justify-center"} py-12 px-4`}
    >
      {children}
    </div>
  );
}

// ─── Frame 1: Mission Overview ────────────────────────────────────────────────

function MissionOverview({ onStart }: { onStart: () => void }) {
  const topics = ["Electricity", "Circuits", "Resistance"];

  return (
    <Screen>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-4 uppercase tracking-widest">
            Today's Mission
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
            Physics
          </h1>
          <p className="text-sm text-gray-400">
            Prepare yourself — you're about to begin.
          </p>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
          <InfoRow
            icon={
              <BookOpen
                className="w-4 h-4 text-blue-500"
                strokeWidth={1.75}
              />
            }
            label="Questions"
            value="20 Questions"
          />
          <InfoRow
            icon={
              <Clock
                className="w-4 h-4 text-blue-500"
                strokeWidth={1.75}
              />
            }
            label="Estimated Time"
            value="35 Minutes"
          />
          <InfoRow
            icon={
              <BarChart2
                className="w-4 h-4 text-blue-500"
                strokeWidth={1.75}
              />
            }
            label="Difficulty"
            value="Medium"
          />

          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <Zap
                className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Topics Covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
            <Star
              className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0"
              strokeWidth={1.75}
            />
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                Mission Reward
              </p>
              <p className="text-sm font-bold text-amber-600">
                +120 XP
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-white" />
          Start Now
        </button>
      </div>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Frame 2: Question Screen ─────────────────────────────────────────────────

function QuestionScreen({
  question,
  index,
  selected,
  onSelect,
  onSubmit,
  onSkip,
}: {
  question: Question;
  index: number;
  selected: string | null;
  onSelect: (l: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}) {
  const progress = (index / DISPLAYED_TOTAL) * 100;

  return (
    <Screen centered={false}>
      <div className="w-full max-w-2xl pt-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">
              Question {index + 1} of {DISPLAYED_TOTAL}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">
                Physics
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
                Medium
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Topic */}
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
          {question.topic}
        </p>

        {/* Question text */}
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-8">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map(({ letter, text }) => {
            const active = selected === letter;
            return (
              <button
                key={letter}
                onClick={() => onSelect(letter)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150
                  ${
                    active
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                  ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {letter}
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${active ? "text-blue-700" : "text-gray-700"}`}
                >
                  {text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSubmit}
            disabled={!selected}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
          >
            Submit Answer
          </button>
          <button
            onClick={onSkip}
            className="px-5 py-3.5 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-medium text-sm rounded-xl transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </Screen>
  );
}

// ─── Frame 3: Correct Answer ──────────────────────────────────────────────────

function CorrectScreen({
  question,
  selected,
  onNext,
}: {
  question: Question;
  selected: string;
  onNext: () => void;
}) {
  return (
    <Screen centered={false}>
      <div className="w-full max-w-2xl pt-4">
        {/* Status */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2
              className="w-5 h-5 text-green-500"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Correct!
            </h2>
            <p className="text-sm text-gray-500">
              Excellent work.
            </p>
          </div>
          <span className="ml-auto px-3 py-1.5 bg-amber-50 text-amber-700 font-bold text-sm rounded-full">
            +8 XP
          </span>
        </div>

        {/* Options — show correct highlighted green */}
        <div className="space-y-3 mb-8">
          {question.options.map(({ letter, text }) => {
            const isCorrect = letter === question.correct;
            const wasSelected = letter === selected;
            return (
              <div
                key={letter}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border
                  ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-gray-100 bg-white opacity-50"
                  }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${isCorrect ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      className="w-4 h-4"
                      strokeWidth={2.5}
                    />
                  ) : (
                    letter
                  )}
                </span>
                <span
                  className={`text-sm font-medium ${isCorrect ? "text-green-800" : "text-gray-400"}`}
                >
                  {text}
                </span>
                {isCorrect && (
                  <span className="ml-auto text-xs font-semibold text-green-600">
                    Correct
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          Next Question{" "}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </Screen>
  );
}

// ─── Frame 4: Incorrect Answer ────────────────────────────────────────────────

function IncorrectScreen({
  question,
  selected,
  onContinue,
}: {
  question: Question;
  selected: string;
  onContinue: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Screen centered={false}>
      <div className="w-full max-w-2xl pt-4">
        {/* Status */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
            <XCircle
              className="w-5 h-5 text-red-400"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Incorrect
            </h2>
            <p className="text-sm text-gray-500">
              That's okay — let's learn from it.
            </p>
          </div>
        </div>

        {/* Options — wrong in red, correct in green, others dimmed */}
        <div className="space-y-3 mb-6">
          {question.options.map(({ letter, text }) => {
            const isCorrect = letter === question.correct;
            const isWrong = letter === selected;

            let containerClass =
              "border-gray-100 bg-white opacity-40";
            let badgeClass = "bg-gray-100 text-gray-400";
            let textClass = "text-gray-400";
            let label = "";

            if (isWrong && !isCorrect) {
              containerClass = "border-red-300 bg-red-50";
              badgeClass = "bg-red-500 text-white";
              textClass = "text-red-800";
              label = "Your answer";
            } else if (isCorrect) {
              containerClass = "border-green-300 bg-green-50";
              badgeClass = "bg-green-500 text-white";
              textClass = "text-green-800";
              label = "Correct answer";
            }

            return (
              <div
                key={letter}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${containerClass}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${badgeClass}`}
                >
                  {letter}
                </span>
                <span
                  className={`text-sm font-medium flex-1 ${textClass}`}
                >
                  {text}
                </span>
                {label && (
                  <span
                    className={`text-xs font-semibold ${isCorrect ? "text-green-600" : "text-red-500"}`}
                  >
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Explanation — collapsible */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles
                className="w-4 h-4 text-blue-500"
                strokeWidth={1.75}
              />
              <span className="text-sm font-semibold text-gray-800">
                AI Explanation
              </span>
            </div>
            {expanded ? (
              <ChevronUp
                className="w-4 h-4 text-gray-400"
                strokeWidth={2}
              />
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <span className="text-xs font-medium">
                  Show Explanation
                </span>
                <ChevronDown
                  className="w-4 h-4"
                  strokeWidth={2}
                />
              </div>
            )}
          </button>

          {expanded && (
            <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  Explanation
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  Why Students Often Get This Wrong
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {question.misconception}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">
                  Key Takeaway
                </p>
                <p className="text-sm font-semibold text-blue-800">
                  {question.takeaway}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </Screen>
  );
}

// ─── Frame 5: Mission Complete ────────────────────────────────────────────────

function MissionComplete({
  onViewReport,
}: {
  answers: Answer[];
  onViewReport: () => void;
}) {
  const stats = [
    { label: "Score", value: "17 / 20" },
    { label: "Accuracy", value: "85%" },
    { label: "XP Earned", value: "+180 XP" },
  ];
  const strengths = ["Electricity", "Circuits"];
  const needsReview = ["Resistance", "Kirchhoff's Laws"];

  return (
    <Screen>
      <div className="w-full max-w-lg">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
            Mission Complete 🎉
          </h1>
          <p className="text-sm text-gray-400">
            Here's how you did, Kalehiwot.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-5 text-center"
            >
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {value}
              </p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Strengths + Needs Review */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2
                className="w-4 h-4 text-green-500"
                strokeWidth={1.75}
              />
              <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">
                Strengths
              </p>
            </div>
            <ul className="space-y-1.5">
              {strengths.map((t) => (
                <li
                  key={t}
                  className="text-sm font-medium text-green-800"
                >
                  • {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle
                className="w-4 h-4 text-amber-500"
                strokeWidth={1.75}
              />
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                Needs Review
              </p>
            </div>
            <ul className="space-y-1.5">
              {needsReview.map((t) => (
                <li
                  key={t}
                  className="text-sm font-medium text-amber-800"
                >
                  • {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onViewReport}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.75} />
          View AI Study Report
        </button>
      </div>
    </Screen>
  );
}

// ─── Frame 6: AI Study Report ─────────────────────────────────────────────────

function StudyReport({
  onContinue,
}: {
  answers: Answer[];
  onContinue: () => void;
}) {
  return (
    <Screen centered={false}>
      <div className="w-full max-w-2xl pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles
              className="w-4 h-4 text-white"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Study Report
            </h1>
            <p className="text-sm text-gray-400">
              Personalized analysis for Kalehiwot
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/* Performance Summary */}
          <ReportCard title="Performance Summary">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Score", value: "17 / 20" },
                { label: "Accuracy", value: "85%" },
                { label: "Score Improvement", value: "+2.3%" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <p className="text-base font-bold text-gray-900">
                    {value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* Strongest / Needs Review */}
          <div className="grid grid-cols-2 gap-4">
            <ReportCard title="Strongest Topics">
              <ul className="space-y-1.5">
                {["Electricity", "Circuits"].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      strokeWidth={1.75}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </ReportCard>
            <ReportCard title="Topics Needing Review">
              <ul className="space-y-1.5">
                {["Resistance", "Kirchhoff's Laws"].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <XCircle
                      className="w-4 h-4 text-red-400 flex-shrink-0"
                      strokeWidth={1.75}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </ReportCard>
          </div>

          {/* Tomorrow's Recommendation */}
          <ReportCard title="Tomorrow's Recommendation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                {
                  label: "Recommended Study Time",
                  value: "45 minutes",
                },
                {
                  label: "Suggested Chapters",
                  value:
                    "Chapter 7 — Resistance & Kirchhoff's Laws",
                },
                {
                  label: "Suggested Video",
                  value:
                    "14-min lesson: Parallel Circuits Explained",
                },
                {
                  label: "Suggested Practice",
                  value: "15 targeted questions on Resistance",
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>

        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          Continue{" "}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </Screen>
  );
}

function ReportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Frame 7: Reflection ─────────────────────────────────────────────────────

function ReflectionScreen({
  onExit,
}: {
  answers: Answer[];
  onExit: () => void;
}) {
  return (
    <Screen>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Reflection
          </h2>
          <p className="text-sm text-gray-400 text-center mb-8">
            A moment before you go.
          </p>

          <div className="space-y-4 mb-10">
            <p className="text-sm text-gray-700 leading-relaxed">
              Today you improved in{" "}
              <span className="font-semibold text-gray-900">
                Electricity
              </span>
              .
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              You still struggled with{" "}
              <span className="font-semibold text-gray-900">
                Resistance
              </span>
              . That's completely normal.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Tomorrow's mission will spend more time
              strengthening this topic.
            </p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                Keep your study streak alive tomorrow 🔥
              </p>
            </div>
          </div>

          <button
            onClick={onExit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]"
          >
            Return to Mission Control
          </button>
        </div>
      </div>
    </Screen>
  );
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

export function Practice({ onExit }: PracticeProps) {
  const [step, setStep] = useState<Step>("overview");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const q = questions[qIndex];

  function handleSubmit() {
    if (!selected) return;
    const correct = selected === q.correct;
    setAnswers((prev) => [
      ...prev,
      { questionId: q.id, selected, correct, topic: q.topic },
    ]);
    setStep(correct ? "correct" : "incorrect");
  }

  function handleSkip() {
    setAnswers((prev) => [
      ...prev,
      {
        questionId: q.id,
        selected: "",
        correct: false,
        topic: q.topic,
      },
    ]);
    advance();
  }

  function advance() {
    setSelected(null);
    if (qIndex + 1 >= questions.length) {
      setStep("complete");
    } else {
      setQIndex((i) => i + 1);
      setStep("question");
    }
  }

  if (step === "overview")
    return (
      <MissionOverview onStart={() => setStep("question")} />
    );
  if (step === "question")
    return (
      <QuestionScreen
        question={q}
        index={qIndex}
        selected={selected}
        onSelect={setSelected}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
      />
    );
  if (step === "correct")
    return (
      <CorrectScreen
        question={q}
        selected={selected!}
        onNext={advance}
      />
    );
  if (step === "incorrect")
    return (
      <IncorrectScreen
        question={q}
        selected={selected!}
        onContinue={advance}
      />
    );
  if (step === "complete")
    return (
      <MissionComplete
        answers={answers}
        onViewReport={() => setStep("report")}
      />
    );
  if (step === "report")
    return (
      <StudyReport
        answers={answers}
        onContinue={() => setStep("reflection")}
      />
    );
  if (step === "reflection")
    return (
      <ReflectionScreen answers={answers} onExit={onExit} />
    );
  return null;
}