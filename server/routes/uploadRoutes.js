import express from 'express';

const router = express.Router();

// Image upload functionality has been removed
router.post('/', (req, res) => {
  res.status(503).json({ 
    error: 'Image upload service is currently unavailable. Please use external image URLs for products.' 
  });
});

export default router;
