import mongoose from 'mongoose';

const abandonedCartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    cartItems: [
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
    cartTotal: {
      type: Number,
      default: 0,
    },
    recoveryEmailSent: {
      type: Boolean,
      default: false,
    },
    isRecovered: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AbandonedCart = mongoose.model('AbandonedCart', abandonedCartSchema);

export default AbandonedCart;
