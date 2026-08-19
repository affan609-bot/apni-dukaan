import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiArrowLeft, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders/admin/all');
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await API.delete(`/orders/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  if (!user || user.role !== 'admin') return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    processing: 'bg-purple-100 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'confirmed').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.totalAmount : 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link to="/account" className="text-gray-400 hover:text-dark-900 transition">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-dark-900">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Manage orders & track sales</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                <FiShoppingBag size={20} className="text-brand-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Orders</p>
                <p className="text-xl sm:text-2xl font-black text-dark-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FiClock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Pending</p>
                <p className="text-xl sm:text-2xl font-black text-dark-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FiTruck size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Processing</p>
                <p className="text-xl sm:text-2xl font-black text-dark-900">{stats.processing}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <FiDollarSign size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Revenue</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600">${stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-dark-900">All Orders</h2>
          </div>

          {loading ? (
            <div className="p-4 sm:p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 sm:h-20 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📦</div>
              <h3 className="text-lg font-bold text-dark-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-sm">Orders from customers will appear here</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Order ID</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Delivery Address</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Items</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Notes</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-dark-900">#{order._id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-dark-900">{order.user?.firstName} {order.user?.lastName}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                          {order.user?.phone && <p className="text-xs text-gray-500">{order.user.phone}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[200px]">
                            {order.shippingAddress?.area && (
                              <p className="text-xs font-semibold text-brand-600">{order.shippingAddress.area}</p>
                            )}
                            {order.shippingAddress?.street && (
                              <p className="text-xs text-gray-700">{order.shippingAddress.street}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(', ')}
                              {order.shippingAddress?.postcode && ` - ${order.shippingAddress.postcode}`}
                            </p>
                            {order.shippingAddress?.country && (
                              <p className="text-[10px] text-gray-400">{order.shippingAddress.country}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{order.items.length} item(s)</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[150px]">
                            {order.notes ? (
                              <p className="text-xs text-gray-600 italic">"{order.notes}"</p>
                            ) : (
                              <p className="text-xs text-gray-300">No notes</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-brand-600">${order.totalAmount.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-AU')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              disabled={updatingId === order._id}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50 cursor-pointer"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete order"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order._id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-dark-900">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-900">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </div>
                    {order.shippingAddress && (
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-[10px] font-semibold text-brand-600 uppercase mb-1">Delivery Address</p>
                        {order.shippingAddress.area && <p className="text-xs font-semibold text-dark-900">{order.shippingAddress.area}</p>}
                        {order.shippingAddress.street && <p className="text-xs text-gray-700">{order.shippingAddress.street}</p>}
                        <p className="text-xs text-gray-500">
                          {[order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ')}
                          {order.shippingAddress.postcode && ` - ${order.shippingAddress.postcode}`}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{order.items.length} item(s) &bull; {new Date(order.createdAt).toLocaleDateString('en-AU')}</span>
                      <span className="text-sm font-bold text-brand-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    {order.notes && (
                      <div className="bg-amber-50 rounded-xl p-2.5">
                        <p className="text-[10px] font-semibold text-amber-600 uppercase mb-0.5">Order Notes</p>
                        <p className="text-xs text-amber-700 italic">"{order.notes}"</p>
                      </div>
                    )}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
