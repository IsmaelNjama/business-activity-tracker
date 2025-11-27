import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If authenticated but not admin, redirect to employee dashboard
  if (!isAdmin) {
    return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />;
  }

  return <>{children}</>;
}
