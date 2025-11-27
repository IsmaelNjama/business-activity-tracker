import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { AdminActivityTable } from '@/components/dashboard/AdminActivityTable';
import { StatCard } from '@/components/shared/StatCard';
import { FilterPanel, FilterValues } from '@/components/shared/FilterPanel';
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton';
import { ActivityDetailView } from '@/components/dashboard/ActivityDetailView';
import { OrganizationCharts } from '@/components/dashboard/OrganizationCharts';
import { EmployeePerformanceMetrics } from '@/components/dashboard/EmployeePerformanceMetrics';
import { Activity, ActivityType } from '@/types';
import { getUsers } from '@/services/storageService';
import { 
  Receipt, 
  ShoppingCart, 
  Users, 
  Factory, 
  Warehouse,
  TrendingUp,
  Activity as ActivityIcon,
  BarChart3,
  Users2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { activities, getAllActivityCountsByType, filterActivities, loading } = useActivities();
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Get all users for the employee filter
  const allUsers = useMemo(() => {
    return getUsers().map(u => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`
    }));
  }, []);

  // Get organization-wide activity counts
  const activityCounts = useMemo(() => {
    return getAllActivityCountsByType();
  }, [getAllActivityCountsByType]);

  // Calculate total activities
  const totalActivities = useMemo(() => {
    return Object.values(activityCounts).reduce((sum, count) => sum + count, 0);
  }, [activityCounts]);

  // Apply filters to activities
  const filteredActivities = useMemo(() => {
    const hasFilters = 
      filterValues.userId || 
      (filterValues.activityType && filterValues.activityType !== 'all') ||
      filterValues.startDate || 
      filterValues.endDate;

    if (!hasFilters) {
      return activities;
    }

    return filterActivities({
      userId: filterValues.userId,
      type: filterValues.activityType && filterValues.activityType !== 'all' 
        ? filterValues.activityType as ActivityType 
        : undefined,
      startDate: filterValues.startDate,
      endDate: filterValues.endDate
    });
  }, [activities, filterValues, filterActivities]);

  const handleFilterChange = (filters: FilterValues) => {
    setFilterValues(filters);
  };

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" role="heading" aria-level={1}>
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.firstName} {user?.lastName}! Monitor all employee activities across the organization.
        </p>
      </div>

      {/* Aggregate Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization-Wide Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Activities"
            value={totalActivities}
            icon={ActivityIcon}
            colorClass="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Expenses"
            value={activityCounts.expense}
            icon={Receipt}
            colorClass="text-red-600 bg-red-50"
          />
          <StatCard
            title="Sales"
            value={activityCounts.sales}
            icon={ShoppingCart}
            colorClass="text-green-600 bg-green-50"
          />
          <StatCard
            title="Customer Service"
            value={activityCounts.customer}
            icon={Users}
            colorClass="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Production"
            value={activityCounts.production}
            icon={Factory}
            colorClass="text-purple-600 bg-purple-50"
          />
          <StatCard
            title="Storage"
            value={activityCounts.storage}
            icon={Warehouse}
            colorClass="text-amber-600 bg-amber-50"
          />
        </div>
      </div>

      {/* Employee Activity Summary */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Active Employees"
            value={allUsers.length}
            icon={Users}
            colorClass="text-indigo-600 bg-indigo-50"
          />
          <StatCard
            title="Avg Activities/Employee"
            value={allUsers.length > 0 ? Math.round(totalActivities / allUsers.length) : 0}
            icon={TrendingUp}
            colorClass="text-teal-600 bg-teal-50"
          />
          <StatCard
            title="Most Active Type"
            value={(() => {
              const mostActive = Object.entries(activityCounts).reduce((max, [type, count]) => 
                count > (activityCounts[max as ActivityType] || 0) ? type as ActivityType : max
              , 'expense' as ActivityType);
              return mostActive.charAt(0).toUpperCase() + mostActive.slice(1);
            })()}
            icon={ActivityIcon}
            colorClass="text-pink-600 bg-pink-50"
          />
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          {/* Filter Panel */}
          <div>
            <FilterPanel 
              onFilterChange={handleFilterChange}
              showUserFilter={true}
              users={allUsers}
            />
          </div>

          {/* Activities Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                All Employee Activities
              </h2>
              <p className="text-sm text-gray-500">
                Showing {filteredActivities.length} of {activities.length} activities
              </p>
            </div>

            <AdminActivityTable
              activities={filteredActivities}
              users={getUsers()}
              onViewDetails={handleViewDetails}
            />
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <OrganizationCharts activities={activities} users={getUsers()} />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <EmployeePerformanceMetrics activities={activities} users={getUsers()} />
        </TabsContent>
      </Tabs>

      {/* Activity Details Dialog */}
      <Dialog open={selectedActivity !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <ActivityDetailView 
              activity={selectedActivity}
              userName={allUsers.find(u => u.id === selectedActivity.userId)?.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
