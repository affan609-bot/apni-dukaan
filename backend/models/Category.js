const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  cuisine: { type: String, enum: ['pakistani', 'indian', 'bangladeshi', 'middle-eastern', 'general', ''], default: 'general' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
