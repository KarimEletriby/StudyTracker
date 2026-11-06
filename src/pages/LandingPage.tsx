import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Soft background decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-coral-100/40 via-cream-100/30 to-transparent pointer-events-none -z-10 rounded-b-full blur-3xl opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-50 border border-coral-200 text-coral-700 text-xs font-semibold shadow-subtle animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>Next-Gen Academic Productivity for Modern Students</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 font-sans leading-tight">
              Master your coursework.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 via-coral-600 to-navy-900">
                Never miss a deadline.
              </span>
            </h1>

            {/* Subtitle / Value Prop */}
            <p className="text-lg sm:text-xl text-navy-600 leading-relaxed max-w-2xl mx-auto">
              Study Planner helps students organize subjects, prioritize assignments, track due dates, and visualize semester academic milestones with zero friction.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 shadow-card hover:shadow-glow-coral transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Get Started — It's Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base text-navy-800 bg-white hover:bg-navy-50 border border-navy-200 shadow-subtle hover:shadow transition-all"
              >
                <Sparkles className="w-4 h-4 text-coral-500" />
                <span>Explore Interactive Demo</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-navy-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free Demo Access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Browser Storage</span>
              </div>
            </div>
          </div>

          {/* Product Dashboard Visual Preview */}
          <div id="preview" className="mt-14 lg:mt-18 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border-4 border-navy-900/10 shadow-elevated bg-white overflow-hidden p-2 sm:p-4 backdrop-blur-lg">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg mb-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="bg-white px-3 py-0.5 rounded text-[11px] text-navy-500 font-mono flex-1 text-center truncate">
                  studyplanner.app/dashboard
                </div>
              </div>

              {/* Teaser content mock */}
              <div className="bg-cream-50 rounded-xl p-4 sm:p-6 border border-navy-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100">
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">
                      Welcome back, Alex! 👋
                    </h3>
                    <p className="text-xs text-navy-500">
                      You have 3 tasks due within the next 48 hours. Let's conquer today!
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-coral-500 text-white rounded-lg text-xs font-semibold shadow hover:bg-coral-600 transition-colors w-fit"
                  >
                    Open Live App <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-navy-100 shadow-subtle">
                    <span className="text-[11px] text-navy-400 uppercase font-semibold">Subjects</span>
                    <p className="text-xl font-bold text-navy-900 mt-1">5 Active</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-navy-100 shadow-subtle">
                    <span className="text-[11px] text-navy-400 uppercase font-semibold">Pending</span>
                    <p className="text-xl font-bold text-coral-600 mt-1">5 Tasks</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-navy-100 shadow-subtle">
                    <span className="text-[11px] text-navy-400 uppercase font-semibold">Completed</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">3 Done</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-navy-100 shadow-subtle">
                    <span className="text-[11px] text-navy-400 uppercase font-semibold">Progress</span>
                    <p className="text-xl font-bold text-indigo-600 mt-1">38%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 bg-white border-y border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Engineered For Academic Success
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-2 font-sans">
              Everything you need to stay on top of your semester
            </h2>
            <p className="text-navy-600 mt-3 text-base">
              Say goodbye to scattered notes, missed homework submissions, and stressful exam weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-cream-50 border border-navy-100/90 shadow-card hover:shadow-elevated transition-all group">
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-coral-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2.5">
                Organized Coursework
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Color-code your subjects, keep track of professor contacts, syllabus objectives, and monitor task distribution per course in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-cream-50 border border-navy-100/90 shadow-card hover:shadow-elevated transition-all group">
              <div className="w-12 h-12 rounded-xl bg-coral-500 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2.5">
                Smart Deadline Prioritization
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Filter tasks by urgency (Urgent, High, Medium, Low) and get instant visual alerts when assignments are due today or overdue.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-cream-50 border border-navy-100/90 shadow-card hover:shadow-elevated transition-all group">
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-coral-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2.5">
                Progress & Metrics Overview
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">
                Watch your completion rate rise with real-time statistics derived seamlessly from your ongoing subject and task activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-2 font-sans">
              How Study Planner Works
            </h2>
            <p className="text-navy-600 mt-3 text-base">
              Set up your semester in under 2 minutes and keep your mind clear for deep learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-7 rounded-2xl border border-navy-100 shadow-card relative">
              <span className="w-10 h-10 rounded-full bg-navy-900 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow">
                1
              </span>
              <h4 className="text-lg font-bold text-navy-900 mb-2">
                Add Your Subjects
              </h4>
              <p className="text-sm text-navy-600 leading-relaxed">
                Input your courses (e.g. CS 201, MATH 230), pick custom accent colors, and assign credit hours or classroom locations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-7 rounded-2xl border border-navy-100 shadow-card relative">
              <span className="w-10 h-10 rounded-full bg-coral-500 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow">
                2
              </span>
              <h4 className="text-lg font-bold text-navy-900 mb-2">
                Log Tasks & Deadlines
              </h4>
              <p className="text-sm text-navy-600 leading-relaxed">
                Add problem sets, reading assignments, lab reports, and upcoming exam dates with estimated study durations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-7 rounded-2xl border border-navy-100 shadow-card relative">
              <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mb-4 shadow">
                3
              </span>
              <h4 className="text-lg font-bold text-navy-900 mb-2">
                Track & Conquer
              </h4>
              <p className="text-sm text-navy-600 leading-relaxed">
                Check off items as you complete them, watch your progress bar advance, and enjoy stress-free academic momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready To Get Started CTA */}
      <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-coral-400 border border-navy-700 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Built for High School, College & University Students</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans">
            Ready to upgrade your study workflow?
          </h2>

          <p className="text-navy-300 max-w-xl mx-auto text-base leading-relaxed">
            Take full control of your academic calendar today with our clean, student-first dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-coral-500 hover:bg-coral-600 shadow-card hover:shadow-glow-coral transition-all active:scale-95"
            >
              Create Account Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-navy-800 hover:bg-navy-700 border border-navy-700 transition-colors"
            >
              Sign In To Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

