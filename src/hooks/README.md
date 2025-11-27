# Image Upload Hook

## useImageUpload

A custom React hook for handling image uploads with automatic compression and thumbnail generation.

### Features

- **Automatic Image Compression**: Reduces image size to 80% quality by default
- **Thumbnail Generation**: Optionally creates smaller thumbnails for list views
- **File Validation**: Validates file type and size before processing
- **Error Handling**: Provides clear error messages for invalid files
- **Loading States**: Tracks processing state for UI feedback

### Usage

```typescript
import { useImageUpload } from '@/hooks/useImageUpload';

function MyComponent() {
  const { uploadImage, isProcessing, error, clearError } = useImageUpload();

  const handleFileSelect = async (file: File) => {
    const result = await uploadImage(file, {
      compress: true,
      generateThumb: true,
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      thumbnailSize: 200
    });

    if (result.fullImage && !result.error) {
      // Use result.fullImage for the full-size image
      // Use result.thumbnail for the thumbnail (if generated)
      console.log('Image uploaded successfully');
    }
  };

  return (
    <div>
      {isProcessing && <p>Processing image...</p>}
      {error && <p>Error: {error}</p>}
      <input type="file" onChange={(e) => {
        if (e.target.files?.[0]) {
          handleFileSelect(e.target.files[0]);
        }
      }} />
    </div>
  );
}
```

### Options

- `compress` (boolean, default: true): Enable image compression
- `generateThumb` (boolean, default: false): Generate a thumbnail
- `maxWidth` (number, default: 1920): Maximum width in pixels
- `maxHeight` (number, default: 1080): Maximum height in pixels
- `quality` (number, default: 0.8): Compression quality (0-1)
- `thumbnailSize` (number, default: 200): Thumbnail size in pixels

### Return Values

- `uploadImage`: Function to upload and process an image
- `isProcessing`: Boolean indicating if an image is being processed
- `error`: Error message string or null
- `clearError`: Function to clear the error state
