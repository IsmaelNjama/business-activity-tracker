import { useMemo } from 'react';
import { Activity, ActivityType, User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ACTIVITY_LABELS } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Award, Target } from 'lucide-react';

interface EmployeePerformanceMetricsProps {
  activities: Activity[];
  users: User[];
}

interface EmployeeMetrics {
  userId: string;
  userName: string;
  totalActivities: number;
  activityBreakdown: Record<ActivityType, number>;
  mostActiveType: ActivityType;
  recentActivityCount: number; // Last 7 days
  trend: 'up' | 'down' | 'stable';
}

export function EmployeePerformanceMetrics({ activities, users }: EmployeePerformanceMetricsProps) {
  const employeeMetrics = useMemo(() => {
    const metrics: EmployeeMetrics[] = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    users.forEach(user => {
      const userActivities = activities.filter(a => a.userId === user.id);
      
      // Count activities by type
      const breakdown: Record<ActivityType, number> = {
        expense: 0,
        sales: 0,
        customer: 0,
        production: 0,
        storage: 0,
      };

      userActivities.forEach(activity => {
        breakdown[activity.type]++;
      });

      // Find most active type
      const mostActiveType = (Object.entries(breakdown).reduce((max, [type, count]) => 
        count > breakdown[max as ActivityType] ? type as ActivityType : max
      , 'expense' as ActivityType));

      // Calculate recent activity count (last 7 days)
      const recentActivities = userActivities.filter(a => 
        new Date(a.createdAt) >= sevenDaysAgo
      );

      // Calculate previous week's activity count (8-14 days ago)
      const previousWeekActivities = userActivities.filter(a => {
        const date = new Date(a.createdAt);
        return date >= fourteenDaysAgo && date < sevenDaysAgo;
      });

      // Determine trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (recentActivities.length > previousWeekActivities.length) {
        trend = 'up';
      } else if (recentActivities.length < previousWeekActivities.length) {
        trend = 'down';
      }

      metrics.push({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        totalActivities: userActivities.length,
        activityBreakdown: breakdown,
        mostActiveType,
        recentActivityCount: recentActivities.length,
        trend
      });
    });

    // Sort by total activities (descending)
    return metrics.sort((a, b) => b.totalActivities - a.totalActivities);
  }, [activities, users]);

  const topPerformer = employeeMetrics[0];
  const avgActivitiesPerEmployee = useMemo(() => {
    if (employeeMetrics.length === 0) return 0;
    const total = employeeMetrics.reduce((sum, m) => sum + m.totalActivities, 0);
    return Math.round(total / employeeMetrics.length);
  }, [employeeMetrics]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };



  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformer ? (
              <div>
                <p className="text-2xl font-bold text-gray-900">{topPerformer.userName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {topPerformer.totalActivities} total activities
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {ACTIVITY_LABELS[topPerformer.mostActiveType]}
                  </Badge>
                  <span className="text-xs text-gray-500">Most active in</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Average Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{avgActivitiesPerEmployee}</p>
            <p className="text-sm text-gray-600 mt-1">Activities per employee</p>
            <p className="text-xs text-gray-500 mt-2">
              Based on {employeeMetrics.length} active employees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Activity Summary</CardTitle>
          <CardDescription>
            Detailed breakdown of activities by employee with weekly trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employeeMetrics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No employee data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">This Week</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                    <TableHead className="text-center">Expenses</TableHead>
                    <TableHead className="text-center">Sales</TableHead>
                    <TableHead className="text-center">Customer</TableHead>
                    <TableHead className="text-center">Production</TableHead>
                    <TableHead className="text-center">Storage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeMetrics.map((metric) => (
                    <TableRow key={metric.userId}>
                      <TableCell className="font-medium">
                        {metric.userName}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {metric.totalActivities}
                      </TableCell>
                      <TableCell className="text-center">
                        {metric.recentActivityCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getTrendIcon(metric.trend)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {metric.activityBreakdown.expense}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {metric.activityBreakdown.sales}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {metric.activityBreakdown.customer}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {metric.activityBreakdown.production}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {metric.activityBreakdown.storage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
