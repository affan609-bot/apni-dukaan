import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 sm:hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl bg-gradient-to-br from-gray-100 to-gray-200">
              🛍️
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {product.isNew && (
              <span className="bg-emerald-500 text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                New
              </span>
            )}
            {product.isOnSale && discount > 0 && (
              <span className="bg-rose-500 text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick View overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-3 sm:pb-5">
            <span className="bg-white text-dark-900 text-[10px] sm:text-xs font-black px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full shadow-xl translate-y-3 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-2.5 sm:p-4">
          {product.category && (
            <p className="text-[8px] sm:text-[10px] text-brand-600 font-black uppercase tracking-[0.15em] mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-bold text-dark-900 group-hover:text-brand-600 transition-colors line-clamp-2 text-[11px] sm:text-sm leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="mt-1.5 sm:mt-2.5 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-lg font-black text-brand-600">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > 0 && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-emerald-500 rounded-full"></span>
              <p className="text-[9px] sm:text-[11px] text-emerald-600 font-semibold">In Stock</p>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-rose-500 rounded-full"></span>
              <p className="text-[9px] sm:text-[11px] text-rose-500 font-semibold">Out of Stock</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
