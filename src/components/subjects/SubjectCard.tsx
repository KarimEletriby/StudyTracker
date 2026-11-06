import React, { useState } from 'react';
import { Subject } from '../../types';
import { useStudy } from '../../context/StudyContext';
import {
  Edit2,
  Trash2,
  User,
  MapPin,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useNavigate } from 'react-router-dom';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit }) => {
  const { deleteSubject, getSubjectTaskCount } = useStudy();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const counts = getSubjectTaskCount(subject.id);
  const progressPercent = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

  const handleDelete = () => {
    deleteSubject(subject.id);
    setShowConfirmDelete(false);
  };

  const handleFilterTasks = () => {
    navigate(`/tasks?subject=${subject.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-navy-100/90 shadow-card hover:shadow-elevated transition-all duration-200 overflow-hidden flex flex-col group relative">
        {/* Color accent top strip */}
        <div
          className="h-2 w-full transition-all group-hover:h-2.5"
          style={{ backgroundColor: subject.color }}
        />

        <div className="p-5 flex-1 flex flex-col">
          {/* Card Top: Code badge & Actions menu */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider"
                style={{
                  backgroundColor: `${subject.color}15`,
                  color: subject.color,
                  border: `1px solid ${subject.color}30`,
                }}
              >
                {subject.code}
              </span>
              {subject.creditHours && (
                <span className="text-[11px] font-medium text-navy-400 bg-navy-50 px-2 py-0.5 rounded-md">
                  {subject.creditHours} Credits
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="relative">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(subject)}
                  className="p-1.5 text-navy-400 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                  title="Edit Subject"
                  aria-label="Edit Subject"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-1.5 text-navy-400 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition-colors"
                  title="Delete Subject"
                  aria-label="Delete Subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Subject Title */}
          <h3 className="text-lg font-bold text-navy-900 group-hover:text-navy-950 transition-colors line-clamp-1 mb-1.5">
            {subject.name}
          </h3>

          {/* Instructor & Location */}
          <div className="space-y-1 text-xs text-navy-500 mb-4">
            {subject.instructor && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                <span className="truncate">{subject.instructor}</span>
              </div>
            )}
            {subject.room && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                <span className="truncate">{subject.room}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {subject.description && (
            <p className="text-xs text-navy-600 line-clamp-2 mb-4 italic leading-relaxed">
              "{subject.description}"
            </p>
          )}

          {/* Spacer */}
          <div className="mt-auto pt-4 border-t border-navy-100">
            {/* Task stats and progress */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-navy-600">
                Tasks ({counts.completed}/{counts.total})
              </span>
              <span className="font-bold text-navy-800">
                {counts.total > 0 ? `${progressPercent}% complete` : 'No tasks'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-navy-100 rounded-full h-2 overflow-hidden mb-3.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: subject.color,
                }}
              />
            </div>

            {/* Footer counts & link */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[11px] border border-amber-200">
                  {counts.pending} pending
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                  {counts.completed} done
                </span>
              </div>

              <button
                type="button"
                onClick={handleFilterTasks}
                className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-coral-600 transition-colors group-hover:translate-x-0.5"
              >
                <span>Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Subject?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-coral-50 border border-coral-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-coral-600 shrink-0 mt-0.5" />
            <div className="text-xs text-coral-900 leading-relaxed">
              Are you sure you want to delete <strong className="font-semibold">{subject.name}</strong>?
              {counts.total > 0 && (
                <span className="block mt-1 font-semibold text-coral-700">
                  This will also remove all {counts.total} tasks associated with this subject.
                </span>
              )}
            </div>
          </div>

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
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

