import React, { useState } from 'react';
import { getImageUrl as getApiImageUrl } from '../../utils/api';

const ResponsiveImage = ({ 
  image, 
  alt, 
  className = '', 
  size = 'medium',
  fallbackSrc = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle different image formats - FIXED: No more infinite recursion
  const processImageUrl = (imageData, requestedSize = size) => {
    if (!imageData) return fallbackSrc;
    
    // If it's a string (old format or simple URL)
    if (typeof imageData === 'string') {
      return getApiImageUrl(imageData); // Use the imported API function
    }
    
    // If it's new format with responsive images
    if (imageData.responsive && imageData.responsive[requestedSize]) {
      const url = imageData.responsive[requestedSize];
      return getApiImageUrl(url);
    }
    
    // Fallback to main URL
    if (imageData.url) {
      const url = imageData.url;
      return getApiImageUrl(url);
    }
    
    return fallbackSrc;
  };

  const getFallbackUrl = (imageData) => {
    if (!imageData) return fallbackSrc;
    
    if (typeof imageData === 'string') {
      return getApiImageUrl(imageData);
    }
    
    if (imageData.fallbackUrl) {
      const url = imageData.fallbackUrl;
      return getApiImageUrl(url);
    }
    
    return processImageUrl(imageData);
  };

  const getSrcSet = (imageData) => {
    if (!imageData || typeof imageData === 'string') return '';
    
    if (imageData.srcSet) {
      // Convert relative URLs to absolute using API utility
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      return imageData.srcSet.replace(/\/uploads/g, `${API_BASE_URL}/uploads`);
    }
    
    return '';
  };

  const getSizes = (imageData) => {
    if (!imageData || typeof imageData === 'string') return '';
    return imageData.sizes || '(max-width: 300px) 300px, (max-width: 600px) 600px, 1200px';
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const primaryUrl = processImageUrl(image, size);
  const fallbackUrl = getFallbackUrl(image);
  const srcSet = getSrcSet(image);
  const sizes = getSizes(image);

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      
      {/* Responsive image with WebP support */}
      <picture>
        {/* WebP source with srcset for responsive images */}
        {srcSet && !imageError && (
          <source 
            srcSet={srcSet} 
            sizes={sizes}
            type="image/webp" 
          />
        )}
        
        {/* Fallback image */}
        <img
          src={imageError ? fallbackSrc : (primaryUrl || fallbackUrl)}
          alt={alt || 'Product image'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </picture>
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
