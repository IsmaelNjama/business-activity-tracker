import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users } from 'lucide-react';
import { customerServiceSchema, type CustomerServiceFormData } from '@/lib/validators';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SERVICE_TYPES } from '@/lib/constants';
import { Select } from '@/components/ui/select';
import type { CustomerActivity } from '@/types';

interface CustomerServiceFormProps {
  onSuccess?: () => void;
}

export function CustomerServiceForm({ onSuccess }: CustomerServiceFormProps) {
  const { user } = useAuth();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CustomerServiceFormData>({
    resolver: zodResolver(customerServiceSchema),
    defaultValues: {
      customerName: '',
      serviceDate: '',
      serviceType: '',
      notes: ''
    }
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setValue('serviceDate', formattedDate, { shouldValidate: true });
    } else {
      setValue('serviceDate', '', { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CustomerServiceFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to log customer service',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const customerActivity: Omit<CustomerActivity, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        type: 'customer',
        customerName: data.customerName,
        serviceDate: data.serviceDate,
        serviceType: data.serviceType,
        notes: data.notes
      };

      await addActivity(customerActivity);

      toast({
        title: 'Success',
        description: 'Customer service logged successfully',
      });

      // Reset form
      reset({
        customerName: '',
        serviceDate: '',
        serviceType: '',
        notes: ''
      });
      setSelectedDate(undefined);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error logging customer service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to log customer service. Please try again.';
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
          <div className="rounded-full bg-blue-100 p-1.5 sm:p-2 flex-shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Log Customer Service</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Record information about customer interactions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-sm">Customer Name *</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Enter customer's name"
              {...register('customerName')}
              className={errors.customerName ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
            />
            {errors.customerName && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Service Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="serviceDate" className="text-sm">Service Date *</Label>
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
              {errors.serviceDate && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.serviceDate.message}
                </p>
              )}
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="serviceType" className="text-sm">Service Type *</Label>
              <Select
                id="serviceType"
                {...register('serviceType')}
                className={errors.serviceType ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
              >
                <option value="">Select service type</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {errors.serviceType && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.serviceType.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details about the service interaction..."
              rows={4}
              {...register('notes')}
              className={errors.notes ? 'border-red-500 resize-none text-sm' : 'resize-none text-sm'}
            />
            {errors.notes && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.notes.message}
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
                  customerName: '',
                  serviceDate: '',
                  serviceType: '',
                  notes: ''
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
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
            >
              <span className="text-sm sm:text-base">
                {isSubmitting ? 'Logging...' : 'Log Service'}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
