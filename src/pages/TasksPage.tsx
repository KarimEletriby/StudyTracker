import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useStudy } from '../context/StudyContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskModal } from '../components/tasks/TaskModal';
import { Task, TaskFilter, Priority } from '../types';
import {
  Plus,
  Search,
  Filter,
  RotateCcw,
  CheckSquare
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, subjects } = useStudy();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskFilter>(
    (searchParams.get('status') as TaskFilter) || 'all'
  );
  const [subjectFilter, setSubjectFilter] = useState<string>(
    searchParams.get('subject') || 'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'newest'>('dueDate');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenAdd = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSubjectFilter('all');
    setPriorityFilter('all');
    setSearchParams({});
  };

  // Status counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchNotes = task.notes?.toLowerCase().includes(q);
          if (!matchTitle && !matchNotes) return false;
        }

        // Status tab
        if (statusFilter !== 'all' && task.status !== statusFilter) {
          return false;
        }

        // Subject filter
        if (subjectFilter !== 'all' && task.subjectId !== subjectFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'priority') {
          const weight: Record<Priority, number> = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return weight[b.priority] - weight[a.priority];
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, subjectFilter, priorityFilter, sortBy]);

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    subjectFilter !== 'all' ||
    priorityFilter !== 'all';

  return (
    <AppLayout
      pageTitle="My Tasks"
      pageSubtitle="Track deadlines, prioritize homework, and mark assignments as completed."
      actionButton={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 shadow-subtle hover:shadow-glow-coral transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      }
    >
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        defaultSubjectId={subjectFilter !== 'all' ? subjectFilter : undefined}
      />

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-200/80 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setStatusFilter('all');
            searchParams.delete('status');
            setSearchParams(searchParams);
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
            statusFilter === 'all'
              ? 'border-coral-500 text-coral-600 bg-coral-50/40'
              : 'border-transparent text-navy-500 hover:text-navy-900'
          }`}
        >
          <span>All Tasks</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-navy-100 text-navy-700 font-bold">
            {tabCounts.all}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('todo');
            searchParams.set('status', 'todo');
            setSearchParams(searchParams);
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
            statusFilter === 'todo'
              ? 'border-coral-500 text-coral-600 bg-coral-50/40'
              : 'border-transparent text-navy-500 hover:text-navy-900'
          }`}
        >
          <span>Pending (To-Do)</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-bold">
            {tabCounts.todo}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('in_progress');
            searchParams.set('status', 'in_progress');
            setSearchParams(searchParams);
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
            statusFilter === 'in_progress'
              ? 'border-coral-500 text-coral-600 bg-coral-50/40'
              : 'border-transparent text-navy-500 hover:text-navy-900'
          }`}
        >
          <span>In Progress</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 font-bold">
            {tabCounts.in_progress}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('completed');
            searchParams.set('status', 'completed');
            setSearchParams(searchParams);
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
            statusFilter === 'completed'
              ? 'border-coral-500 text-coral-600 bg-coral-50/40'
              : 'border-transparent text-navy-500 hover:text-navy-900'
          }`}
        >
          <span>Completed</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {tabCounts.completed}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-card p-4 sm:p-5 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-2 bg-cream-50/60 border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            />
          </div>

          {/* Subject Select */}
          <div>
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                if (e.target.value === 'all') {
                  searchParams.delete('subject');
                } else {
                  searchParams.set('subject', e.target.value);
                }
                setSearchParams(searchParams);
              }}
              className="w-full px-3 py-2 bg-cream-50/60 border border-navy-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            >
              <option value="all">All Course Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Select */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50/60 border border-navy-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort By Select */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-cream-50/60 border border-navy-200 rounded-xl text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            >
              <option value="dueDate">Sort by: Earliest Deadline</option>
              <option value="priority">Sort by: Highest Priority</option>
              <option value="newest">Sort by: Recently Added</option>
            </select>
          </div>
        </div>

        {/* Filter Info & Clear helper */}
        <div className="flex items-center justify-between text-xs text-navy-500 pt-2 border-t border-navy-100">
          <span>
            Showing <strong className="text-navy-900">{filteredTasks.length}</strong> task
            {filteredTasks.length === 1 ? '' : 's'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-coral-600 hover:text-coral-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List / Empty States */}
      {tasks.length === 0 ? (
        /* Zero tasks empty state */
        <div className="bg-white rounded-2xl border border-navy-100/90 shadow-card p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 text-coral-500 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No tasks created yet</h3>
          <p className="text-sm text-navy-500 leading-relaxed mb-6">
            Keep yourself accountable. Add your assignments, problem sets, and review milestones to begin tracking.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-coral-500 hover:bg-coral-600 transition-colors shadow-subtle hover:shadow-glow-coral"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Task</span>
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Filter matched 0 tasks */
        <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center max-w-md mx-auto my-8">
          <Filter className="w-8 h-8 text-navy-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-navy-900 mb-1">No matching tasks</h4>
          <p className="text-xs text-navy-500 mb-4">
            No tasks match the active filters or search parameters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-xs font-semibold text-navy-700 bg-navy-100 hover:bg-navy-200 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        /* Task items */
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

