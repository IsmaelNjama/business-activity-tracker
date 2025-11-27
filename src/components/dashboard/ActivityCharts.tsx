import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, ActivityType } from '@/types';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityChartsProps {
  activities: Activity[];
}

// Color mapping for activity types
const ACTIVITY_COLORS: Record<ActivityType, string> = {
  expense: '#EF4444',
  sales: '#10B981',
  customer: '#3B82F6',
  production: '#8B5CF6',
  storage: '#F59E0B',
};

export const ActivityCharts: React.FC<ActivityChartsProps> = ({ activities }) => {
  // Prepare data for bar chart (activity counts by type)
  const barChartData = useMemo(() => {
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

    return Object.entries(counts).map(([type, count]) => ({
      name: ACTIVITY_LABELS[type as ActivityType],
      count,
      fill: ACTIVITY_COLORS[type as ActivityType],
    }));
  }, [activities]);

  // Prepare data for line chart (activity trends over time)
  const lineChartData = useMemo(() => {
    // Group activities by date
    const activityByDate: Record<string, Record<ActivityType, number>> = {};

    activities.forEach((activity) => {
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

    // Convert to array and sort by date
    const sortedData = Object.entries(activityByDate)
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .sort((a, b) => {
        // Parse dates for proper sorting
        const dateA = new Date(a.date + ', ' + new Date().getFullYear());
        const dateB = new Date(b.date + ', ' + new Date().getFullYear());
        return dateA.getTime() - dateB.getTime();
      });

    // Return last 7 days of data
    return sortedData.slice(-7);
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* Bar Chart - Activity Counts by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Distribution</CardTitle>
          <CardDescription>
            Total count of activities by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                }}
              />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Activity Trends Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Trends</CardTitle>
          <CardDescription>
            Daily activity counts over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke={ACTIVITY_COLORS.expense}
                strokeWidth={2}
                name={ACTIVITY_LABELS.expense}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={ACTIVITY_COLORS.sales}
                strokeWidth={2}
                name={ACTIVITY_LABELS.sales}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="customer"
                stroke={ACTIVITY_COLORS.customer}
                strokeWidth={2}
                name={ACTIVITY_LABELS.customer}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="production"
                stroke={ACTIVITY_COLORS.production}
                strokeWidth={2}
                name={ACTIVITY_LABELS.production}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="storage"
                stroke={ACTIVITY_COLORS.storage}
                strokeWidth={2}
                name={ACTIVITY_LABELS.storage}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
