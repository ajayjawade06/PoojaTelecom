import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippedAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    excludeFromStats: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
    isReturnRequested: {
      type: Boolean,
      required: true,
      default: false,
    },
    returnReason: {
      type: String,
    },
    returnStatus: {
      type: String,
      enum: ['None', 'Pending', 'Approved', 'Rejected', 'Refunded'],
      default: 'None',
    },
    isRefunded: {
      type: Boolean,
      required: true,
      default: false,
    },
    refundedAt: {
      type: Date,
    },
    timeline: [{
      event: { type: String, required: true },
      description: { type: String },
      timestamp: { type: Date, default: Date.now },
    }],
  },
  {
    timestamps: true,
  }
);

// Auto-generate timeline events on status changes
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.timeline.push({ event: 'Order Placed', description: 'Order was created successfully.' });
  }
  if (this.isModified('isPaid') && this.isPaid) {
    this.timeline.push({ event: 'Payment Confirmed', description: `Payment of ₹${this.totalPrice.toLocaleString('en-IN')} received via ${this.paymentMethod}.` });
  }
  if (this.isModified('isShipped') && this.isShipped) {
    this.timeline.push({ event: 'Shipped', description: 'Order has been dispatched for delivery.' });
  }
  if (this.isModified('isDelivered') && this.isDelivered) {
    this.timeline.push({ event: 'Delivered', description: 'Order delivered to the customer.' });
  }
  if (this.isModified('isCancelled') && this.isCancelled) {
    this.timeline.push({ event: 'Cancelled', description: 'Order was cancelled.' });
  }
  if (this.isModified('isReturnRequested') && this.isReturnRequested) {
    this.timeline.push({ event: 'Return Requested', description: `Reason: ${this.returnReason || 'Not specified'}` });
  }
  if (this.isModified('returnStatus') && this.returnStatus === 'Approved') {
    this.timeline.push({ event: 'Return Approved', description: 'Return request has been approved by admin.' });
  }
  if (this.isModified('isRefunded') && this.isRefunded) {
    this.timeline.push({ event: 'Refunded', description: 'Refund has been processed to the customer.' });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
