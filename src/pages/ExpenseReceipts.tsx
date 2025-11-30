import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { ExpenseReceiptUpload } from '@/components/activities/ExpenseReceiptUpload';
import { ActivityCard } from '@/components/shared/ActivityCard';
import { ActivityDetailView } from '@/components/dashboard/ActivityDetailView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Activity } from '@/types';
import { getUsers } from '@/services/storageService';
import { Receipt } from 'lucide-react';

export const ExpenseReceipts: React.FC = () => {
  const { user } = useAuth();
  const { getActivitiesByUser } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get user's expense activities
  const expenseActivities = useMemo(() => {
    if (!user) return [];
    const activities = getActivitiesByUser(user.id);
    const expenseOnly = activities.filter(a => a.type === 'expense');
    return expenseOnly.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [user, getActivitiesByUser, refreshKey]);

  const handleSuccess = () => {
    // Refresh the list after successful upload
    setRefreshKey(prev => prev + 1);
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
    // Refresh in case image was deleted
    setRefreshKey(prev => prev + 1);
  };

  const getUserName = (userId: string) => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-red-100 p-3">
          <Receipt className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense Receipts</h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload and manage your expense receipts
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <ExpenseReceiptUpload onSuccess={handleSuccess} />

      {/* Recent Expenses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Expenses
          </h2>
          <span className="text-sm text-gray-600">
            {expenseActivities.length} {expenseActivities.length === 1 ? 'receipt' : 'receipts'}
          </span>
        </div>

        {expenseActivities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No expense receipts yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload your first expense receipt using the form above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expenseActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => handleActivityClick(activity)}
                showUser={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Activity Detail Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Receipt Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <ActivityDetailView
              activity={selectedActivity}
              userName={getUserName(selectedActivity.userId)}
              onImageDeleted={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
