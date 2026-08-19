import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiTruck, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const KARACHI_AREAS = [
  'Clifton', 'Defence (DHA)', 'Gulshan-e-Iqbal', 'North Nazimabad', 'Saddar',
  'PECHS', 'Bahadurabad', 'Tariq Road', 'Federal B Area', 'Gulistan-e-Johar',
  'Malir', 'Korangi', 'Landhi', 'Orangi Town', 'North Karachi', 'Surjani Town',
  'Liaquatabad', 'Nazimabad', 'Jamshed Town', 'SITE Area', 'Shah Faisal Colony',
  'Model Colony', 'Gulzar-e-Hijri', 'Scheme 33', 'Saylani Town', 'Abdul Rehman Goth',
  'Bin Qasim', 'Port Qasim', 'Manzoor Colony', 'Buffer Zone', 'Samdani Town',
  'Chanesar Town', 'Neelam Colony', 'Mominpur', 'Machar Colony', 'Kathore',
  'Super Highway', 'Gadap Town', 'Murad Memon Goth', 'Dhabeji', 'Thatta',
  'Hub', 'Windar', 'Sonmiani', 'Hawksbay', 'Sandra',
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    street: '', city: '', area: '', postcode: '', phone: '', notes: '',
    deliveryDate: '', deliverySlot: 'morning',
  });

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = subtotal >= 100 ? 0 : 14.99;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) { toast.error('Your cart is empty'); return; }
    if (!formData.area) { toast.error('Please select your area in Karachi'); return; }
    setLoading(true);
    try {
      const { data: order } = await API.post('/orders', {
        shippingAddress: {
          street: formData.street,
          city: 'Karachi',
          state: 'Sindh',
          postcode: formData.postcode || '75000',
          country: 'Pakistan',
          area: formData.area,
        },
        paymentMethod: 'cod', deliveryDate: formData.deliveryDate || undefined,
        deliverySlot: formData.deliverySlot, notes: formData.notes,
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center p-8"><div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🔒</div><h2 className="text-2xl font-black mb-3">Please Login</h2><Link to="/login" className="btn-primary">Login</Link></div></div>;
  if (cart.items.length === 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center p-8"><div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🛒</div><h2 className="text-2xl font-black mb-3">Cart is empty</h2><Link to="/shop" className="btn-primary">Start Shopping</Link></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <SEO title="Checkout" description="Complete your order at Apni Dukaan. Cash on delivery available." />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Link to="/cart" className="inline-flex items-center gap-1.5 sm:gap-2 text-brand-600 hover:text-brand-700 font-semibold mb-4 sm:mb-6 transition text-sm">
          <FiArrowLeft size={14} /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-dark-900 mb-6 sm:mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-3 sm:mb-4 flex items-center gap-2"><FiMapPin size={18} /> Delivery Address (Karachi Only)</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-xs sm:text-sm text-amber-700 font-medium flex items-center gap-2">
                    <span>⚠️</span> We only deliver within Karachi, Pakistan. Please select your area below.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Area / Neighbourhood *</label>
                    <select name="area" value={formData.area} onChange={handleChange} required className="input-field text-sm">
                      <option value="">Select your area in Karachi</option>
                      {KARACHI_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Street Address / House No.</label>
                    <input name="street" value={formData.street} onChange={handleChange} required className="input-field text-sm" placeholder="House #123, Street 4, Phase 7" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Postcode</label>
                    <input name="postcode" value={formData.postcode} onChange={handleChange} className="input-field text-sm" placeholder="75000" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required className="input-field text-sm" placeholder="0300 1234567" />
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-3 sm:mb-4">Delivery Details</h3>
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Preferred Delivery Date</label>
                    <input name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Delivery Slot</label>
                    <select name="deliverySlot" value={formData.deliverySlot} onChange={handleChange} className="input-field text-sm">
                      <option value="morning">Morning (9am - 12pm)</option>
                      <option value="afternoon">Afternoon (12pm - 4pm)</option>
                      <option value="evening">Evening (4pm - 8pm)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Order Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input-field text-sm" placeholder="Any special instructions..." />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-3 sm:mb-4 flex items-center gap-2">💵 Payment Method</h3>
                <div className="p-3 sm:p-4 border-2 border-brand-400 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4">
                  <span className="text-lg sm:text-2xl">💵</span>
                  <div>
                    <span className="font-semibold text-dark-900 text-sm">Cash on Delivery</span>
                    <p className="text-[10px] sm:text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                  <FiCheck className="ml-auto text-brand-600" size={18} />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6 sticky top-24 sm:top-32">
                <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-3 sm:mb-4">Order Summary</h3>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-48 sm:max-h-60 overflow-auto">
                  {cart.items.map((item) => (
                    <div key={item.product?._id} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex-shrink-0 overflow-hidden">
                        {item.product?.image && <img src={item.product.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-gray-600 truncate flex-1">{item.product?.name || 'Product'} x {item.quantity}</span>
                      <span className="font-bold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : ''}`}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 sm:pt-3 flex justify-between">
                    <span className="font-bold text-dark-900">Total</span>
                    <span className="text-xl sm:text-2xl font-black text-brand-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary sm:btn-lg mt-4 sm:mt-6 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 text-sm">
                  {loading ? 'Placing Order...' : '💵 Place Order'}
                </button>
                <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 sm:mt-3">By placing this order you agree to our terms</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
