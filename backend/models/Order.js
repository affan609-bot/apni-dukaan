const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    street: String,
    city: { type: String, default: 'Karachi' },
    area: String,
    state: { type: String, default: 'Sindh' },
    postcode: String,
    country: { type: String, default: 'Pakistan' },
  },
  paymentMethod: { type: String, default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  deliveryDate: { type: Date },
  deliverySlot: { type: String, default: '' },
  notes: { type: String, default: '' },
  trackingNumber: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
