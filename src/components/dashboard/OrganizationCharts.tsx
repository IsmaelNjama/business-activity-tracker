import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, ActivityType, User } from '@/types';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OrganizationChartsProps {
  activities: Activity[];
  users: User[];
}

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  expense: '#EF4444',
  sales: '#10B981',
  customer: '#3B82F6',
  production: '#8B5CF6',
  storage: '#F59E0B',
};

export function OrganizationCharts({ activities, users }: OrganizationChartsProps) {
  // Activity distribution pie chart data
  const pieChartData = useMemo(() => {
    const counts: Record<ActivityType, number> = {
      expense: 0,
      sales: 0,
      customer: 0,
      production: 0,
      storage: 0,
    };

    activities.forEach((activity) => {
      counts[activity.type]++;
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        name: ACTIVITY_LABELS[type as ActivityType],
        value: count,
        color: ACTIVITY_COLORS[type as ActivityType],
      }));
  }, [activities]);

  // Activity trends over last 30 days
  const trendChartData = useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const activityByDate: Record<string, Record<ActivityType, number>> = {};

    activities
      .filter(a => new Date(a.createdAt) >= last30Days)
      .forEach((activity) => {
        const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        if (!activityByDate[date]) {
          activityByDate[date] = {
            expense: 0,
            sales: 0,
            customer: 0,
            production: 0,
            storage: 0,
          };
        }

        activityByDate[date][activity.type]++;
      });

    return Object.entries(activityByDate)
      .map(([date, counts]) => ({
        date,
        ...counts,
        total: Object.values(counts).reduce((sum, count) => sum + count, 0),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date + ', ' + new Date().getFullYear());
        const dateB = new Date(b.date + ', ' + new Date().getFullYear());
        return dateA.getTime() - dateB.getTime();
      });
  }, [activities]);

  // Employee activity comparison
  const employeeComparisonData = useMemo(() => {
    const userMap = new Map<string, string>();
    users.forEach(user => {
      userMap.set(user.id, `${user.firstName} ${user.lastName}`);
    });

    const employeeActivities = new Map<string, number>();
    activities.forEach(activity => {
      const count = employeeActivities.get(activity.userId) || 0;
      employeeActivities.set(activity.userId, count + 1);
    });

    return Array.from(employeeActivities.entries())
      .map(([userId, count]) => ({
        name: userMap.get(userId) || 'Unknown',
        activities: count,
      }))
      .sort((a, b) => b.activities - a.activities)
      .slice(0, 10); // Top 10 employees
  }, [activities, users]);

  // Activity type by employee
  const activityTypeByEmployeeData = useMemo(() => {
    const userMap = new Map<string, string>();
    users.forEach(user => {
      userMap.set(user.id, `${user.firstName} ${user.lastName}`);
    });

    const employeeTypeBreakdown = new Map<string, Record<ActivityType, number>>();
    
    activities.forEach(activity => {
      if (!employeeTypeBreakdown.has(activity.userId)) {
        employeeTypeBreakdown.set(activity.userId, {
          expense: 0,
          sales: 0,
          customer: 0,
          production: 0,
          storage: 0,
        });
      }
      const breakdown = employeeTypeBreakdown.get(activity.userId)!;
      breakdown[activity.type]++;
    });

    return Array.from(employeeTypeBreakdown.entries())
      .map(([userId, breakdown]) => ({
        name: userMap.get(userId) || 'Unknown',
        ...breakdown,
      }))
      .sort((a, b) => {
        const totalA = Object.values(a).reduce((sum: number, val) => 
          typeof val === 'number' ? sum + val : sum, 0);
        const totalB = Object.values(b).reduce((sum: number, val) => 
          typeof val === 'number' ? sum + val : sum, 0);
        return totalB - totalA;
      })
      .slice(0, 8); // Top 8 employees
  }, [activities, users]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Activity Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <CardDescription>
              Organization-wide breakdown by activity type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Activity Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Top Employees</CardTitle>
            <CardDescription>
              Most active employees by total activity count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={employeeComparisonData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="activities" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trends Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Trends (Last 30 Days)</CardTitle>
          <CardDescription>
            Daily activity counts by type over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={trendChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="expense"
                stroke={ACTIVITY_COLORS.expense}
                strokeWidth={2}
                name={ACTIVITY_LABELS.expense}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={ACTIVITY_COLORS.sales}
                strokeWidth={2}
                name={ACTIVITY_LABELS.sales}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="customer"
                stroke={ACTIVITY_COLORS.customer}
                strokeWidth={2}
                name={ACTIVITY_LABELS.customer}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="production"
                stroke={ACTIVITY_COLORS.production}
                strokeWidth={2}
                name={ACTIVITY_LABELS.production}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="storage"
                stroke={ACTIVITY_COLORS.storage}
                strokeWidth={2}
                name={ACTIVITY_LABELS.storage}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stacked Bar Chart - Activity Types by Employee */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown by Employee</CardTitle>
          <CardDescription>
            Distribution of activity types for top employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={activityTypeByEmployeeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                dataKey="expense"
                stackId="a"
                fill={ACTIVITY_COLORS.expense}
                name={ACTIVITY_LABELS.expense}
              />
              <Bar
                dataKey="sales"
                stackId="a"
                fill={ACTIVITY_COLORS.sales}
                name={ACTIVITY_LABELS.sales}
              />
              <Bar
                dataKey="customer"
                stackId="a"
                fill={ACTIVITY_COLORS.customer}
                name={ACTIVITY_LABELS.customer}
              />
              <Bar
                dataKey="production"
                stackId="a"
                fill={ACTIVITY_COLORS.production}
                name={ACTIVITY_LABELS.production}
              />
              <Bar
                dataKey="storage"
                stackId="a"
                fill={ACTIVITY_COLORS.storage}
                name={ACTIVITY_LABELS.storage}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
