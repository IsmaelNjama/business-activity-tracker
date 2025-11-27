import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShoppingCart } from 'lucide-react';
import { salesReceiptSchema, type SalesReceiptFormData } from '@/lib/validators';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploadZone } from '@/components/shared/ImageUploadZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SalesActivity } from '@/types';

interface SalesReceiptFormProps {
  onSuccess?: () => void;
}

export function SalesReceiptForm({ onSuccess }: SalesReceiptFormProps) {
  const { user } = useAuth();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<SalesReceiptFormData>({
    resolver: zodResolver(salesReceiptSchema),
    defaultValues: {
      receiptImage: '',
      date: '',
      time: '',
      servingEmployee: user ? `${user.firstName} ${user.lastName}` : '',
      buyerName: ''
    }
  });

  const receiptImage = watch('receiptImage');

  const handleImageSelect = (base64: string) => {
    setValue('receiptImage', base64, { shouldValidate: true });
  };

  const handleImageRemove = () => {
    setValue('receiptImage', '', { shouldValidate: true });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setValue('date', formattedDate, { shouldValidate: true });
    } else {
      setValue('date', '', { shouldValidate: true });
    }
  };

  const onSubmit = async (data: SalesReceiptFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to record sales receipts',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const salesActivity: Omit<SalesActivity, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        type: 'sales',
        receiptImage: data.receiptImage,
        date: data.date,
        time: data.time,
        servingEmployee: data.servingEmployee,
        buyerName: data.buyerName
      };

      await addActivity(salesActivity);

      toast({
        title: 'Success',
        description: 'Sales receipt recorded successfully',
      });

      // Reset form
      reset({
        receiptImage: '',
        date: '',
        time: '',
        servingEmployee: user ? `${user.firstName} ${user.lastName}` : '',
        buyerName: ''
      });
      setSelectedDate(undefined);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error recording sales receipt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to record sales receipt. Please try again.';
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
          <div className="rounded-full bg-green-100 p-1.5 sm:p-2 flex-shrink-0">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Record Sales Receipt</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Upload a sales receipt with transaction details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Receipt Image Upload */}
          <div>
            <ImageUploadZone
              label="Receipt Image *"
              currentImage={receiptImage}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
            />
            {errors.receiptImage && (
              <p className="text-sm text-red-600 mt-1">
                {errors.receiptImage.message}
              </p>
            )}
          </div>

          {/* Date and Time - Side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">Sale Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-10 sm:h-11 text-sm',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time Input */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm">Sale Time *</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
                className={errors.time ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
              />
              {errors.time && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Serving Employee (Auto-filled) */}
          <div className="space-y-2">
            <Label htmlFor="servingEmployee" className="text-sm">Serving Employee *</Label>
            <Input
              id="servingEmployee"
              type="text"
              {...register('servingEmployee')}
              className={errors.servingEmployee ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
              readOnly
            />
            {errors.servingEmployee && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.servingEmployee.message}
              </p>
            )}
          </div>

          {/* Buyer Name */}
          <div className="space-y-2">
            <Label htmlFor="buyerName" className="text-sm">Buyer Name *</Label>
            <Input
              id="buyerName"
              type="text"
              placeholder="Enter buyer's name"
              {...register('buyerName')}
              className={errors.buyerName ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            />
            {errors.buyerName && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.buyerName.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  receiptImage: '',
                  date: '',
                  time: '',
                  servingEmployee: user ? `${user.firstName} ${user.lastName}` : '',
                  buyerName: ''
                });
                setSelectedDate(undefined);
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
            >
              <span className="text-sm sm:text-base">Clear</span>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !receiptImage}
              className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
            >
              <span className="text-sm sm:text-base">
                {isSubmitting ? 'Recording...' : 'Record Sale'}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
