import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Task, Priority, TaskStatus } from '../../types';
import { useStudy } from '../../context/StudyContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultSubjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultSubjectId,
}) => {
  const { subjects, addTask, updateTask } = useStudy();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [estimatedMinutes, setEstimatedMinutes] = useState('60');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSubjectId(taskToEdit.subjectId);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setEstimatedMinutes(taskToEdit.estimatedMinutes ? String(taskToEdit.estimatedMinutes) : '60');
      setNotes(taskToEdit.notes || '');
    } else {
      // Default new task
      setTitle('');
      setSubjectId(defaultSubjectId || (subjects.length > 0 ? subjects[0].id : ''));
      // Default due date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
      setPriority('medium');
      setStatus('todo');
      setEstimatedMinutes('60');
      setNotes('');
    }
    setErrors({});
  }, [taskToEdit, isOpen, defaultSubjectId, subjects]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Task title is required';
    if (!subjectId) errs.subjectId = 'Please select a subject';
    if (!dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        subjectId,
        dueDate,
        priority,
        status,
        estimatedMinutes: Number(estimatedMinutes) || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        dueDate,
        priority,
        status,
        estimatedMinutes: Number(estimatedMinutes) || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Add New Task'}
      description={
        taskToEdit
          ? 'Update deadline, status, or notes.'
          : 'Schedule a coursework assignment, exam prep, or study goal.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            Task Description / Title <span className="text-coral-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete Problem Set #3"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
              errors.title ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-coral-600 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Subject & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Subject <span className="text-coral-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                errors.subjectId ? 'border-coral-500' : 'border-navy-200'
              }`}
            >
              <option value="" disabled>
                Select Course
              </option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <p className="mt-1 text-xs text-coral-600 font-medium">{errors.subjectId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Due Date <span className="text-coral-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                  errors.dueDate ? 'border-coral-500' : 'border-navy-200'
                }`}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-xs text-coral-600 font-medium">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            >
              <option value="todo">Pending (To-Do)</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            Estimated Study Duration (Minutes)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="5"
              step="5"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            />
            <span className="text-xs text-navy-500 font-medium whitespace-nowrap">mins</span>
          </div>
        </div>

        {/* Notes / Instructions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            Assignment Notes / Checklist
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Rubric notes, page numbers, or submission portal links..."
            className="w-full px-3.5 py-2 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-navy-700 hover:text-navy-900 hover:bg-navy-100/70 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-coral-500 hover:bg-coral-600 rounded-xl shadow-subtle hover:shadow-glow-coral transition-all active:scale-95"
          >
            {taskToEdit ? 'Save Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

