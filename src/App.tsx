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
import { ExpenseReceiptUpload } from '@/components/activities/ExpenseReceiptUpload';
import { SalesReceiptForm } from '@/components/activities/SalesReceiptForm';
import { CustomerServiceForm } from '@/components/activities/CustomerServiceForm';
import { ProductionActivityForm } from '@/components/activities/ProductionActivityForm';
import { StorageInfoForm } from '@/components/activities/StorageInfoForm';
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
        
        {/* Activities page - Expense Upload */}
        <Route
          path="activities/expense"
          element={
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Log Expense</h1>
              <ExpenseReceiptUpload />
            </div>
          }
        />
        
        {/* Activities page - Sales Receipt */}
        <Route
          path="activities/sales"
          element={
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Record Sales Receipt</h1>
              <SalesReceiptForm />
            </div>
          }
        />
        
        {/* Activities page - Customer Service */}
        <Route
          path="activities/customer"
          element={
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Log Customer Service</h1>
              <CustomerServiceForm />
            </div>
          }
        />
        
        {/* Activities page - Production Activity */}
        <Route
          path="activities/production"
          element={
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Record Production Activity</h1>
              <ProductionActivityForm />
            </div>
          }
        />
        
        {/* Activities page - Storage Information */}
        <Route
          path="activities/storage"
          element={
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Record Storage Information</h1>
              <StorageInfoForm />
            </div>
          }
        />
      </Route>
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
    <Toaster />
    </ErrorBoundary>
  );
}

export default App;
