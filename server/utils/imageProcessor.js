const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
  constructor() {
    this.supportedFormats = [
      'jpeg', 'jpg', 'png', 'webp', 'avif', 'tiff', 'tif', 
      'gif', 'bmp', 'svg', 'heic', 'heif'
    ];
    
    this.outputFormats = {
      webp: { quality: 85, effort: 4 },
      jpeg: { quality: 85, progressive: true }
    };
    
    this.sizes = {
      thumbnail: { width: 150, height: 150 },
      small: { width: 300, height: 300 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 1200 }
    };
  }

  /**
   * Check if the uploaded file is a supported image format
   */
  isSupportedFormat(filename) {
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    return this.supportedFormats.includes(ext);
  }

  /**
   * Generate a unique filename
   */
  generateFilename(originalName, size = '', format = 'webp') {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '-');
    const sizePrefix = size ? `${size}-` : '';
    return `${sizePrefix}${baseName}-${timestamp}-${random}.${format}`;
  }

  /**
   * Process a single image file
   */
  async processImage(inputBuffer, originalName, outputDir) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      // Get image metadata
      const metadata = await sharp(inputBuffer).metadata();
      console.log(`Processing image: ${originalName} (${metadata.format}, ${metadata.width}x${metadata.height})`);

      const processedImages = {};

      // Process for each size and format
      for (const [sizeName, dimensions] of Object.entries(this.sizes)) {
        for (const [formatName, formatOptions] of Object.entries(this.outputFormats)) {
          const filename = this.generateFilename(originalName, sizeName, formatName);
          const outputPath = path.join(outputDir, filename);

          // Create Sharp pipeline
          let pipeline = sharp(inputBuffer)
            .resize(dimensions.width, dimensions.height, {
              fit: 'cover',
              position: 'center'
            });

          // Apply format-specific processing
          if (formatName === 'webp') {
            pipeline = pipeline.webp(formatOptions);
          } else if (formatName === 'jpeg') {
            pipeline = pipeline.jpeg(formatOptions);
          }

          // Save processed image
          await pipeline.toFile(outputPath);

          // Store in results
          if (!processedImages[sizeName]) {
            processedImages[sizeName] = {};
          }
          processedImages[sizeName][formatName] = {
            filename,
            path: outputPath,
            url: `/uploads/products/${filename}`,
            size: await this.getFileSize(outputPath)
          };
        }
      }

      // Also create original size versions
      for (const [formatName, formatOptions] of Object.entries(this.outputFormats)) {
        const filename = this.generateFilename(originalName, 'original', formatName);
        const outputPath = path.join(outputDir, filename);

        let pipeline = sharp(inputBuffer);

        if (formatName === 'webp') {
          pipeline = pipeline.webp(formatOptions);
        } else if (formatName === 'jpeg') {
          pipeline = pipeline.jpeg(formatOptions);
        }

        await pipeline.toFile(outputPath);

        if (!processedImages.original) {
          processedImages.original = {};
        }
        processedImages.original[formatName] = {
          filename,
          path: outputPath,
          url: `/uploads/products/${filename}`,
          size: await this.getFileSize(outputPath)
        };
      }

      return {
        success: true,
        originalMetadata: metadata,
        processedImages
      };

    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Get file size in bytes
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Generate responsive image URLs for frontend
   */
  generateResponsiveUrls(processedImages) {
    const responsive = {
      thumbnail: processedImages.thumbnail?.webp?.url || processedImages.thumbnail?.jpeg?.url,
      small: processedImages.small?.webp?.url || processedImages.small?.jpeg?.url,
      medium: processedImages.medium?.webp?.url || processedImages.medium?.jpeg?.url,
      large: processedImages.large?.webp?.url || processedImages.large?.jpeg?.url,
      original: processedImages.original?.webp?.url || processedImages.original?.jpeg?.url
    };

    return {
      // Primary URL (medium size, WebP preferred)
      url: responsive.medium,
      // Fallback URL (JPEG)
      fallbackUrl: processedImages.medium?.jpeg?.url,
      // All sizes
      responsive,
      // Source set for responsive images
      srcSet: [
        `${responsive.small} 300w`,
        `${responsive.medium} 600w`,
        `${responsive.large} 1200w`
      ].join(', '),
      // Sizes attribute
      sizes: '(max-width: 300px) 300px, (max-width: 600px) 600px, 1200px'
    };
  }

  /**
   * Clean up old image files
   */
  async cleanupImages(imageUrls) {
    if (!Array.isArray(imageUrls)) return;

    for (const imageUrl of imageUrls) {
      try {
        if (imageUrl && typeof imageUrl === 'string') {
          // Extract filename from URL
          const filename = path.basename(imageUrl);
          const filePath = path.join(__dirname, '../uploads/products', filename);
          
          // Check if file exists and delete
          try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`Cleaned up image: ${filename}`);
          } catch (error) {
            // File doesn't exist, ignore
          }
        }
      } catch (error) {
        console.error('Error cleaning up image:', error);
      }
    }
  }

  /**
   * Get optimized image URL based on browser support
   */
  getOptimizedUrl(processedImages, size = 'medium', preferWebP = true) {
    const sizeImages = processedImages[size];
    if (!sizeImages) return null;

    if (preferWebP && sizeImages.webp) {
      return sizeImages.webp.url;
    }
    
    return sizeImages.jpeg?.url || null;
  }

  /**
   * Generate image metadata for database storage
   */
  generateImageMetadata(processedImages, originalName, alt = '') {
    const responsive = this.generateResponsiveUrls(processedImages);
    
    return {
      url: responsive.url,
      alt: alt || originalName,
      responsive: responsive.responsive,
      srcSet: responsive.srcSet,
      sizes: responsive.sizes,
      fallbackUrl: responsive.fallbackUrl,
      originalName,
      processedAt: new Date()
    };
  }
}

module.exports = new ImageProcessor();
