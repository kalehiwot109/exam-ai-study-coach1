import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'subjects' | 'trends' | 'exam';

// ─── Data ─────────────────────────────────────────────────────────────────────

const accuracyOverTime = [
  { week: 'Week 1', accuracy: 61 },
  { week: 'Week 2', accuracy: 65 },
  { week: 'Week 3', accuracy: 68 },
  { week: 'Week 4', accuracy: 71 },
  { week: 'Week 5', accuracy: 69 },
  { week: 'Week 6', accuracy: 74 },
  { week: 'Week 7', accuracy: 78 },
  { week: 'Week 8', accuracy: 82 },
];

const questionsPerWeek = [
  { week: 'W1', questions: 48 },
  { week: 'W2', questions: 62 },
  { week: 'W3', questions: 55 },
  { week: 'W4', questions: 74 },
  { week: 'W5', questions: 68 },
  { week: 'W6', questions: 83 },
  { week: 'W7', questions: 91 },
  { week: 'W8', questions: 88 },
];

const subjectData = [
  {
    name: 'Biology',
    accuracy: 91,
    trend: 'up' as const,
    chapters: [
      { name: 'Cell Structure',   pct: 96 },
      { name: 'Genetics',         pct: 88 },
      { name: 'Ecology',          pct: 90 },
      { name: 'Human Physiology', pct: 91 },
    ],
  },
  {
    name: 'English',
    accuracy: 87,
    trend: 'up' as const,
    chapters: [
      { name: 'Reading Comprehension', pct: 92 },
      { name: 'Grammar',               pct: 83 },
      { name: 'Vocabulary',            pct: 88 },
      { name: 'Essay Writing',         pct: 84 },
    ],
  },
  {
    name: 'Mathematics',
    accuracy: 84,
    trend: 'up' as const,
    chapters: [
      { name: 'Calculus',           pct: 88 },
      { name: 'Functions',          pct: 86 },
      { name: 'Quadratic Equations', pct: 80 },
      { name: 'Probability',        pct: 82 },
    ],
  },
  {
    name: 'History',
    accuracy: 79,
    trend: 'flat' as const,
    chapters: [
      { name: 'Ancient Ethiopia',   pct: 84 },
      { name: 'Modern History',     pct: 76 },
      { name: 'African History',    pct: 78 },
    ],
  },
  {
    name: 'Geography',
    accuracy: 76,
    trend: 'up' as const,
    chapters: [
      { name: 'Physical Geography', pct: 80 },
      { name: 'Human Geography',    pct: 72 },
      { name: 'Map Reading',        pct: 76 },
    ],
  },
  {
    name: 'Physics',
    accuracy: 68,
    trend: 'up' as const,
    chapters: [
      { name: 'Electricity', pct: 74 },
      { name: 'Mechanics',   pct: 63 },
      { name: 'Optics',      pct: 70 },
      { name: 'Waves',       pct: 65 },
    ],
  },
  {
    name: 'Chemistry',
    accuracy: 63,
    trend: 'up' as const,
    chapters: [
      { name: 'Organic Chemistry',    pct: 58 },
      { name: 'Stoichiometry',        pct: 66 },
      { name: 'Chemical Equilibrium', pct: 62 },
      { name: 'Periodic Table',       pct: 70 },
    ],
  },
  {
    name: 'Civics',
    accuracy: 72,
    trend: 'flat' as const,
    chapters: [
      { name: 'Democracy',        pct: 76 },
      { name: 'Human Rights',     pct: 74 },
      { name: 'Governance',       pct: 68 },
    ],
  },
];

const strongest  = subjectData.filter(s => s.accuracy >= 80).slice(0, 3);
const needsWork  = subjectData.filter(s => s.accuracy < 72).slice(0, 2);
const examTop    = subjectData.filter(s => s.accuracy >= 80).map(s => s.name);
const examWeak   = subjectData.filter(s => s.accuracy < 72).map(s => s.name);

