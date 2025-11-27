import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, SignupData, LoginData } from '../types';
import * as authService from '../services/authService';
import { ROUTES } from '../lib/constants';
import { updateSessionActivity } from '../services/storageService';

export interface AuthContextType {
  user: User | null;
  login: (loginData: LoginData) => Promise<void>;
  signup: (signupData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCheckInterval, setSessionCheckInterval] = useState<number | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentAuthUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Handle session timeout
  const handleSessionTimeout = useCallback(() => {
    setUser(null);
    authService.logout();
    setError('Your session has expired. Please log in again.');
    
    // Redirect to login page
    window.location.href = ROUTES.LOGIN;
  }, []);

  // Check session validity periodically
  useEffect(() => {
    if (!user) {
      // Clear interval if user logs out
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        setSessionCheckInterval(null);
      }
      return;
    }

    // Check session every minute
    const interval = setInterval(() => {
      if (!authService.isAuthenticated()) {
        handleSessionTimeout();
      }
    }, 60000); // Check every minute

    setSessionCheckInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, handleSessionTimeout]);

  // Update session activity on user interaction
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      updateSessionActivity();
    };

    // Update activity on various user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [user]);

  const login = useCallback(async (loginData: LoginData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await authService.login(loginData);
      setUser(loggedInUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (signupData: SignupData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await authService.signup(signupData);
      // After signup, automatically log the user in
      await login({ email: signupData.email, password: signupData.password });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback((): void => {
    authService.logout();
    setUser(null);
    setError(null);
    
    // Clear session check interval
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      setSessionCheckInterval(null);
    }
  }, [sessionCheckInterval]);

  const updateProfile = useCallback(async (
    updates: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>
  ): Promise<void> => {
    if (!user) {
      const error = new Error('No user logged in');
      setError(error.message);
      throw error;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(user.id, updates);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isAdmin: !!user && user.role === 'admin',
    loading,
    error,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
