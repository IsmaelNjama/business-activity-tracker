import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signupSchema, SignupFormData } from '@/lib/validators';
import { GENDER_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange'
  });
  
  const password = watch('password', '');
  const loading = isLoading || isSubmitting;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      {/* Name Fields - Side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            {...register('firstName')}
            className={errors.firstName ? 'border-red-500 focus:ring-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            disabled={loading}
          />
          {errors.firstName && (
            <p className="text-xs sm:text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            {...register('lastName')}
            className={errors.lastName ? 'border-red-500 focus:ring-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            disabled={loading}
          />
          {errors.lastName && (
            <p className="text-xs sm:text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
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
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      {/* Phone Number and Gender - Side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            {...register('phoneNumber')}
            className={errors.phoneNumber ? 'border-red-500 focus:ring-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            disabled={loading}
          />
          {errors.phoneNumber && (
            <p className="text-xs sm:text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
        
        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm">Gender</Label>
          <Select
            id="gender"
            {...register('gender')}
            className={errors.gender ? 'border-red-500 focus:ring-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            disabled={loading}
          >
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {errors.gender && (
            <p className="text-xs sm:text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
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
        <PasswordStrengthIndicator password={password} />
      </div>
      
      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500 pr-10 h-10 sm:h-11' : 'pr-10 h-10 sm:h-11'}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 touch-manipulation p-1"
            disabled={loading}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs sm:text-sm text-red-600">{errors.confirmPassword.message}</p>
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
            <span className="text-sm sm:text-base">Creating account...</span>
          </>
        ) : (
          <span className="text-sm sm:text-base">Sign Up</span>
        )}
      </Button>
    </form>
  );
};
