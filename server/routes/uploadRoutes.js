import path from 'path';
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pooja-telecom/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optimize image sizing
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only! (jpeg, png, webp)'), false);
  }
}

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
router.post('/', (req, res, next) => {
  console.log('Upload request received...');
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer/Upload Error Detail:', err);
      return res.status(400).send({ 
        message: err.message || 'Upload failed',
        error: err.code || 'UPLOAD_ERROR' 
      });
    }
    
    if (!req.file) {
      console.warn('No file in request after multer processing. Headers:', req.headers['content-type']);
      return res.status(400).send({ message: 'No file uploaded. Verify field name is "image".' });
    }

    console.log(`File uploaded successfully to Cloudinary: ${req.file.path}`);
    
    // Cloudinary returns the full CDN url in `req.file.path`
    res.status(200).send({
      message: 'Image uploaded successfully to Cloudinary',
      image: req.file.path, // We return the direct high-speed CDN URL
    });
  });
});

export default router;
