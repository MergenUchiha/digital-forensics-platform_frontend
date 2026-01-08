import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
    red: 'text-red-500 bg-red-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
  };

  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-tertiary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm mt-2',
              trend.isPositive ? 'text-status-success' : 'text-status-error'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
};