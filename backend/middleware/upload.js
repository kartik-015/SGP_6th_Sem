const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Storage destination called for file:', file);
    let uploadPath = uploadDir;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'idCard') {
      uploadPath = path.join(uploadDir, 'id-cards');
    } else if (file.fieldname === 'equipment') {
      uploadPath = path.join(uploadDir, 'equipment');
    } else if (file.fieldname === 'profile') {
      uploadPath = path.join(uploadDir, 'profiles');
    } else if (file.fieldname === 'attachments') {
      uploadPath = path.join(uploadDir, 'attachments');
    }
    
    console.log('Upload path:', uploadPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log('Storage filename called for file:', file);
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    
    // Sanitize filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const finalFilename = `${sanitizedName}-${uniqueSuffix}${ext}`;
    
    console.log('Final filename:', finalFilename);
    cb(null, finalFilename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Debug logging
  console.log('File filter processing:', file);
  
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
  };
  
  if (allowedTypes[file.mimetype]) {
    console.log('File type allowed:', file.mimetype);
    cb(null, true);
  } else {
    console.log('File type rejected:', file.mimetype);
    cb(new Error(`Invalid file type. Allowed types: ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 10 // Maximum 10 files
  }
});

// Specific upload configurations
const uploadIdCard = upload.single('idCard');
const uploadEquipmentImages = upload.array('images', 5); // Max 5 images
const uploadProfileImage = upload.single('profile');
const uploadAttachments = upload.array('attachments', 10); // Max 10 attachments

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  console.error('Upload error:', error);
  return res.status(500).json({
    success: false,
    message: 'File upload failed.'
  });
};

// Helper function to get file URL
const getFileUrl = (filename, type = 'general') => {
  if (!filename) return null;
  
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${type}/${filename}`;
};

// Helper function to delete file
const deleteFile = (filepath) => {
  if (!filepath) return;
  
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Helper function to process uploaded files
const processUploadedFiles = (files, type = 'general') => {
  if (!files) return [];
  
  const processedFiles = Array.isArray(files) ? files : [files];
  
  return processedFiles.map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    url: getFileUrl(file.filename, type)
  }));
};

module.exports = {
  upload,
  uploadIdCard,
  uploadEquipmentImages,
  uploadProfileImage,
  uploadAttachments,
  handleUploadError,
  getFileUrl,
  deleteFile,
  processUploadedFiles
}; 