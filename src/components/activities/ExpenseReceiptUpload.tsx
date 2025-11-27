import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt } from 'lucide-react';
import { expenseSchema, type ExpenseFormData } from '@/lib/validators';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploadZone } from '@/components/shared/ImageUploadZone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExpenseActivity } from '@/types';

interface ExpenseReceiptUploadProps {
  onSuccess?: () => void;
}

export function ExpenseReceiptUpload({ onSuccess }: ExpenseReceiptUploadProps) {
  const { user } = useAuth();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      receiptImage: '',
      description: ''
    }
  });

  const receiptImage = watch('receiptImage');

  const handleImageSelect = (base64: string) => {
    setValue('receiptImage', base64, { shouldValidate: true });
  };

  const handleImageRemove = () => {
    setValue('receiptImage', '', { shouldValidate: true });
  };

  const onSubmit = async (data: ExpenseFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload expense receipts',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseActivity: Omit<ExpenseActivity, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        type: 'expense',
        receiptImage: data.receiptImage,
        description: data.description
      };

      await addActivity(expenseActivity);

      toast({
        title: 'Success',
        description: 'Expense receipt uploaded successfully',
      });

      // Reset form
      reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading expense receipt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload expense receipt. Please try again.';
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
            <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Upload Expense Receipt</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Upload a receipt image to track your business expenses
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

          {/* Optional Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes about this expense..."
              rows={4}
              {...register('description')}
              className="resize-none text-sm"
            />
            {errors.description && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
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
                {isSubmitting ? 'Uploading...' : 'Upload Receipt'}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
