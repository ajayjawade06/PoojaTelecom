import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { 
  sendOrderConfirmationEmail, 
  sendOrderSms,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderRefundedEmail,
  sendStatusUpdateSms,
  sendReturnApprovedEmail
} from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order status by ID (Public)
// @route   GET /api/orders/:id/status
// @access  Public
const getOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.json({
      _id: order._id,
      orderItems: order.orderItems,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isShipped: order.isShipped,
      shippedAt: order.shippedAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      isCancelled: order.isCancelled,
      cancelledAt: order.cancelledAt,
      isReturnRequested: order.isReturnRequested,
      returnStatus: order.returnStatus,
      isRefunded: order.isRefunded,
      refundedAt: order.refundedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/:id/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(order.totalPrice * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    res.json(razorpayOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.paymentMethod === 'Credit Card') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || 'dummy_payment_id_' + Date.now(),
        status: 'COMPLETED',
        update_time: Date.now().toString(),
        email_address: req.user.email,
      };
      const updatedOrder = await order.save();
      
      // Update stock and sold count
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          product.soldCount = (product.soldCount || 0) + item.qty;
          await product.save();
        }
      }
      
      // Send notifications
      const user = await User.findById(order.user);
      if (user) {
        sendOrderConfirmationEmail(updatedOrder, user);
        if (updatedOrder.shippingAddress.phone) {
          sendOrderSms(updatedOrder, updatedOrder.shippingAddress.phone);
        } else if (user.phoneNumber) {
          sendOrderSms(updatedOrder, user.phoneNumber);
        }
      }
      
      return res.json(updatedOrder);
    }
    
    // Validate Razorpay Payment
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        update_time: Date.now().toString(),
        email_address: req.user.email,
      };

      const updatedOrder = await order.save();
      
      // Update stock and sold count
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          product.soldCount = (product.soldCount || 0) + item.qty;
          await product.save();
        }
      }

      // Send notifications
      const user = await User.findById(order.user);
      if (user) {
        sendOrderConfirmationEmail(updatedOrder, user);
        if (updatedOrder.shippingAddress.phone) {
          sendOrderSms(updatedOrder, updatedOrder.shippingAddress.phone);
        } else if (user.phoneNumber) {
          sendOrderSms(updatedOrder, user.phoneNumber);
        }
      }

      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error('Payment verification failed');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/shipped
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isShipped = true;
    order.shippedAt = Date.now();

    const updatedOrder = await order.save();

    // Send notifications
    const user = await User.findById(order.user);
    if (user) {
      sendOrderShippedEmail(updatedOrder, user);
      if (updatedOrder.shippingAddress.phone || user.phoneNumber) {
        sendStatusUpdateSms(updatedOrder, updatedOrder.shippingAddress.phone || user.phoneNumber, 'shipped');
      }
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    // Send notifications
    const user = await User.findById(order.user);
    if (user) {
      sendOrderDeliveredEmail(updatedOrder, user);
      if (updatedOrder.shippingAddress.phone || user.phoneNumber) {
        sendStatusUpdateSms(updatedOrder, updatedOrder.shippingAddress.phone || user.phoneNumber, 'delivered');
      }
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Toggle order exclusion from stats
// @route   PUT /api/orders/:id/exclude
// @access  Private/Admin
const updateOrderExclusion = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.excludeFromStats = !order.excludeFromStats;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Order already delivered and cannot be cancelled');
    }

    if (order.isCancelled) {
      res.status(400);
      throw new Error('Order is already cancelled');
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();

    // Restore stock and soldCount if order was paid
    if (order.isPaid) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          product.soldCount = Math.max(0, (product.soldCount || 0) - item.qty);
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Request a return for a delivered order
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturnOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (!order.isDelivered) {
      res.status(400);
      throw new Error('Order must be delivered before requesting a return');
    }

    if (order.isReturnRequested) {
      res.status(400);
      throw new Error('Return has already been requested for this order');
    }

    const { returnReason } = req.body;

    order.isReturnRequested = true;
    order.returnReason = returnReason || 'Not specified';
    order.returnStatus = 'Pending';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Process a return request (approve/reject/refund)
// @route   PUT /api/orders/:id/process-return
// @access  Private/Admin
const processReturnOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { action } = req.body; // 'approve', 'reject', 'refund'

    if (action === 'approve') {
      order.returnStatus = 'Approved';

      // Send return approved notification email
      const user = await User.findById(order.user);
      if (user) {
        sendReturnApprovedEmail(order, user);
      }
    } else if (action === 'reject') {
      order.returnStatus = 'Rejected';
      order.isReturnRequested = false; 
    } else if (action === 'refund') {
      if (order.returnStatus !== 'Approved') {
         res.status(400);
         throw new Error('Return must be approved before refunding');
      }
      
      order.returnStatus = 'Refunded';
      order.isRefunded = true;
      order.refundedAt = Date.now();

      // Restore stock and adjust sold count upon successful return/refund
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          product.soldCount = Math.max(0, (product.soldCount || 0) - item.qty);
          await product.save();
        }
      }

      // Send notifications
      const user = await User.findById(order.user);
      if (user) {
        sendOrderRefundedEmail(order, user);
        if (order.shippingAddress.phone || user.phoneNumber) {
          sendStatusUpdateSms(order, order.shippingAddress.phone || user.phoneNumber, 'refunded');
        }
      }
    } else {
      res.status(400);
      throw new Error('Invalid action');
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Bulk update orders
// @route   PUT /api/orders/bulk-update
// @access  Private/Admin
const bulkUpdateOrders = asyncHandler(async (req, res) => {
  const { orderIds, action } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    res.status(400);
    throw new Error('No orders selected');
  }

  const updates = {};
  if (action === 'shipped') {
    updates.isShipped = true;
    updates.shippedAt = Date.now();
  } else if (action === 'delivered') {
    updates.isDelivered = true;
    updates.deliveredAt = Date.now();
  } else {
    res.status(400);
    throw new Error('Invalid bulk action');
  }

  await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: updates }
  );

  // Note: Bulk email dispatching omitted here to prevent SMTP rate limiting. 
  // Should ideally be offloaded to a background queue (e.g. BullMQ).
  
  res.json({ message: `${orderIds.length} orders successfully marked as ${action}` });
});

export {
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
  bulkUpdateOrders,
};
