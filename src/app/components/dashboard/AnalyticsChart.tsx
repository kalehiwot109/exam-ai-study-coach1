import { ArrowRight, AlertCircle } from 'lucide-react';

const weak = [
  { subject: 'Chemistry', accuracy: 63 },
  { subject: 'English',   accuracy: 79 },
  { subject: 'Physics',   accuracy: 84 },
];

export function AnalyticsChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Subject Performance</h3>
          <p className="text-sm text-gray-500 mt-0.5">Subjects that need your attention</p>
        </div>
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" strokeWidth={1.75} />
      </div>

      <div className="space-y-3">
        {weak.map(({ subject, accuracy }) => (
          <div key={subject} className="flex items-center gap-3">
            <div className="w-24 flex-shrink-0">
              <p className="text-sm font-medium text-gray-700">{subject}</p>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-10 text-right tabular-nums">
              {accuracy}%
            </span>
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
          View Full Analytics
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
