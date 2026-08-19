import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import API from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const { data } = await API.get(`/products?search=${encodeURIComponent(query)}&limit=20`);
        setProducts(data.products);
      } catch (error) { console.error('Search error:', error); } finally { setLoading(false); }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <SEO title="Search Results" description="Search products at Apni Dukaan." />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-dark-900 truncate">
            Search Results for "<span className="text-brand-600">{query}</span>"
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            {loading ? 'Searching...' : `${products.length} products found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6">
              <FiSearch size={24} className="text-brand-400 sm:hidden" />
              <FiSearch size={32} className="text-brand-400 hidden sm:block" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Try different keywords or browse our categories</p>
            <Link to="/shop" className="btn-primary text-sm inline-flex items-center gap-2">
              Browse All Products <FiArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
