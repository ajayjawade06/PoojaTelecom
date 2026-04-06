import express from 'express';
import {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
} from '../controllers/carouselController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route — get active slides for homepage
router.get('/', getActiveSlides);

// Admin routes
router.get('/admin', protect, admin, getAllSlides);
router.post('/', protect, admin, createSlide);
router.put('/reorder', protect, admin, reorderSlides);
router.put('/:id', protect, admin, updateSlide);
router.delete('/:id', protect, admin, deleteSlide);

export default router;
