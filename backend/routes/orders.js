const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const DELIVERY_FEE = 14.99;
const FREE_DELIVERY_THRESHOLD = 100;

router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { shippingAddress, paymentMethod, paymentId, deliveryDate, deliverySlot, notes } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price stock').session(session);
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}` });
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const totalAmount = subtotal + deliveryFee;

    const paymentStatus = paymentMethod === 'cod' ? 'pending' : (paymentId ? 'paid' : 'pending');

    const order = await Order.create([{
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalAmount,
      deliveryDate,
      deliverySlot,
      notes,
    }], { session });

    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
      if (!updated) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Stock changed for ${item.product.name}. Please try again.` });
      }
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email phone').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    order.orderStatus = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!isAdmin && order.orderStatus !== 'cancelled') {
      return res.status(400).json({ message: 'Only cancelled orders can be deleted' });
    }

    if (isAdmin && order.orderStatus !== 'cancelled' && order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Only pending or cancelled orders can be deleted' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/payment/process', auth, async (req, res) => {
  try {
    const { cardNumber, expiry, cvv, amount } = req.body;

    if (!cardNumber || !expiry || !cvv) {
      return res.status(400).json({ message: 'All card details are required' });
    }

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
      return res.status(400).json({ message: 'Invalid card number' });
    }

    const [expMonth, expYear] = expiry.split('/');
    if (!expMonth || !expYear || Number(expMonth) < 1 || Number(expMonth) > 12) {
      return res.status(400).json({ message: 'Invalid expiry date' });
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return res.status(400).json({ message: 'Invalid CVV' });
    }

    const success = cleanCard !== '4000000000000002';

    if (success) {
      const paymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      res.json({ success: true, paymentId, message: 'Payment processed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Card declined. Try 4242 4242 4242 4242 for testing.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
