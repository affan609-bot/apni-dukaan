import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import SEO from '../components/SEO';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      await register({
        firstName: formData.firstName, lastName: formData.lastName,
        email: formData.email, password: formData.password, phone: formData.phone,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4 animate-fade-in">
      <SEO title="Register" description="Create your Apni Dukaan account for fast checkout and order tracking." />
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-lg sm:text-2xl">🏪</span>
            </div>
            <span className="text-xl sm:text-3xl font-black text-dark-900">Apni Dukaan</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900">Create Account</h1>
          <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm">Join Apni Dukaan today</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-5 sm:p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-xs sm:text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 block">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required className="input-field pl-9 sm:pl-11 text-sm" placeholder="John" />
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 block">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required className="input-field text-sm" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input-field pl-9 sm:pl-11 text-sm" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 block">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-9 sm:pl-11 text-sm" placeholder="0412 345 678" />
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required minLength={6} className="input-field pl-9 sm:pl-11 pr-10 sm:pr-12 text-sm" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="input-field pl-9 sm:pl-11 text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary sm:btn-lg text-sm disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-bold hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
