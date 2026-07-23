import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, ChevronDown, ChevronUp, ArrowRight,
  Clock, Zap, TrendingUp, Brain, Target, PlayCircle,
  CheckCircle2, BarChart2, MessageCircle, Send, ArrowLeft,
  User,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Duration = '15min' | '30min' | '1hr' | '2hr';
type View = 'dashboard' | 'chat';

interface Recommendation {
  topic: string;
  subject: string;
  questions: number;
  time: string;
  improvement: string;
  extra?: string;
}

interface ChatMessage {
  id: string;
  role: 'student' | 'coach';
  content: string | MessageBlock[];
  timestamp: Date;
}

type MessageBlock =
  | { type: 'text'; value: string }
  | { type: 'highlight'; label: string; value: string; color: 'red' | 'green' | 'blue' | 'amber' }
  | { type: 'list'; items: string[] }
  | { type: 'cta'; label: string }
  | { type: 'divider' };

// ─── Data ─────────────────────────────────────────────────────────────────────

const recommendations: Record<Duration, Recommendation> = {
  '15min': {
    topic: 'Organic Chemistry',
    subject: 'Chemistry',
    questions: 8,
    time: '15 minutes',
    improvement: '+1.8%',
  },
  '30min': {
    topic: 'Electricity',
    subject: 'Physics',
    questions: 12,
    time: '20 minutes',
    improvement: '+3%',
  },
  '1hr': {
    topic: 'Electricity + Mechanics',
    subject: 'Physics',
    questions: 30,
    time: '55 minutes',
    improvement: '+5.2%',
    extra: 'Two high-impact topics covered in one session.',
  },
  '2hr': {
    topic: 'Electricity, Mechanics & Organic Chemistry',
    subject: 'Physics · Chemistry',
    questions: 60,
    time: '1h 50min',
    improvement: '+8.4%',
    extra: 'Full multi-subject session targeting your three weakest areas.',
  },
};

const insights = [
  {
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    text: 'Your Physics accuracy improved by 9% this month.',
    sub: 'Consistent daily sessions are making a measurable difference.',
  },
  {
    icon: Brain,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    text: 'Organic Chemistry remains your weakest Chemistry topic.',
    sub: 'Current mastery: 48%. The exam tests this in roughly 21% of Chemistry questions.',
  },
  {
    icon: Clock,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    text: 'You perform best when studying for at least 30 minutes.',
    sub: 'Sessions under 15 minutes show significantly lower retention.',
  },
  {
    icon: Zap,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    text: 'Your study streak has improved your consistency.',
    sub: '21 days of continuous practice correlates with a 14% accuracy gain.',
  },
];

const whySteps = [
  {
    icon: BarChart2,
    label: 'Exam Importance',
    value: '18% of Physics questions',
    detail: 'Electricity is one of the most frequently tested Physics topics across recent entrance exams.',
  },
  {
    icon: Target,
    label: 'Current Mastery',
    value: '48% accuracy',
    detail: 'Your current performance in Electricity is significantly below your goal of 80%.',
  },
  {
    icon: TrendingUp,
    label: 'Recent Performance',
    value: 'Improving steadily',
    detail: 'You have answered 3 Electricity questions correctly in the past 7 days — a positive trend.',
  },
  {
    icon: Clock,
    label: 'Available Study Time',
    value: '30 minutes selected',
    detail: 'A 30-minute session is enough to meaningfully cover 12 Electricity questions.',
  },
];

const durationOptions: { key: Duration; label: string }[] = [
  { key: '15min', label: '15 Minutes' },
  { key: '30min', label: '30 Minutes' },
  { key: '1hr',   label: '1 Hour' },
  { key: '2hr',   label: '2 Hours' },
];

const suggestedPrompts = [
  'Why did you recommend Electricity?',
  'Explain today\'s recommendation.',
  'Explain Ohm\'s Law in simple language.',
  'I only have 20 minutes today.',
  'How can I improve my Physics score?',
  'Which topics appear most often on the entrance exam?',
];

