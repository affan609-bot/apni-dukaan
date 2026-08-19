const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Category.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});

  await User.create({
    firstName: 'Admin',
    lastName: 'Dukaan',
    email: 'admin@apnidukaan.com',
    password: 'admin123',
    role: 'admin',
  });

  await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    password: 'test123',
    role: 'customer',
  });

  const categories = await Category.insertMany([
    { name: 'Halal Meat', slug: 'halal-meat', icon: '🥩', description: 'Fresh hand-slaughtered halal meat', displayOrder: 1 },
    { name: 'International Groceries', slug: 'international-groceries', icon: '🛒', description: 'Pakistani, Indian, Bangladeshi & Middle Eastern products', displayOrder: 2 },
    { name: 'KEB Meals', slug: 'keb-meals', icon: '🍛', description: 'Authentic ready-to-heat Pakistani meals', displayOrder: 3 },
    { name: 'Fragrance Bazaar', slug: 'fragrance-bazaar', icon: '🌸', description: 'Premium Arabian perfumes & attars', displayOrder: 4 },
    { name: 'Aayat Collections', slug: 'aayat-collections', icon: '🧕', description: 'Premium hijabs & modest essentials', displayOrder: 5 },
  ]);

  const meatCat = categories[0];
  const groceryCat = categories[1];
  const kebCat = categories[2];
  const fragranceCat = categories[3];
  const aayatCat = categories[4];

  const subcategories = await Category.insertMany([
    { name: 'Beef Products', slug: 'beef-products', icon: '🐄', parentCategory: meatCat._id, displayOrder: 1 },
    { name: 'Chicken Products', slug: 'chicken-products', icon: '🍗', parentCategory: meatCat._id, displayOrder: 2 },
    { name: 'Lamb Products', slug: 'lamb-products', icon: '🐑', parentCategory: meatCat._id, displayOrder: 3 },
    { name: 'Goat Products', slug: 'goat-products', icon: '🐐', parentCategory: meatCat._id, displayOrder: 4 },
    { name: 'Fish Products', slug: 'fish-products', icon: '🐟', parentCategory: meatCat._id, displayOrder: 5 },
    { name: 'Duck Products', slug: 'duck-products', icon: '🦆', parentCategory: meatCat._id, displayOrder: 6 },
    { name: 'Bulk Buy Meat', slug: 'bulk-buy-meat', icon: '📦', parentCategory: meatCat._id, displayOrder: 7 },
    { name: 'Sadaqah & Aqeeqah', slug: 'sadaqah-aqeeqah', icon: '🙏', parentCategory: meatCat._id, displayOrder: 8 },
    { name: 'Pakistani Products', slug: 'pakistani-products', icon: '🇵🇰', parentCategory: groceryCat._id, cuisine: 'pakistani', displayOrder: 1 },
    { name: 'Indian Products', slug: 'indian-products', icon: '🇮🇳', parentCategory: groceryCat._id, cuisine: 'indian', displayOrder: 2 },
    { name: 'Bangladeshi Products', slug: 'bangladeshi-products', icon: '🇧🇩', parentCategory: groceryCat._id, cuisine: 'bangladeshi', displayOrder: 3 },
    { name: 'Middle Eastern Products', slug: 'middle-eastern-products', icon: '🇸🇦', parentCategory: groceryCat._id, cuisine: 'middle-eastern', displayOrder: 4 },
    { name: 'Snacks', slug: 'snacks', icon: '🍿', parentCategory: groceryCat._id, displayOrder: 5 },
    { name: 'Spices', slug: 'spices', icon: '🧂', parentCategory: groceryCat._id, displayOrder: 6 },
    { name: 'Drinks', slug: 'drinks', icon: '🥤', parentCategory: groceryCat._id, displayOrder: 7 },
    { name: 'Frozen Products', slug: 'frozen-products', icon: '🧊', parentCategory: groceryCat._id, displayOrder: 8 },
    { name: 'Rice', slug: 'rice', icon: '🍚', parentCategory: groceryCat._id, displayOrder: 9 },
    { name: 'Oil & Ghee', slug: 'oil-ghee', icon: '🫒', parentCategory: groceryCat._id, displayOrder: 10 },
    { name: "Men's Fragrances", slug: 'mens-fragrances', icon: '🚹', parentCategory: fragranceCat._id, displayOrder: 1 },
    { name: "Women's Fragrances", slug: 'womens-fragrances', icon: '🚺', parentCategory: fragranceCat._id, displayOrder: 2 },
    { name: 'Unisex Fragrances', slug: 'unisex-fragrances', icon: '⚧️', parentCategory: fragranceCat._id, displayOrder: 3 },
    { name: 'Attars & Perfume Oils', slug: 'attars-perfume-oils', icon: '💧', parentCategory: fragranceCat._id, displayOrder: 4 },
    { name: 'Bakhoor & Incense', slug: 'bakhoor-incense', icon: '🪔', parentCategory: fragranceCat._id, displayOrder: 5 },
    { name: 'Gift Sets', slug: 'gift-sets', icon: '🎁', parentCategory: fragranceCat._id, displayOrder: 6 },
    { name: 'Premium Hijabs', slug: 'premium-hijabs', icon: '🧕', parentCategory: aayatCat._id, displayOrder: 1 },
    { name: 'Prayer Sets', slug: 'prayer-sets', icon: '🤲', parentCategory: aayatCat._id, displayOrder: 2 },
    { name: 'Prayer Mats', slug: 'prayer-mats', icon: '🕌', parentCategory: aayatCat._id, displayOrder: 3 },
  ]);

  const products = [
    { name: 'Halal Beef Mince (500g)', slug: 'halal-beef-mince-500g', description: 'Fresh halal beef mince, hand-slaughtered', price: 12.99, category: subcategories[0]._id, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop', stock: 50, isFeatured: true, tags: ['beef', 'mince', 'halal'] },
    { name: 'Beef Rump Steak (1kg)', slug: 'beef-rump-steak-1kg', description: 'Premium cut beef rump steak', price: 28.99, originalPrice: 32.99, category: subcategories[0]._id, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', stock: 30, isOnSale: true, tags: ['beef', 'steak'] },
    { name: 'Beef Karahi Cut (1kg)', slug: 'beef-karahi-cut-1kg', description: 'Perfect for Pakistani karahi', price: 18.99, category: subcategories[0]._id, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=600&fit=crop', stock: 40, tags: ['beef', 'karahi'] },
    { name: 'Beef Biryani Cut (1kg)', slug: 'beef-biryani-cut-1kg', description: 'Ideal for authentic biryani', price: 17.99, category: subcategories[0]._id, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop', stock: 35, tags: ['beef', 'biryani'] },
    { name: 'Beef Nihari Cut (1kg)', slug: 'beef-nihari-cut-1kg', description: 'Special nihari cut with bones', price: 15.99, category: subcategories[0]._id, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=600&fit=crop', stock: 25, isNew: true, tags: ['beef', 'nihari'] },
    { name: 'Whole Chicken (1.5kg)', slug: 'whole-chicken-1500g', description: 'Fresh whole halal chicken', price: 9.99, category: subcategories[1]._id, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=600&fit=crop', stock: 60, isFeatured: true, tags: ['chicken', 'whole'] },
    { name: 'Chicken Breast Boneless (500g)', slug: 'chicken-breast-boneless-500g', description: 'Boneless chicken breast fillets', price: 11.99, category: subcategories[1]._id, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=600&fit=crop', stock: 45, tags: ['chicken', 'breast'] },
    { name: 'Chicken Tikka Pieces (500g)', slug: 'chicken-tikka-pieces-500g', description: 'Marinated chicken tikka ready to cook', price: 13.99, category: subcategories[1]._id, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop', stock: 35, isFeatured: true, tags: ['chicken', 'tikka'] },
    { name: 'Chicken Mince (500g)', slug: 'chicken-mince-500g', description: 'Lean chicken mince', price: 8.99, category: subcategories[1]._id, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', stock: 50, tags: ['chicken', 'mince'] },
    { name: 'Lamb Mince (500g)', slug: 'lamb-mince-500g', description: 'Fresh halal lamb mince', price: 14.99, category: subcategories[2]._id, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop&q=80', stock: 40, tags: ['lamb', 'mince'] },
    { name: 'Lamb Chops (500g)', slug: 'lamb-chops-500g', description: 'Premium lamb cutlets', price: 22.99, category: subcategories[2]._id, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop&q=80', stock: 25, isFeatured: true, isOnSale: true, originalPrice: 26.99, tags: ['lamb', 'chops'] },
    { name: 'Lamb Shoulder (1kg)', slug: 'lamb-shoulder-1kg', description: 'Whole lamb shoulder for roasting', price: 24.99, category: subcategories[2]._id, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=600&fit=crop', stock: 20, tags: ['lamb', 'shoulder'] },
    { name: 'Goat Curry Cut (1kg)', slug: 'goat-curry-cut-1kg', description: 'Fresh goat meat curry cut', price: 21.99, category: subcategories[3]._id, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop&q=80', stock: 30, tags: ['goat', 'curry'] },
    { name: 'Goat Mince (500g)', slug: 'goat-mince-500g', description: 'Lean goat mince', price: 16.99, category: subcategories[3]._id, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop&q=90', stock: 20, tags: ['goat', 'mince'] },
    { name: 'Barramundi Fillet (500g)', slug: 'barramundi-fillet-500g', description: 'Fresh barramundi fillets', price: 16.99, category: subcategories[4]._id, image: 'https://images.unsplash.com/photo-1510130113356-d4c9f0e5c96c?w=600&h=600&fit=crop', stock: 25, tags: ['fish', 'barramundi'] },
    { name: 'Pomfret Whole (400g)', slug: 'pomfret-whole-400g', description: 'Whole pomfret fish', price: 14.99, category: subcategories[4]._id, image: 'https://images.unsplash.com/photo-1534604973900-c43a0f39c1b7?w=600&h=600&fit=crop', stock: 15, tags: ['fish', 'pomfret'] },
    { name: 'Whole Duck (1.8kg)', slug: 'whole-duck-1800g', description: 'Fresh whole duck', price: 19.99, category: subcategories[5]._id, image: 'https://images.unsplash.com/photo-1432139509613-5c4255a1d197?w=600&h=600&fit=crop', stock: 15, tags: ['duck'] },
    { name: 'National Biryani Masala', slug: 'national-biryani-masala', description: 'Authentic Pakistani biryani spice mix', price: 3.99, category: subcategories[8]._id, cuisine: 'pakistani', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop', stock: 100, isFeatured: true, tags: ['pakistani', 'masala', 'biryani'] },
    { name: 'Shan Karahi Masala', slug: 'shan-karahi-masala', description: 'Perfect karahi every time', price: 3.49, category: subcategories[8]._id, cuisine: 'pakistani', image: 'https://images.unsplash.com/photo-1599909631498-32e07b66b2a6?w=600&h=600&fit=crop', stock: 80, tags: ['pakistani', 'masala', 'karahi'] },
    { name: 'National Chicken Tikka', slug: 'national-chicken-tikka', description: 'Chicken tikka spice mix', price: 3.29, category: subcategories[8]._id, cuisine: 'pakistani', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop&q=80', stock: 70, tags: ['pakistani', 'tikka'] },
    { name: 'Tapal Danedar Chai (500g)', slug: 'tapal-danedar-chai', description: 'Premium Pakistani tea leaves', price: 7.99, category: subcategories[8]._id, cuisine: 'pakistani', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop', stock: 60, isNew: true, tags: ['pakistani', 'chai', 'tea'] },
    { name: 'Lazzat Vermicelli (400g)', slug: 'lazzat-vermicelli', description: 'Seviyan for meethi seviyan', price: 2.99, category: subcategories[8]._id, cuisine: 'pakistani', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=600&fit=crop', stock: 50, tags: ['pakistani', 'vermicelli'] },
    { name: "Mitchell's Mango Chutney (300g)", slug: 'mitchells-mango-chutney', description: 'Sweet and tangy mango chutney', price: 4.49, category: subcategories[8]._id, cuisine: 'pakistani', image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=600&fit=crop', stock: 45, tags: ['pakistani', 'chutney'] },
    { name: 'MDH Chana Masala', slug: 'mdh-chana-masala', description: 'Authentic chole masala blend', price: 3.99, category: subcategories[9]._id, cuisine: 'indian', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop&q=90', stock: 70, tags: ['indian', 'masala'] },
    { name: 'Everest Garam Masala (100g)', slug: 'everest-garam-masala', description: 'Premium garam masala', price: 4.49, category: subcategories[9]._id, cuisine: 'indian', image: 'https://images.unsplash.com/photo-1599909631498-32e07b66b2a6?w=600&h=600&fit=crop&q=80', stock: 60, tags: ['indian', 'masala'] },
    { name: 'Basmati Rice 5kg (India Gate)', slug: 'basmati-rice-india-gate', description: 'Premium aged basmati rice', price: 18.99, category: subcategories[9]._id, cuisine: 'indian', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop', stock: 40, isFeatured: true, tags: ['indian', 'rice'] },
    { name: "Haldiram's Bhujia (200g)", slug: 'haldirams-bhujia', description: 'Crunchy spiced snack', price: 3.99, category: subcategories[9]._id, cuisine: 'indian', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop', stock: 55, tags: ['indian', 'snack'] },
    { name: 'Radhuni Panch Phoron', slug: 'radhuni-panch-phoron', description: 'Five spice blend', price: 3.49, category: subcategories[10]._id, cuisine: 'bangladeshi', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop&q=70', stock: 40, tags: ['bangladeshi', 'spice'] },
    { name: 'Pran Tamarind Sauce (250g)', slug: 'pran-tamarind-sauce', description: 'Tangy tamarind sauce', price: 3.99, category: subcategories[10]._id, cuisine: 'bangladeshi', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&h=600&fit=crop', stock: 35, tags: ['bangladeshi', 'sauce'] },
    { name: 'Al Marai Feta Cheese (200g)', slug: 'al-marai-feta-cheese', description: 'Creamy feta cheese', price: 5.99, category: subcategories[11]._id, cuisine: 'middle-eastern', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop', stock: 30, tags: ['middle-eastern', 'cheese'] },
    { name: 'Al Wadi Pomegranate Molasses', slug: 'al-wadi-pomegranate-molasses', description: 'Pure pomegranate molasses', price: 6.99, category: subcategories[11]._id, cuisine: 'middle-eastern', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop', stock: 25, isNew: true, tags: ['middle-eastern', 'molasses'] },
    { name: 'Tahina Paste (300g)', slug: 'tahina-paste-300g', description: 'Premium sesame paste', price: 5.49, category: subcategories[11]._id, cuisine: 'middle-eastern', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', stock: 35, tags: ['middle-eastern', 'tahina'] },
    { name: 'Lays Classic Salted (170g)', slug: 'lays-classic-salted', description: 'Classic salted potato chips', price: 3.49, category: subcategories[12]._id, image: 'https://images.unsplash.com/photo-1566473782167-9f81f36f4f65?w=600&h=600&fit=crop', stock: 100, tags: ['snack', 'chips'] },
    { name: 'Kurkure Masala Munch (90g)', slug: 'kurkure-masala-munch', description: 'Crunchy corn snack', price: 2.49, category: subcategories[12]._id, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop&q=80', stock: 80, tags: ['snack'] },
    { name: 'Popcorn Classic (100g)', slug: 'popcorn-classic', description: 'Microwave popcorn', price: 3.99, category: subcategories[12]._id, image: 'https://images.unsplash.com/photo-1585735036881-c3e53e370674?w=600&h=600&fit=crop', stock: 50, tags: ['snack'] },
    { name: 'Karachi Chicken Biryani (500g)', slug: 'karachi-chicken-biryani', description: 'Ready-to-heat authentic Karachi style biryani', price: 14.99, category: kebCat._id, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop', stock: 40, isFeatured: true, tags: ['keb', 'biryani', 'ready-meal'] },
    { name: 'Karachi Beef Biryani (500g)', slug: 'karachi-beef-biryani', description: 'Rich beef biryani', price: 15.99, category: kebCat._id, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop', stock: 35, isFeatured: true, tags: ['keb', 'biryani'] },
    { name: 'Charsi Chicken Karahi (400g)', slug: 'charsi-chicken-karahi', description: 'Charsi style chicken karahi', price: 13.99, category: kebCat._id, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=600&fit=crop', stock: 30, isNew: true, tags: ['keb', 'karahi'] },
    { name: 'Shahi White Chicken Karahi (400g)', slug: 'shahi-white-chicken-karahi', description: 'Creamy white karahi', price: 14.49, category: kebCat._id, image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&h=600&fit=crop', stock: 25, tags: ['keb', 'karahi'] },
    { name: "Chef's Special Paya (400g)", slug: 'chefs-special-paya', description: 'Slow-cooked paya', price: 12.99, category: kebCat._id, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=600&fit=crop', stock: 20, tags: ['keb', 'paya'] },
    { name: 'Lattafa Raghba for Men (100ml)', slug: 'lattafa-raghba-men', description: 'Popular Arabian fragrance for men', price: 45.99, category: subcategories[18]._id, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop', stock: 20, isFeatured: true, tags: ['fragrance', 'men', 'lattafa'] },
    { name: 'Armaf Club De Nuit Intense (105ml)', slug: 'armaf-club-de-nuit', description: "Premium men's EDP", price: 55.99, originalPrice: 65.99, category: subcategories[18]._id, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', stock: 15, isOnSale: true, tags: ['fragrance', 'men', 'armaf'] },
    { name: 'Afnan Supremacy Silver (100ml)', slug: 'afnan-supremacy-silver', description: 'Fresh aquatic fragrance', price: 39.99, category: subcategories[18]._id, image: 'https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=600&h=600&fit=crop', stock: 25, tags: ['fragrance', 'men', 'afnan'] },
    { name: "Al Haramain L'Aventure (100ml)", slug: 'al-haramain-laventure', description: 'Adventure inspired scent', price: 49.99, category: subcategories[18]._id, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop', stock: 18, isNew: true, tags: ['fragrance', 'men', 'al-haramain'] },
    { name: 'Lattafa Yara for Women (100ml)', slug: 'lattafa-yara-women', description: 'Sweet floral Arabian perfume', price: 42.99, category: subcategories[19]._id, image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop', stock: 20, isFeatured: true, tags: ['fragrance', 'women', 'lattafa'] },
    { name: 'Armaf treselle EDP (100ml)', slug: 'armaf-treselle', description: "Elegant women's fragrance", price: 48.99, category: subcategories[19]._id, image: 'https://images.unsplash.com/photo-1592945832076-3a088315cbbf?w=600&h=600&fit=crop', stock: 15, tags: ['fragrance', 'women', 'armaf'] },
    { name: 'French Avenue Liquid Brun (100ml)', slug: 'french-avenue-liquid-brun', description: 'Unisex woody fragrance', price: 52.99, category: subcategories[20]._id, image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=600&fit=crop', stock: 12, tags: ['fragrance', 'unisex', 'french-avenue'] },
    { name: 'Arabiyat Prestige Maya (100ml)', slug: 'arabiyat-prestige-maya', description: 'Floral unisex fragrance', price: 38.99, category: subcategories[20]._id, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=600&fit=crop', stock: 20, tags: ['fragrance', 'unisex', 'arabiyat'] },
    { name: 'Al Haramain Oud Muattar (50g)', slug: 'al-haramain-oud-muattar', description: 'Pure oud incense', price: 35.99, category: subcategories[21]._id, image: 'https://images.unsplash.com/photo-1547793548-7a00406e2873?w=600&h=600&fit=crop', stock: 15, tags: ['attar', 'oud'] },
    { name: 'Premium Chiffon Hijab - Black', slug: 'premium-chiffon-hijab-black', description: 'Lightweight premium chiffon hijab', price: 19.99, category: subcategories[24]._id, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop', stock: 50, isFeatured: true, tags: ['hijab', 'chiffon'] },
    { name: 'Bamboo Jersey Hijab - Navy', slug: 'bamboo-jersey-hijab-navy', description: 'Soft bamboo jersey hijab', price: 22.99, category: subcategories[24]._id, image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc608a?w=600&h=600&fit=crop', stock: 40, tags: ['hijab', 'jersey'] },
    { name: 'Prayer Set - Rose Gold', slug: 'prayer-set-rose-gold', description: 'Complete prayer set with bag', price: 34.99, category: subcategories[25]._id, image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&h=600&fit=crop', stock: 25, isFeatured: true, tags: ['prayer', 'set'] },
    { name: 'Premium Prayer Mat - Teal', slug: 'premium-prayer-mat-teal', description: 'Luxurious prayer mat', price: 29.99, category: subcategories[26]._id, image: 'https://images.unsplash.com/photo-1542816417-0983c9c0ad53?w=600&h=600&fit=crop', stock: 30, tags: ['prayer', 'mat'] },
    { name: 'Beef Nalli (1kg)', slug: 'beef-nalli-1kg', description: 'Fresh beef nalli for nihari', price: 19.99, category: subcategories[0]._id, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=600&fit=crop', stock: 20, isNew: true, tags: ['beef', 'nalli', 'nihari'] },
    { name: 'Chicken Wings (1kg)', slug: 'chicken-wings-1kg', description: 'Fresh halal chicken wings', price: 10.99, category: subcategories[1]._id, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=600&fit=crop', stock: 55, tags: ['chicken', 'wings'] },
    { name: 'Karachi Seekh Kabab (400g)', slug: 'karachi-seekh-kabab', description: 'Ready-to-grill seekh kabab', price: 12.99, category: kebCat._id, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop', stock: 30, isNew: true, tags: ['keb', 'seekh', 'kabab'] },
    { name: 'Anda Shami Burger Meal (300g)', slug: 'anda-shami-burger-meal', description: 'Classic Pakistani street food meal', price: 9.99, category: kebCat._id, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop', stock: 40, tags: ['keb', 'burger', 'meal'] },
    { name: 'Lattafa Ana Abiyedh (100ml)', slug: 'lattafa-ana-abiyedh', description: 'Clean white Arabian perfume', price: 35.99, category: subcategories[20]._id, image: 'https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=600&h=600&fit=crop', stock: 22, isFeatured: true, tags: ['fragrance', 'unisex', 'lattafa'] },
    { name: 'Georgette Hijab - Olive Green', slug: 'georgette-hijab-olive', description: 'Elegant georgette hijab', price: 17.99, category: subcategories[24]._id, image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc608a?w=600&h=600&fit=crop', stock: 45, tags: ['hijab', 'georgette'] },
  ];

  await Product.insertMany(products);

  console.log('Seed data created successfully!');
  console.log(`Created ${categories.length} parent categories`);
  console.log(`Created ${subcategories.length} subcategories`);
  console.log(`Created ${products.length} products`);
  process.exit();
};

seedData();
