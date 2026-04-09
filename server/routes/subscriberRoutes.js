import express from 'express';
import { subscribeUser, getSubscribers } from '../controllers/subscriberController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(subscribeUser)
  .get(protect, admin, getSubscribers);

export default router;
