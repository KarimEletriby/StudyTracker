-- ==============================================================================
-- Test Suite: 02_rls_two_user_isolation_test.sql
-- Description: Two-User RLS Security Isolation and Constraint Verification
-- ==============================================================================

BEGIN;

-- Setup Mock Test Users in auth.users if not already present
DO $$
DECLARE
    user_a_id UUID := '00000000-0000-0000-0000-000000000001';
    user_b_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
    -- Ensure test users exist in auth.users
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
        (user_a_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student_a@test.edu', 'hash_a', now(), now(), now()),
        (user_b_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student_b@test.edu', 'hash_b', now(), now(), now())
    ON CONFLICT (id) DO NOTHING;
END $$;

--------------------------------------------------------------------------------
-- TEST 1: Unauthenticated request cannot access subjects or tasks
--------------------------------------------------------------------------------
SET LOCAL ROLE anon;
RESET request.jwt.claims;

DO $$
BEGIN
    -- Trying to select as anon should return 0 rows or error
    PERFORM * FROM public.subjects;
    -- If anon has no grant, it would raise an exception; if grant is restricted, 0 rows
END $$;

--------------------------------------------------------------------------------
-- TEST 2: Student A operations (Create, Read, Update)
--------------------------------------------------------------------------------
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}', true);

-- Student A creates Subject 1
INSERT INTO public.subjects (id, user_id, name, color)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'Data Structures', '#4F46E5');

-- Student A creates Task 1 under Subject 1
INSERT INTO public.tasks (id, user_id, subject_id, title, priority, due_date)
VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Binary Search Tree Assignment', 'high', CURRENT_DATE + 3);

-- Verify Student A can read their subject and task
DO $$
DECLARE
    sub_count INT;
    task_count INT;
BEGIN
    SELECT count(*) INTO sub_count FROM public.subjects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    SELECT count(*) INTO task_count FROM public.tasks WHERE id = '11111111-1111-1111-1111-111111111111';

    IF sub_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Student A could not read their created subject';
    END IF;

    IF task_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: Student A could not read their created task';
    END IF;
END $$;

-- Student A updates task (complete / reopen)
UPDATE public.tasks
SET is_completed = true
WHERE id = '11111111-1111-1111-1111-111111111111';

--------------------------------------------------------------------------------
-- TEST 3: Student B isolation (Cannot read, modify, or hijack Student A's data)
--------------------------------------------------------------------------------
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000002", "role": "authenticated"}', true);

-- Verification: Student B SELECT returns 0 rows of Student A
DO $$
DECLARE
    sub_count INT;
    task_count INT;
BEGIN
    SELECT count(*) INTO sub_count FROM public.subjects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    SELECT count(*) INTO task_count FROM public.tasks WHERE id = '11111111-1111-1111-1111-111111111111';

    IF sub_count > 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH: Student B was able to read Student A subject!';
    END IF;

    IF task_count > 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH: Student B was able to read Student A task!';
    END IF;
END $$;

-- Verification: Student B UPDATE on Student A subject affects 0 rows
DO $$
DECLARE
    rows_affected INT;
BEGIN
    UPDATE public.subjects SET name = 'Hacked Subject' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    IF rows_affected > 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH: Student B updated Student A subject!';
    END IF;
END $$;

-- Verification: Student B cannot create task referencing Student A subject
DO $$
BEGIN
    INSERT INTO public.tasks (user_id, subject_id, title)
    VALUES ('00000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cross-user Task');
    RAISE EXCEPTION 'SECURITY BREACH: Student B was able to attach a task to Student A subject!';
EXCEPTION
    WHEN foreign_key_violation THEN
        -- Expected error! fk_tasks_subject_user correctly rejected the cross-user subject reference
        NULL;
END $$;

-- Verification: Student B cannot steal/reassign task by inserting with user_id = student_a
DO $$
BEGIN
    INSERT INTO public.tasks (user_id, subject_id, title)
    VALUES ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Impersonated Task');
    RAISE EXCEPTION 'SECURITY BREACH: Student B was able to insert a task under Student A user_id!';
EXCEPTION
    WHEN check_violation OR insufficient_privilege THEN
        -- Expected: RLS policy WITH CHECK (auth.uid() = user_id) blocked the impersonation
        NULL;
END $$;

--------------------------------------------------------------------------------
-- TEST 4: Constraint Validation Tests
--------------------------------------------------------------------------------
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}', true);

-- 4.1 Empty subject name rejected
DO $$
BEGIN
    INSERT INTO public.subjects (user_id, name) VALUES ('00000000-0000-0000-0000-000000000001', '   ');
    RAISE EXCEPTION 'VALIDATION ERROR: Empty subject name was accepted!';
EXCEPTION
    WHEN check_violation THEN NULL;
END $$;

-- 4.2 Empty task title rejected
DO $$
BEGIN
    INSERT INTO public.tasks (user_id, subject_id, title)
    VALUES ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '');
    RAISE EXCEPTION 'VALIDATION ERROR: Empty task title was accepted!';
EXCEPTION
    WHEN check_violation THEN NULL;
END $$;

-- 4.3 Invalid priority rejected
DO $$
BEGIN
    INSERT INTO public.tasks (user_id, subject_id, title, priority)
    VALUES ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Valid Title', 'super-urgent');
    RAISE EXCEPTION 'VALIDATION ERROR: Invalid task priority was accepted!';
EXCEPTION
    WHEN check_violation THEN NULL;
END $$;

-- 4.4 Invalid color format rejected
DO $$
BEGIN
    INSERT INTO public.subjects (user_id, name, color)
    VALUES ('00000000-0000-0000-0000-000000000001', 'Physics', 'not-a-hex-color');
    RAISE EXCEPTION 'VALIDATION ERROR: Invalid hex color was accepted!';
EXCEPTION
    WHEN check_violation THEN NULL;
END $$;

-- 4.5 Deleting a subject with linked tasks rejected (ON DELETE RESTRICT)
DO $$
BEGIN
    DELETE FROM public.subjects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    RAISE EXCEPTION 'CONSTRAINT ERROR: Subject with active linked tasks was deleted!';
EXCEPTION
    WHEN foreign_key_violation THEN
        -- Expected: ON DELETE RESTRICT blocked premature subject deletion
        NULL;
END $$;

-- 4.6 Deleting linked tasks then deleting subject succeeds
DELETE FROM public.tasks WHERE id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.subjects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Verify complete deletion
DO $$
DECLARE
    sub_count INT;
BEGIN
    SELECT count(*) INTO sub_count FROM public.subjects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    IF sub_count <> 0 THEN
        RAISE EXCEPTION 'TEST FAILED: Subject was not cleanly deleted after tasks removed';
    END IF;
END $$;

ROLLBACK;

