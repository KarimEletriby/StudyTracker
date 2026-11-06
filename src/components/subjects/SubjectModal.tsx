import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Subject } from '../../types';
import { useStudy, SUBJECT_COLOR_OPTIONS } from '../../context/StudyContext';
import { Check } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  subjectToEdit,
}) => {
  const { addSubject, updateSubject } = useStudy();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(SUBJECT_COLOR_OPTIONS[0].hex);
  const [instructor, setInstructor] = useState('');
  const [creditHours, setCreditHours] = useState('3');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setCode(subjectToEdit.code);
      setColor(subjectToEdit.color);
      setInstructor(subjectToEdit.instructor || '');
      setCreditHours(subjectToEdit.creditHours ? String(subjectToEdit.creditHours) : '3');
      setRoom(subjectToEdit.room || '');
      setDescription(subjectToEdit.description || '');
    } else {
      setName('');
      setCode('');
      setColor(SUBJECT_COLOR_OPTIONS[0].hex);
      setInstructor('');
      setCreditHours('3');
      setRoom('');
      setDescription('');
    }
    setErrors({});
  }, [subjectToEdit, isOpen]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Subject name is required';
    if (!code.trim()) errs.code = 'Subject code is required (e.g. CS 101)';
    const credits = Number(creditHours);
    if (isNaN(credits) || credits < 1 || credits > 12) {
      errs.creditHours = 'Credit hours must be between 1 and 12';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        instructor: instructor.trim() || undefined,
        creditHours: Number(creditHours) || 3,
        room: room.trim() || undefined,
        description: description.trim() || undefined,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        instructor: instructor.trim() || undefined,
        creditHours: Number(creditHours) || 3,
        room: room.trim() || undefined,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
      description={
        subjectToEdit
          ? 'Update the course details and accent styling.'
          : 'Define a new academic course, syllabus code, and color theme.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            Subject Title <span className="text-coral-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Algorithms & Complexity"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
              errors.name ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-coral-600 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Code & Credits */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Course Code <span className="text-coral-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CS 301"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors ${
                errors.code ? 'border-coral-500 bg-coral-50/20' : 'border-navy-200'
              }`}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-coral-600 font-medium">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Credit Hours
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            />
            {errors.creditHours && (
              <p className="mt-1 text-xs text-coral-600 font-medium">{errors.creditHours}</p>
            )}
          </div>
        </div>

        {/* Color Palette Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-2">
            Color Accent Theme
          </label>
          <div className="flex flex-wrap gap-2.5 items-center">
            {SUBJECT_COLOR_OPTIONS.map((c) => {
              const isSelected = color === c.hex;
              return (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-navy-900 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructor & Room */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Instructor / Prof.
            </label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Martinez"
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
              Classroom / Hall
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Hall 302"
              className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
            />
          </div>
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            Course Notes or Objectives
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key syllabus topics, office hours, or textbook details..."
            className="w-full px-3.5 py-2 rounded-xl border border-navy-200 text-sm text-navy-900 bg-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors resize-none"
          />
        </div>

        {/* Form Action Buttons */}
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
            {subjectToEdit ? 'Save Changes' : 'Create Subject'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

