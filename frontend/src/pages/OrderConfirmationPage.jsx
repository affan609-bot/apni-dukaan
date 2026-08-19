import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheck, FiPackage, FiTruck, FiArrowRight } from 'react-icons/fi';
import API from '../api';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FiCheck size={28} className="text-green-600 sm:hidden" />
            <FiCheck size={40} className="text-green-600 hidden sm:block" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-card p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-dark-900">Order Details</h2>
              <p className="text-[10px] sm:text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <span className="badge bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs">{order.orderStatus}</span>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl">
                    🛍️
                  </div>
                  <div>
                    <p className="font-medium text-dark-900 text-xs sm:text-sm">{item.name}</p>
                    <p className="text-[10px] sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-dark-900 text-xs sm:text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-3 sm:mt-4 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${(order.totalAmount - (order.totalAmount >= 100 ? 0 : 14.99)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500">Delivery</span>
              <span className="font-medium">{order.totalAmount >= 100 ? 'FREE' : '$14.99'}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-brand-500">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FiTruck className="text-brand-500" size={18} />
              <h3 className="font-bold text-dark-900 text-sm">Shipping Address</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postcode}<br />
              {order.shippingAddress?.country}
            </p>
            {order.deliverySlot && (
              <p className="text-[10px] sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
                Delivery: {order.deliverySlot.charAt(0).toUpperCase() + order.deliverySlot.slice(1)} slot
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FiPackage className="text-brand-500" size={18} />
              <h3 className="font-bold text-dark-900 text-sm">Payment Info</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}<br />
              Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          <Link to="/account" className="btn-outline text-sm flex items-center justify-center gap-2">
            View My Orders
          </Link>
          <Link to="/shop" className="btn-primary text-sm flex items-center justify-center gap-2">
            Continue Shopping <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
