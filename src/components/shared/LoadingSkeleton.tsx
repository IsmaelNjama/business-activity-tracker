import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'button' | 'table';
  count?: number;
}

export function LoadingSkeleton({ 
  className, 
  variant = 'text',
  count = 1 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    card: 'h-32 w-full',
    text: 'h-4 w-full',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24',
    table: 'h-12 w-full'
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses[variant], className)}
            role="status"
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 sm:p-6 space-y-3 animate-pulse" role="status" aria-label="Loading activity">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading table">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b animate-pulse">
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
