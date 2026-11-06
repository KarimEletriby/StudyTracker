-- ==============================================================================
-- Migration: 20261106000001_create_study_planner_schema.sql
-- Description: Core schema definition for Study Planner (subjects & tasks)
-- ==============================================================================

-- 1. Helper Function: Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 2. Create Table: subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT chk_subjects_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT chk_subjects_name_length CHECK (char_length(name) <= 100),
    CONSTRAINT chk_subjects_color_hex CHECK (
        color IS NULL OR color ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
    ),
    -- Composite unique key to support composite foreign key enforcement in tasks
    CONSTRAINT uq_subjects_id_user UNIQUE (id, user_id)
);

-- Comments on subjects
COMMENT ON TABLE public.subjects IS 'Academic courses/subjects owned by authenticated students.';
COMMENT ON COLUMN public.subjects.id IS 'Primary key UUID.';
COMMENT ON COLUMN public.subjects.user_id IS 'Owner reference to auth.users.';
COMMENT ON COLUMN public.subjects.name IS 'Subject display name (e.g. Data Structures).';
COMMENT ON COLUMN public.subjects.color IS 'Hex color string (e.g. #4F46E5).';

-- 3. Create Table: tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority TEXT NOT NULL DEFAULT 'medium',
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT chk_tasks_title_not_empty CHECK (char_length(trim(title)) > 0),
    CONSTRAINT chk_tasks_title_length CHECK (char_length(title) <= 255),
    CONSTRAINT chk_tasks_priority_valid CHECK (priority IN ('low', 'medium', 'high')),
    
    -- Foreign Key 1: Direct link to subjects(id)
    -- ON DELETE RESTRICT: Deleting a subject with linked tasks is rejected until tasks are deleted or reassigned
    CONSTRAINT fk_tasks_subject_id FOREIGN KEY (subject_id)
        REFERENCES public.subjects(id) ON DELETE RESTRICT,

    -- Foreign Key 2: Composite link to guarantee task user_id matches subject user_id at the DB level
    CONSTRAINT fk_tasks_subject_user FOREIGN KEY (subject_id, user_id)
        REFERENCES public.subjects(id, user_id) ON DELETE RESTRICT
);

-- Comments on tasks
COMMENT ON TABLE public.tasks IS 'Student assignments, homework, and study milestones.';
COMMENT ON COLUMN public.tasks.id IS 'Primary key UUID.';
COMMENT ON COLUMN public.tasks.user_id IS 'Owner reference to auth.users.';
COMMENT ON COLUMN public.tasks.subject_id IS 'Foreign key to public.subjects.';
COMMENT ON COLUMN public.tasks.title IS 'Task title/summary.';
COMMENT ON COLUMN public.tasks.priority IS 'Task priority: low, medium, or high.';
COMMENT ON COLUMN public.tasks.is_completed IS 'Completion status boolean flag.';

-- 4. Triggers: Automatically update updated_at timestamps
DROP TRIGGER IF EXISTS trg_subjects_updated_at ON public.subjects;
CREATE TRIGGER trg_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_subject_id ON public.tasks(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_subject ON public.tasks(user_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON public.tasks(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(user_id, priority);

