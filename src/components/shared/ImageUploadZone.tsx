import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageUploadZoneProps {
  onImageSelect: (base64: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  label?: string;
  className?: string;
  compress?: boolean;
}

export function ImageUploadZone({
  onImageSelect,
  onImageRemove,
  currentImage,
  label = 'Upload Image',
  className,
  compress = true
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { uploadImage, isProcessing, error, clearError } = useImageUpload();

  const handleFile = useCallback(async (file: File) => {
    clearError();

    const result = await uploadImage(file, {
      compress,
      generateThumb: false,
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8
    });

    if (result.fullImage && !result.error) {
      onImageSelect(result.fullImage);
    }
  }, [compress, onImageSelect, uploadImage, clearError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    clearError();
    if (onImageRemove) {
      onImageRemove();
    }
  }, [onImageRemove, clearError]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-xs sm:text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {currentImage ? (
        <div className="relative">
          <div className="relative rounded-lg border-2 border-gray-200 overflow-hidden group">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                  >
                    <ZoomIn className="h-4 w-4 mr-1" />
                    <span className="text-sm">Preview</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <img
                    src={currentImage}
                    alt="Full preview"
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
              >
                <X className="h-4 w-4 mr-1" />
                <span className="text-sm">Remove</span>
              </Button>
            </div>
          </div>
          {/* Mobile-friendly buttons always visible on touch devices */}
          <div className="mt-2 flex gap-2 sm:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="flex-1 touch-manipulation"
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              <span className="text-sm">Preview</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="flex-1 touch-manipulation"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-sm">Remove</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors duration-200',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400',
            isProcessing && 'opacity-50 pointer-events-none'
          )}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-manipulation"
            disabled={isProcessing}
            aria-label={label}
            aria-describedby={error ? 'upload-error' : undefined}
          />
          
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-gray-600">Processing image...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-gray-100 p-2 sm:p-3 mb-3 sm:mb-4">
                  {isDragging ? (
                    <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  ) : (
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 text-center">
                  {isDragging ? 'Drop image here' : 'Tap to select or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mb-2 sm:mb-3 text-center">
                  {isDragging ? '' : 'Choose an image from your device'}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  JPEG, PNG, or WebP (max 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p id="upload-error" className="text-xs sm:text-sm text-red-600 flex items-start gap-1" role="alert">
          <span className="font-medium">Error:</span> 
          <span className="flex-1">{error}</span>
        </p>
      )}
    </div>
  );
}
