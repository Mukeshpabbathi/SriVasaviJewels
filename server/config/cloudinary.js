const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageProcessor = require('../utils/imageProcessor');

// Check if Cloudinary credentials are provided
const hasCloudinaryCredentials = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
  process.env.CLOUDINARY_API_KEY !== 'demo' &&
  process.env.CLOUDINARY_API_SECRET !== 'demo';

let cloudinaryStorage = null;

// Configure Cloudinary only if credentials are provided
if (hasCloudinaryCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'srivasavijewels/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif'],
      transformation: [
        { width: 800, height: 800, crop: 'limit', quality: 'auto' },
        { format: 'webp' }
      ]
    }
  });
  
  console.log('✅ Cloudinary storage configured');
} else {
  console.log('ℹ️ Using local file storage with image processing (Cloudinary credentials not provided)');
}

// Configure local storage with image processing
const localStorage = multer.memoryStorage(); // Store in memory for processing

// File filter function - now accepts all image formats
const fileFilter = (req, file, cb) => {
  // Check if it's an image file
  if (file.mimetype.startsWith('image/')) {
    // Check if it's a supported format
    if (imageProcessor.isSupportedFormat(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported image format: ${path.extname(file.originalname)}. Supported formats: ${imageProcessor.supportedFormats.join(', ')}`), false);
    }
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload middleware
const createUpload = (useCloudinary = hasCloudinaryCredentials) => {
  return multer({
    storage: useCloudinary && cloudinaryStorage ? cloudinaryStorage : localStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit (larger since we'll compress)
      files: 10 // Maximum 10 files
    }
  });
};

// Upload single image
const uploadSingle = createUpload().single('image');

// Upload multiple images
const uploadMultiple = createUpload().array('images', 10);

// Upload fields (for different image types)
const uploadFields = createUpload().fields([
  { name: 'primaryImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 9 }
]);

// Process uploaded images
const processUploadedImages = async (files, fieldName = 'images') => {
  if (!files || files.length === 0) return [];

  const processedImages = [];
  const outputDir = path.join(__dirname, '../uploads/products');

  for (const file of files) {
    try {
      console.log(`Processing ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);

      // Process the image
      const result = await imageProcessor.processImage(
        file.buffer,
        file.originalname,
        outputDir
      );

      if (result.success) {
        // Generate image metadata for database
        const imageMetadata = imageProcessor.generateImageMetadata(
          result.processedImages,
          file.originalname,
          `${fieldName} - ${file.originalname}`
        );

        processedImages.push(imageMetadata);
        console.log(`✅ Successfully processed: ${file.originalname}`);
      }

    } catch (error) {
      console.error(`❌ Failed to process ${file.originalname}:`, error.message);
      throw new Error(`Image processing failed for ${file.originalname}: ${error.message}`);
    }
  }

  return processedImages;
};

// Helper function to delete image from Cloudinary or local storage
const deleteImage = async (imageUrl) => {
  if (!hasCloudinaryCredentials) {
    // For local storage, delete all related files
    try {
      if (typeof imageUrl === 'string' && imageUrl.includes('/uploads/products/')) {
        const filename = path.basename(imageUrl);
        const baseFilename = filename.split('-').slice(0, -2).join('-'); // Remove timestamp and random
        
        // Find all related files (different sizes and formats)
        const uploadsDir = path.join(__dirname, '../uploads/products');
        const files = await fs.promises.readdir(uploadsDir);
        
        const relatedFiles = files.filter(file => 
          file.includes(baseFilename) || file === filename
        );
        
        for (const file of relatedFiles) {
          const filePath = path.join(uploadsDir, file);
          try {
            await fs.promises.unlink(filePath);
            console.log(`Deleted: ${file}`);
          } catch (error) {
            console.error(`Error deleting ${file}:`, error.message);
          }
        }
      }
      return { result: 'ok' };
    } catch (error) {
      console.error('Error deleting local files:', error);
      throw error;
    }
  }
  
  try {
    const result = await cloudinary.uploader.destroy(imageUrl);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
const getOptimizedImageUrl = (imageMetadata, size = 'medium', preferWebP = true) => {
  if (!imageMetadata) return null;
  
  // If it's old format (just URL string)
  if (typeof imageMetadata === 'string') {
    return imageMetadata;
  }
  
  // If it's new format with responsive images
  if (imageMetadata.responsive) {
    return imageMetadata.responsive[size] || imageMetadata.url;
  }
  
  return imageMetadata.url || null;
};

// Helper function to get image URL (works for both local and Cloudinary)
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For local storage, ensure it starts with /uploads
  if (!imagePath.startsWith('/uploads')) {
    return `/uploads/products/${imagePath}`;
  }
  
  return imagePath;
};

// Generate responsive image HTML
const generateResponsiveImageHTML = (imageMetadata, alt = '', className = '') => {
  if (!imageMetadata || !imageMetadata.responsive) {
    const url = getImageUrl(imageMetadata);
    return `<img src="${url}" alt="${alt}" class="${className}" />`;
  }

  return `
    <picture>
      <source srcset="${imageMetadata.srcSet}" sizes="${imageMetadata.sizes}" type="image/webp">
      <img src="${imageMetadata.fallbackUrl}" alt="${alt}" class="${className}" />
    </picture>
  `;
};

module.exports = {
  cloudinary: hasCloudinaryCredentials ? cloudinary : null,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  processUploadedImages,
  deleteImage,
  getOptimizedImageUrl,
  getImageUrl,
  generateResponsiveImageHTML,
  createUpload,
  hasCloudinaryCredentials,
  imageProcessor
};
