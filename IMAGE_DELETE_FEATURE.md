# Image Delete Feature

## Overview

Added functionality to allow users to delete uploaded images from activities. This feature provides a UI for removing images with confirmation dialogs and will integrate with backend deletion during API integration.

## Changes Made

### 1. Created AlertDialog Component

**File:** `src/components/ui/alert-dialog.tsx`

- Created a new Radix UI-based AlertDialog component
- Provides confirmation dialogs for destructive actions
- Fully accessible with keyboard navigation
- Responsive design for mobile and desktop

**Dependencies Added:**
```bash
npm install @radix-ui/react-alert-dialog
```

### 2. Enhanced ActivityDetailView Component

**File:** `src/components/dashboard/ActivityDetailView.tsx`

#### New Features:

1. **Delete Image Button** - Added to all image displays
   - Appears next to image title
   - Red color scheme to indicate destructive action
   - Disabled state while deletion is in progress

2. **Confirmation Dialog** - Prevents accidental deletions
   - Warning icon and clear messaging
   - "Cancel" and "Delete Image" buttons
   - Explains that action cannot be undone

3. **Image Deletion Handler** - `handleDeleteImage()`
   - Updates activity to remove image field
   - Shows success/error toast notifications
   - Calls optional callback after deletion
   - Handles loading states

4. **Reusable Image Renderer** - `renderImageWithDelete()`
   - Displays image with delete button
   - Consistent styling across all image types
   - Handles different image fields (receiptImage, machineImageBefore, etc.)

#### Updated Image Displays:

- **Expense Activities** - Receipt image with delete button
- **Sales Activities** - Receipt image with delete button
- **Production Activities** - Before and After images with delete buttons

### 3. Integration with Activity Context

Uses existing `updateActivity` function from ActivityContext:
```tsx
await updateActivity(activity.id, { [imageField]: '' });
```

This sets the image field to an empty string, effectively removing it from the activity.

## User Experience

### Delete Flow:

1. **User views activity** with images in ActivityDetailView
2. **Clicks "Delete" button** next to an image
3. **Confirmation dialog appears** with warning
4. **User confirms** by clicking "Delete Image"
5. **Image is removed** from activity
6. **Success toast** appears confirming deletion
7. **View updates** to reflect changes

### Visual Design:

```
┌─────────────────────────────────────┐
│ Receipt Image          [Delete]     │
├─────────────────────────────────────┤
│                                     │
│         [Image Preview]             │
│                                     │
└─────────────────────────────────────┘
```

### Confirmation Dialog:

```
┌─────────────────────────────────────┐
│ ⚠️  Delete Image?                   │
├─────────────────────────────────────┤
│ Are you sure you want to delete     │
│ this image? This action cannot be   │
│ undone. The image will be           │
│ permanently removed from this       │
│ activity.                           │
├─────────────────────────────────────┤
│           [Cancel] [Delete Image]   │
└─────────────────────────────────────┘
```

## Technical Details

### Image Fields Supported:

- `receiptImage` - Expense and Sales activities
- `machineImageBefore` - Production activities
- `machineImageAfter` - Production activities

### State Management:

```tsx
const [deletingImage, setDeletingImage] = useState<string | null>(null);
```

Tracks which image is currently being deleted to:
- Disable the delete button during deletion
- Prevent multiple simultaneous deletions
- Show loading state

### Error Handling:

```tsx
try {
  await updateActivity(activity.id, { [imageField]: '' });
  toast({ title: 'Image Deleted', ... });
} catch (error) {
  toast({ title: 'Error', variant: 'destructive', ... });
}
```

## Backend Integration Notes

### Current Implementation:

- Updates activity in localStorage
- Sets image field to empty string
- No actual file deletion (images are base64 strings)

### Future Backend Integration:

When integrating with a backend API, update the `handleDeleteImage` function to:

1. **Call backend API** to delete image file:
   ```tsx
   await fetch(`/api/activities/${activity.id}/images/${imageField}`, {
     method: 'DELETE'
   });
   ```

2. **Delete from cloud storage** (S3, Cloudinary, etc.):
   ```tsx
   await deleteImageFromStorage(imageUrl);
   ```

3. **Update database** to remove image reference:
   ```tsx
   await updateActivity(activity.id, { [imageField]: null });
   ```

### Recommended Backend Endpoint:

```
DELETE /api/activities/:activityId/images/:imageField
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "activity": { /* updated activity */ }
}
```

## Accessibility Features

✅ **Keyboard Navigation** - Full keyboard support for dialog
✅ **Screen Reader Support** - Proper ARIA labels and roles
✅ **Focus Management** - Focus trapped in dialog when open
✅ **Clear Messaging** - Descriptive text for all actions
✅ **Visual Indicators** - Red color for destructive action
✅ **Confirmation Required** - Prevents accidental deletions

## Testing Checklist

- [x] Delete button appears on all images
- [x] Confirmation dialog opens when clicked
- [x] Cancel button closes dialog without deleting
- [x] Delete button removes image from activity
- [x] Success toast appears after deletion
- [x] Error toast appears if deletion fails
- [x] Button is disabled during deletion
- [x] Multiple images can be deleted independently
- [x] Build succeeds without errors
- [x] No TypeScript errors
- [x] Responsive on mobile and desktop

## Security Considerations

### Current (LocalStorage):
- No security concerns (client-side only)
- Images stored as base64 in browser

### Future (Backend):
- **Authentication** - Verify user owns the activity
- **Authorization** - Check user permissions
- **Rate Limiting** - Prevent abuse
- **Audit Logging** - Track image deletions
- **Soft Delete** - Consider keeping deleted images for recovery

### Recommended Backend Validation:

```typescript
// Verify ownership
if (activity.userId !== currentUser.id && !currentUser.isAdmin) {
  throw new UnauthorizedException();
}

// Validate image field
const validFields = ['receiptImage', 'machineImageBefore', 'machineImageAfter'];
if (!validFields.includes(imageField)) {
  throw new BadRequestException();
}

// Delete from storage
await storageService.deleteFile(activity[imageField]);

// Update database
await activityRepository.update(activityId, { [imageField]: null });
```

## Benefits

1. **User Control** - Users can fix mistakes by removing wrong images
2. **Data Accuracy** - Ensures activities have correct images
3. **Storage Management** - Reduces storage usage by removing unwanted images
4. **Better UX** - Clear, safe deletion process with confirmation
5. **Accessibility** - Fully accessible to all users
6. **Backend Ready** - Easy to integrate with API when ready

## Future Enhancements

1. **Bulk Delete** - Delete multiple images at once
2. **Undo Feature** - Temporarily store deleted images for recovery
3. **Image History** - Track image changes over time
4. **Replace Image** - Delete and upload new image in one action
5. **Admin Override** - Allow admins to delete any image
6. **Deletion Reason** - Optional field to explain why image was deleted

## Summary

✅ Image deletion feature fully implemented
✅ Confirmation dialog prevents accidents
✅ Toast notifications provide feedback
✅ Accessible and responsive design
✅ Ready for backend integration
✅ Build succeeds with no errors

Users can now safely delete uploaded images from activities with a clear, intuitive interface! 🎉
