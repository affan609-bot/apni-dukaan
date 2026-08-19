import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiShield, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = subtotal >= 100 ? 0 : 14.99;
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🛒</div>
          <h2 className="text-2xl font-black text-dark-900 mb-3">Please Login</h2>
          <p className="text-gray-500 mb-6">Login to view your cart</p>
          <Link to="/login" className="btn-primary">Login Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <SEO title="Shopping Cart" description="Review your cart items at Apni Dukaan." />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-dark-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1 text-sm">{cart.items.length} items in your cart</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm transition">
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-gray-100 shadow-card">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6">🛒</div>
            <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet</p>
            <Link to="/shop" className="btn-primary text-sm">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.items.map((item) => (
                <div key={item.product?._id || item._id} className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-3 sm:p-6 flex gap-3 sm:gap-5">
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-50 rounded-xl sm:rounded-2xl flex-shrink-0 overflow-hidden">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl">🛍️</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product?.slug}`}
                      className="font-bold text-dark-900 hover:text-brand-600 transition line-clamp-1 text-sm sm:text-lg"
                    >
                      {item.product?.name || 'Product'}
                    </Link>
                    <p className="text-brand-600 font-black text-base sm:text-xl mt-0.5 sm:mt-1">
                      ${(item.product?.price || 0).toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-2 sm:mt-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl sm:rounded-2xl">
                        <button
                          onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                          className="p-1.5 sm:p-2.5 hover:bg-gray-50 transition rounded-l-xl sm:rounded-l-2xl"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 sm:w-12 text-center text-xs sm:text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                          className="p-1.5 sm:p-2.5 hover:bg-gray-50 transition rounded-r-xl sm:rounded-r-2xl"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product?._id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 sm:p-2.5 hover:bg-red-50 rounded-lg sm:rounded-xl transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-semibold transition mt-2 sm:mt-4"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6 sticky top-24 sm:top-32">
                <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-4 sm:mb-6">Order Summary</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Add ${(100 - subtotal).toFixed(2)} more for free delivery
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-dark-900">Total</span>
                    <span className="text-xl sm:text-2xl font-black text-brand-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <FiShield size={14} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs text-gray-500">Cash on Delivery - Pay when your order arrives</span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full btn-primary sm:btn-lg flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 text-sm"
                >
                  <FiShoppingBag size={18} />
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
