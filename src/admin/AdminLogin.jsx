import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Successfully logged in!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.error || 'Failed to login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card p-8 shadow-2xl bg-white/90 backdrop-blur-xl border border-white">
          <div className="text-center mb-10">
            <div className="h-20 flex items-center justify-center mb-6">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="max-h-full w-auto object-contain" />
              ) : (
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-accent/30">
                  <span className="text-white font-bold text-3xl font-[Outfit]">
                    {settings.companyName?.charAt(0) || 'B'}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-primary font-[Outfit]">Admin Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to manage your real estate platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full transition-all focus:scale-[1.01]"
                placeholder="admin@gmail.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {/* <a href="#" className="text-xs text-accent hover:underline font-medium">Forgot Password?</a> */}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full transition-all focus:scale-[1.01]"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 flex items-center justify-center mt-4 transition-all hover:scale-[1.02] shadow-xl shadow-accent/20"
            >
              {isSubmitting ? (
                <div className="spinner border-t-white border-2 w-5 h-5"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Secure connection established</span>
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
