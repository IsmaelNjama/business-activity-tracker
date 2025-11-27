import { User, Activity } from '../types';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../lib/constants';

// Storage error class for better error handling
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

// Session data interface
export interface SessionData {
  userId: string;
  email: string;
  role: string;
  lastActivity: number;
}

/**
 * Check if localStorage is available and has space
 */
const checkStorageAvailable = (): void => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
  } catch (error) {
    if (error instanceof DOMException && (
      error.code === 22 ||
      error.code === 1014 ||
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      throw new StorageError(ERROR_MESSAGES.STORAGE_FULL);
    }
    throw new StorageError('localStorage is not available');
  }
};

/**
 * Safely parse JSON from localStorage
 */
const safeJSONParse = <T>(data: string | null, defaultValue: T): T => {
  if (!data) return defaultValue;
  
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Failed to parse JSON from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Safely stringify and store data in localStorage
 */
const safeJSONStringify = (key: string, data: unknown): void => {
  try {
    checkStorageAvailable();
    const jsonString = JSON.stringify(data);
    
    // Check if we're approaching localStorage quota
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    console.log(`Storing ${key}: ${sizeInMB.toFixed(2)} MB`);
    
    if (sizeInMB > 4) {
      console.warn(`Warning: ${key} is ${sizeInMB.toFixed(2)} MB. LocalStorage limit is typically 5-10 MB.`);
    }
    
    localStorage.setItem(key, jsonString);
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    
    // Check if it's a quota exceeded error
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      throw new StorageError('Storage quota exceeded. Please delete some activities or clear browser data.');
    }
    
    throw new StorageError(`Failed to store data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ============================================================================
// User Storage Operations
// ============================================================================

/**
 * Get all users from localStorage
 */
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return safeJSONParse<User[]>(data, []);
};

/**
 * Get a user by ID
 */
export const getUserById = (userId: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
};

/**
 * Get a user by email
 */
export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

/**
 * Save a new user to localStorage
 */
export const saveUser = (user: User): void => {
  const users = getUsers();
  
  // Check if user with same email already exists
  const existingUser = getUserByEmail(user.email);
  if (existingUser) {
    throw new StorageError(ERROR_MESSAGES.EMAIL_EXISTS);
  }
  
  users.push(user);
  safeJSONStringify(STORAGE_KEYS.USERS, users);
};

/**
 * Update an existing user in localStorage
 */
export const updateUser = (userId: string, updates: Partial<User>): User => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new StorageError('User not found');
  }
  
  // Merge updates with existing user data
  users[userIndex] = { ...users[userIndex], ...updates };
  safeJSONStringify(STORAGE_KEYS.USERS, users);
  
  return users[userIndex];
};

/**
 * Delete a user from localStorage
 */
export const deleteUser = (userId: string): void => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  safeJSONStringify(STORAGE_KEYS.USERS, filteredUsers);
};

// ============================================================================
// Activity Storage Operations
// ============================================================================

/**
 * Get all activities from localStorage
 */
export const getActivities = (): Activity[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  return safeJSONParse<Activity[]>(data, []);
};

/**
 * Get an activity by ID
 */
export const getActivityById = (activityId: string): Activity | null => {
  const activities = getActivities();
  return activities.find(activity => activity.id === activityId) || null;
};

/**
 * Get activities by user ID
 */
export const getActivitiesByUserId = (userId: string): Activity[] => {
  const activities = getActivities();
  return activities.filter(activity => activity.userId === userId);
};

/**
 * Save a new activity to localStorage
 */
export const saveActivity = (activity: Activity): void => {
  const activities = getActivities();
  activities.push(activity);
  safeJSONStringify(STORAGE_KEYS.ACTIVITIES, activities);
};

/**
 * Update an existing activity in localStorage
 */
export const updateActivity = (activityId: string, updates: Partial<Activity>): Activity => {
  const activities = getActivities();
  const activityIndex = activities.findIndex(activity => activity.id === activityId);
  
  if (activityIndex === -1) {
    throw new StorageError('Activity not found');
  }
  
  // Merge updates with existing activity data and update timestamp
  const updatedActivity = {
    ...activities[activityIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  } as Activity;
  
  activities[activityIndex] = updatedActivity;
  safeJSONStringify(STORAGE_KEYS.ACTIVITIES, activities);
  
  return updatedActivity;
};

/**
 * Delete an activity from localStorage
 */
export const deleteActivity = (activityId: string): void => {
  const activities = getActivities();
  const filteredActivities = activities.filter(activity => activity.id !== activityId);
  safeJSONStringify(STORAGE_KEYS.ACTIVITIES, filteredActivities);
};

// ============================================================================
// Session Storage Operations
// ============================================================================

/**
 * Get current session data
 */
export const getSession = (): SessionData | null => {
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  return safeJSONParse<SessionData | null>(data, null);
};

/**
 * Save session data
 */
export const saveSession = (sessionData: SessionData): void => {
  safeJSONStringify(STORAGE_KEYS.SESSION, sessionData);
};

/**
 * Update session last activity timestamp
 */
export const updateSessionActivity = (): void => {
  const session = getSession();
  if (session) {
    session.lastActivity = Date.now();
    saveSession(session);
  }
};

/**
 * Clear session data
 */
export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

/**
 * Check if session is valid (not expired)
 */
export const isSessionValid = (timeoutMs: number = 30 * 60 * 1000): boolean => {
  const session = getSession();
  if (!session) return false;
  
  const now = Date.now();
  const timeSinceLastActivity = now - session.lastActivity;
  
  return timeSinceLastActivity < timeoutMs;
};

// ============================================================================
// Current User Storage Operations
// ============================================================================

/**
 * Get current logged-in user
 */
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return safeJSONParse<User | null>(data, null);
};

/**
 * Save current logged-in user
 */
export const saveCurrentUser = (user: User): void => {
  safeJSONStringify(STORAGE_KEYS.CURRENT_USER, user);
};

/**
 * Clear current user data
 */
export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// ============================================================================
// Utility Operations
// ============================================================================

/**
 * Clear all application data from localStorage
 */
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get storage usage information
 */
export const getStorageInfo = (): { used: number; available: boolean } => {
  try {
    let used = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        used += data.length;
      }
    });
    
    return {
      used,
      available: true
    };
  } catch (error) {
    return {
      used: 0,
      available: false
    };
  }
};

/**
 * Export all data as JSON (for backup purposes)
 */
export const exportData = (): string => {
  const data = {
    users: getUsers(),
    activities: getActivities(),
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

/**
 * Import data from JSON (for restore purposes)
 */
export const importData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.users && Array.isArray(data.users)) {
      safeJSONStringify(STORAGE_KEYS.USERS, data.users);
    }
    
    if (data.activities && Array.isArray(data.activities)) {
      safeJSONStringify(STORAGE_KEYS.ACTIVITIES, data.activities);
    }
  } catch (error) {
    throw new StorageError('Invalid import data format');
  }
};
