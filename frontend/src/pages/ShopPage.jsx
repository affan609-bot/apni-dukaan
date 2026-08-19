import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import API from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const categoryStructure = [
  { label: 'Halal Meat', slug: 'halal-meat', icon: '🥩', subcats: [
    { label: 'Beef', slug: 'beef-products', icon: '🐄' },
    { label: 'Chicken', slug: 'chicken-products', icon: '🍗' },
    { label: 'Lamb', slug: 'lamb-products', icon: '🐑' },
    { label: 'Goat', slug: 'goat-products', icon: '🐐' },
    { label: 'Fish', slug: 'fish-products', icon: '🐟' },
    { label: 'Duck', slug: 'duck-products', icon: '🦆' },
    { label: 'Bulk Buy', slug: 'bulk-buy-meat', icon: '📦' },
    { label: 'Sadaqah & Aqeeqah', slug: 'sadaqah-aqeeqah', icon: '🙏' },
  ]},
  { label: 'Groceries', slug: 'international-groceries', icon: '🛒', subcats: [
    { label: 'Pakistani', slug: 'pakistani-products', icon: '🇵🇰' },
    { label: 'Indian', slug: 'indian-products', icon: '🇮🇳' },
    { label: 'Bangladeshi', slug: 'bangladeshi-products', icon: '🇧🇩' },
    { label: 'Middle Eastern', slug: 'middle-eastern-products', icon: '🇸🇦' },
    { label: 'Snacks', slug: 'snacks', icon: '🍿' },
    { label: 'Spices', slug: 'spices', icon: '🧂' },
    { label: 'Drinks', slug: 'drinks', icon: '🥤' },
    { label: 'Frozen', slug: 'frozen-products', icon: '🧊' },
    { label: 'Rice', slug: 'rice', icon: '🍚' },
    { label: 'Oil & Ghee', slug: 'oil-ghee', icon: '🫒' },
  ]},
  { label: 'KEB Meals', slug: 'keb-meals', icon: '🍛', subcats: [] },
  { label: 'Fragrances', slug: 'fragrance-bazaar', icon: '🌸', subcats: [
    { label: "Men's", slug: 'mens-fragrances', icon: '🚹' },
    { label: "Women's", slug: 'womens-fragrances', icon: '🚺' },
    { label: 'Unisex', slug: 'unisex-fragrances', icon: '⚧️' },
    { label: 'Attars & Oils', slug: 'attars-perfume-oils', icon: '💧' },
    { label: 'Bakhoor & Incense', slug: 'bakhoor-incense', icon: '🪔' },
    { label: 'Gift Sets', slug: 'gift-sets', icon: '🎁' },
  ]},
  { label: 'Aayat', slug: 'aayat-collections', icon: '🧕', subcats: [
    { label: 'Hijabs', slug: 'premium-hijabs', icon: '🧕' },
    { label: 'Prayer Sets', slug: 'prayer-sets', icon: '🤲' },
    { label: 'Prayer Mats', slug: 'prayer-mats', icon: '🕌' },
  ]},
];

export default function ShopPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const cuisine = searchParams.get('cuisine');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('All Products');

  const parentCategories = categoryStructure;
  const activeParent = categoryStructure.find(c => c.slug === categorySlug);
  const activeSubcats = activeParent?.subcats || [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: allCats } = await API.get('/categories/all');

        let params = `?page=${page}&limit=12`;
        if (sort) params += `&sort=${sort}`;
        if (cuisine) params += `&cuisine=${cuisine}`;

        if (categorySlug) {
          const cat = allCats.data?.find(c => c.slug === categorySlug) || allCats.find?.(c => c.slug === categorySlug);
          if (cat) { params += `&category=${cat._id}`; setCategoryName(cat.name); }
          else { setCategoryName(categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())); }
        } else {
          setCategoryName(cuisine ? `${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} Products` : 'All Products');
        }

        const { data } = await API.get(`/products${params}`);
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchData();
  }, [categorySlug, cuisine, sort, page]);

  useEffect(() => { setPage(1); }, [categorySlug, cuisine, sort]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <SEO title={categoryName} description={`Shop ${categoryName} at Apni Dukaan. Best prices on halal meat, groceries & more in Karachi.`} />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <Link to="/" className="hover:text-brand-600 transition">Home</Link>
            <span>/</span>
            <span className="text-dark-900 font-medium truncate">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex gap-4 sm:gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 sticky top-32">
              <h3 className="font-bold text-dark-900 mb-4">Categories</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link to="/shop" className={`block px-3 py-2 rounded-xl text-sm font-medium transition ${!categorySlug ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                    All Products
                  </Link>
                </li>
                {parentCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/shop/${cat.slug}`} className={`block px-3 py-2 rounded-xl text-sm font-medium transition ${categorySlug === cat.slug ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {cat.icon} {cat.label}
                    </Link>
                    {categorySlug === cat.slug && cat.subcats.length > 0 && (
                      <ul className="pl-4 mt-0.5 space-y-0.5 border-l-2 border-brand-200 ml-4">
                        {cat.subcats.map((sub) => (
                          <li key={sub.slug}>
                            <Link to={`/shop/${sub.slug}`} className={`flex items-center gap-2 block px-3 py-1.5 rounded-lg text-xs font-medium transition ${categorySlug === sub.slug ? 'text-brand-600 bg-brand-50' : 'text-gray-500 hover:text-brand-600 hover:bg-gray-50'}`}>
                              <span>{sub.icon}</span>
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-dark-900 mb-4">Sort By</h3>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field text-sm">
                  <option value="">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-dark-900 truncate">{categoryName}</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{products.length} products found</p>
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-1.5 btn-outline btn-sm text-xs sm:text-sm">
                <FiFilter size={14} /> Filters
              </button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6 mb-4 sm:mb-6 animate-slide-up">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-bold text-sm sm:text-base">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl"><FiX size={18} /></button>
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field text-xs sm:text-sm mb-3 sm:mb-4">
                  <option value="">Sort: Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Link to="/shop" className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm bg-brand-50 text-brand-600 font-bold">All</Link>
                  {parentCategories.map((cat) => (
                    <Link key={cat.slug} to={`/shop/${cat.slug}`} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium">
                      {cat.icon} {cat.label}
                    </Link>
                  ))}
                </div>
                {activeSubcats.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100">
                    {activeSubcats.map((sub) => (
                      <Link key={sub.slug} to={`/shop/${sub.slug}`} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${categorySlug === sub.slug ? 'bg-brand-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-brand-50 hover:text-brand-600'}`}>
                        {sub.icon} {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-t-2xl sm:rounded-t-3xl"></div>
                    <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                      <div className="h-3 bg-gray-200 rounded-full w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or browse all products</p>
                <Link to="/shop" className="btn-primary text-sm">Browse All Products</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition ${page === i + 1 ? 'bg-brand-400 text-dark-900 shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
