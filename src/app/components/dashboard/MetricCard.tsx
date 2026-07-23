import { LucideIcon, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const iconClasses = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

export function MetricCard({ title, value, change, trend, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconClasses[color]}`}>
          <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
        </div>
        {trend === 'up' && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{change}</span>
          </div>
        )}
        {trend === 'down' && (
          <span className="text-xs font-medium text-gray-400">{change}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none mb-1.5">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}
