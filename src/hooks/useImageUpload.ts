import { useState, useCallback } from 'react';
import { compressImage, generateThumbnail, validateImageFile } from '@/lib/utils';

interface ImageUploadOptions {
  compress?: boolean;
  generateThumb?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  thumbnailSize?: number;
}

interface ImageUploadResult {
  fullImage: string;
  thumbnail?: string;
  error?: string;
}

interface UseImageUploadReturn {
  uploadImage: (file: File, options?: ImageUploadOptions) => Promise<ImageUploadResult>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for handling image uploads with compression and thumbnail generation
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (
    file: File,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> => {
    const {
      compress = true,
      generateThumb = false,
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      thumbnailSize = 200
    } = options;

    setIsProcessing(true);
    setError(null);

    try {
      // Validate the file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        const errorMsg = validation.error || 'Invalid image file';
        console.error('Image validation failed:', errorMsg);
        setError(errorMsg);
        return { fullImage: '', error: errorMsg };
      }

      console.log('Processing image:', {
        name: file.name,
        size: file.size,
        type: file.type,
        compress,
        maxWidth,
        maxHeight,
        quality
      });

      // Process the full image
      let fullImage: string;
      if (compress) {
        fullImage = await compressImage(file, maxWidth, maxHeight, quality);
        console.log('Image compressed successfully, base64 length:', fullImage.length);
      } else {
        // Convert to base64 without compression
        fullImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        console.log('Image converted to base64, length:', fullImage.length);
      }

      // Generate thumbnail if requested
      let thumbnail: string | undefined;
      if (generateThumb) {
        thumbnail = await generateThumbnail(file, thumbnailSize);
      }

      return { fullImage, thumbnail };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process image';
      setError(errorMsg);
      console.error('Image upload error:', err);
      return { fullImage: '', error: errorMsg };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    uploadImage,
    isProcessing,
    error,
    clearError
  };
}
