import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit3, FiGrid, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchOrders();
  }, [user, navigate]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const { data } = await API.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? data : o));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;
    try {
      await API.delete(`/orders/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  if (!user) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <SEO title="My Account" description="Manage your profile, orders and addresses." />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-dark-900 mb-6 sm:mb-8">My Account</h1>

        <div className="grid md:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2 sm:mb-3">
                  <FiUser size={20} className="text-brand-600 sm:hidden" />
                  <FiUser size={28} className="text-brand-600 hidden sm:block" />
                </div>
                <h3 className="font-bold text-dark-900 text-sm sm:text-base">{user.firstName} {user.lastName}</h3>
                <p className="text-[10px] sm:text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <nav className="space-y-0.5 sm:space-y-1">
                {[
                  ...(user.role !== 'admin' ? [{ key: 'orders', label: 'My Orders', icon: <FiPackage size={16} /> }] : []),
                  { key: 'profile', label: 'Profile', icon: <FiUser size={16} /> },
                  { key: 'addresses', label: 'Addresses', icon: <FiMapPin size={16} /> },
                ].map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition ${activeTab === tab.key ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
                {user.role === 'admin' && (
                  <Link to="/admin" className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition">
                    <FiGrid size={16} />Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 transition">
                  <FiLogOut size={16} />Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'orders' && user.role === 'admin' && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-dark-900 mb-4 sm:mb-6">Admin Dashboard</h2>
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4">📊</div>
                  <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-2">Manage Orders from Dashboard</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">View and manage all customer orders from the admin panel</p>
                  <Link to="/admin" className="btn-primary text-sm inline-block">Go to Admin Dashboard</Link>
                </div>
              </div>
            )}
            {activeTab === 'orders' && user.role !== 'admin' && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-dark-900 mb-4 sm:mb-6">My Orders</h2>
                {loading ? (
                  <div className="space-y-3 sm:space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="animate-pulse h-16 sm:h-20 bg-gray-100 rounded-xl sm:rounded-2xl"></div>)}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4">📦</div>
                    <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">Start shopping to see your orders here</p>
                    <Link to="/shop" className="btn-primary text-sm">Shop Now</Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className="text-[10px] sm:text-sm text-gray-500 font-medium">Order #{order._id.slice(-8).toUpperCase()}</span>
                          <span className={`badge text-[10px] sm:text-xs ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{order.orderStatus}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-AU')}</span>
                          <span className="font-bold text-brand-600 text-xs sm:text-sm">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2">{order.items.length} item(s)</p>
                        <div className="flex items-center gap-2 mt-2 sm:mt-3">
                          {order.orderStatus === 'pending' && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-orange-500 hover:text-orange-600 hover:bg-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition"
                            >
                              <FiX size={12} /> Cancel
                            </button>
                          )}
                          {order.orderStatus === 'cancelled' && (
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition"
                            >
                              <FiTrash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-dark-900 mb-4 sm:mb-6 flex items-center gap-2"><FiEdit3 size={18} /> Profile Settings</h2>
                <div className="space-y-3 sm:space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">First Name</label><input defaultValue={user.firstName} className="input-field text-sm" readOnly /></div>
                    <div><label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Last Name</label><input defaultValue={user.lastName} className="input-field text-sm" readOnly /></div>
                  </div>
                  <div><label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Email</label><input defaultValue={user.email} className="input-field text-sm" readOnly /></div>
                  <button className="btn-primary text-sm">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-dark-900 mb-4 sm:mb-6">Saved Addresses</h2>
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4">📍</div>
                  <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-2">No saved addresses</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">Add an address at checkout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