// Keyed responses for known prompts
const knownResponses: Record<string, MessageBlock[]> = {
  'why did you recommend electricity?': [
    { type: 'text', value: 'Great question. Here is the reasoning behind today\'s recommendation:' },
    { type: 'highlight', label: 'Exam Weight', value: 'Electricity appears in approximately 18% of recent Physics entrance exam questions — making it one of the highest-impact topics you can study.', color: 'blue' },
    { type: 'highlight', label: 'Your Current Mastery', value: 'Your accuracy on Electricity questions is 48%, which is significantly below your 80% target.', color: 'red' },
    { type: 'highlight', label: 'Topics You Have Already Mastered', value: 'Mechanics: 94% accuracy. Revisiting Mechanics would offer minimal improvement at this stage.', color: 'green' },
    { type: 'text', value: 'Because Electricity is both highly tested and one of your weakest areas, improving it is expected to increase your overall exam readiness faster than any other topic right now.' },
    { type: 'cta', label: 'Start Electricity Practice — 12 Questions' },
  ],
  "explain today's recommendation.": [
    { type: 'text', value: 'Today I recommended Electricity because it offers the highest return on your study time.' },
    { type: 'list', items: [
      'Electricity accounts for 18% of Physics exam questions',
      'Your current mastery is 48% — below your 80% goal',
      'You have been improving steadily over the past week',
      'A 30-minute session can realistically add +3% to your overall readiness',
    ]},
    { type: 'text', value: 'Think of it this way: studying a topic you are already strong in moves you sideways. Studying Electricity moves you forward.' },
    { type: 'cta', label: 'Start Recommended Practice' },
  ],
  'explain ohm\'s law in simple language.': [
    { type: 'text', value: "Ohm's Law describes the relationship between voltage, current, and resistance in a circuit. Here is the simplest way to think about it:" },
    { type: 'highlight', label: 'The Formula', value: 'V = I × R   (Voltage = Current × Resistance)', color: 'blue' },
    { type: 'text', value: 'Imagine water flowing through a pipe:' },
    { type: 'list', items: [
      'Voltage (V) is the pressure pushing the water through the pipe.',
      'Current (I) is how much water flows per second.',
      'Resistance (R) is how narrow the pipe is — a narrower pipe slows the flow.',
    ]},
    { type: 'text', value: 'A practical example: if a light bulb has a resistance of 10 ohms and is connected to a 20-volt battery, the current flowing through it is 20 ÷ 10 = 2 amperes.' },
    { type: 'highlight', label: 'Why This Matters for Your Exam', value: "Ohm's Law appears in approximately 12% of Electricity questions — and it is the foundation for almost every other Electricity concept.", color: 'amber' },
  ],
  'i only have 20 minutes today.': [
    { type: 'text', value: 'No problem. Twenty minutes is enough for a focused, high-impact session.' },
    { type: 'highlight', label: 'Recommended Practice', value: 'Organic Chemistry — 10 questions, 18 minutes', color: 'blue' },
    { type: 'text', value: 'Here is why I chose this:' },
    { type: 'list', items: [
      'Organic Chemistry is your weakest Chemistry topic at 48% mastery',
      'Chemistry accounts for 22% of the entrance exam',
      'Short focused sessions on weak areas are more effective than long sessions on strong ones',
      '10 questions is a realistic target for 20 minutes without rushing',
    ]},
    { type: 'text', value: 'Even a short session today keeps your 17-day streak alive and contributes to your long-term readiness.' },
    { type: 'cta', label: 'Start 20-Minute Practice Session' },
  ],
  'how can i improve my physics score?': [
    { type: 'text', value: 'Your Physics score has already improved by 9% this month — which is excellent progress. Here is how to continue that momentum:' },
    { type: 'highlight', label: 'Highest Priority: Electricity', value: 'Current mastery: 48%. This topic alone accounts for 18% of Physics questions. Bringing it to 75% would meaningfully raise your overall Physics score.', color: 'red' },
    { type: 'highlight', label: 'Medium Priority: Optics', value: 'Current mastery: 61%. Optics appears in 14% of Physics questions and is within reach with focused practice.', color: 'amber' },
    { type: 'highlight', label: 'Already Strong: Mechanics', value: 'Current mastery: 94%. Spend minimal time here — only review if a specific question type is unclear.', color: 'green' },
    { type: 'text', value: 'My recommendation: alternate between Electricity and Optics over the next two weeks. Two or three 30-minute sessions per topic per week is enough to see measurable improvement.' },
    { type: 'cta', label: 'Start Electricity Practice' },
  ],
  'which topics appear most often on the entrance exam?': [
    { type: 'text', value: 'Based on an analysis of recent Ethiopian University Entrance Examination papers, here are the highest-frequency topics across all subjects:' },
    { type: 'highlight', label: 'Physics', value: 'Electricity (18%), Mechanics (16%), Optics (14%), Thermodynamics (12%)', color: 'blue' },
    { type: 'highlight', label: 'Chemistry', value: 'Organic Chemistry (21%), Stoichiometry (18%), Atomic Structure (15%)', color: 'amber' },
    { type: 'highlight', label: 'Mathematics', value: 'Calculus (22%), Algebra (19%), Trigonometry (16%)', color: 'green' },
    { type: 'highlight', label: 'Biology', value: 'Cell Biology (20%), Genetics (18%), Ecology (14%)', color: 'red' },
    { type: 'text', value: 'I factor this topic frequency directly into every recommendation I make for you. Topics that are both high-frequency and low-mastery always get priority.' },
  ],
};

