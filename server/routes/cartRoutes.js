import express from 'express';
import { syncCart, getAbandonedCarts, markCartRecovered } from '../controllers/cartController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/sync').post(protect, syncCart);
router.route('/abandoned').get(protect, admin, getAbandonedCarts);
router.route('/abandoned/:id/recover').put(protect, admin, markCartRecovered);

export default router;
