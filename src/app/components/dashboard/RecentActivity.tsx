import { ArrowRight, Sparkles } from 'lucide-react';

export function RecentActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Study Coach */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Study Coach</h3>
            <p className="text-xs text-gray-400 mt-0.5">AI-powered recommendation</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3.5 border border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1.5">Today's Recommendation</p>
          <p className="text-sm font-semibold text-gray-800">Review Organic Chemistry</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Your accuracy dropped to 58% yesterday. A focused 35-minute session today will get you back on track.
          </p>
        </div>

        <div className="pt-1 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
            Open Study Coach
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Question Bank */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Question Bank</h3>
          <p className="text-sm text-gray-500 mt-0.5">Past exam questions, chapter drills, and more</p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900 tabular-nums leading-none">12,481</span>
          <span className="text-sm text-gray-500 pb-1">questions available</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Subjects', value: '8' },
            { label: 'Chapters', value: '142' },
            { label: 'Exam Years', value: '12' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg px-3 py-3 border border-gray-100 text-center">
              <p className="text-base font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="pt-1 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
            Browse Questions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </button>
        </div>
      </div>

    </div>
  );
}
