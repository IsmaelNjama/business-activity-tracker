import { User, SignupData, LoginData } from '../types';
import {
  getUserByEmail,
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
const hashPassword = (password: string): string => {
  // Simple base64 encoding for MVP - NOT SECURE for production
  // This is just a placeholder to simulate password hashing
  return btoa(password + '_hashed_salt_2024');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// Store hashed passwords separately (in production, this would be in the backend database)
interface StoredCredentials {
  [email: string]: string; // email -> hashedPassword
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
  // Check if user already exists
  const existingUser = getUserByEmail(signupData.email);
  if (existingUser) {
    throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
  }

  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    firstName: signupData.firstName,
    lastName: signupData.lastName,
    email: signupData.email,
    phoneNumber: signupData.phoneNumber,
    gender: signupData.gender,
    role: 'employee', // Default role is employee
    createdAt: new Date().toISOString()
  };

  // Hash and store password
  const hashedPassword = hashPassword(signupData.password);
  const credentials = getCredentials();
  credentials[signupData.email.toLowerCase()] = hashedPassword;
  saveCredentials(credentials);

  // Save user to storage
  saveUser(newUser);

  return newUser;
};

/**
 * Login user with email and password
 */
export const login = async (loginData: LoginData): Promise<User> => {
  // Find user by email
  const user = getUserByEmail(loginData.email);
  if (!user) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Verify password
  const credentials = getCredentials();
  const hashedPassword = credentials[loginData.email.toLowerCase()];
  
  if (!hashedPassword || !verifyPassword(loginData.password, hashedPassword)) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Create session
  const sessionData: SessionData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    lastActivity: Date.now()
  };

  saveSession(sessionData);
  saveCurrentUser(user);

  return user;
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

/**
 * Update user profile
 */
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

/**
 * Change user password
 */
export const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  // Verify old password
  const credentials = getCredentials();
  const hashedPassword = credentials[email.toLowerCase()];
  
  if (!hashedPassword || !verifyPassword(oldPassword, hashedPassword)) {
    throw new Error('Current password is incorrect');
  }

  // Hash and save new password
  const newHashedPassword = hashPassword(newPassword);
  credentials[email.toLowerCase()] = newHashedPassword;
  saveCredentials(credentials);
};

/**
 * Promote user to admin (for testing purposes)
 */
export const promoteToAdmin = (userId: string): User => {
  return updateUser(userId, { role: 'admin' });
};
