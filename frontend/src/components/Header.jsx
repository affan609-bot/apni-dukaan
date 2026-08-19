import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiPhone, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
  {
    label: 'Halal Meat', path: '/shop/halal-meat', icon: '🥩',
    subcats: [
      { label: 'Beef', path: '/shop/beef-products', icon: '🐄' },
      { label: 'Chicken', path: '/shop/chicken-products', icon: '🍗' },
      { label: 'Lamb', path: '/shop/lamb-products', icon: '🐑' },
      { label: 'Goat', path: '/shop/goat-products', icon: '🐐' },
      { label: 'Fish', path: '/shop/fish-products', icon: '🐟' },
      { label: 'Duck', path: '/shop/duck-products', icon: '🦆' },
      { label: 'Bulk Buy', path: '/shop/bulk-buy-meat', icon: '📦' },
      { label: 'Sadaqah & Aqeeqah', path: '/shop/sadaqah-aqeeqah', icon: '🙏' },
    ]
  },
  {
    label: 'Groceries', path: '/shop/international-groceries', icon: '🛒',
    subcats: [
      { label: 'Pakistani', path: '/shop/pakistani-products', icon: '🇵🇰' },
      { label: 'Indian', path: '/shop/indian-products', icon: '🇮🇳' },
      { label: 'Bangladeshi', path: '/shop/bangladeshi-products', icon: '🇧🇩' },
      { label: 'Middle Eastern', path: '/shop/middle-eastern-products', icon: '🇸🇦' },
      { label: 'Snacks', path: '/shop/snacks', icon: '🍿' },
      { label: 'Spices', path: '/shop/spices', icon: '🧂' },
      { label: 'Drinks', path: '/shop/drinks', icon: '🥤' },
      { label: 'Frozen', path: '/shop/frozen-products', icon: '🧊' },
      { label: 'Rice', path: '/shop/rice', icon: '🍚' },
      { label: 'Oil & Ghee', path: '/shop/oil-ghee', icon: '🫒' },
    ]
  },
  {
    label: 'Fragrances', path: '/shop/fragrance-bazaar', icon: '🌸',
    subcats: [
      { label: "Men's", path: '/shop/mens-fragrances', icon: '🚹' },
      { label: "Women's", path: '/shop/womens-fragrances', icon: '🚺' },
      { label: 'Unisex', path: '/shop/unisex-fragrances', icon: '⚧️' },
      { label: 'Attars & Oils', path: '/shop/attars-perfume-oils', icon: '💧' },
      { label: 'Bakhoor & Incense', path: '/shop/bakhoor-incense', icon: '🪔' },
      { label: 'Gift Sets', path: '/shop/gift-sets', icon: '🎁' },
    ]
  },
  {
    label: 'Aayat', path: '/shop/aayat-collections', icon: '🧕',
    subcats: [
      { label: 'Hijabs', path: '/shop/premium-hijabs', icon: '🧕' },
      { label: 'Prayer Sets', path: '/shop/prayer-sets', icon: '🤲' },
      { label: 'Prayer Mats', path: '/shop/prayer-mats', icon: '🕌' },
    ]
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-white shadow-sm'}`}>
      {/* Top Bar */}
      <div className="bg-dark-900 text-white text-center text-[10px] sm:text-xs py-1.5 sm:py-2 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1.5"><FiPhone size={12} /> 1800-DUKAAN</span>
            <span className="flex items-center gap-1.5"><FiMapPin size={12} /> Karachi, Pakistan</span>
          </div>
          <p className="flex-1 text-center">Free delivery over <span className="text-brand-400 font-bold">Rs. 5000</span></p>
          <div className="hidden md:flex items-center gap-4 text-gray-300">
            <Link to="/login" className="hover:text-brand-400 transition">Track Order</Link>
            <span className="text-gray-600">|</span>
            <Link to="/login" className="hover:text-brand-400 transition">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button
            className="lg:hidden text-dark-900 p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-base sm:text-xl">🏪</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-dark-900 tracking-tight leading-none">
                  Apni Dukaan
                </h1>
                <p className="text-[8px] sm:text-[9px] text-brand-600 font-bold uppercase tracking-[0.2em]">
                  Halal Meat & Grocery
                </p>
              </div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for halal meat, groceries, fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-gray-100 border-2 border-transparent text-dark-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-400/10 transition-all duration-300"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-900 text-white p-2.5 rounded-xl hover:bg-dark-800 transition">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="md:hidden text-dark-900 p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-xl transition"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FiSearch size={18} />
            </button>

            {user?.role !== 'admin' && (
              <Link to="/cart" className="relative text-dark-900 p-1.5 sm:p-2.5 hover:bg-brand-50 rounded-xl transition group">
                <FiShoppingCart size={20} className="group-hover:text-brand-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-400 text-dark-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <Link to="/account" className="flex items-center gap-2 text-dark-900 p-2.5 hover:bg-brand-50 rounded-xl transition group">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <FiUser size={16} className="text-brand-600" />
                </div>
                <span className="hidden lg:inline text-sm font-semibold">{user.firstName}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 btn-primary btn-sm">
                <FiUser size={16} />
                <span className="hidden lg:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="md:hidden mt-3 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-gray-100 border-2 border-transparent text-dark-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:bg-white transition"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-900 text-white p-2.5 rounded-xl">
                <FiSearch size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Desktop Navigation with Dropdowns */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0.5">
            <li>
              <Link to="/" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-dark-900 hover:bg-brand-50 rounded-xl transition-all duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-dark-900 hover:bg-brand-50 rounded-xl transition-all duration-200">
                Shop All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.path} className="relative" ref={openDropdown === cat.path ? dropdownRef : null}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === cat.path ? null : cat.path)}
                  onMouseEnter={() => setOpenDropdown(cat.path)}
                  className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 hover:text-dark-900 hover:bg-brand-50 rounded-xl transition-all duration-200"
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                  <FiChevronDown size={12} className={`transition-transform ${openDropdown === cat.path ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === cat.path && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-up z-50"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link to={cat.path} onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition">
                      All {cat.label}
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    {cat.subcats.map((sub) => (
                      <Link key={sub.path} to={sub.path} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition">
                        <span className="text-base">{sub.icon}</span>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-up max-h-[70vh] overflow-y-auto">
          <ul className="p-4 space-y-1">
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-dark-900 hover:bg-brand-50 rounded-xl transition font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-dark-900 hover:bg-brand-50 rounded-xl transition font-medium">
                Shop All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.path}>
                <button
                  onClick={() => setMobileShopOpen(mobileShopOpen === cat.path ? null : cat.path)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-dark-900 hover:bg-brand-50 rounded-xl transition font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </span>
                  <FiChevronDown size={16} className={`transition-transform ${mobileShopOpen === cat.path ? 'rotate-180' : ''}`} />
                </button>
                {mobileShopOpen === cat.path && (
                  <ul className="pl-8 mt-1 space-y-0.5">
                    <li>
                      <Link to={cat.path} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition font-medium">
                        All {cat.label}
                      </Link>
                    </li>
                    {cat.subcats.map((sub) => (
                      <li key={sub.path}>
                        <Link to={sub.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition">
                          <span>{sub.icon}</span>
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {!user && (
              <>
                <li className="border-t border-gray-100 pt-2 mt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-brand-600 font-bold">Login</Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-brand-600 font-bold">Register</Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="border-t border-gray-100 pt-2 mt-2">
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-dark-900 font-medium">My Account</Link>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-emerald-600 font-medium">Admin Dashboard</Link>
                  </li>
                )}
                <li>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-red-500 hover:text-red-600 font-medium">Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
