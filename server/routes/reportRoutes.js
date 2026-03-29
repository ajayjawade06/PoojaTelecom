import express from 'express';
import { getSalesReport, getInventoryReport, getUserReport } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/sales').get(protect, admin, getSalesReport);
router.route('/inventory').get(protect, admin, getInventoryReport);
router.route('/users').get(protect, admin, getUserReport);

export default router;
