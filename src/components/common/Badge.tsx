import React from 'react';
import { Priority, TaskStatus } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (priority) {
    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-coral-100 text-coral-700 border border-coral-200 ${sizeClasses}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-coral-600" />}
          Urgent
        </span>
      );
    case 'high':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200 ${sizeClasses}`}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />}
          High
        </span>
      );
    case 'medium':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600" />}
          Medium
        </span>
      );
    case 'low':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          Low
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Completed
        </span>
      );
    case 'in_progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          In Progress
        </span>
      );
    case 'todo':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          Pending
        </span>
      );
  }
};

interface SubjectTagProps {
  name: string;
  code?: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const SubjectTag: React.FC<SubjectTagProps> = ({
  name,
  code,
  color = '#4F46E5',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizeClasses}`}
      style={{
        backgroundColor: `${color}14`,
        borderColor: `${color}35`,
        color: color,
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate max-w-[130px]">
        {code ? `${code} · ${name}` : name}
      </span>
    </span>
  );
};

