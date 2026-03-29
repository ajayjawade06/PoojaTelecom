import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategoriesAndBrands,
  bulkUpdateStock,
  getUserReviewsAdmin,
  deleteReviewAdmin,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/filters').get(getCategoriesAndBrands);
router.route('/bulk-stock').put(protect, admin, bulkUpdateStock);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/reviews/user/:id').get(protect, admin, getUserReviewsAdmin);
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteReviewAdmin);

export default router;
