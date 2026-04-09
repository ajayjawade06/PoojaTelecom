import asyncHandler from '../middleware/asyncHandler.js';
import AbandonedCart from '../models/abandonedCartModel.js';

// @desc    Sync user cart to server (upsert)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  
  if (!cartItems || cartItems.length === 0) {
    // If cart is empty, mark as recovered or remove
    await AbandonedCart.findOneAndDelete({ user: req.user._id });
    return res.json({ message: 'Cart cleared' });
  }

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  await AbandonedCart.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      cartItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id || item.product,
      })),
      cartTotal,
      lastActivity: Date.now(),
      isRecovered: false,
    },
    { upsert: true, new: true }
  );

  res.json({ message: 'Cart synced' });
});

// @desc    Get all abandoned carts (admin)
// @route   GET /api/cart/abandoned
// @access  Private/Admin
const getAbandonedCarts = asyncHandler(async (req, res) => {
  // Carts older than 30 minutes with items, not recovered
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  const carts = await AbandonedCart.find({
    lastActivity: { $lt: thirtyMinutesAgo },
    isRecovered: false,
    'cartItems.0': { $exists: true },
  })
  .populate('user', 'name email phoneNumber')
  .sort({ cartTotal: -1 });

  res.json(carts);
});

// @desc    Mark cart as recovered
// @route   PUT /api/cart/abandoned/:id/recover
// @access  Private/Admin
const markCartRecovered = asyncHandler(async (req, res) => {
  const cart = await AbandonedCart.findById(req.params.id);
  if (cart) {
    cart.isRecovered = true;
    await cart.save();
    res.json({ message: 'Cart marked as recovered' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

export { syncCart, getAbandonedCarts, markCartRecovered };
