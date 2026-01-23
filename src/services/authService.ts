import { User, SignupData, LoginData, LoginResponse } from '../types';
import { authApiService } from '@/api/authApi';
import {
  getUserByEmail,
  getUsers,
  saveUser,
  updateUser,
  saveSession,
  clearSession,
  saveCurrentUser,
  clearCurrentUser,
  getSession,
  isSessionValid,
  updateSessionActivity,
  SessionData
} from './storageService';
import { ERROR_MESSAGES } from '../lib/constants';

// Simple password hashing simulation for MVP
// In production, this should be handled by the backend with proper bcrypt/argon2
// const hashPassword = (password: string): string => {
//   // Simple base64 encoding for MVP - NOT SECURE for production
//   // This is just a placeholder to simulate password hashing
//   return btoa(password + '_hashed_salt_2024');
// };

// const verifyPassword = (password: string, hashedPassword: string): boolean => {
//   return hashPassword(password) === hashedPassword;
// };

// Store hashed passwords separately (in production, this would be in the backend database)
interface StoredCredentials {
  [username: string]: string; // username -> hashedPassword
}

const CREDENTIALS_KEY = 'app_credentials';

const getCredentials = (): StoredCredentials => {
  const data = localStorage.getItem(CREDENTIALS_KEY);
  if (!data) return {};
  
  try {
    return JSON.parse(data) as StoredCredentials;
  } catch {
    return {};
  }
};

const saveCredentials = (credentials: StoredCredentials): void => {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
};

/**
 * Register a new user
 */
export const signup = async (signupData: SignupData): Promise<User> => {
    try {
      const { confirmPassword, ...dataToPost } = signupData;
      const newUser = await authApiService.registerEmployee(dataToPost);
      saveUser(newUser);
      return newUser;
    } catch (error) {
      throw new Error('Registration failed: ' + (error as Error).message);
      
    }

};

/**
 * Login user with username and password
 */
export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  if (!loginData.username || !loginData.password) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const response = await authApiService.loginEmployee(loginData)
  console.log(response)
  localStorage.setItem('token', response.access_token)
  localStorage.setItem('employee', JSON.stringify(response.employee))

  

  // Create session
  const sessionData: SessionData = {
    userId: response.employee.id,
    email: response.employee.email,
    role: response.employee.role,
    lastActivity: Date.now()
  };

  saveSession(sessionData);
  saveCurrentUser(response.employee);

  return response;
};

/**
 * Logout current user
 */
export const logout = (): void => {
  clearSession();
  clearCurrentUser();
};

/**
 * Get current authenticated user
 */
export const getCurrentAuthUser = (): User | null => {
  // Check if session is valid
  if (!isSessionValid()) {
    // Session expired, clear everything
    logout();
    return null;
  }

  // Update session activity
  updateSessionActivity();

  // Get user from storage
  const session = getSession();
  if (!session) return null;

  const user = getUserByEmail(session.email);
  return user;
};


//  * Update user profile

export const updateProfile = async (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>
): Promise<User> => {
  // If email is being updated, check if new email already exists
  if (updates.email) {
    const existingUser = getUserByEmail(updates.email);
    if (existingUser && existingUser.id !== userId) {
      throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    }
  }

  // Update user
  const updatedUser = updateUser(userId, updates);

  // Update current user in storage if it's the same user
  const session = getSession();
  if (session && session.userId === userId) {
    saveCurrentUser(updatedUser);
  }

  return updatedUser;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return isSessionValid() && getSession() !== null;
};

/**
 * Check if current user is admin
 */
export const isAdmin = (): boolean => {
  const session = getSession();
  return session?.role === 'admin';
};


