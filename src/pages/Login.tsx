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
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/sunrise.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-blue-900/85"></div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Brand & Information */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Brand */}
          <div>
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
            
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Grow Your Wealth With<br />Smart Accounting Today
            </h2>
          </div>

          {/* Business Information */}
          <div className="space-y-6 max-w-lg">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-300 rounded-full"></span>
                Our Mission
              </h3>
              <p className="text-blue-50 text-sm leading-relaxed">
                {BUSINESS_INFO.mission}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-300 rounded-full"></span>
                Our Values
              </h3>
              <ul className="space-y-2 text-blue-50 text-sm">
                {BUSINESS_INFO.values.map((value, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <h3 className="font-semibold mb-2 text-sm">Short-term Goals</h3>
                <ul className="space-y-1.5 text-blue-50 text-xs">
                  {BUSINESS_INFO.shortTermGoals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-blue-300 text-xs">•</span>
                      <span className="leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <h3 className="font-semibold mb-2 text-sm">Long-term Goals</h3>
                <ul className="space-y-1.5 text-blue-50 text-xs">
                  {BUSINESS_INFO.longTermGoals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-blue-300 text-xs">•</span>
                      <span className="leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to your account</h2>
              <p className="text-sm text-gray-600">
                Welcome back! Please enter your details
              </p>
            </div>

            {displayError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{displayError}</AlertDescription>
              </Alert>
            )}

            <LoginForm onSubmit={handleLogin} />

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link
                to={ROUTES.SIGNUP}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign up for free
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
