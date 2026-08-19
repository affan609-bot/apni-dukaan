const router = require('express').Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/address', auth, async (req, res) => {
  try {
    const { label, street, city, state, postcode, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    user.addresses.push({ label, street, city, state, postcode, isDefault });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/address/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
