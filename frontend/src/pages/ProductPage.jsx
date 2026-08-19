import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiStar, FiTruck, FiShield, FiPackage } from 'react-icons/fi';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${slug}`);
        setProduct(data);
        if (data.category?._id) {
          const { data: related } = await API.get(`/products?category=${data.category._id}&limit=4`);
          setRelatedProducts(related.products.filter(p => p._id !== data._id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product._id, quantity, product.price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded-full w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded-full w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-dark-900 mb-4">Product Not Found</h2>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <SEO title={product?.name} description={product?.description || product?.name} />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 overflow-x-auto">
            <Link to="/" className="hover:text-brand-600 transition whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-brand-600 transition whitespace-nowrap">Shop</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link to={`/shop/${product.category.slug}`} className="hover:text-brand-600 transition whitespace-nowrap">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-dark-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Link to="/shop" className="inline-flex items-center gap-1.5 sm:gap-2 text-brand-600 hover:text-brand-700 font-semibold mb-4 sm:mb-6 transition text-sm">
          <FiArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square bg-gray-50">
              {!imgError && product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl sm:text-[120px] bg-gradient-to-br from-gray-100 to-gray-200">
                  🛍️
                </div>
              )}
              {product.isOnSale && discount > 0 && (
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-rose-500 text-white px-2.5 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-lg">
                  -{discount}% OFF
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-emerald-500 text-white px-2.5 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-lg">
                  NEW
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 sm:p-8 lg:p-10 flex flex-col">
              {product.category && (
                <Link
                  to={`/shop/${product.category.slug}`}
                  className="inline-flex items-center bg-brand-50 text-brand-700 w-fit px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-dark-900 mb-3 sm:mb-4 tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <FiStar key={star} size={14} className={star <= 4 ? 'text-brand-400 fill-brand-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">(4.0) 12 reviews</span>
              </div>

              <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-black text-brand-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > 0 && (
                  <>
                    <span className="text-base sm:text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-rose-100 text-rose-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm">
                {product.description || 'Fresh quality product from Apni Dukaan. Sourced with care to ensure the best halal standards.'}
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <FiShield size={16} className="text-brand-600 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-600">100% Halal</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <FiTruck size={16} className="text-brand-600 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-600">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <FiPackage size={16} className="text-brand-600 mb-0.5 sm:mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-600">Fresh Quality</span>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-gray-500">Availability:</span>
                  <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </span>
                </div>
                {product.brand && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-gray-500">Brand:</span>
                    <span className="font-bold text-dark-900">{product.brand}</span>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart - Hide for admin */}
              {user?.role === 'admin' ? (
                <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="bg-brand-50 rounded-xl sm:rounded-2xl p-4 text-center">
                    <p className="text-brand-700 text-sm font-semibold">You are logged in as Admin</p>
                    <p className="text-brand-500 text-xs mt-1">Manage products from the Admin Dashboard</p>
                  </div>
                </div>
              ) : (
                <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Quantity:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl sm:rounded-2xl">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 sm:p-3 hover:bg-gray-50 transition rounded-l-xl sm:rounded-l-2xl"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 sm:w-14 text-center font-bold text-sm sm:text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 sm:p-3 hover:bg-gray-50 transition rounded-r-xl sm:rounded-r-2xl"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full btn-primary sm:btn-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <FiShoppingCart size={18} />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>

                  {!user && (
                    <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                      <Link to="/login" className="text-brand-600 font-semibold hover:underline">Login</Link> to add items to cart
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-dark-900 mb-4 sm:mb-8 tracking-tight">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
