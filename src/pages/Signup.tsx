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
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/dog-park-petting-dog.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-blue-900/85"></div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Brand (Simplified for Signup) */}
        <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">BAT</h1>
              <p className="text-sm text-blue-100">Business Activity Tracker</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Join us today and<br />start growing your<br />business
          </h2>
          
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Track expenses, manage sales, monitor production, and gain insights into your business operations.
          </p>
        </div>
      </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Mobile Brand */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">BAT</h1>
                <p className="text-xs text-gray-600">Business Activity Tracker</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-sm text-gray-600">
                Get started with your free account today
              </p>
            </div>

            {displayError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{displayError}</AlertDescription>
              </Alert>
            )}

            <SignupForm onSubmit={handleSignup} />

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Log in
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
