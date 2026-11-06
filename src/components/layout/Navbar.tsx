import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-navy-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 text-coral-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-navy-900 font-sans">
                  Study<span className="text-coral-500">Planner</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-coral-100 text-coral-700 px-1.5 py-0.5 rounded">
                  Demo
                </span>
              </div>
              <span className="text-[11px] text-navy-500 block -mt-1 font-medium">Academic Organizer</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#preview"
              className="text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
            >
              Interactive Preview
            </a>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-navy-600 hover:text-coral-600 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              Live Dashboard
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-navy-700 hover:text-navy-950 hover:bg-navy-100/60 rounded-xl transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 rounded-xl shadow-card hover:shadow-glow-coral transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-navy-700 hover:text-navy-900 hover:bg-navy-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-50 rounded-lg"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-50 rounded-lg"
            >
              How It Works
            </a>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-50 rounded-lg flex items-center justify-between"
            >
              <span>Explore Dashboard</span>
              <span className="text-xs bg-coral-100 text-coral-700 px-2 py-0.5 rounded-full font-semibold">Demo</span>
            </Link>
          </div>
          <div className="pt-4 border-t border-navy-100 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-navy-800 bg-navy-50 hover:bg-navy-100 rounded-xl transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-coral-500 hover:bg-coral-600 rounded-xl shadow-card transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

