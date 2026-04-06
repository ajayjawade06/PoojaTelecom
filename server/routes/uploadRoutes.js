import path from 'path';
import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

const router = express.Router();

// Initialize GridFS
let gfs, gridfsBucket;
const conn = mongoose.connection;

conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `image-${Date.now()}${path.extname(file.originalname)}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });

// @desc    Upload image to MongoDB
// @route   POST /api/upload
router.post('/', (req, res, next) => {
  console.log('Upload request received...');
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer/Upload Error:', err);
      return res.status(400).send({ message: err.message || 'Upload failed' });
    }
    
    if (!req.file) {
      console.warn('No file in request after multer processing');
      return res.status(400).send({ message: 'No file uploaded' });
    }

    console.log(`File uploaded successfully: ${req.file.filename}`);
    res.status(200).send({
      message: 'Image uploaded successfully to MongoDB',
      image: `/api/upload/image/${req.file.filename}`,
    });
  });
});

// @desc    Get image from MongoDB
// @route   GET /api/upload/image/:filename
router.get('/image/:filename', async (req, res) => {
  try {
    if (!gridfsBucket) {
      return res.status(503).json({ err: 'GridFS Bucket not initialized yet. Please try again in a few seconds.' });
    }

    const file = await gridfsBucket.find({ filename: req.params.filename }).toArray();
    
    if (!file || file.length === 0) {
      console.error(`Image not found: ${req.params.filename}`);
      return res.status(404).json({ err: 'No file exists' });
    }

    // Check if image - more permissive check
    if (file[0].contentType && file[0].contentType.startsWith('image/')) {
      // Read output to browser
      const readstream = gridfsBucket.openDownloadStreamByName(req.params.filename);
      readstream.pipe(res);
    } else {
      console.warn(`File is not an image: ${req.params.filename} (Type: ${file[0].contentType})`);
      res.status(404).json({ err: 'Not an image' });
    }
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({ err: 'Server error' });
  }
});

export default router;
