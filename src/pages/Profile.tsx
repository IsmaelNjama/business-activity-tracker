import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { profileUpdateSchema, ProfileUpdateFormData } from '@/lib/validators';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Edit2, X } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || 'male'
    }
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || 'male'
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {isEditing ? 'Update your profile details' : 'View your profile details'}
                </CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2 w-full sm:w-auto touch-manipulation"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-sm">Edit Profile</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Enter your first name"
                    disabled={isSubmitting || loading}
                    className="h-10 sm:h-11"
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
                    {...register('lastName')}
                    placeholder="Enter your last name"
                    disabled={isSubmitting || loading}
                    className="h-10 sm:h-11"
                  />
                  {errors.lastName && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  disabled={isSubmitting || loading}
                  className="h-10 sm:h-11"
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting || loading}
                    className="h-10 sm:h-11"
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
                    disabled={isSubmitting || loading}
                    className="h-10 sm:h-11"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex-1 h-10 sm:h-11 touch-manipulation"
                >
                  <span className="text-sm sm:text-base">
                    {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting || loading}
                  className="gap-2 h-10 sm:h-11 touch-manipulation"
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm sm:text-base">Cancel</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* First Name Display */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">First Name</p>
                  <p className="text-sm sm:text-base text-gray-900">{user.firstName}</p>
                </div>

                {/* Last Name Display */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Last Name</p>
                  <p className="text-sm sm:text-base text-gray-900">{user.lastName}</p>
                </div>
              </div>

              {/* Email Display */}
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-sm sm:text-base text-gray-900 break-all">{user.email}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Phone Number Display */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                  <p className="text-sm sm:text-base text-gray-900">{user.phoneNumber}</p>
                </div>

                {/* Gender Display */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Gender</p>
                  <p className="text-sm sm:text-base text-gray-900 capitalize">{user.gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Role Display */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Role</p>
                  <p className="text-sm sm:text-base text-gray-900 capitalize">{user.role}</p>
                </div>

                {/* Account Created */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Member Since</p>
                  <p className="text-sm sm:text-base text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
