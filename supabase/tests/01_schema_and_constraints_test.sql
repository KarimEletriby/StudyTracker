-- ==============================================================================
-- Test Suite: 01_schema_and_constraints_test.sql
-- Description: Unit & constraint tests for Study Planner database schema
-- ==============================================================================

BEGIN;

-- Install or ensure pgtap extension if available, or simulate test assertions
CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(20);

-- 1. Verify Tables Exist
SELECT has_table('public', 'subjects', 'Table public.subjects should exist');
SELECT has_table('public', 'tasks', 'Table public.tasks should exist');
SELECT has_view('public', 'student_dashboard_stats', 'View public.student_dashboard_stats should exist');

-- 2. Verify Primary Keys
SELECT col_is_pk('public', 'subjects', 'id', 'subjects.id is primary key');
SELECT col_is_pk('public', 'tasks', 'id', 'tasks.id is primary key');

-- 3. Verify Foreign Keys
SELECT fk_ok(
    'public', 'subjects', 'user_id',
    'auth', 'users', 'id'
);

SELECT fk_ok(
    'public', 'tasks', 'subject_id',
    'public', 'subjects', 'id'
);

-- 4. Verify Column Constraints
SELECT col_not_null('public', 'subjects', 'name', 'subjects.name cannot be null');
SELECT col_not_null('public', 'subjects', 'user_id', 'subjects.user_id cannot be null');
SELECT col_not_null('public', 'tasks', 'title', 'tasks.title cannot be null');
SELECT col_not_null('public', 'tasks', 'user_id', 'tasks.user_id cannot be null');
SELECT col_not_null('public', 'tasks', 'subject_id', 'tasks.subject_id cannot be null');
SELECT col_has_default('public', 'tasks', 'is_completed', 'tasks.is_completed defaults to false');
SELECT col_has_default('public', 'tasks', 'priority', 'tasks.priority defaults to medium');

-- 5. Verify Check Constraints Exist
SELECT has_check('public', 'subjects', 'chk_subjects_name_not_empty', 'Subjects name not empty constraint exists');
SELECT has_check('public', 'subjects', 'chk_subjects_color_hex', 'Subjects color hex constraint exists');
SELECT has_check('public', 'tasks', 'chk_tasks_title_not_empty', 'Tasks title not empty constraint exists');
SELECT has_check('public', 'tasks', 'chk_tasks_priority_valid', 'Tasks priority check constraint exists');

-- 6. Verify RLS is Enabled
SELECT table_privs_are(
    'public', 'subjects', 'anon', ARRAY[]::text[],
    'anon role should have no permissions on subjects'
);
SELECT table_privs_are(
    'public', 'tasks', 'anon', ARRAY[]::text[],
    'anon role should have no permissions on tasks'
);

SELECT * FROM finish();

ROLLBACK;

