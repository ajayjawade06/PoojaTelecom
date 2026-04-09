import asyncHandler from '../middleware/asyncHandler.js';
import Subscriber from '../models/subscriberModel.js';

// @desc    Register a new subscriber
// @route   POST /api/subscribers
// @access  Public
const subscribeUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const subscriberExists = await Subscriber.findOne({ email });

  if (subscriberExists) {
    res.status(400);
    throw new Error('You are already subscribed to our newsletter');
  }

  const subscriber = await Subscriber.create({
    email,
  });

  if (subscriber) {
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
    });
  } else {
    res.status(400);
    throw new Error('Invalid subscriber data');
  }
});

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.json(subscribers);
});

export { subscribeUser, getSubscribers };
