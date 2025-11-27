import { type ReactNode } from 'react';
import { 
  Receipt, 
  ShoppingCart, 
  Users, 
  Factory, 
  Warehouse,
  Calendar,
  User
} from 'lucide-react';
import { Activity, ActivityType } from '@/types';
import { formatDate, getRelativeTime, truncateText } from '@/lib/utils';
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LazyImage } from './LazyImage';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  showUser?: boolean;
  userName?: string;
  className?: string;
}

const activityIcons: Record<ActivityType, ReactNode> = {
  expense: <Receipt className="h-5 w-5" />,
  sales: <ShoppingCart className="h-5 w-5" />,
  customer: <Users className="h-5 w-5" />,
  production: <Factory className="h-5 w-5" />,
  storage: <Warehouse className="h-5 w-5" />
};

function getActivitySummary(activity: Activity): string {
  switch (activity.type) {
    case 'expense':
      return activity.description || 'Expense receipt uploaded';
    case 'sales':
      return `Sale to ${activity.buyerName}`;
    case 'customer':
      return `${activity.serviceType} - ${activity.customerName}`;
    case 'production':
      return `${activity.rawMaterialWeight} ${activity.weightUnit} processed`;
    case 'storage':
      return `${activity.quantity} ${truncateText(activity.itemDescription, 30)}`;
    default:
      return 'Activity logged';
  }
}

function getActivityDetails(activity: Activity): string[] {
  const details: string[] = [];

  switch (activity.type) {
    case 'expense':
      if (activity.description) {
        details.push(truncateText(activity.description, 60));
      }
      break;
    case 'sales':
      details.push(`Date: ${activity.date}`);
      details.push(`Time: ${activity.time}`);
      details.push(`Served by: ${activity.servingEmployee}`);
      break;
    case 'customer':
      details.push(`Service Date: ${formatDate(activity.serviceDate)}`);
      if (activity.notes) {
        details.push(truncateText(activity.notes, 60));
      }
      break;
    case 'production':
      if (activity.notes) {
        details.push(truncateText(activity.notes, 60));
      }
      break;
    case 'storage':
      details.push(`Location: ${activity.location}`);
      if (activity.condition) {
        details.push(`Condition: ${truncateText(activity.condition, 40)}`);
      }
      break;
  }

  return details;
}

function getActivityImage(activity: Activity): string | null {
  switch (activity.type) {
    case 'expense':
      return activity.receiptImage;
    case 'sales':
      return activity.receiptImage;
    case 'production':
      return activity.machineImageBefore; // Show before image as preview
    default:
      return null;
  }
}

export function ActivityCard({ 
  activity, 
  onClick, 
  showUser = false,
  userName,
  className 
}: ActivityCardProps) {
  const colorClasses = ACTIVITY_COLORS[activity.type];
  const summary = getActivitySummary(activity);
  const details = getActivityDetails(activity);
  const imageUrl = getActivityImage(activity);

  const ariaLabel = `${ACTIVITY_LABELS[activity.type]} activity: ${summary}. Created ${getRelativeTime(activity.createdAt)}${showUser && userName ? ` by ${userName}` : ''}`;

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md touch-manipulation',
        onClick && 'cursor-pointer hover:border-gray-400 active:scale-[0.98]',
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
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <div className={cn('rounded-lg p-1.5 sm:p-2 flex-shrink-0', colorClasses)}>
              {activityIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">
                  {ACTIVITY_LABELS[activity.type]}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">
                {summary}
              </p>
            </div>
          </div>
          
          {/* Thumbnail preview for activities with images */}
          {imageUrl && (
            <div className="flex-shrink-0">
              <LazyImage
                src={imageUrl}
                alt={`${activity.type} preview`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
                fallbackClassName="w-12 h-12 sm:w-16 sm:h-16 rounded-md"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
        {details.length > 0 && (
          <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
            {details.map((detail, index) => (
              <p key={index} className="text-xs text-gray-600 leading-relaxed">
                {detail}
              </p>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1 min-w-0">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{getRelativeTime(activity.createdAt)}</span>
          </div>
          {showUser && userName && (
            <div className="flex items-center gap-1 min-w-0 ml-2">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{userName}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
