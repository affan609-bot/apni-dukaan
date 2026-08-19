const router = require('express').Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const { cuisine, parent } = req.query;
    const filter = { isActive: true };
    if (cuisine) filter.cuisine = cuisine;
    if (parent) filter.parentCategory = parent;
    else filter.parentCategory = null;

    const categories = await Category.find(filter).sort('displayOrder');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('displayOrder');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const subcategories = await Category.find({ parentCategory: category._id, isActive: true });
    res.json({ category, subcategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
