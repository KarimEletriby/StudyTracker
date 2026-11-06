import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  Menu,
  X,
  Plus,
  RotateCcw,
  ExternalLink,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { ToastContainer } from '../common/ToastContainer';
import { TaskModal } from '../tasks/TaskModal';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  actionButton?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
  actionButton,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const { user, stats, resetDefaultData, showToast } = useStudy();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    showToast('Signed out of demo session. (Placeholder)', 'info');
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/subjects',
      label: 'My Subjects',
      icon: FolderKanban,
      badge: stats.totalSubjects,
    },
    {
      to: '/tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      badge: stats.pendingTasks > 0 ? stats.pendingTasks : null,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row antialiased">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Quick Add Task Modal */}
      <TaskModal
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
      />

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-navy-900 text-white flex items-center justify-between px-4 py-3.5 sticky top-0 z-40 border-b border-navy-800 shadow-card">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-coral-500 flex items-center justify-center text-white font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-base">
            Study<span className="text-coral-400">Planner</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuickTaskOpen(true)}
            className="p-1.5 rounded-lg bg-coral-500 text-white hover:bg-coral-600 active:scale-95 transition-all text-xs flex items-center gap-1 font-medium px-2.5"
            aria-label="Quick Add Task"
          >
            <Plus className="w-4 h-4" />
            <span>Task</span>
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-navy-200 hover:text-white hover:bg-navy-800 transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-navy-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } border-r border-navy-800/80 shadow-elevated`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral-600 to-coral-400 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Study<span className="text-coral-400">Planner</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-coral-500/20 text-coral-300 border border-coral-500/30 px-1.5 py-0.5 rounded">
                  Demo
                </span>
              </div>
              <span className="text-[11px] text-navy-400 font-medium">Academic Workspace</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-navy-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add CTA */}
        <div className="px-4 pt-5 pb-2">
          <button
            onClick={() => {
              setIsQuickTaskOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-sm shadow-subtle hover:shadow-glow-coral transition-all duration-200 transform active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Add Task</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
            Main Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-navy-800 text-white shadow-subtle border-l-4 border-coral-500'
                    : 'text-navy-300 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-coral-400' : 'text-navy-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {link.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isActive
                        ? 'bg-coral-500 text-white'
                        : 'bg-navy-800 text-navy-300'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
            Quick Tools
          </div>

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-xs text-navy-400 hover:text-navy-200 hover:bg-navy-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-navy-400" />
              <span>Public Landing Page</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-coral-400" />
          </Link>

          <button
            onClick={() => {
              resetDefaultData();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-medium text-xs text-navy-400 hover:text-coral-300 hover:bg-navy-800/40 transition-colors text-left"
            title="Reload fictional starter data"
          >
            <RotateCcw className="w-4 h-4 text-navy-400" />
            <span>Reset Demo Mock Data</span>
          </button>
        </nav>

        {/* Demo environment pill */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-navy-800/70 border border-navy-700/60 text-xs">
          <div className="flex items-center gap-2 text-coral-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-coral-400 animate-ping"></span>
            <span>Interactive Demo Mode</span>
          </div>
          <p className="text-[11px] text-navy-400 leading-relaxed">
            Data is persisted in your local browser. No real backend or database is active.
          </p>
        </div>

        {/* User Profile Card & Sign Out */}
        <div className="p-3.5 border-t border-navy-800/80 bg-navy-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-navy-700 border-2 border-coral-500/40 flex items-center justify-center font-bold text-coral-300 shrink-0 text-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold text-white truncate">
                {user.name}
              </div>
              <div className="text-[11px] text-navy-400 truncate">
                {user.major || user.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="p-2 text-navy-400 hover:text-coral-400 hover:bg-navy-800 rounded-lg transition-colors"
            title="Log out (UI placeholder)"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-navy-100/90 px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-30 shadow-subtle">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-navy-500 mb-1">
              <span>Study Planner</span>
              <span>/</span>
              <span className="text-coral-600 font-semibold">{pageTitle}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900 font-sans">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="text-sm text-navy-500 mt-0.5">{pageSubtitle}</p>
            )}
          </div>

          {actionButton && (
            <div className="flex items-center gap-2.5 shrink-0">
              {actionButton}
            </div>
          )}
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

