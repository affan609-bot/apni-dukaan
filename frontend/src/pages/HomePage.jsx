import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiCreditCard, FiClock, FiStar } from 'react-icons/fi';
import API from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const heroSlides = [
  {
    title: '100% Halal\nMeat & Groceries',
    subtitle: 'Fresh hand-slaughtered halal meat delivered to your door across Australia',
    cta: 'Shop Halal Meat',
    link: '/shop/halal-meat',
    bg: 'from-dark-900 via-dark-800 to-dark-900',
    accent: 'brand-400',
    img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=600&fit=crop',
  },
  {
    title: 'Premium Arabian\nFragrances',
    subtitle: 'Discover Lattafa, Armaf, Afnan & more. Authentic Arabian perfumes at best prices',
    cta: 'Shop Fragrances',
    link: '/shop/fragrance-bazaar',
    bg: 'from-purple-900 via-purple-800 to-dark-900',
    accent: 'purple-400',
    img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop',
  },
  {
    title: 'KEB Meals\nReady to Heat',
    subtitle: 'Authentic Karachi-style biryani, karahi & more. Heat and serve in minutes',
    cta: 'Shop KEB Meals',
    link: '/shop/keb-meals',
    bg: 'from-orange-900 via-orange-800 to-dark-900',
    accent: 'orange-400',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop',
  },
];

const cuisineData = [
  { name: 'Pakistani', slug: 'pakistani-products', flag: '🇵🇰', desc: 'Authentic Pakistani groceries', color: 'from-green-500 to-emerald-600' },
  { name: 'Indian', slug: 'indian-products', flag: '🇮🇳', desc: 'Wide range of Indian products', color: 'from-orange-500 to-red-500' },
  { name: 'Bangladeshi', slug: 'bangladeshi-products', flag: '🇧🇩', desc: 'Popular Bangladeshi brands', color: 'from-green-600 to-teal-600' },
  { name: 'Middle Eastern', slug: 'middle-eastern-products', flag: '🇸🇦', desc: 'Premium ME groceries', color: 'from-amber-500 to-orange-600' },
];

