import { useState, useEffect, useRef } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  thumbnail?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage component with loading states and error handling
 * Implements intersection observer for lazy loading
 */
export function LazyImage({
  src,
  alt,
  className,
  fallbackClassName,
  thumbnail,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // For base64 images, load immediately without lazy loading
    if (src.startsWith('data:')) {
      setIsInView(true);
      return;
    }

    // Set up intersection observer for lazy loading URL-based images
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Disconnect observer once image is in view
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('LazyImage failed to load:', {
      src: src.substring(0, 50) + '...', // Log first 50 chars
      alt,
      error: e
    });
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  // Show error state
  if (hasError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-gray-100 text-gray-400',
          fallbackClassName || className
        )}
      >
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-xs text-center px-2">Failed to load image</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center',
            className
          )}
        >
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Thumbnail (if provided) - shown while full image loads */}
      {thumbnail && isLoading && isInView && (
        <img
          src={thumbnail}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover blur-sm',
            className
          )}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView ? src : ''}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}
