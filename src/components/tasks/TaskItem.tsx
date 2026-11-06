import React, { useState } from 'react';
import { Task } from '../../types';
import { useStudy } from '../../context/StudyContext';
import { PriorityBadge, StatusBadge, SubjectTag } from '../common/Badge';
import {
  Calendar,
  Clock,
  Check,
  Edit2,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { getSubjectById, toggleTaskComplete, deleteTask } = useStudy();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const subject = getSubjectById(task.subjectId);
  const isCompleted = task.status === 'completed';

  // Format Due Date and detect overdue
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.dueDate < todayStr;
  const isDueToday = task.dueDate === todayStr;

  const formatDueDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;

    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl border transition-all duration-200 p-4 sm:p-5 shadow-subtle hover:shadow-card flex flex-col gap-3 group ${
          isCompleted
            ? 'border-navy-100 bg-slate-50/50 opacity-80'
            : isOverdue
            ? 'border-coral-300 bg-coral-50/15'
            : 'border-navy-100 hover:border-navy-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          {/* Checkbox Complete Action */}
          <button
            type="button"
            onClick={() => toggleTaskComplete(task.id)}
            className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500 ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                : 'border-navy-300 hover:border-coral-500 hover:bg-coral-50 bg-white'
            }`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          {/* Main Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Subject Tag */}
              {subject ? (
                <SubjectTag
                  name={subject.name}
                  code={subject.code}
                  color={subject.color}
                  size="sm"
                />
              ) : (
                <span className="text-xs text-navy-400">General</span>
              )}

              {/* Priority Badge */}
              <PriorityBadge priority={task.priority} size="sm" />

              {/* Status Badge */}
              <StatusBadge status={task.status} size="sm" />
            </div>

            {/* Task Title */}
            <h4
              onClick={() => toggleTaskComplete(task.id)}
              className={`text-base font-semibold cursor-pointer transition-colors ${
                isCompleted
                  ? 'line-through text-navy-400'
                  : 'text-navy-900 hover:text-coral-600'
              }`}
            >
              {task.title}
            </h4>

            {/* Meta Information (Due date, time, notes toggle) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-navy-500">
              {/* Due Date Indicator */}
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isOverdue
                    ? 'text-coral-600 font-semibold'
                    : isDueToday
                    ? 'text-amber-600 font-semibold'
                    : 'text-navy-500'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3.5 h-3.5 text-coral-600" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                <span>{formatDueDateLabel(task.dueDate)}</span>
                <span className="text-navy-400">({task.dueDate})</span>
              </span>

              {/* Estimated Duration */}
              {task.estimatedMinutes && (
                <span className="inline-flex items-center gap-1 text-navy-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{task.estimatedMinutes}m est.</span>
                </span>
              )}

              {/* Notes expand button if notes exist */}
              {task.notes && (
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="inline-flex items-center gap-1 text-navy-500 hover:text-coral-600 font-medium transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes</span>
                  {showNotes ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>

            {/* Collapsible notes area */}
            {task.notes && showNotes && (
              <div className="mt-3 p-3 rounded-lg bg-navy-50/80 border border-navy-100 text-xs text-navy-700 leading-relaxed">
                {task.notes}
              </div>
            )}
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center gap-1 self-start opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1.5 text-navy-400 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors"
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 text-navy-400 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition-colors"
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Task?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-navy-600">
            Are you sure you want to delete{' '}
            <strong className="text-navy-900 font-semibold">"{task.title}"</strong>?
            This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-semibold text-white bg-coral-600 hover:bg-coral-700 rounded-xl shadow-subtle transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

