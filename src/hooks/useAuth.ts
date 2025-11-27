import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * 
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType with user state and auth methods
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
