import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToShipped,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  createRazorpayOrder,
  deleteOrder,
  updateOrderExclusion,
  cancelOrder,
  requestReturnOrder,
  processReturnOrder,
  getOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router
  .route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);
router.route('/:id/status').get(getOrderStatus);
router.route('/:id/razorpay').post(protect, createRazorpayOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/shipped').put(protect, admin, updateOrderToShipped);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/exclude').put(protect, admin, updateOrderExclusion);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/return').put(protect, requestReturnOrder);
router.route('/:id/process-return').put(protect, admin, processReturnOrder);

export default router;
