const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config();

const addMoreProducts = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const subcategories = await Category.find();
  const subcatMap = {};
  subcategories.forEach(cat => { subcatMap[cat.slug] = cat; });

  const kebCat = subcategories.find(c => c.name === 'KEB Meals' && !c.parentCategory);

  const newProducts = [
    { name: 'Beef Nalli (1kg)', slug: 'beef-nalli-1kg', description: 'Fresh beef nalli for nihari', price: 19.99, category: subcatMap['beef-products']?._id, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=600&fit=crop', stock: 20, isNew: true, tags: ['beef', 'nalli', 'nihari'] },
    { name: 'Chicken Wings (1kg)', slug: 'chicken-wings-1kg', description: 'Fresh halal chicken wings', price: 10.99, category: subcatMap['chicken-products']?._id, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=600&fit=crop', stock: 55, tags: ['chicken', 'wings'] },
    { name: 'Karachi Seekh Kabab (400g)', slug: 'karachi-seekh-kabab', description: 'Ready-to-grill seekh kabab', price: 12.99, category: kebCat?._id, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop', stock: 30, isNew: true, tags: ['keb', 'seekh', 'kabab'] },
    { name: 'Anda Shami Burger Meal (300g)', slug: 'anda-shami-burger-meal', description: 'Classic Pakistani street food meal', price: 9.99, category: kebCat?._id, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop', stock: 40, tags: ['keb', 'burger', 'meal'] },
    { name: 'Lattafa Ana Abiyedh (100ml)', slug: 'lattafa-ana-abiyedh', description: 'Clean white Arabian perfume', price: 35.99, category: subcatMap['unisex-fragrances']?._id, image: 'https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=600&h=600&fit=crop', stock: 22, isFeatured: true, tags: ['fragrance', 'unisex', 'lattafa'] },
    { name: 'Georgette Hijab - Olive Green', slug: 'georgette-hijab-olive', description: 'Elegant georgette hijab', price: 17.99, category: subcatMap['premium-hijabs']?._id, image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc608a?w=600&h=600&fit=crop', stock: 45, tags: ['hijab', 'georgette'] },
    { name: 'Lamb Brain (300g)', slug: 'lamb-brain-300g', description: 'Fresh halal lamb brain', price: 7.99, category: subcatMap['lamb-products']?._id, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop', stock: 15, isNew: true, tags: ['lamb', 'brain'] },
  ];

  const filtered = newProducts.filter(p => p.category);
  const result = await Product.insertMany(filtered);
  console.log(`Added ${result.length} new products`);
  console.log('Total products now:', await Product.countDocuments());
  process.exit();
};

addMoreProducts();
