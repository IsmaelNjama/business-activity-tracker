import React, { useState } from 'react';
import { Activity, ActivityType } from '@/types';
import { formatDate } from '@/lib/utils';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LazyImage } from '@/components/shared/LazyImage';
import { useActivities } from '@/hooks/useActivities';
import { useToast } from '@/hooks/use-toast';
import {
  Receipt,
  ShoppingCart,
  Users,
  Factory,
  Warehouse,
  Calendar,
  Clock,
  User,
  MapPin,
  Package,
  FileText,
  Weight,
  Image as ImageIcon,
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ActivityDetailViewProps {
  activity: Activity;
  userName?: string;
  onImageDeleted?: () => void;
}

const activityTypeColors: Record<ActivityType, string> = {
  expense: 'bg-red-100 text-red-700',
  sales: 'bg-green-100 text-green-700',
  customer: 'bg-blue-100 text-blue-700',
  production: 'bg-purple-100 text-purple-700',
  storage: 'bg-amber-100 text-amber-700',
};

const activityIcons: Record<ActivityType, React.ReactNode> = {
  expense: <Receipt className="h-6 w-6" />,
  sales: <ShoppingCart className="h-6 w-6" />,
  customer: <Users className="h-6 w-6" />,
  production: <Factory className="h-6 w-6" />,
  storage: <Warehouse className="h-6 w-6" />
};

export function ActivityDetailView({ activity, userName, onImageDeleted }: ActivityDetailViewProps) {
  const { updateActivity } = useActivities();
  const { toast } = useToast();
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const handleDeleteImage = async (imageField: string) => {
    setDeletingImage(imageField);
    try {
      // Update activity to remove the image
      await updateActivity(activity.id, { [imageField]: '' });
      
      toast({
        title: 'Image Deleted',
        description: 'The image has been successfully removed from this activity.',
      });

      // Call callback if provided
      if (onImageDeleted) {
        onImageDeleted();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingImage(null);
    }
  };

  const renderImageWithDelete = (
    imageUrl: string,
    imageField: string,
    altText: string,
    title: string
  ) => (
    <div className="flex items-start gap-3">
      <ImageIcon className="h-5 w-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={deletingImage === imageField}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Delete Image?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this image? This action cannot be undone.
                  {' '}The image will be permanently removed from this activity.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteImage(imageField)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Image
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <LazyImage
          src={imageUrl}
          alt={altText}
          className="rounded-lg border border-gray-200 max-w-full h-auto max-h-96 object-contain"
          fallbackClassName="rounded-lg border border-gray-200 w-full h-96"
        />
      </div>
    </div>
  );

  const renderExpenseDetails = (activity: Activity & { type: 'expense' }) => (
    <div className="space-y-4">
      {activity.description && (
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          </div>
        </div>
      )}
      {activity.receiptImage && renderImageWithDelete(
        activity.receiptImage,
        'receiptImage',
        'Expense receipt',
        'Receipt Image'
      )}
    </div>
  );

  const renderSalesDetails = (activity: Activity & { type: 'sales' }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Date</p>
            <p className="text-sm text-gray-600 mt-1">{activity.date}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Time</p>
            <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <User className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Serving Employee</p>
          <p className="text-sm text-gray-600 mt-1">{activity.servingEmployee}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Users className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Buyer Name</p>
          <p className="text-sm text-gray-600 mt-1">{activity.buyerName}</p>
        </div>
      </div>
      {activity.receiptImage && renderImageWithDelete(
        activity.receiptImage,
        'receiptImage',
        'Sales receipt',
        'Receipt Image'
      )}
    </div>
  );

  const renderCustomerDetails = (activity: Activity & { type: 'customer' }) => (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Users className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Customer Name</p>
          <p className="text-sm text-gray-600 mt-1">{activity.customerName}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Service Date</p>
          <p className="text-sm text-gray-600 mt-1">{formatDate(activity.serviceDate)}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Service Type</p>
          <p className="text-sm text-gray-600 mt-1">{activity.serviceType}</p>
        </div>
      </div>
      {activity.notes && (
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Notes</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{activity.notes}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderProductionDetails = (activity: Activity & { type: 'production' }) => (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Weight className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Raw Material Weight</p>
          <p className="text-sm text-gray-600 mt-1">
            {activity.rawMaterialWeight} {activity.weightUnit}
          </p>
        </div>
      </div>
      {activity.notes && (
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Notes</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{activity.notes}</p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {activity.machineImageBefore && renderImageWithDelete(
          activity.machineImageBefore,
          'machineImageBefore',
          'Machine before production',
          'Before Production'
        )}
        {activity.machineImageAfter && renderImageWithDelete(
          activity.machineImageAfter,
          'machineImageAfter',
          'Machine after production',
          'After Production'
        )}
      </div>
    </div>
  );

  const renderStorageDetails = (activity: Activity & { type: 'storage' }) => (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Location</p>
          <p className="text-sm text-gray-600 mt-1">{activity.location}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Package className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Item Description</p>
          <p className="text-sm text-gray-600 mt-1">{activity.itemDescription}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Quantity</p>
          <p className="text-sm text-gray-600 mt-1">{activity.quantity}</p>
        </div>
      </div>
      {activity.condition && (
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Condition</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{activity.condition}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderActivitySpecificDetails = () => {
    switch (activity.type) {
      case 'expense':
        return renderExpenseDetails(activity as Activity & { type: 'expense' });
      case 'sales':
        return renderSalesDetails(activity as Activity & { type: 'sales' });
      case 'customer':
        return renderCustomerDetails(activity as Activity & { type: 'customer' });
      case 'production':
        return renderProductionDetails(activity as Activity & { type: 'production' });
      case 'storage':
        return renderStorageDetails(activity as Activity & { type: 'storage' });
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`rounded-lg p-3 ${activityTypeColors[activity.type]}`}>
              {activityIcons[activity.type]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {ACTIVITY_LABELS[activity.type]}
                </h3>
                <Badge variant="secondary" className={activityTypeColors[activity.type]}>
                  {activity.type}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                {userName && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{userName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(activity.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(activity.createdAt, 'time')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Details */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Activity Details</h4>
          <Separator className="mb-4" />
          {renderActivitySpecificDetails()}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Metadata</h4>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Activity ID</p>
              <p className="text-gray-900 font-mono text-xs mt-1">{activity.id}</p>
            </div>
            <div>
              <p className="text-gray-500">User ID</p>
              <p className="text-gray-900 font-mono text-xs mt-1">{activity.userId}</p>
            </div>
            <div>
              <p className="text-gray-500">Created At</p>
              <p className="text-gray-900 mt-1">{formatDate(activity.createdAt, 'full')}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="text-gray-900 mt-1">{formatDate(activity.updatedAt, 'full')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
