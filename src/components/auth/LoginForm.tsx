import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });
  
  const loading = isLoading || isSubmitting;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-red-500 focus:ring-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
          disabled={loading}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            className={errors.password ? 'border-red-500 focus:ring-red-500 pr-10 h-10 sm:h-11' : 'pr-10 h-10 sm:h-11'}
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 touch-manipulation p-1"
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs sm:text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-10 sm:h-11 touch-manipulation"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            <span className="text-sm sm:text-base">Logging in...</span>
          </>
        ) : (
          <span className="text-sm sm:text-base">Log In</span>
        )}
      </Button>
    </form>
  );
};
