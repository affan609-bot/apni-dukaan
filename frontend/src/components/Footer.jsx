import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const footerLinks = {
  'Quick Links': [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Halal Meat', path: '/shop/halal-meat' },
    { label: 'Groceries', path: '/shop/international-groceries' },
    { label: 'KEB Meals', path: '/shop/keb-meals' },
  ],
  'Categories': [
    { label: 'Beef Products', path: '/shop/beef-products' },
    { label: 'Chicken Products', path: '/shop/chicken-products' },
    { label: 'Lamb Products', path: '/shop/lamb-products' },
    { label: 'Fragrances', path: '/shop/fragrance-bazaar' },
    { label: 'Aayat Collections', path: '/shop/aayat-collections' },
  ],
  'Support': [
    { label: 'About Us', path: '#' },
    { label: 'Contact Us', path: '#' },
    { label: 'Delivery Info', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms & Conditions', path: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Get deals, new products & halal recipes delivered to your inbox.</p>
            </div>
            <form className="flex w-full md:w-auto gap-2 sm:gap-3">
              <input type="email" placeholder="Enter your email" className="flex-1 md:w-80 px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-dark-800 border border-dark-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-400 transition" />
              <button type="submit" className="btn-primary text-sm px-4 sm:px-6 whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-400 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span className="text-base sm:text-xl">🏪</span>
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-black text-white">Apni Dukaan</h2>
                <p className="text-[8px] sm:text-[9px] text-brand-400 font-bold uppercase tracking-[0.2em]">Halal Meat & Grocery</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              Karachi's trusted online halal marketplace. Fresh meat & international groceries delivered to your door.
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6">
              <p className="flex items-center gap-2"><FiPhone size={12} className="text-brand-400" /> 1800-DUKAAN</p>
              <p className="flex items-center gap-2"><FiMail size={12} className="text-brand-400" /> hello@apnidukaan.pk</p>
              <p className="flex items-center gap-2"><FiMapPin size={12} className="text-brand-400" /> Karachi, Pakistan</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-dark-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-400 transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">{title}</h3>
              <ul className="space-y-1.5 sm:space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-xs sm:text-sm text-gray-400 hover:text-brand-400 transition flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-xs sm:text-sm text-gray-500">&copy; 2026 Apni Dukaan. All rights reserved.</p>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">Payment:</span>
            <div className="flex gap-1.5 sm:gap-2">
              <span className="bg-dark-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs text-brand-400 font-bold">💵 Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
