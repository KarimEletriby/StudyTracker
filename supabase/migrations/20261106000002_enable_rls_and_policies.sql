-- ==============================================================================
-- Migration: 20261106000002_enable_rls_and_policies.sql
-- Description: Row Level Security (RLS) enforcement & granular access policies
-- ==============================================================================

-- 1. Enable and Force RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects FORCE ROW LEVEL SECURITY;

-- 2. Enable and Force RLS on tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks FORCE ROW LEVEL SECURITY;

-- 3. Configure Database Grants
-- Ensure anon has no access to private study tables
REVOKE ALL ON TABLE public.subjects FROM anon;
REVOKE ALL ON TABLE public.tasks FROM anon;

-- Grant required schema usage and table permissions to authenticated role
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.subjects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

-- ==============================================================================
-- Subjects Table Policies
-- ==============================================================================

-- Policy 1: Authenticated users can SELECT only their own subjects
DROP POLICY IF EXISTS "subjects_select_owner" ON public.subjects;
CREATE POLICY "subjects_select_owner"
    ON public.subjects
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 2: Authenticated users can INSERT subjects belonging only to themselves
DROP POLICY IF EXISTS "subjects_insert_owner" ON public.subjects;
CREATE POLICY "subjects_insert_owner"
    ON public.subjects
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Authenticated users can UPDATE only their own subjects (and cannot reassign ownership)
DROP POLICY IF EXISTS "subjects_update_owner" ON public.subjects;
CREATE POLICY "subjects_update_owner"
    ON public.subjects
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Authenticated users can DELETE only their own subjects
DROP POLICY IF EXISTS "subjects_delete_owner" ON public.subjects;
CREATE POLICY "subjects_delete_owner"
    ON public.subjects
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- Tasks Table Policies
-- ==============================================================================

-- Policy 5: Authenticated users can SELECT only their own tasks
DROP POLICY IF EXISTS "tasks_select_owner" ON public.tasks;
CREATE POLICY "tasks_select_owner"
    ON public.tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 6: Authenticated users can INSERT tasks belonging only to themselves
DROP POLICY IF EXISTS "tasks_insert_owner" ON public.tasks;
CREATE POLICY "tasks_insert_owner"
    ON public.tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 7: Authenticated users can UPDATE only their own tasks (and cannot reassign ownership)
DROP POLICY IF EXISTS "tasks_update_owner" ON public.tasks;
CREATE POLICY "tasks_update_owner"
    ON public.tasks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 8: Authenticated users can DELETE only their own tasks
DROP POLICY IF EXISTS "tasks_delete_owner" ON public.tasks;
CREATE POLICY "tasks_delete_owner"
    ON public.tasks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

