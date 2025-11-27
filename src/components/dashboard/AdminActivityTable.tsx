import React, { useMemo } from 'react';
import { Activity, ActivityType, User } from '@/types';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminActivityTableProps {
  activities: Activity[];
  users: User[];
  onViewDetails?: (activity: Activity) => void;
}

type SortField = 'date' | 'employee' | 'type';
type SortOrder = 'asc' | 'desc';

const activityTypeColors: Record<ActivityType, string> = {
  expense: 'bg-red-100 text-red-700 hover:bg-red-200',
  sales: 'bg-green-100 text-green-700 hover:bg-green-200',
  customer: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  production: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  storage: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
};

export function AdminActivityTable({
  activities,
  users,
  onViewDetails
}: AdminActivityTableProps) {
  const [sortField, setSortField] = React.useState<SortField>('date');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

  // Create a map of user IDs to user names for quick lookup
  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach(user => {
      map.set(user.id, `${user.firstName} ${user.lastName}`);
    });
    return map;
  }, [users]);

  // Sort activities
  const sortedActivities = useMemo(() => {
    const sorted = [...activities];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'employee':
          const nameA = userMap.get(a.userId) || '';
          const nameB = userMap.get(b.userId) || '';
          comparison = nameA.localeCompare(nameB);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [activities, sortField, sortOrder, userMap]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getActivitySummary = (activity: Activity): string => {
    switch (activity.type) {
      case 'expense':
        return activity.description || 'Expense receipt';
      case 'sales':
        return `Sale to ${activity.buyerName}`;
      case 'customer':
        return `${activity.serviceType} for ${activity.customerName}`;
      case 'production':
        return `${activity.rawMaterialWeight} ${activity.weightUnit} processed`;
      case 'storage':
        return `${activity.quantity} ${activity.itemDescription}`;
      default:
        return 'Activity';
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12">
          <div className="text-center text-gray-500">
            <p className="font-medium text-sm sm:text-base">No activities found</p>
            <p className="text-xs sm:text-sm mt-1">Activities will appear here once employees start logging them</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('date')}
                      className="h-8 font-semibold"
                    >
                      Date & Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('employee')}
                      className="h-8 font-semibold"
                    >
                      Employee
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('type')}
                      className="h-8 font-semibold"
                    >
                      Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{formatDate(activity.createdAt)}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.createdAt, 'time')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {userMap.get(activity.userId) || 'Unknown User'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={activityTypeColors[activity.type]}
                      >
                        {ACTIVITY_LABELS[activity.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {getActivitySummary(activity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {onViewDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(activity)}
                          className="h-8"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-3">
        {/* Sort Controls for Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={sortField === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('date')}
            className="flex-shrink-0 touch-manipulation"
          >
            Date
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant={sortField === 'employee' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('employee')}
            className="flex-shrink-0 touch-manipulation"
          >
            Employee
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant={sortField === 'type' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('type')}
            className="flex-shrink-0 touch-manipulation"
          >
            Type
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Activity Cards */}
        {sortedActivities.map((activity) => (
          <Card key={activity.id} className="touch-manipulation">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header with Type Badge */}
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className={activityTypeColors[activity.type]}
                  >
                    {ACTIVITY_LABELS[activity.type]}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>

                {/* Employee Name */}
                <div>
                  <p className="text-xs text-gray-500">Employee</p>
                  <p className="text-sm font-medium text-gray-900">
                    {userMap.get(activity.userId) || 'Unknown User'}
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-xs text-gray-500">Summary</p>
                  <p className="text-sm text-gray-900">
                    {getActivitySummary(activity)}
                  </p>
                </div>

                {/* View Details Button */}
                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(activity)}
                    className="w-full touch-manipulation"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
