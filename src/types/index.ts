export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // hex or color identifier
  instructor?: string;
  creditHours?: number;
  description?: string;
  room?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DashboardStats {
  totalSubjects: number;
  pendingTasks: number;
  completedTasks: number;
  completionRate: number;
  urgentTasksCount: number;
  dueSoonCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  major?: string;
  term?: string;
}

export type TaskFilter = 'all' | 'todo' | 'in_progress' | 'completed';

