# Shared Components

## LazyImage

A React component that implements lazy loading for images with loading states and error handling.

### Features

- **Lazy Loading**: Uses Intersection Observer to load images only when they enter the viewport
- **Loading States**: Shows a skeleton loader while the image is loading
- **Error Handling**: Displays a fallback UI if the image fails to load
- **Thumbnail Support**: Can display a blurred thumbnail while the full image loads
- **Performance**: Starts loading 50px before the image enters the viewport

### Usage

```typescript
import { LazyImage } from '@/components/shared/LazyImage';

function MyComponent() {
  return (
    <LazyImage
      src="https://example.com/image.jpg"
      alt="Description"
      className="w-full h-64 object-cover rounded-lg"
      fallbackClassName="w-full h-64 rounded-lg"
      thumbnail="data:image/jpeg;base64,..."
      onLoad={() => console.log('Image loaded')}
      onError={() => console.log('Image failed to load')}
    />
  );
}
```

### Props

- `src` (string, required): The image source URL or base64 string
- `alt` (string, required): Alternative text for the image
- `className` (string, optional): CSS classes for the image element
- `fallbackClassName` (string, optional): CSS classes for the error fallback
- `thumbnail` (string, optional): Thumbnail image to show while loading
- `onLoad` (function, optional): Callback when image loads successfully
- `onError` (function, optional): Callback when image fails to load

### Loading States

1. **Initial**: Shows a gray skeleton with an image icon
2. **Loading with Thumbnail**: Shows blurred thumbnail if provided
3. **Loaded**: Fades in the full image
4. **Error**: Shows error icon with message

## ImageUploadZone

An enhanced image upload component with drag-and-drop, compression, and preview functionality.

### Features

- **Drag and Drop**: Supports dragging images directly into the upload zone
- **Image Compression**: Automatically compresses images before upload (configurable)
- **Image Preview**: Shows a preview of the uploaded image with zoom capability
- **File Validation**: Validates file type (JPEG, PNG, WebP) and size (max 10MB)
- **Mobile Friendly**: Touch-optimized buttons and responsive design
- **Error Handling**: Clear error messages for invalid files

### Usage

```typescript
import { ImageUploadZone } from '@/components/shared/ImageUploadZone';

function MyComponent() {
  const [image, setImage] = useState<string>('');

  return (
    <ImageUploadZone
      label="Upload Receipt"
      currentImage={image}
      onImageSelect={(base64) => setImage(base64)}
      onImageRemove={() => setImage('')}
      compress={true}
    />
  );
}
```

### Props

- `onImageSelect` (function, required): Callback with base64 image string
- `onImageRemove` (function, optional): Callback when image is removed
- `currentImage` (string, optional): Current image to display
- `label` (string, optional): Label text for the upload zone
- `className` (string, optional): Additional CSS classes
- `compress` (boolean, optional, default: true): Enable image compression

## ActivityCard

Displays a summary card for an activity with lazy-loaded image thumbnails.

### Features

- **Activity Type Icons**: Different icons for each activity type
- **Image Thumbnails**: Shows lazy-loaded thumbnails for activities with images
- **Responsive Design**: Adapts to different screen sizes
- **Click Handler**: Optional onClick for viewing details
- **User Information**: Can display user name for admin views

### Usage

```typescript
import { ActivityCard } from '@/components/shared/ActivityCard';

function MyComponent() {
  return (
    <ActivityCard
      activity={activityData}
      onClick={() => console.log('Card clicked')}
      showUser={true}
      userName="John Doe"
    />
  );
}
```

### Image Optimization

The ActivityCard automatically displays thumbnails for:
- Expense activities (receipt image)
- Sales activities (receipt image)
- Production activities (before production image)

Images are lazy-loaded using the LazyImage component for optimal performance.
