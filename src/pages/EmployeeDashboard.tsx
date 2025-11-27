import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { ActivitySummary } from '@/components/dashboard/ActivitySummary';
import { ActivityCharts } from '@/components/dashboard/ActivityCharts';
import { ActivityCard } from '@/components/shared/ActivityCard';
import { FilterPanel, FilterValues } from '@/components/shared/FilterPanel';
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { 
  Receipt, 
  ShoppingCart, 
  Users, 
  Factory, 
  Warehouse,
  Plus,
  Filter
} from 'lucide-react';
import { ActivityType } from '@/types';
import { ACTIVITY_LABELS } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExpenseReceiptUpload } from '@/components/activities/ExpenseReceiptUpload';
import { SalesReceiptForm } from '@/components/activities/SalesReceiptForm';
import { CustomerServiceForm } from '@/components/activities/CustomerServiceForm';
import { ProductionActivityForm } from '@/components/activities/ProductionActivityForm';
import { StorageInfoForm } from '@/components/activities/StorageInfoForm';
import { cn } from '@/lib/utils';

type CreateActivityType = ActivityType | null;

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getActivitiesByUser, getActivityCountsByType, filterActivities, loading } = useActivities();
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [createActivityType, setCreateActivityType] = useState<CreateActivityType>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  // Get user's activities
  const userActivities = useMemo(() => {
    if (!user) return [];
    return getActivitiesByUser(user.id);
  }, [user, getActivitiesByUser]);

  // Get activity counts
  const activityCounts = useMemo(() => {
    if (!user) return { expense: 0, sales: 0, customer: 0, production: 0, storage: 0 };
    return getActivityCountsByType(user.id);
  }, [user, getActivityCountsByType]);

  // Apply filters to activities
  const filteredActivities = useMemo(() => {
    if (!user) return [];

    // Start with user's activities
    let activities = userActivities;

    // Apply type filter from selectedType (from activity summary cards)
    if (selectedType) {
      activities = activities.filter(activity => activity.type === selectedType);
    }

    // Apply date range and type filters from FilterPanel
    const hasDateFilters = filterValues.startDate || filterValues.endDate;
    const hasTypeFilter = filterValues.activityType && filterValues.activityType !== 'all';

    if (hasDateFilters || hasTypeFilter) {
      activities = filterActivities({
        userId: user.id,
        type: hasTypeFilter ? filterValues.activityType as ActivityType : undefined,
        startDate: filterValues.startDate,
        endDate: filterValues.endDate
      });
    }

    return activities;
  }, [user, userActivities, selectedType, filterValues, filterActivities]);

  const handleActivityTypeClick = (type: ActivityType) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const handleCreateActivity = (type: ActivityType) => {
    setCreateActivityType(type);
  };

  const handleCloseDialog = () => {
    setCreateActivityType(null);
  };

  const handleFilterChange = (filters: FilterValues) => {
    setFilterValues(filters);
    // Clear the selectedType when using FilterPanel to avoid confusion
    if (filters.activityType && filters.activityType !== 'all') {
      setSelectedType(null);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filterValues.startDate || 
    filterValues.endDate || 
    (filterValues.activityType && filterValues.activityType !== 'all') ||
    selectedType;

  const quickActions = [
    { type: 'expense' as ActivityType, icon: Receipt, label: 'Log Expense', color: 'text-red-600 bg-red-50 hover:bg-red-100' },
    { type: 'sales' as ActivityType, icon: ShoppingCart, label: 'Record Sale', color: 'text-green-600 bg-green-50 hover:bg-green-100' },
    { type: 'customer' as ActivityType, icon: Users, label: 'Log Service', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { type: 'production' as ActivityType, icon: Factory, label: 'Log Production', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { type: 'storage' as ActivityType, icon: Warehouse, label: 'Update Storage', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Employee Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      {/* Activity Summary */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h2>
        <ActivitySummary 
          counts={activityCounts} 
          onActivityTypeClick={handleActivityTypeClick}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.type}
              variant="outline"
              className={cn(
                'h-auto py-4 flex flex-col items-center gap-2 transition-colors',
                action.color
              )}
              onClick={() => handleCreateActivity(action.type)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Activity Charts */}
      {userActivities.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Analytics</h2>
          <ActivityCharts activities={userActivities} />
        </div>
      )}

      {/* Filter Panel */}
      {userActivities.length > 0 && (
        <div>
          <FilterPanel 
            onFilterChange={handleFilterChange}
            showUserFilter={false}
          />
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedType ? `${ACTIVITY_LABELS[selectedType]} Activities` : 'Recent Activities'}
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedType(null);
                setFilterValues({});
              }}
              className="text-sm"
            >
              <Filter className="h-4 w-4 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex flex-col items-center gap-3">
              <Plus className="h-12 w-12 text-gray-400" />
              <p className="text-gray-600 font-medium">
                {hasActiveFilters
                  ? 'No activities match your filters'
                  : selectedType 
                    ? `No ${ACTIVITY_LABELS[selectedType].toLowerCase()} activities yet`
                    : 'No activities logged yet'
                }
              </p>
              <p className="text-sm text-gray-500">
                {hasActiveFilters
                  ? 'Try adjusting your filters or clear them to see all activities'
                  : 'Get started by logging your first activity using the quick actions above'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Activity Dialog */}
      <Dialog open={createActivityType !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {createActivityType && ACTIVITY_LABELS[createActivityType]}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to log your activity
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {createActivityType === 'expense' && (
              <ExpenseReceiptUpload onSuccess={handleCloseDialog} />
            )}
            {createActivityType === 'sales' && (
              <SalesReceiptForm onSuccess={handleCloseDialog} />
            )}
            {createActivityType === 'customer' && (
              <CustomerServiceForm onSuccess={handleCloseDialog} />
            )}
            {createActivityType === 'production' && (
              <ProductionActivityForm onSuccess={handleCloseDialog} />
            )}
            {createActivityType === 'storage' && (
              <StorageInfoForm onSuccess={handleCloseDialog} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
