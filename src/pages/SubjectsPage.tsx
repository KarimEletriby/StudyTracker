import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useStudy } from '../context/StudyContext';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { Subject } from '../types';
import { Plus, BookOpen, Search } from 'lucide-react';

export const SubjectsPage: React.FC = () => {
  const { subjects } = useStudy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenAdd = () => {
    setSubjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsModalOpen(true);
  };

  // Filter subjects by name or code
  const filteredSubjects = subjects.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      (s.instructor && s.instructor.toLowerCase().includes(query))
    );
  });

  return (
    <AppLayout
      pageTitle="My Subjects"
      pageSubtitle="Manage your enrolled courses, syllabus objectives, and track subject-specific workloads."
      actionButton={
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 shadow-subtle hover:shadow-glow-coral transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Subject</span>
        </button>
      }
    >
      {/* Subject Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubjectToEdit(null);
        }}
        subjectToEdit={subjectToEdit}
      />

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects by name, code (e.g. CS 201), or professor..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-subtle transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-navy-500 font-medium self-end sm:self-auto">
          <span>
            Showing <strong className="text-navy-900">{filteredSubjects.length}</strong> of{' '}
            <strong className="text-navy-900">{subjects.length}</strong> subjects
          </span>
        </div>
      </div>

      {/* Empty State when no subjects exist at all */}
      {subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100/90 shadow-card p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 text-coral-500 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No subjects yet</h3>
          <p className="text-sm text-navy-500 leading-relaxed mb-6">
            Get started by adding your first course. You can choose custom accent colors, add instructor details, and organize all your upcoming deadlines.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-coral-500 hover:bg-coral-600 transition-colors shadow-subtle hover:shadow-glow-coral"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Subject</span>
          </button>
        </div>
      ) : filteredSubjects.length === 0 ? (
        /* Empty search results state */
        <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center max-w-md mx-auto my-8">
          <Search className="w-8 h-8 text-navy-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-navy-900 mb-1">No matching subjects</h4>
          <p className="text-xs text-navy-500 mb-4">
            No subjects matched your search term "{searchQuery}". Try a different keyword or clear the filter.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 text-xs font-semibold text-navy-700 bg-navy-100 hover:bg-navy-200 rounded-xl transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Subjects Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

