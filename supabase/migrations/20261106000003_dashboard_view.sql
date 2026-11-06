-- ==============================================================================
-- Migration: 20261106000003_dashboard_view.sql
-- Description: Security-invoker analytical view for instant student dashboard metrics
-- ==============================================================================

-- Create a security_invoker view to aggregate real-time student statistics.
-- Because security_invoker is enabled, it inherits the caller's active RLS policies,
-- guaranteeing that only the authenticated user's records are counted.
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

COMMENT ON VIEW public.student_dashboard_stats IS 'Aggregated student dashboard metrics evaluated dynamically under caller RLS context.';

-- Grant access to authenticated users
GRANT SELECT ON public.student_dashboard_stats TO authenticated;
REVOKE ALL ON public.student_dashboard_stats FROM anon;

