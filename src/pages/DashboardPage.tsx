import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useStudy } from '../context/StudyContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskModal } from '../components/tasks/TaskModal';
import { Task } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FolderKanban,
  Calendar,
  CheckSquare,
  GraduationCap
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, stats, subjects, tasks, getSubjectTaskCount } = useStudy();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Derive Upcoming Deadlines (Pending tasks sorted by earliest dueDate)
  const upcomingDeadlines = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Derive Recent Tasks (latest created or modified)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleAddNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  return (
    <AppLayout
      pageTitle="Student Dashboard"
      pageSubtitle="Track upcoming coursework deadlines and monitor semester momentum."
      actionButton={
        <button
          onClick={handleAddNewTask}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 shadow-subtle hover:shadow-glow-coral transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Quick Add Task</span>
        </button>
      }
    >
      {/* Task Modal for Add/Edit */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-navy-700/60 mb-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-coral-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-coral-500/20 text-coral-300 border border-coral-500/30 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{user.term || 'Fall Semester 2026'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="text-sm text-navy-300 max-w-xl leading-relaxed">
              You have{' '}
              <strong className="text-coral-400 font-bold">{stats.pendingTasks} pending tasks</strong>,
              including{' '}
              <strong className="text-white font-semibold">
                {stats.urgentTasksCount} urgent item{stats.urgentTasksCount === 1 ? '' : 's'}
              </strong>
              . Stay focused and keep up the great momentum!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/tasks"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
            >
              View Task List
            </Link>
            <button
              onClick={handleAddNewTask}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-coral-500 hover:bg-coral-600 text-white shadow transition-colors"
            >
              + New Task
            </button>
          </div>
        </div>
      </div>

      {/* Key Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Subjects Card */}
        <Link
          to="/subjects"
          className="bg-white p-5 rounded-2xl border border-navy-100 shadow-card hover:shadow-elevated transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
              Total Subjects
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-navy-900">
              {stats.totalSubjects}
            </span>
            <span className="text-xs font-semibold text-indigo-600 group-hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="mt-2 text-xs text-navy-400">
            Active registered courses this term
          </p>
        </Link>

        {/* Pending Tasks Card */}
        <Link
          to="/tasks?status=todo"
          className="bg-white p-5 rounded-2xl border border-navy-100 shadow-card hover:shadow-elevated transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
              Pending Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-coral-50 border border-coral-100 flex items-center justify-center text-coral-600 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-coral-600">
              {stats.pendingTasks}
            </span>
            {stats.urgentTasksCount > 0 && (
              <span className="text-xs font-semibold text-coral-700 bg-coral-100 px-2 py-0.5 rounded-full">
                {stats.urgentTasksCount} Urgent
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-navy-400">
            {stats.dueSoonCount} due within the next 3 days
          </p>
        </Link>

        {/* Completed Tasks Card */}
        <Link
          to="/tasks?status=completed"
          className="bg-white p-5 rounded-2xl border border-navy-100 shadow-card hover:shadow-elevated transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
              Completed Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">
              {stats.completedTasks}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {stats.completedTasks} Done
            </span>
          </div>
          <p className="mt-2 text-xs text-navy-400">
            Out of {tasks.length} total logged assignments
          </p>
        </Link>

        {/* Progress Overview Card */}
        <div className="bg-white p-5 rounded-2xl border border-navy-100 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
              Semester Completion
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {stats.completionRate}%
            </span>
            <span className="text-xs font-medium text-navy-500">
              {stats.completedTasks} of {tasks.length}
            </span>
          </div>
          <div className="w-full bg-navy-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-coral-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Upcoming Deadlines & Recent Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white rounded-2xl border border-navy-100/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-navy-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-coral-500" />
                  <span>Upcoming Deadlines</span>
                </h3>
                <p className="text-xs text-navy-500 mt-0.5">
                  Assignments sorted by urgency and scheduled submission date
                </p>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-semibold text-coral-600 hover:text-coral-700 flex items-center gap-1 group"
              >
                <span>View all ({tasks.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-10 px-4 bg-cream-50 rounded-xl border border-dashed border-navy-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-navy-900">
                  All caught up! No pending deadlines.
                </h4>
                <p className="text-xs text-navy-500 mt-1">
                  Enjoy your free time or add a new task to stay ahead.
                </p>
                <button
                  onClick={handleAddNewTask}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-coral-500 rounded-xl hover:bg-coral-600 transition-colors"
                >
                  Add Next Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => (
                  <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks Widget */}
          <div className="bg-white rounded-2xl border border-navy-100/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-navy-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                  <span>Recent Tasks & Activity</span>
                </h3>
                <p className="text-xs text-navy-500 mt-0.5">
                  Latest tasks updated in your study planner
                </p>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-semibold text-navy-600 hover:text-coral-600 flex items-center gap-1"
              >
                <span>Go to Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Subject Breakdown & Productivity Widget */}
        <div className="space-y-6">
          {/* Subjects Workload Card */}
          <div className="bg-white rounded-2xl border border-navy-100/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-navy-100 mb-4">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-coral-500" />
                <span>Subject Workload</span>
              </h3>
              <Link
                to="/subjects"
                className="text-xs font-semibold text-coral-600 hover:underline"
              >
                All Subjects
              </Link>
            </div>

            {subjects.length === 0 ? (
              <p className="text-xs text-navy-500 text-center py-4">
                No subjects registered yet.
              </p>
            ) : (
              <div className="space-y-4">
                {subjects.map((sub) => {
                  const counts = getSubjectTaskCount(sub.id);
                  const pct = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

                  return (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sub.color }}
                          />
                          <span className="font-semibold text-navy-900 truncate">
                            {sub.code} — {sub.name}
                          </span>
                        </div>
                        <span className="text-navy-500 shrink-0 ml-2 font-medium">
                          {counts.completed}/{counts.total} ({pct}%)
                        </span>
                      </div>

                      <div className="w-full bg-navy-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: sub.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Productivity Tip Widget */}
          <div className="bg-cream-100/80 rounded-2xl border border-cream-200/90 p-5 space-y-3">
            <div className="flex items-center gap-2 text-coral-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-coral-500" />
              <span>Study Pro Tip</span>
            </div>
            <p className="text-xs text-navy-700 leading-relaxed">
              Break long assignments into 25-minute Pomodoro blocks. High-priority tasks completed before 1:00 PM build daily academic confidence.
            </p>
            <div className="pt-2 border-t border-cream-200/60 flex items-center justify-between text-[11px] text-navy-500">
              <span>Goal: 4 study blocks today</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

