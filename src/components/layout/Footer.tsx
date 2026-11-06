import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-coral-500/20 border border-coral-500/30 flex items-center justify-center text-coral-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Study<span className="text-coral-500">Planner</span>
              </span>
            </div>
            <p className="text-sm text-navy-400 leading-relaxed">
              Empowering students to organize courses, stay ahead of deadlines, and build productive academic habits.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-800 text-xs text-navy-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Frontend Prototype v1.0
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-4">
              Application
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="text-navy-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="text-navy-300 hover:text-white transition-colors">
                  My Subjects
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="text-navy-300 hover:text-white transition-colors">
                  My Tasks
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-navy-300 hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-navy-300 hover:text-white transition-colors">
                  Create Demo Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                Color-coded Course Workspaces
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                Urgency & Due Date Tracker
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                Task Completion Metrics
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                Fast Mock Local Persistence
              </li>
            </ul>
          </div>

          {/* Col 4: Demo Notice */}
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2 text-xs">
            <span className="font-semibold text-coral-400 uppercase tracking-wider block">
              Frontend Demo Prototype
            </span>
            <p className="text-navy-400 leading-relaxed">
              Designed for integration with Supabase authentication and PostgreSQL backend in subsequent phases. No personal credentials or live data are transmitted.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-400">
          <p>© {new Date().getFullYear()} Study Planner. Built for modern student success.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
            <span>using React & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

