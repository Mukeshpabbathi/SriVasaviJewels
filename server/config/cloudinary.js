const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: 'limit', quality: 'auto' },
        { format: 'webp' }
      ]
    }
  });
  
  console.log('✅ Cloudinary storage configured');
} else {
  console.log('ℹ️ Using local file storage (Cloudinary credentials not provided)');
}

// Configure local storage
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/products/');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
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
      fileSize: 5 * 1024 * 1024, // 5MB limit
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

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  if (!hasCloudinaryCredentials) {
    // For local storage, delete file from filesystem
    try {
      const filePath = path.join(__dirname, '../uploads/products/', publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { result: 'ok' };
    } catch (error) {
      console.error('Error deleting local file:', error);
      throw error;
    }
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  if (!hasCloudinaryCredentials) {
    // For local storage, return the local URL
    return `/uploads/products/${publicId}`;
  }
  
  const defaultOptions = {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'webp'
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  return cloudinary.url(publicId, finalOptions);
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

module.exports = {
  cloudinary: hasCloudinaryCredentials ? cloudinary : null,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  deleteImage,
  getOptimizedImageUrl,
  getImageUrl,
  createUpload,
  hasCloudinaryCredentials
};