function getCoachResponse(input: string): MessageBlock[] {
  const key = input.trim().toLowerCase();
  if (knownResponses[key]) return knownResponses[key];

  // Fuzzy fallback matchers
  if (key.includes('electricity') || key.includes('recommend')) {
    return knownResponses['why did you recommend electricity?'];
  }
  if (key.includes("ohm") || key.includes('law')) {
    return knownResponses["explain ohm's law in simple language."];
  }
  if (key.includes('physics')) {
    return knownResponses['how can i improve my physics score?'];
  }
  if (key.includes('topic') || key.includes('exam') || key.includes('frequent')) {
    return knownResponses['which topics appear most often on the entrance exam?'];
  }
  if (key.includes('minute') || key.includes('time') || key.includes('short')) {
    return knownResponses['i only have 20 minutes today.'];
  }

  return [
    { type: 'text', value: `That is a thoughtful question. Based on your current performance profile — strong in Mechanics (94%), improving in Physics overall (+9% this month), and with Electricity and Organic Chemistry as your primary growth areas — here is my guidance:` },
    { type: 'list', items: [
      'Focus your next session on Electricity or Organic Chemistry',
      'Aim for at least 30-minute sessions for better retention',
      'Review the questions you flagged in your last practice session',
      'Keep your 17-day streak going — consistency is your greatest asset right now',
    ]},
    { type: 'text', value: 'Feel free to ask me anything more specific about a topic, your performance, or how to prepare for a particular part of the exam.' },
  ];
}

// ─── Chat Components ──────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function RichBlock({ block }: { block: MessageBlock }) {
  const colorMap = {
    red:   { bg: 'bg-red-50',   border: 'border-red-100',   label: 'text-red-500',   value: 'text-red-800'   },
    green: { bg: 'bg-green-50', border: 'border-green-100', label: 'text-green-600', value: 'text-green-800' },
    blue:  { bg: 'bg-blue-50',  border: 'border-blue-100',  label: 'text-blue-600',  value: 'text-blue-800'  },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', label: 'text-amber-600', value: 'text-amber-800' },
  };

  if (block.type === 'text') {
    return <p className="text-sm text-gray-700 leading-relaxed">{block.value}</p>;
  }
  if (block.type === 'highlight') {
    const c = colorMap[block.color];
    return (
      <div className={`rounded-xl border px-4 py-3 ${c.bg} ${c.border}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${c.label}`}>{block.label}</p>
        <p className={`text-sm font-medium leading-relaxed ${c.value}`}>{block.value}</p>
      </div>
    );
  }
  if (block.type === 'list') {
    return (
      <ul className="space-y-1.5 pl-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === 'cta') {
    return (
      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
        <PlayCircle className="w-4 h-4" strokeWidth={2} />
        {block.label}
      </button>
    );
  }
  if (block.type === 'divider') {
    return <hr className="border-gray-100" />;
  }
  return null;
}

