import { useContext } from 'react';
import { ActivityContext, ActivityContextType } from '../contexts/ActivityContext';

/**
 * Custom hook to access the Activity context
 * @throws Error if used outside of ActivityProvider
 */
export const useActivities = (): ActivityContextType => {
  const context = useContext(ActivityContext);

  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }

  return context;
};
