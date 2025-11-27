import { Activity, ActivityType, ActivityFilters } from '../types';
import * as storageService from './storageService';

/**
 * Create a new activity
 */
export const createActivity = async (
  activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Activity> => {
  const now = new Date().toISOString();
  
  const newActivity: Activity = {
    ...activityData,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  } as Activity;

  storageService.saveActivity(newActivity);
  return newActivity;
};

/**
 * Get all activities
 */
export const getAllActivities = (): Activity[] => {
  return storageService.getActivities();
};

/**
 * Get activity by ID
 */
export const getActivityById = (activityId: string): Activity | null => {
  return storageService.getActivityById(activityId);
};

/**
 * Get activities by user ID
 */
export const getActivitiesByUserId = (userId: string): Activity[] => {
  return storageService.getActivitiesByUserId(userId);
};

/**
 * Get activities by type
 */
export const getActivitiesByType = (type: ActivityType): Activity[] => {
  const activities = storageService.getActivities();
  return activities.filter(activity => activity.type === type);
};

/**
 * Get activities by user ID and type
 */
export const getActivitiesByUserAndType = (userId: string, type: ActivityType): Activity[] => {
  const activities = storageService.getActivitiesByUserId(userId);
  return activities.filter(activity => activity.type === type);
};

/**
 * Filter activities based on multiple criteria
 */
export const filterActivities = (filters: ActivityFilters): Activity[] => {
  let activities = storageService.getActivities();

  // Filter by user ID
  if (filters.userId) {
    activities = activities.filter(activity => activity.userId === filters.userId);
  }

  // Filter by type
  if (filters.type) {
    activities = activities.filter(activity => activity.type === filters.type);
  }

  // Filter by date range
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    activities = activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate >= startDate;
    });
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    // Set to end of day
    endDate.setHours(23, 59, 59, 999);
    activities = activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate <= endDate;
    });
  }

  return activities;
};

/**
 * Sort activities by date (newest first by default)
 */
export const sortActivitiesByDate = (
  activities: Activity[],
  order: 'asc' | 'desc' = 'desc'
): Activity[] => {
  return [...activities].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Get activity counts by type for a user
 */
export const getActivityCountsByType = (userId: string): Record<ActivityType, number> => {
  const activities = storageService.getActivitiesByUserId(userId);
  
  const counts: Record<ActivityType, number> = {
    expense: 0,
    sales: 0,
    customer: 0,
    production: 0,
    storage: 0
  };

  activities.forEach(activity => {
    counts[activity.type]++;
  });

  return counts;
};

/**
 * Get activity counts by type for all users (admin view)
 */
export const getAllActivityCountsByType = (): Record<ActivityType, number> => {
  const activities = storageService.getActivities();
  
  const counts: Record<ActivityType, number> = {
    expense: 0,
    sales: 0,
    customer: 0,
    production: 0,
    storage: 0
  };

  activities.forEach(activity => {
    counts[activity.type]++;
  });

  return counts;
};

/**
 * Get recent activities for a user
 */
export const getRecentActivities = (userId: string, limit: number = 10): Activity[] => {
  const activities = storageService.getActivitiesByUserId(userId);
  const sorted = sortActivitiesByDate(activities, 'desc');
  return sorted.slice(0, limit);
};

/**
 * Get recent activities for all users (admin view)
 */
export const getAllRecentActivities = (limit: number = 10): Activity[] => {
  const activities = storageService.getActivities();
  const sorted = sortActivitiesByDate(activities, 'desc');
  return sorted.slice(0, limit);
};

/**
 * Update an existing activity
 */
export const updateActivity = async (
  activityId: string,
  updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Activity> => {
  return storageService.updateActivity(activityId, updates);
};

/**
 * Delete an activity
 */
export const deleteActivity = async (activityId: string): Promise<void> => {
  storageService.deleteActivity(activityId);
};

/**
 * Get activities grouped by date
 */
export const getActivitiesGroupedByDate = (activities: Activity[]): Record<string, Activity[]> => {
  const grouped: Record<string, Activity[]> = {};

  activities.forEach(activity => {
    const date = new Date(activity.createdAt).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });

  return grouped;
};

/**
 * Get activity statistics for a date range
 */
export const getActivityStats = (userId: string, startDate?: string, endDate?: string) => {
  const filters: ActivityFilters = { userId };
  
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const activities = filterActivities(filters);
  const counts = getActivityCountsByType(userId);

  return {
    total: activities.length,
    byType: counts,
    activities: sortActivitiesByDate(activities, 'desc')
  };
};
