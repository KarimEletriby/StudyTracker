-- ==============================================================================
-- STUDY PLANNER — COMPLETE SUPABASE SQL SCHEMA
-- Paste this script directly into your Supabase Dashboard > SQL Editor and run it.
-- ==============================================================================

-- 1. Automatic Timestamp Update Trigger Function
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
    -- Composite unique key to support cross-user isolation in tasks
    CONSTRAINT uq_subjects_id_user UNIQUE (id, user_id)
);

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
    
    -- Foreign Key 1: Direct link to subjects (ON DELETE RESTRICT blocks deleting a course with active tasks)
    CONSTRAINT fk_tasks_subject_id FOREIGN KEY (subject_id)
        REFERENCES public.subjects(id) ON DELETE RESTRICT,

    -- Foreign Key 2: Composite link to guarantee task user_id matches subject user_id at the DB level
    CONSTRAINT fk_tasks_subject_user FOREIGN KEY (subject_id, user_id)
        REFERENCES public.subjects(id, user_id) ON DELETE RESTRICT
);

-- 4. Triggers for Automatic updated_at
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

-- 6. Enable and Force Row Level Security (RLS)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects FORCE ROW LEVEL SECURITY;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks FORCE ROW LEVEL SECURITY;

-- 7. Configure Permissions and Grants
REVOKE ALL ON TABLE public.subjects FROM anon;
REVOKE ALL ON TABLE public.tasks FROM anon;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.subjects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

-- 8. Subjects RLS Policies
DROP POLICY IF EXISTS "subjects_select_owner" ON public.subjects;
CREATE POLICY "subjects_select_owner"
    ON public.subjects FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "subjects_insert_owner" ON public.subjects;
CREATE POLICY "subjects_insert_owner"
    ON public.subjects FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subjects_update_owner" ON public.subjects;
CREATE POLICY "subjects_update_owner"
    ON public.subjects FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subjects_delete_owner" ON public.subjects;
CREATE POLICY "subjects_delete_owner"
    ON public.subjects FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 9. Tasks RLS Policies
DROP POLICY IF EXISTS "tasks_select_owner" ON public.tasks;
CREATE POLICY "tasks_select_owner"
    ON public.tasks FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_insert_owner" ON public.tasks;
CREATE POLICY "tasks_insert_owner"
    ON public.tasks FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_update_owner" ON public.tasks;
CREATE POLICY "tasks_update_owner"
    ON public.tasks FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_delete_owner" ON public.tasks;
CREATE POLICY "tasks_delete_owner"
    ON public.tasks FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 10. Dashboard Analytical View (Security-Invoker)
CREATE OR REPLACE VIEW public.student_dashboard_stats
WITH (security_invoker = true)
AS
SELECT
    (SELECT count(*)::int FROM public.subjects) AS total_subjects,
    (SELECT count(*)::int FROM public.tasks) AS total_tasks,
    (SELECT count(*)::int FROM public.tasks WHERE is_completed = false) AS pending_tasks,
    (SELECT count(*)::int FROM public.tasks WHERE is_completed = true) AS completed_tasks,
    (SELECT count(*)::int FROM public.tasks WHERE is_completed = false AND priority = 'high') AS high_priority_tasks,
    (SELECT count(*)::int FROM public.tasks WHERE is_completed = false AND due_date IS NOT NULL AND due_date <= CURRENT_DATE + 3) AS due_soon_tasks;

GRANT SELECT ON public.student_dashboard_stats TO authenticated;
REVOKE ALL ON public.student_dashboard_stats FROM anon;

