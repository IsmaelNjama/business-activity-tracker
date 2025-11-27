import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData } from '@/lib/validators';
import { BUSINESS_INFO, ROUTES, SUCCESS_MESSAGES } from '@/lib/constants';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, error: authError, clearError } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // Show session expired message if redirected from protected route
  useEffect(() => {
    if (authError && authError.includes('expired')) {
      toast({
        title: 'Session Expired',
        description: authError,
        variant: 'destructive'
      });
      clearError();
    }
  }, [authError, clearError, toast]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError(null);
      clearError();
      await login(data);
      
      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.LOGIN
      });
      
      // Redirect based on user role
      if (isAdmin) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.EMPLOYEE_DASHBOARD, { replace: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const displayError = error;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{displayError}</AlertDescription>
        </Alert>
      )}

      <LoginForm onSubmit={handleLogin} />

      {/* Business Information */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1 sm:mb-2">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">{BUSINESS_INFO.mission}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1 sm:mb-2">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-0.5 sm:space-y-1">
              {BUSINESS_INFO.values.map((value, index) => (
                <li key={index} className="leading-relaxed">{value}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1 sm:mb-2">Short-term Goals</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-0.5 sm:space-y-1">
              {BUSINESS_INFO.shortTermGoals.map((goal, index) => (
                <li key={index} className="leading-relaxed">{goal}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1 sm:mb-2">Long-term Goals</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-0.5 sm:space-y-1">
              {BUSINESS_INFO.longTermGoals.map((goal, index) => (
                <li key={index} className="leading-relaxed">{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center text-xs sm:text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          to={ROUTES.SIGNUP}
          className="font-medium text-blue-600 hover:text-blue-500 touch-manipulation"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
