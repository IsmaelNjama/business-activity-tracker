import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Factory, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { productionSchema, type ProductionFormData } from '@/lib/validators';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploadZone } from '@/components/shared/ImageUploadZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { ProductionActivity } from '@/types';

const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'ton', label: 'Tons' },
];

const STEPS = [
  { id: 1, title: 'Raw Material', description: 'Enter weight and unit' },
  { id: 2, title: 'Before Production', description: 'Upload machine image' },
  { id: 3, title: 'After Production', description: 'Upload machine image' },
  { id: 4, title: 'Additional Notes', description: 'Optional details' },
];

interface ProductionActivityFormProps {
  onSuccess?: () => void;
}

export function ProductionActivityForm({ onSuccess }: ProductionActivityFormProps) {
  const { user } = useAuth();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      rawMaterialWeight: 0,
      weightUnit: '',
      machineImageBefore: '',
      machineImageAfter: '',
      notes: ''
    },
    mode: 'onChange'
  });

  const machineImageBefore = watch('machineImageBefore');
  const machineImageAfter = watch('machineImageAfter');

  const handleImageBeforeSelect = (base64: string) => {
    setValue('machineImageBefore', base64, { shouldValidate: true });
  };

  const handleImageBeforeRemove = () => {
    setValue('machineImageBefore', '', { shouldValidate: true });
  };

  const handleImageAfterSelect = (base64: string) => {
    setValue('machineImageAfter', base64, { shouldValidate: true });
  };

  const handleImageAfterRemove = () => {
    setValue('machineImageAfter', '', { shouldValidate: true });
  };

  const canProceedToNextStep = async () => {
    let fieldsToValidate: (keyof ProductionFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['rawMaterialWeight', 'weightUnit'];
        break;
      case 2:
        fieldsToValidate = ['machineImageBefore'];
        break;
      case 3:
        fieldsToValidate = ['machineImageAfter'];
        break;
      case 4:
        // Notes are optional, always allow proceeding
        return true;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const handleNext = async () => {
    const canProceed = await canProceedToNextStep();
    if (canProceed && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProductionFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to record production activities',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const productionActivity: Omit<ProductionActivity, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        type: 'production',
        rawMaterialWeight: data.rawMaterialWeight,
        weightUnit: data.weightUnit,
        machineImageBefore: data.machineImageBefore,
        machineImageAfter: data.machineImageAfter,
        notes: data.notes
      };

      await addActivity(productionActivity);

      toast({
        title: 'Success',
        description: 'Production activity recorded successfully',
      });

      // Reset form
      reset({
        rawMaterialWeight: 0,
        weightUnit: '',
        machineImageBefore: '',
        machineImageAfter: '',
        notes: ''
      });
      setCurrentStep(1);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error recording production activity:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to record production activity. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rawMaterialWeight" className="text-sm">Raw Material Weight *</Label>
              <Input
                id="rawMaterialWeight"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter weight"
                {...register('rawMaterialWeight', { valueAsNumber: true })}
                className={errors.rawMaterialWeight ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
              />
              {errors.rawMaterialWeight && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.rawMaterialWeight.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightUnit" className="text-sm">Unit of Measurement *</Label>
              <Select
                id="weightUnit"
                {...register('weightUnit')}
                className={errors.weightUnit ? 'border-red-500 h-10 sm:h-11' : 'h-10 sm:h-11'}
              >
                <option value="">Select unit</option>
                {WEIGHT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
              {errors.weightUnit && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.weightUnit.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>Before Production:</strong> Take a photo of the machine and raw materials before starting production.
              </p>
            </div>
            <ImageUploadZone
              label="Machine Image (Before Production) *"
              currentImage={machineImageBefore}
              onImageSelect={handleImageBeforeSelect}
              onImageRemove={handleImageBeforeRemove}
            />
            {errors.machineImageBefore && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.machineImageBefore.message}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-green-800">
                <strong>After Production:</strong> Take a photo of the machine and finished products after completing production.
              </p>
            </div>
            <ImageUploadZone
              label="Machine Image (After Production) *"
              currentImage={machineImageAfter}
              onImageSelect={handleImageAfterSelect}
              onImageRemove={handleImageAfterRemove}
            />
            {errors.machineImageAfter && (
              <p className="text-xs sm:text-sm text-red-600">
                {errors.machineImageAfter.message}
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-700">
                Add any additional notes about the production process (optional).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm">Production Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes about the production process..."
                rows={6}
                {...register('notes')}
                className="resize-none text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-purple-100 p-1.5 sm:p-2 flex-shrink-0">
            <Factory className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Record Production Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Document production process with raw materials and machine status
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {/* Step Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-base font-semibold transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-1 sm:mt-2 text-center">
                    <p className={`text-xs font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 sm:h-1 flex-1 mx-1 sm:mx-2 transition-colors ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Step Content */}
          <div className="min-h-[250px] sm:min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-sm sm:text-base">Previous</span>
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  reset({
                    rawMaterialWeight: 0,
                    weightUnit: '',
                    machineImageBefore: '',
                    machineImageAfter: '',
                    notes: ''
                  });
                  setCurrentStep(1);
                }}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
              >
                <span className="text-sm sm:text-base">Clear All</span>
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
                >
                  <span className="text-sm sm:text-base">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-10 sm:h-11 touch-manipulation"
                >
                  <span className="text-sm sm:text-base">
                    {isSubmitting ? 'Recording...' : 'Record Production'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
