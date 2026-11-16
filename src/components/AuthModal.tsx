import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginAsDemoCustomer,
    loginAsDemoAdmin,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone, address, role });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemoCustomer();
    } catch (err: any) {
      setError(err.message || 'Failed to login as demo customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemoAdmin();
    } catch (err: any) {
      setError(err.message || 'Failed to login as demo admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 text-2xl">
            🍽️
          </div>
          <h2 className="font-heading font-bold text-2xl text-stone-900">
            {authModalMode === 'login' ? 'Welcome Back!' : 'Create FoodieHub Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {authModalMode === 'login'
              ? 'Log in to place orders and track delivery status'
              : 'Join FoodieHub for delicious food ordering and discounts'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
          <span className="text-[11px] font-semibold text-stone-500 block mb-2 uppercase tracking-wider text-center">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoCustomer}
              disabled={loading}
              className="py-2 px-2.5 bg-white hover:bg-orange-50 border border-stone-200 hover:border-orange-300 rounded-xl text-xs font-semibold text-stone-700 hover:text-orange-700 transition-colors cursor-pointer text-left flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div className="truncate">
                <span className="block leading-tight">Customer</span>
                <span className="text-[10px] text-stone-400 font-normal">Harshith Babu</span>
              </div>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="py-2 px-2.5 bg-white hover:bg-orange-50 border border-stone-200 hover:border-orange-300 rounded-xl text-xs font-semibold text-stone-700 hover:text-orange-700 transition-colors cursor-pointer text-left flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <div className="truncate">
                <span className="block leading-tight">Admin Portal</span>
                <span className="text-[10px] text-stone-400 font-normal">Kitchen Mgr</span>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harshith Babu"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin / Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. #42, 4th Cross, Indiranagar, Bangalore"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm mt-2"
          >
            {loading ? 'Please wait...' : authModalMode === 'login' ? 'Sign In to FoodieHub' : 'Create Account'}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 text-center text-xs text-stone-500">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthModalMode('register');
                }}
                className="text-orange-600 font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthModalMode('login');
                }}
                className="text-orange-600 font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
