import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Activity, ActivityType, ActivityFilters } from '../types';
import * as activityService from '../services/activityService';

export interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Activity>;
  updateActivity: (activityId: string, updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<Activity>;
  deleteActivity: (activityId: string) => Promise<void>;
  getActivitiesByUser: (userId: string) => Activity[];
  getActivitiesByType: (type: ActivityType) => Activity[];
  filterActivities: (filters: ActivityFilters) => Activity[];
  getActivityCountsByType: (userId: string) => Record<ActivityType, number>;
  getAllActivityCountsByType: () => Record<ActivityType, number>;
  getRecentActivities: (userId: string, limit?: number) => Activity[];
  getAllRecentActivities: (limit?: number) => Activity[];
  refreshActivities: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load activities on mount
  const loadActivities = useCallback(() => {
    try {
      setLoading(true);
      const allActivities = activityService.getAllActivities();
      setActivities(activityService.sortActivitiesByDate(allActivities, 'desc'));
      setError(null);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const addActivity = useCallback(async (
    activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Activity> => {
    setError(null);

    try {
      const newActivity = await activityService.createActivity(activityData);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      let errorMessage = 'Failed to create activity';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Check for storage quota errors
        if (err.name === 'StorageError' && err.message.includes('Storage limit')) {
          errorMessage = 'Storage limit reached. Please contact your administrator or delete some old activities.';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateActivityHandler = useCallback(async (
    activityId: string,
    updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Activity> => {
    setError(null);

    try {
      const updatedActivity = await activityService.updateActivity(activityId, updates);
      setActivities(prev =>
        prev.map(activity =>
          activity.id === activityId ? updatedActivity : activity
        )
      );
      return updatedActivity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update activity';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteActivityHandler = useCallback(async (activityId: string): Promise<void> => {
    setError(null);

    try {
      await activityService.deleteActivity(activityId);
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete activity';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getActivitiesByUser = useCallback((userId: string): Activity[] => {
    return activities.filter(activity => activity.userId === userId);
  }, [activities]);

  const getActivitiesByType = useCallback((type: ActivityType): Activity[] => {
    return activities.filter(activity => activity.type === type);
  }, [activities]);

  const filterActivitiesHandler = useCallback((filters: ActivityFilters): Activity[] => {
    let filtered = [...activities];

    // Filter by user ID
    if (filters.userId) {
      filtered = filtered.filter(activity => activity.userId === filters.userId);
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= startDate;
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate <= endDate;
      });
    }

    return filtered;
  }, [activities]);

  const getActivityCountsByType = useCallback((userId: string): Record<ActivityType, number> => {
    return activityService.getActivityCountsByType(userId);
  }, []);

  const getAllActivityCountsByType = useCallback((): Record<ActivityType, number> => {
    return activityService.getAllActivityCountsByType();
  }, []);

  const getRecentActivities = useCallback((userId: string, limit: number = 10): Activity[] => {
    const userActivities = getActivitiesByUser(userId);
    return userActivities.slice(0, limit);
  }, [getActivitiesByUser]);

  const getAllRecentActivities = useCallback((limit: number = 10): Activity[] => {
    return activities.slice(0, limit);
  }, [activities]);

  const refreshActivities = useCallback(() => {
    loadActivities();
  }, [loadActivities]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value: ActivityContextType = {
    activities,
    addActivity,
    updateActivity: updateActivityHandler,
    deleteActivity: deleteActivityHandler,
    getActivitiesByUser,
    getActivitiesByType,
    filterActivities: filterActivitiesHandler,
    getActivityCountsByType,
    getAllActivityCountsByType,
    getRecentActivities,
    getAllRecentActivities,
    refreshActivities,
    loading,
    error,
    clearError
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};
