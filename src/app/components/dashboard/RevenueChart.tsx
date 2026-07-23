import { Play, PenLine, BookOpen, Bot } from 'lucide-react';

const actions = [
  {
    icon: Play,
    label: 'Continue Yesterday\'s Practice',
    description: 'Physics — Newton\'s Laws',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: PenLine,
    label: 'Practice Weakest Subject',
    description: 'Chemistry — 63% accuracy',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: BookOpen,
    label: 'Browse Question Bank',
    description: '12,481 questions available',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: Bot,
    label: 'Open Study Coach',
    description: 'Get AI-powered guidance',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

export function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-500 mt-0.5">Jump right back in</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {actions.map(({ icon: Icon, label, description, iconBg, iconColor }) => (
          <button
            key={label}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-150 group"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors truncate">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