// ─── Shared helpers ───────────────────────────────────────────────────────────

const accuracyColor = (pct: number) =>
  pct >= 80 ? 'bg-blue-500' : pct >= 65 ? 'bg-amber-400' : 'bg-red-400';

const accuracyText = (pct: number) =>
  pct >= 80 ? 'text-blue-600' : pct >= 65 ? 'text-amber-600' : 'text-red-500';

const chartTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '12px',
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const tabs: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'subjects', label: 'Subjects' },
  { key: 'trends',   label: 'Trends' },
  { key: 'exam',     label: 'Exam Readiness' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, subUp,
}: {
  label: string; value: string; sub?: string; subUp?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
      <p className="text-2xl font-bold text-gray-900 leading-none mb-2">{value}</p>
      {sub && (
        <div className={`flex items-center gap-1 text-xs font-medium ${subUp ? 'text-green-600' : 'text-gray-400'}`}>
          {subUp && <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

// ─── Progress Row ─────────────────────────────────────────────────────────────

function ProgressRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-700">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${accuracyText(pct)}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${accuracyColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{title}</p>
      {children}
    </div>
  );
}

// ─── Frame 1: Overview ────────────────────────────────────────────────────────

function Overview() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Accuracy" value="82%" sub="+6% this month" subUp />
        <StatCard label="Questions Solved" value="1,482" sub="+88 this week" subUp />
        <StatCard label="Study Streak"     value="21 Days" sub="+4 days" subUp />
        <StatCard label="Exam Readiness"   value="74%" sub="Est. 590–620" />
      </div>

      {/* Strongest + Needs Improvement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SectionCard title="Strongest Subjects">
          <div className="space-y-3">
            {strongest.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{s.name}</span>
                <span className="text-sm font-bold text-blue-600">{s.accuracy}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Needs Improvement">
          <div className="space-y-3">
            {needsWork.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{s.name}</span>
                <span className="text-sm font-bold text-red-500">{s.accuracy}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Accuracy over time */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Overall Accuracy Over Time</p>
        <p className="text-sm text-gray-500 mb-5">Your accuracy trend across the past 8 weeks.</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accuracyOverTime} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v}%`, 'Accuracy']} />
              <Area type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={2} fill="url(#accGrad)" dot={false} activeDot={{ r: 4, fill: '#2563eb' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Learning Summary</p>
        <div className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
          <p>Compared to last month, your <span className="font-semibold text-gray-800">Physics accuracy improved by 12%</span> — a strong result given how challenging the topic is.</p>
          <p>You have shown consistent improvement in <span className="font-semibold text-gray-800">Electricity and Mechanics</span>, two of the most frequently tested topics.</p>
          <p>Your overall preparation has <span className="font-semibold text-gray-800">steadily increased over the past four weeks</span>, with accuracy rising from 69% to 82%.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Frame 2: Subjects ────────────────────────────────────────────────────────

function SubjectCard({ subject }: { subject: typeof subjectData[0] }) {
  const [open, setOpen] = useState(false);
  const TrendIcon = subject.trend === 'up' ? TrendingUp : subject.trend === 'down' ? TrendingDown : Minus;
  const trendColor = subject.trend === 'up' ? 'text-green-500' : subject.trend === 'down' ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900 w-28">{subject.name}</span>
          <TrendIcon className={`w-4 h-4 ${trendColor}`} strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${accuracyColor(subject.accuracy)}`}
              style={{ width: `${subject.accuracy}%` }}
            />
          </div>
          <span className={`text-sm font-bold tabular-nums w-10 text-right ${accuracyText(subject.accuracy)}`}>
            {subject.accuracy}%
          </span>
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-400" strokeWidth={2} />
            : <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
          }
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          {subject.chapters.map(ch => (
            <ProgressRow key={ch.name} label={ch.name} pct={ch.pct} />
          ))}
        </div>
      )}
    </div>
  );
}

