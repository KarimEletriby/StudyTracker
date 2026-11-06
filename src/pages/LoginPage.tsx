import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ToastContainer } from '../components/common/ToastContainer';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex.morgan@university.edu');
  const [password, setPassword] = useState('StudyPlanner2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useStudy();
  const navigate = useNavigate();

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulating quick client-side validation transition
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Welcome back, Alex! Navigating to your dashboard...');
      navigate('/dashboard');
    }, 450);
  };

  const handleFillDemo = () => {
    setEmail('alex.morgan@university.edu');
    setPassword('DemoStudy2026!');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-coral-100 selection:text-coral-700">
      <ToastContainer />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy-600 hover:text-navy-900 bg-white px-3 py-1.5 rounded-lg border border-navy-200 shadow-subtle hover:bg-navy-50 transition-colors"
        >
          ← Back to Overview
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <Link to="/" className="inline-flex items-center justify-center gap-2.5 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-coral-500" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-navy-900 font-sans tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-navy-500">
          Sign in to access your course subjects and deadlines
        </p>

        {/* Demo environment pill banner */}
        <div className="mt-4 mx-4 sm:mx-0 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold text-amber-800">UI Demo Mode:</strong> This frontend does not transmit credentials. You can click "Sign In" with any valid email or use the pre-filled demo data.
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-2xl border border-navy-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5"
              >
                Student Email <span className="text-coral-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                  errors.email ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field with Show/Hide */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-700"
                >
                  Password <span className="text-coral-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-coral-600 hover:text-coral-700 font-medium underline"
                >
                  Fill Demo Password
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                    errors.password ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Demo Hint */}
            <div className="flex items-center justify-between text-xs text-navy-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-coral-500 focus:ring-coral-400 border-navy-300"
                />
                <span>Remember me on this device</span>
              </label>
              <span className="text-navy-400 hover:text-navy-600 cursor-not-allowed" title="Password reset will be available when backend auth is integrated">
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 shadow-card hover:shadow-glow-coral transition-all duration-200 transform active:scale-98 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 text-center text-sm text-navy-600 border-t border-navy-100 pt-5">
            <span>Don't have an account yet? </span>
            <Link
              to="/signup"
              className="font-semibold text-coral-600 hover:text-coral-700 transition-colors"
            >
              Create Account Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

