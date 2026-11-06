import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ToastContainer } from '../components/common/ToastContainer';

export const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useStudy();
  const navigate = useNavigate();

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Please enter at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'You must accept the demo terms of use';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Account created for ${fullName}! Taking you to your dashboard...`);
      navigate('/dashboard');
    }, 500);
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
          Create student account
        </h2>
        <p className="mt-1.5 text-sm text-navy-500">
          Get started with your personalized course & task planner
        </p>

        {/* Demo environment pill */}
        <div className="mt-4 mx-4 sm:mx-0 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold text-amber-800">Frontend Prototype:</strong> Credentials will not be sent to a live server. Form validation and interactions run in your local client.
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-2xl border border-navy-100 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5"
              >
                Full Name <span className="text-coral-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                  errors.fullName ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@university.edu"
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5"
              >
                Password <span className="text-coral-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5"
              >
                Confirm Password <span className="text-coral-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                  errors.confirmPassword ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-2.5 text-xs text-navy-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-coral-500 focus:ring-coral-400 border-navy-300"
                />
                <span>
                  I agree to the demo guidelines and understand this is an interactive student preview prototype.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-coral-600 font-medium">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 shadow-card hover:shadow-glow-coral transition-all duration-200 transform active:scale-98 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Creating Demo Workspace...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-sm text-navy-600 border-t border-navy-100 pt-5">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-coral-600 hover:text-coral-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

