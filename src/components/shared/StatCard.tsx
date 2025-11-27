import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatNumber } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-blue-600 bg-blue-50',
  className,
  onClick
}: StatCardProps) {
  const formattedValue = typeof value === 'number' ? formatNumber(value) : value;

  const ariaLabel = trend 
    ? `${title}: ${formattedValue}. ${trend.isPositive ? 'Up' : 'Down'} ${Math.abs(trend.value)} percent compared to last period`
    : `${title}: ${formattedValue}`;

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer hover:border-gray-400',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={ariaLabel}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1" aria-hidden="true">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-2" aria-hidden="true">
              {formattedValue}
            </p>
            {trend && (
              <div className="flex items-center gap-1" aria-hidden="true">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" aria-hidden="true" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-lg p-3', colorClass)} aria-hidden="true">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