function CoachBubble({ message }: { message: ChatMessage }) {
  const blocks = Array.isArray(message.content)
    ? message.content
    : [{ type: 'text' as const, value: message.content as string }];

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-900">Study Coach</span>
          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 space-y-3 shadow-sm">
          {blocks.map((block, i) => (
            <RichBlock key={i} block={block as MessageBlock} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentBubble({ message }: { message: ChatMessage }) {
  const text = typeof message.content === 'string'
    ? message.content
    : (message.content as MessageBlock[]).filter(b => b.type === 'text').map(b => (b as { type: 'text'; value: string }).value).join(' ');

  return (
    <div className="flex items-start gap-3 flex-row-reverse">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
        <User className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0 max-w-[75%] flex flex-col items-end">
        <div className="flex items-baseline gap-2 mb-2 flex-row-reverse">
          <span className="text-xs font-semibold text-gray-900">You</span>
          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
        </div>
        <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <p className="text-sm text-white leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatView({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'coach',
      content: [
        { type: 'text', value: "Hello, Kalehiwot. I'm your personal Study Coach for the Ethiopian University Entrance Examination." },
        { type: 'text', value: "I have a complete picture of your learning history — your strengths, your weak spots, your study patterns, and which exam topics matter most." },
        { type: 'text', value: "Ask me anything about your recommendations, a topic you don't understand, or how to make the most of your study time today." },
      ] as MessageBlock[],
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;

    const studentMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      role: 'student',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, studentMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const response = getCoachResponse(text);
      const coachMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        role: 'coach',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, coachMsg]);
      setIsTyping(false);
    }, delay);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  // Auto-resize textarea
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }

  const showPrompts = messages.length <= 1;

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        </button>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">Chat with Study Coach</h2>
          <p className="text-xs text-gray-400 leading-tight">Powered by your learning history</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">

        {/* Suggested prompts — visible until user sends first message */}
        {showPrompts && (
          <div className="flex flex-col items-center text-center pt-2 pb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Suggested questions</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestedPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 rounded-full px-3.5 py-2 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg =>
          msg.role === 'coach'
            ? <CoachBubble key={msg.id} message={msg} />
            : <StudentBubble key={msg.id} message={msg} />
        )}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4 flex-shrink-0">
        <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask your Study Coach anything..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed min-h-[24px]"
            style={{ height: '24px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-white disabled:text-gray-400" strokeWidth={2} />
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press <kbd className="font-mono bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px]">Enter</kbd> to send · <kbd className="font-mono bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard Components ─────────────────────────────────────────────────────

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Today's Recommendation</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-0.5">⚡ {rec.topic}</h2>
          <p className="text-sm text-gray-400">{rec.subject}</p>
          {rec.extra && <p className="text-xs text-gray-400 mt-2 italic">{rec.extra}</p>}
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          {[
            { label: 'Study Time',   value: rec.time },
            { label: 'Questions',    value: `${rec.questions}` },
            { label: 'Readiness ↑', value: rec.improvement },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-4 text-center">
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-5">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98]">
            <PlayCircle className="w-4 h-4" strokeWidth={2} />
            Start Recommended Practice
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setWhyOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-blue-500" strokeWidth={1.75} />
            <span className="text-sm font-semibold text-gray-800">Why this recommendation?</span>
          </div>
          {whyOpen
            ? <ChevronUp className="w-4 h-4 text-gray-400" strokeWidth={2} />
            : <div className="flex items-center gap-1 text-gray-400">
                <span className="text-xs font-medium">See reasoning</span>
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </div>
          }
        </button>
        {whyOpen && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-700 leading-relaxed">
            <p><span className="font-semibold text-gray-900">Electricity</span> appears in approximately <span className="font-semibold text-gray-900">18%</span> of recent Ethiopian University Entrance Exam Physics questions.</p>
            <p>Your current mastery in Electricity is <span className="font-semibold text-red-500">48%</span> — well below your strongest subjects.</p>
            <p>You have already mastered Mechanics with an accuracy of <span className="font-semibold text-green-600">94%</span>.</p>
            <p>Improving Electricity is expected to <span className="font-semibold text-gray-900">increase your overall exam readiness more than reviewing Mechanics</span> at this stage.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TimeSelector({ selected, onChange }: { selected: Duration; onChange: (d: Duration) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm font-semibold text-gray-900 mb-1">How much time do you have today?</p>
      <p className="text-xs text-gray-400 mb-4">Your recommendation adapts to your available time.</p>
      <div className="grid grid-cols-4 gap-2">
        {durationOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150
              ${selected === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LearningInsights() {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Learning Insights</p>
      <div className="space-y-3">
        {insights.map(({ icon: Icon, iconBg, iconColor, text, sub }) => (
          <div key={text} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{text}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationLogic() {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">How Recommendations Are Made</p>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="space-y-0">
          {whySteps.map(({ icon: Icon, label, value, detail }, i) => (
            <div key={label}>
              <div className="flex items-start gap-4 py-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-blue-600" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
                    <span className="text-xs font-bold text-gray-700">{value}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
                </div>
              </div>
              {i < whySteps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" strokeWidth={2} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-gray-100 pt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">Recommendation Priority</p>
              <p className="text-sm font-semibold text-blue-800">⚡ Electricity — highest expected impact for today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StudyCoach() {
  const [view, setView] = useState<View>('dashboard');
  const [duration, setDuration] = useState<Duration>('30min');
  const rec = recommendations[duration];

  if (view === 'chat') {
    return <ChatView onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 lg:p-8 max-w-3xl">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Study Coach</h1>
            </div>
            <button
              onClick={() => setView('chat')}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 px-4 py-2 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
              Chat with Coach
            </button>
          </div>
          <p className="text-sm text-gray-500 pl-11">
            Your personal AI tutor for the Ethiopian University Entrance Examination.
          </p>
        </div>

        <div className="space-y-6">
          <TimeSelector selected={duration} onChange={setDuration} />
          <RecommendationCard rec={rec} />
          <LearningInsights />
          <RecommendationLogic />
        </div>

      </main>
    </div>
  );
}
