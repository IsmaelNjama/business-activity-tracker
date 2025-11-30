import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { EmployeeDashboard } from '@/pages/EmployeeDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Profile } from '@/pages/Profile';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { ExpenseReceipts } from '@/pages/ExpenseReceipts';
import { SalesReceipts } from '@/pages/SalesReceipts';
import { CustomerService } from '@/pages/CustomerService';
import { ProductionActivities } from '@/pages/ProductionActivities';
import { StorageInfo } from '@/pages/StorageInfo';
import { ROUTES } from '@/lib/constants';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SkipToMain } from '@/components/shared/SkipToMain';

function App() {
  return (
    <ErrorBoundary>
      <SkipToMain />
      <Routes>
      {/* Redirect root to login */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
      </Route>
      
      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Employee dashboard */}
        <Route path="employee" element={<EmployeeDashboard />} />
        
        {/* Admin dashboard */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        
        {/* Profile page */}
        <Route path="profile" element={<Profile />} />
        
        {/* Activity Pages */}
        <Route path="activities/expense" element={<ExpenseReceipts />} />
        <Route path="activities/sales" element={<SalesReceipts />} />
        <Route path="activities/customer" element={<CustomerService />} />
        <Route path="activities/production" element={<ProductionActivities />} />
        <Route path="activities/storage" element={<StorageInfo />} />
      </Route>
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
    <Toaster />
    </ErrorBoundary>
  );
}

export default App;