function Subjects() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">Click any subject to see chapter-level performance.</p>
      {subjectData.map(s => <SubjectCard key={s.name} subject={s} />)}
    </div>
  );
}

// ─── Frame 3: Trends ──────────────────────────────────────────────────────────

function Trends() {
  return (
    <div className="space-y-6">
      {/* Accuracy over time */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">Accuracy Over Time</p>
            <p className="text-xs text-gray-400 mt-0.5">Weekly average accuracy</p>
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">↑ +21% vs last month</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accuracyOverTime} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="accGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v}%`, 'Accuracy']} />
              <Area type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={2} fill="url(#accGrad2)" dot={false} activeDot={{ r: 4, fill: '#2563eb' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Questions per week */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">Questions Solved Per Week</p>
            <p className="text-xs text-gray-400 mt-0.5">Total questions answered each week</p>
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">↑ +42% vs last month</span>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={questionsPerWeek} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v}`, 'Questions']} />
              <Bar dataKey="questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Practice sessions + study time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Practice Sessions</p>
          <p className="text-3xl font-bold text-gray-900 leading-none mb-2">34</p>
          <p className="text-xs text-gray-500">sessions completed</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            <span>+8 vs last month</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Study Time</p>
          <p className="text-3xl font-bold text-gray-900 leading-none mb-2">42h</p>
          <p className="text-xs text-gray-500">total this month</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            <span>+11h vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Frame 4: Exam Readiness ──────────────────────────────────────────────────

function ExamReadiness() {
  const readiness = 74;
  const readinessProgress = [
    { label: 'Week 5', value: 62 },
    { label: 'Week 6', value: 67 },
    { label: 'Week 7', value: 71 },
    { label: 'Week 8', value: 74 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero readiness card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Exam Readiness</p>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-5xl font-bold text-gray-900">{readiness}%</span>
              <span className="text-sm font-medium text-green-600 mb-2">↑ +4% this week</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Estimated Score</p>
                <p className="text-sm font-bold text-gray-900">590 – 620</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Confidence</p>
                <span className="inline-block px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">High</span>
              </div>
            </div>
          </div>

          {/* Circular-feel readiness bar */}
          <div className="flex-shrink-0">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#2563eb" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 42 * readiness / 100} ${2 * Math.PI * 42}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{readiness}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width progress bar */}
        <div className="mt-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${readiness}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">0%</span>
            <span className="text-xs text-gray-400">Exam Ready</span>
            <span className="text-xs text-gray-400">100%</span>
          </div>
        </div>
      </div>

      {/* Highest performing + needs improvement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SectionCard title="Highest Performing Subjects">
          <div className="space-y-2.5">
            {examTop.map(name => {
              const s = subjectData.find(d => d.name === name)!;
              return <ProgressRow key={name} label={name} pct={s.accuracy} />;
            })}
          </div>
        </SectionCard>

        <SectionCard title="Subjects Needing Improvement">
          <div className="space-y-2.5">
            {examWeak.map(name => {
              const s = subjectData.find(d => d.name === name)!;
              return <ProgressRow key={name} label={name} pct={s.accuracy} />;
            })}
          </div>
        </SectionCard>
      </div>

      {/* Readiness progress over recent weeks */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Estimated Readiness Progress</p>
        <div className="space-y-3">
          {readinessProgress.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-12 flex-shrink-0">{label}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-10 text-right tabular-nums">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">How is this calculated?</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your estimated readiness is based on your recent practice sessions, accuracy, consistency, and performance across all subjects. It reflects your current preparation level and will update as you continue studying.
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Analytics() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 lg:p-8 max-w-5xl">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-sm text-gray-500">Track your learning progress and exam preparation over time.</p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8 flex-wrap">
          {tabs.map(({ key, label }) => (
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
        {tab === 'overview' && <Overview />}
        {tab === 'subjects' && <Subjects />}
        {tab === 'trends'   && <Trends />}
        {tab === 'exam'     && <ExamReadiness />}

      </main>
    </div>
  );
}
