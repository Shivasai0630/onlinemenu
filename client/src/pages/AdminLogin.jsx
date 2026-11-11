import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UtensilsCrossed, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Server error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lavish-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-dark-radial opacity-60" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-lavish-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-lavish-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Back to home */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 font-sans text-sm text-lavish-creamMuted hover:text-lavish-gold transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-lavish-card border border-lavish-border rounded-xl p-8 shadow-luxury fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
              <UtensilsCrossed size={22} className="text-lavish-dark" />
            </div>
            <h1 className="font-cinzel text-xl font-bold tracking-widest text-lavish-cream">
              ADMIN LOGIN
            </h1>
            <p className="font-sans text-xs text-lavish-creamMuted mt-1">The Lavish Restaurant Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 slide-up">
                <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span className="font-sans text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1.5 tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="input-luxury py-3"
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-sans text-xs text-lavish-creamMuted block mb-1.5 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-luxury py-3 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lavish-creamMuted hover:text-lavish-gold transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 font-cinzel tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-lavish-dark/50 border-t-lavish-dark rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  SIGN IN
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-lavish-dark/50 rounded-lg border border-lavish-border/50">
            <p className="font-sans text-xs text-lavish-creamMuted text-center">
              Default credentials: <span className="text-lavish-gold font-mono">admin</span> / <span className="text-lavish-gold font-mono">lavish@admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
