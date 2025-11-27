import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/hooks/useAuth';
import { SignupFormData } from '@/lib/validators';
import { ROUTES, SUCCESS_MESSAGES } from '@/lib/constants';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isAdmin, clearError } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: SignupFormData) => {
    try {
      setError(null);
      clearError();
      await signup(data);
      
      toast({
        title: 'Success',
        description: SUCCESS_MESSAGES.SIGNUP
      });
      
      // After successful signup and auto-login, redirect based on role
      if (isAdmin) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.EMPLOYEE_DASHBOARD, { replace: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const displayError = error;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Sign up to start tracking your business activities
        </p>
      </div>

      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{displayError}</AlertDescription>
        </Alert>
      )}

      <SignupForm onSubmit={handleSignup} />

      <div className="text-center text-xs sm:text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-blue-600 hover:text-blue-500 touch-manipulation"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};
