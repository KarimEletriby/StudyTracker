import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Subject, Task, DashboardStats, UserProfile } from '../types';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

interface StudyContextType {
  subjects: Subject[];
  tasks: Task[];
  user: UserProfile;
  stats: DashboardStats;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  // Subject actions
  addSubject: (data: Omit<Subject, 'id' | 'createdAt'>) => Subject;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => Subject | undefined;
  // Task actions
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  // Helpers
  getSubjectTaskCount: (subjectId: string) => { total: number; pending: number; completed: number };
  resetDefaultData: () => void;
}

const STORAGE_KEY_SUBJECTS = 'study_planner_subjects_v1';
const STORAGE_KEY_TASKS = 'study_planner_tasks_v1';

// Preset subject accent colors
export const SUBJECT_COLOR_OPTIONS = [
  { name: 'Indigo', hex: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', text: '#3730A3' },
  { name: 'Coral', hex: '#FF6358', bg: '#FFF5F4', border: '#FFD6D3', text: '#C7362C' },
  { name: 'Emerald', hex: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
  { name: 'Amber', hex: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  { name: 'Sky', hex: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', text: '#075985' },
  { name: 'Purple', hex: '#9333EA', bg: '#FAF5FF', border: '#E9D5FF', text: '#6B21A8' },
  { name: 'Rose', hex: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
  { name: 'Teal', hex: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', text: '#115E59' },
];

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Data Structures & Algorithms',
    code: 'CS 201',
    color: '#4F46E5',
    instructor: 'Dr. Evelyn Martinez',
    creditHours: 4,
    description: 'Tree balancing, graphs, dynamic programming, and complexity analysis.',
    room: 'Turing Hall 302',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'sub-2',
    name: 'Applied Physics II (Electromagnetism)',
    code: 'PHYS 142',
    color: '#FF6358',
    instructor: 'Prof. Marcus Vance',
    creditHours: 4,
    description: 'Electric fields, Maxwell equations, magnetic induction, and optics.',
    room: 'Science Complex B12',
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
  },
  {
    id: 'sub-3',
    name: 'Calculus III & Linear Algebra',
    code: 'MATH 230',
    color: '#10B981',
    instructor: 'Dr. Sarah Lin',
    creditHours: 3,
    description: 'Multivariable calculus, vector fields, eigenvalues, and transformations.',
    room: 'Euler Hall 105',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'sub-4',
    name: 'Human-Computer Interaction',
    code: 'CS 350',
    color: '#F59E0B',
    instructor: 'Prof. David Kim',
    creditHours: 3,
    description: 'User-centered design principles, accessibility heuristics, and prototyping.',
    room: 'Design Studio 4A',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'sub-5',
    name: 'Academic Writing & Tech Research',
    code: 'ENG 210',
    color: '#0284C7',
    instructor: 'Dr. Rachel Adams',
    creditHours: 2,
    description: 'Research synthesis, technical documentation, peer review, and ethics.',
    room: 'Humanities 204',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

// Helper to get formatted date string: YYYY-MM-DD
function offsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement Red-Black Tree Balancing in C++',
    subjectId: 'sub-1',
    dueDate: offsetDateString(1), // Tomorrow
    priority: 'high',
    status: 'in_progress',
    estimatedMinutes: 120,
    notes: 'Verify left-rotate, right-rotate, and double-red violation recovery algorithms.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Electromagnetism Lab Report #4 (Hall Effect)',
    subjectId: 'sub-2',
    dueDate: offsetDateString(2),
    priority: 'urgent',
    status: 'todo',
    estimatedMinutes: 90,
    notes: 'Calculate error margins, append circuit diagrams, and format IEEE citations.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Multivariable Optimization Problem Set #6',
    subjectId: 'sub-3',
    dueDate: offsetDateString(-1), // Past due / completed
    priority: 'medium',
    status: 'completed',
    estimatedMinutes: 60,
    notes: 'Completed Lagrange multiplier problems 14 through 28.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Heuristic Evaluation of Campus Registration Portal',
    subjectId: 'sub-4',
    dueDate: offsetDateString(4),
    priority: 'high',
    status: 'in_progress',
    estimatedMinutes: 150,
    notes: 'Apply Nielsen Norman 10 usability heuristics and document 5 friction points.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Submit Optics Experiment Raw Data Spreadsheet',
    subjectId: 'sub-2',
    dueDate: offsetDateString(-2),
    priority: 'low',
    status: 'completed',
    estimatedMinutes: 30,
    notes: 'Excel file uploaded to LMS drop folder with calibrated laser readings.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Prepare Review Notes for CS 201 Midterm Exam',
    subjectId: 'sub-1',
    dueDate: offsetDateString(6),
    priority: 'urgent',
    status: 'todo',
    estimatedMinutes: 180,
    notes: 'Covers amortized analysis, Fibonacci heaps, and Dijkstra shortest path.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Draft Literature Review Outline & Annotations',
    subjectId: 'sub-5',
    dueDate: offsetDateString(-1),
    priority: 'medium',
    status: 'completed',
    estimatedMinutes: 75,
    notes: 'Found 8 peer-reviewed IEEE papers on AI ethics in academic software.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-8',
    title: 'Fourier Series & Eigenvector Practice Set',
    subjectId: 'sub-3',
    dueDate: offsetDateString(5),
    priority: 'medium',
    status: 'todo',
    estimatedMinutes: 90,
    notes: 'Review matrix diagonalizations and orthogonal coordinate systems.',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_USER: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@university.edu',
  major: 'Computer Science & Mathematics',
  term: 'Fall Semester 2026',
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_SUBJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  });

  const [user] = useState<UserProfile>(INITIAL_USER);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.warn('Failed to save subjects to localStorage', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  // Toast management
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subject actions
  const addSubject = (data: Omit<Subject, 'id' | 'createdAt'>): Subject => {
    const newSubject: Subject = {
      ...data,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSubjects((prev) => [newSubject, ...prev]);
    showToast(`Added subject "${newSubject.name}"`);
    return newSubject;
  };

  const updateSubject = (id: string, data: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...data } : sub))
    );
    showToast('Subject updated successfully');
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find((s) => s.id === id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // Cascade delete or keep tasks
    setTasks((prev) => prev.filter((t) => t.subjectId !== id));
    showToast(`Removed "${target?.name || 'Subject'}" and linked tasks`, 'info');
  };

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  // Task actions
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: data.status === 'completed' ? new Date().toISOString() : undefined,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title.slice(0, 32)}..." created`);
    return newTask;
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...data };
        if (data.status === 'completed' && t.status !== 'completed') {
          updated.completedAt = new Date().toISOString();
        } else if (data.status && data.status !== 'completed') {
          updated.completedAt = undefined;
        }
        return updated;
      })
    );
    showToast('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted task "${target?.title.slice(0, 28) || 'Task'}"`, 'info');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const willBeComplete = t.status !== 'completed';
        return {
          ...t,
          status: willBeComplete ? 'completed' : 'todo',
          completedAt: willBeComplete ? new Date().toISOString() : undefined,
        };
      })
    );
    const target = tasks.find((t) => t.id === id);
    if (target?.status !== 'completed') {
      showToast('Task marked as completed! 🎉');
    } else {
      showToast('Task marked as pending', 'info');
    }
  };

  const getSubjectTaskCount = (subjectId: string) => {
    const subjectTasks = tasks.filter((t) => t.subjectId === subjectId);
    return {
      total: subjectTasks.length,
      pending: subjectTasks.filter((t) => t.status !== 'completed').length,
      completed: subjectTasks.filter((t) => t.status === 'completed').length,
    };
  };

  // Reset to initial demo data
  const resetDefaultData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setTasks(INITIAL_TASKS);
    localStorage.removeItem(STORAGE_KEY_SUBJECTS);
    localStorage.removeItem(STORAGE_KEY_TASKS);
    showToast('Reset to original demo data', 'info');
  };

  // Derive stats reactively
  const stats: DashboardStats = useMemo(() => {
    const totalSubjects = subjects.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const threeDaysLater = offsetDateString(3);

    const urgentTasksCount = tasks.filter(
      (t) => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high')
    ).length;

    const dueSoonCount = tasks.filter(
      (t) => t.status !== 'completed' && t.dueDate >= todayStr && t.dueDate <= threeDaysLater
    ).length;

    return {
      totalSubjects,
      pendingTasks,
      completedTasks,
      completionRate,
      urgentTasksCount,
      dueSoonCount,
    };
  }, [subjects, tasks]);

  return (
    <StudyContext.Provider
      value={{
        subjects,
        tasks,
        user,
        stats,
        toasts,
        showToast,
        dismissToast,
        addSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        getSubjectTaskCount,
        resetDefaultData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

