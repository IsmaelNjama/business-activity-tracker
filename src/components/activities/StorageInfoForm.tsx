import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package } from 'lucide-react';
import { storageSchema, type StorageFormData } from '@/lib/validators';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { StorageActivity } from '@/types';

const COMMON_LOCATIONS = [
  { value: 'warehouse-a', label: 'Warehouse A' },
  { value: 'warehouse-b', label: 'Warehouse B' },
  { value: 'storage-room-1', label: 'Storage Room 1' },
  { value: 'storage-room-2', label: 'Storage Room 2' },
  { value: 'cold-storage', label: 'Cold Storage' },
  { value: 'outdoor-yard', label: 'Outdoor Yard' },
  { value: 'loading-dock', label: 'Loading Dock' },
  { value: 'other', label: 'Other (specify below)' },
];

interface StorageInfoFormProps {
  onSuccess?: () => void;
}

export function StorageInfoForm({ onSuccess }: StorageInfoFormProps) {
  const { user } = useAuth();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<StorageFormData>({
    resolver: zodResolver(storageSchema),
    defaultValues: {
      location: '',
      itemDescription: '',
      quantity: 0,
      condition: ''
    }
  });

  const selectedLocation = watch('location');

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('location', value, { shouldValidate: true });
    
    if (value === 'other') {
      setShowCustomLocation(true);
      setValue('location', '', { shouldValidate: false });
    } else {
      setShowCustomLocation(false);
    }
  };

  const onSubmit = async (data: StorageFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to record storage information',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const storageActivity: Omit<StorageActivity, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        type: 'storage',
        location: data.location,
        itemDescription: data.itemDescription,
        quantity: data.quantity,
        condition: data.condition
      };

      await addActivity(storageActivity);

      toast({
        title: 'Success',
        description: 'Storage information recorded successfully',
      });

      // Reset form
      reset({
        location: '',
        itemDescription: '',
        quantity: 0,
        condition: ''
      });
      setShowCustomLocation(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error recording storage information:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to record storage information. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-amber-100 p-1.5 sm:p-2 flex-shrink-0">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Record Storage Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Track inventory locations and storage conditions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Location Selection */}
          <div className="space-y-2">
            <Label htmlFor="location-select" className="text-sm">Storage Location *</Label>
            <Select
              id="location-select"
              value={showCustomLocation ? 'other' : selectedLocation}
              onChange={handleLocationChange}
              className={errors.location ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            >
              <option value="">Select a location</option>
              {COMMON_LOCATIONS.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </Select>
            {errors.location && !showCustomLocation && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Custom Location Input */}
          {showCustomLocation && (
            <div className="space-y-2">
              <Label htmlFor="custom-location" className="text-sm">Custom Location *</Label>
              <Input
                id="custom-location"
                type="text"
                placeholder="Enter custom location"
                {...register('location')}
                className={errors.location ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
              />
              {errors.location && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>
          )}

          {/* Item Description */}
          <div className="space-y-2">
            <Label htmlFor="itemDescription" className="text-sm">Item Description *</Label>
            <Textarea
              id="itemDescription"
              placeholder="Describe the items being stored (e.g., Raw materials, finished products, packaging supplies...)"
              rows={4}
              {...register('itemDescription')}
              className={errors.itemDescription ? 'border-red-500 resize-none text-sm' : 'resize-none text-sm'}
            />
            {errors.itemDescription && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.itemDescription.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Minimum 5 characters required
            </p>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              min="0"
              placeholder="Enter quantity"
              {...register('quantity', { valueAsNumber: true })}
              className={errors.quantity ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            />
            {errors.quantity && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Enter the number of units or items
            </p>
          </div>

          {/* Condition Notes */}
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm">Condition Notes (Optional)</Label>
            <Textarea
              id="condition"
              placeholder="Enter any notes about the storage condition (e.g., temperature, humidity, packaging status...)"
              rows={4}
              {...register('condition')}
              className="resize-none text-sm"
            />
            <p className="text-xs text-gray-500">
              Optional: Add details about storage conditions or item status
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  location: '',
                  itemDescription: '',
                  quantity: 0,
                  condition: ''
                });
                setShowCustomLocation(false);
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
            >
              <span className="text-sm sm:text-base">Clear Form</span>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
            >
              <span className="text-sm sm:text-base">
                {isSubmitting ? 'Recording...' : 'Record Storage Info'}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