const trustItems = [
  { icon: <FiShield size={24} />, title: '100% Halal Certified', desc: 'Hand-slaughtered, FANZAHA approved' },
  { icon: <FiTruck size={24} />, title: 'Cold-Chain Delivery', desc: 'Fresh & frozen items delivered safely' },
  { icon: <FiClock size={24} />, title: 'Same Day Dispatch', desc: 'Order before 2PM for same day shipping' },
  { icon: <FiCreditCard size={24} />, title: 'Cash on Delivery', desc: 'Pay when your order arrives at your door' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get('/products?featured=true&limit=8'),
          API.get('/categories'),
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      <SEO
        title="Halal Meat & International Grocery Store"
        description="Fresh halal meat, international groceries, KEB meals, fragrances & more delivered to your door in Karachi, Pakistan. Free delivery over Rs. 5000."
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}></div>
            <div className="absolute inset-0 opacity-20">
              <img src={slide.img} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-dark-900/70 to-transparent"></div>
          </div>
        ))}

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-4 py-10 sm:py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-5 sm:space-y-8">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-400/10 border border-brand-400/20 text-brand-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                <FiStar size={12} />
                Australia's #1 Halal Marketplace
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight whitespace-pre-line">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-sm sm:text-lg text-gray-400 max-w-lg leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link to={heroSlides[currentSlide].link} className="btn-primary sm:btn-lg inline-flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  {heroSlides[currentSlide].cta} <FiArrowRight size={18} />
                </Link>
                <Link to="/shop" className="btn-outline border-white/30 text-white hover:bg-white hover:text-dark-900 btn-sm sm:btn-lg text-sm">
                  Browse All
                </Link>
              </div>
              <div className="flex items-center gap-4 sm:gap-8 pt-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">50+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Products</p>
                </div>
                <div className="w-px h-8 sm:h-12 bg-gray-700"></div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">5</p>
                  <p className="text-xs sm:text-sm text-gray-500">States</p>
                </div>
                <div className="w-px h-8 sm:h-12 bg-gray-700"></div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                  <p className="text-xs sm:text-sm text-gray-500">Halal</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={heroSlides[currentSlide].img}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 bg-brand-400 text-dark-900 px-5 py-3 rounded-2xl font-black text-sm shadow-xl animate-float">
                  100% Halal Certified
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-dark-900 px-5 py-3 rounded-2xl font-bold text-sm shadow-xl">
                  <FiTruck className="inline mr-2" />
                  Free Delivery $100+
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-3 mt-12">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'w-12 bg-brand-400' : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-4 group">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-600 group-hover:bg-brand-400 group-hover:text-white transition-all duration-300 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-dark-900 font-bold text-xs sm:text-sm">{item.title}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 hidden sm:block">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-dark-900 tracking-tight">Shop by Category</h2>
              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">Browse our wide selection of halal products</p>
            </div>
            <Link to="/shop" className="btn-outline btn-sm hidden md:flex items-center gap-2">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat._id}
                to={`/shop/${cat.slug}`}
                className="group card p-3 sm:p-6 text-center hover:border-brand-200"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-dark-900 group-hover:text-brand-600 transition text-[10px] sm:text-sm leading-tight">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-dark-900 tracking-tight">Featured Products</h2>
              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">Our most popular items loved by the community</p>
            </div>
            <Link to="/shop" className="btn-outline btn-sm hidden md:flex items-center gap-2">
              Shop All <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-2xl sm:rounded-t-3xl"></div>
                  <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                    <div className="h-3 bg-gray-200 rounded-full w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-sm">
              View All Products <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Cuisine */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-dark-900 tracking-tight">Shop by Cuisine</h2>
            <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">International groceries from your favourite regions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {cuisineData.map((cuisine) => (
              <Link
                key={cuisine.slug}
                to={`/shop/international-groceries?cuisine=${cuisine.slug.replace('-products', '')}`}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl h-40 sm:h-56 md:h-72"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cuisine.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-white p-3 sm:p-6 text-center">
                  <span className="text-3xl sm:text-5xl md:text-6xl mb-1 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{cuisine.flag}</span>
                  <h3 className="font-bold text-sm sm:text-lg md:text-xl">{cuisine.name}</h3>
                  <p className="text-white/80 text-[10px] sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">{cuisine.desc}</p>
                  <div className="mt-2 sm:mt-4 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Shop Now <FiArrowRight className="inline ml-1" size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fragrance Bazaar Feature */}
      <section className="py-10 sm:py-16 md:py-20 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-400 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-purple-500/20 text-purple-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                New Collection
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                Fragrance Bazaar
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Discover premium Arabian perfumes, attars & incense from top brands like Lattafa, Armaf, Afnan, Al Haramain, French Avenue & Arabiyat Prestige.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {['Lattafa', 'Armaf', 'Afnan', 'Al Haramain', 'French Avenue', 'Arabiyat'].map(brand => (
                  <span key={brand} className="bg-white/10 text-gray-300 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium border border-white/10 hover:bg-white/20 transition cursor-pointer">
                    {brand}
                  </span>
                ))}
              </div>
              <Link to="/shop/fragrance-bazaar" className="btn-primary sm:btn-lg inline-flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                Shop Fragrance Bazaar <FiArrowRight size={18} />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop"
                    alt="Fragrances"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-purple-500 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xl">
                  Up to 30% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aayat Collections Feature */}
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-br from-brand-50 via-white to-brand-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop"
                    alt="Hijabs"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-brand-400 text-dark-900 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xl">
                  Premium Quality
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center bg-brand-100 text-brand-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                Coming Soon
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark-900 mb-4 sm:mb-6 tracking-tight">
                Aayat Collections
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Premium hijabs, prayer sets & modest essentials. Every purchase supports Aayat's Kindness Fund.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {['Premium Chiffon', 'Bamboo Jersey', 'Modal Hijabs', 'Prayer Sets', 'Prayer Mats'].map(tag => (
                  <span key={tag} className="bg-white text-dark-700 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/shop/aayat-collections" className="btn-primary sm:btn-lg inline-flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                Explore Aayat Collections <FiArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-brand-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            Ready to start shopping?
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg mb-6 sm:mb-10">
            Browse 50+ halal products, groceries & more. Delivered fresh to your door.
          </p>
          <Link to="/shop" className="btn-primary sm:btn-lg inline-flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
            Browse All Products <FiArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
