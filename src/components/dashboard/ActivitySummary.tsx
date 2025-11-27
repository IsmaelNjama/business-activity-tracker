import { Receipt, ShoppingCart, Users, Factory, Warehouse } from 'lucide-react';
import { ActivityType } from '@/types';
import { StatCard } from '@/components/shared/StatCard';
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from '@/lib/constants';

interface ActivitySummaryProps {
  counts: Record<ActivityType, number>;
  onActivityTypeClick?: (type: ActivityType) => void;
}

const activityIcons = {
  expense: Receipt,
  sales: ShoppingCart,
  customer: Users,
  production: Factory,
  storage: Warehouse
};

export function ActivitySummary({ counts, onActivityTypeClick }: ActivitySummaryProps) {
  const activityTypes: ActivityType[] = ['expense', 'sales', 'customer', 'production', 'storage'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {activityTypes.map((type) => (
        <StatCard
          key={type}
          title={ACTIVITY_LABELS[type]}
          value={counts[type] || 0}
          icon={activityIcons[type]}
          colorClass={ACTIVITY_COLORS[type]}
          onClick={onActivityTypeClick ? () => onActivityTypeClick(type) : undefined}
        />
      ))}
    </div>
  );
}
