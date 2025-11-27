import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { ActivityType } from '@/types';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface FilterValues {
  startDate?: string;
  endDate?: string;
  activityType?: ActivityType | 'all';
  userId?: string;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
  showUserFilter?: boolean;
  users?: Array<{ id: string; name: string }>;
  className?: string;
}

export function FilterPanel({
  onFilterChange,
  showUserFilter = false,
  users = [],
  className
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterValues>({
    activityType: 'all'
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = 
    filters.startDate || 
    filters.endDate || 
    (filters.activityType && filters.activityType !== 'all') ||
    filters.userId;

  const handleFilterChange = (key: keyof FilterValues, value: string | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterValues = {
      activityType: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activityTypes: Array<{ value: ActivityType | 'all'; label: string }> = [
    { value: 'all', label: 'All Activities' },
    { value: 'expense', label: ACTIVITY_LABELS.expense },
    { value: 'sales', label: ACTIVITY_LABELS.sales },
    { value: 'customer', label: ACTIVITY_LABELS.customer },
    { value: 'production', label: ACTIVITY_LABELS.production },
    { value: 'storage', label: ACTIVITY_LABELS.storage }
  ];

  return (
    <Card className={cn('', className)} role="search" aria-label="Activity filters">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" aria-hidden="true" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 text-xs"
                aria-label="Clear all filters"
              >
                <X className="h-3 w-3 mr-1" aria-hidden="true" />
                Clear
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 text-xs lg:hidden"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn(
        'space-y-4',
        !isExpanded && 'hidden lg:block'
      )}>
        {/* Activity Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="activity-type" className="text-sm font-medium">
            Activity Type
          </Label>
          <Select
            id="activity-type"
            value={filters.activityType || 'all'}
            onChange={(e) => handleFilterChange('activityType', e.target.value)}
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
              max={filters.endDate || undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
              min={filters.startDate || undefined}
            />
          </div>
        </div>

        {/* User Filter (Admin only) */}
        {showUserFilter && users.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="user-filter" className="text-sm font-medium">
              Employee
            </Label>
            <Select
              id="user-filter"
              value={filters.userId || 'all'}
              onChange={(e) => handleFilterChange('userId', e.target.value === 'all' ? undefined : e.target.value)}
            >
              <option value="all">All Employees</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-gray-600 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.activityType && filters.activityType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  Type: {ACTIVITY_LABELS[filters.activityType]}
                </span>
              )}
              {filters.startDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  From: {filters.startDate}
                </span>
              )}
              {filters.endDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  To: {filters.endDate}
                </span>
              )}
              {filters.userId && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  Employee: {users.find(u => u.id === filters.userId)?.name || 'Unknown'}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
