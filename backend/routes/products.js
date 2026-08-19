const router = require('express').Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const { category, cuisine, search, sort, featured, isNew, isOnSale, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) {
      const subcats = await Category.find({ parentCategory: category }).select('_id');
      const catIds = [category, ...subcats.map(c => c._id)];
      filter.category = { $in: catIds };
    }
    if (cuisine) filter.cuisine = cuisine;
    if (featured === 'true') filter.isFeatured = true;
    if (isNew === 'true') filter.isNew = true;
    if (isOnSale === 'true') filter.isOnSale = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'name') sortObj = { name: 1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).populate('category', 'name slug').sort(sortObj).skip(skip).limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / Number(limit)), page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
