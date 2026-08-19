import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import SEO from '../components/SEO';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4 animate-fade-in">
      <SEO title="Login" description="Login to your Apni Dukaan account to track orders and manage your profile." />
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-lg sm:text-2xl">🏪</span>
            </div>
            <span className="text-xl sm:text-3xl font-black text-dark-900">Apni Dukaan</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm">Login to your account</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-card p-5 sm:p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-xs sm:text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-10 sm:pl-12 text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary sm:btn-lg text-sm disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
