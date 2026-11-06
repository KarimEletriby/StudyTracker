# Study Planner — Backend Handoff & Supabase Integration Guide

This document specifies the backend architecture, schema, security policies, API contracts, and integration instructions for the **Study Planner** application.

---

## 1. System Architecture

```text
+-------------------------------------------------------+
|                 Study Planner Frontend                |
|           (React 18 + Vite + TypeScript)              |
+-------------------------------------------------------+
                           |
                           | Supabase JS Client v2
                           v
+-------------------------------------------------------+
|             Supabase Platform / Gateway               |
|                                                       |
|   +---------------------+   +---------------------+   |
|   |    Supabase Auth    |   |     PostgREST       |   |
|   |  (GoTrue / JWTs)    |   |    (Data API)       |   |
|   +---------------------+   +---------------------+   |
+-------------------------------------------------------+
                           |
                           | PostgREST with RLS Context
                           v
+-------------------------------------------------------+
|             PostgreSQL 15 Database                    |
|                                                       |
|   auth.users (Managed Supabase User Identities)       |
|        |                                              |
|        | 1:N (ON DELETE CASCADE)                      |
|        v                                              |
|   public.subjects                                     |
|        |                                              |
|        | 1:N (ON DELETE RESTRICT, Composite FK)       |
|        v                                              |
|   public.tasks                                        |
+-------------------------------------------------------+
```

### Core Security & Data Principles
1. **Managed User Identities**: User identities, credentials, email confirmations, and JWT tokens are handled strictly by Supabase Auth (`auth.users`). Passwords are never stored in public application tables.
2. **Row-Level Security (RLS)**: Enforced directly on `public.subjects` and `public.tasks` via `FORCE ROW LEVEL SECURITY`. Every database read, insert, update, or delete is constrained to rows where `user_id = auth.uid()`.
3. **Cross-Tenant Isolation at Database Level**: `public.tasks` incorporates a **composite foreign key** `(subject_id, user_id) REFERENCES public.subjects(id, user_id)`. This structurally prevents a student from attaching a task to another student's subject, even if an attacker attempts direct REST API calls with forged IDs.
4. **Deletion Protection**: Foreign key on `tasks.subject_id` is set to `ON DELETE RESTRICT`. Deleting a subject that still contains active tasks is automatically rejected by the database until the tasks are reassigned or deleted.

---

## 2. Database Schema

### Table: `public.subjects`

| Column | Type | Nullable | Default | Constraints & Details |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key |
| `user_id` | `UUID` | No | — | References `auth.users(id)` ON DELETE CASCADE |
| `name` | `TEXT` | No | — | `char_length(trim(name)) > 0`, `length <= 100` |
| `color` | `TEXT` | Yes | `NULL` | Hex color regex: `^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$` |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | Automatic timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | Automatic timestamp updated via trigger |

- **Unique Constraints**: `(id, user_id)` (supports composite foreign key).
- **Triggers**: `trg_subjects_updated_at` updates `updated_at = now()`.

---

### Table: `public.tasks`

| Column | Type | Nullable | Default | Constraints & Details |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key |
| `user_id` | `UUID` | No | — | References `auth.users(id)` ON DELETE CASCADE |
| `subject_id` | `UUID` | No | — | References `public.subjects(id)` ON DELETE RESTRICT |
| `title` | `TEXT` | No | — | `char_length(trim(title)) > 0`, `length <= 255` |
| `description`| `TEXT` | Yes | `NULL` | Optional assignment notes / rubric |
| `due_date` | `DATE` | Yes | `NULL` | Scheduled deadline |
| `priority` | `TEXT` | No | `'medium'` | Check: `priority IN ('low', 'medium', 'high')` |
| `is_completed`| `BOOLEAN` | No | `false` | Completion status flag |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | Automatic timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | Automatic timestamp updated via trigger |

- **Foreign Keys**:
  - `fk_tasks_subject_id`: `(subject_id) REFERENCES public.subjects(id) ON DELETE RESTRICT`
  - `fk_tasks_subject_user`: `(subject_id, user_id) REFERENCES public.subjects(id, user_id) ON DELETE RESTRICT`
- **Triggers**: `trg_tasks_updated_at` updates `updated_at = now()`.

---

### Analytical View: `public.student_dashboard_stats`

Security-invoker view aggregating real-time metrics for the authenticated caller:
- `total_subjects`: Count of courses owned by user.
- `total_tasks`: Total assignments logged by user.
- `pending_tasks`: Tasks where `is_completed = false`.
- `completed_tasks`: Tasks where `is_completed = true`.
- `high_priority_tasks`: Pending tasks with `priority = 'high'`.
- `due_soon_tasks`: Pending tasks due within the next 3 days (`due_date <= CURRENT_DATE + 3`).

---

## 3. Row-Level Security (RLS) Policies

All policies check against `auth.uid()`:

```sql
-- Subjects Policies
CREATE POLICY "subjects_select_owner" ON public.subjects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "subjects_insert_owner" ON public.subjects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subjects_update_owner" ON public.subjects FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subjects_delete_owner" ON public.subjects FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "tasks_select_owner" ON public.tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert_owner" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_owner" ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_delete_owner" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

---

## 4. API Contract (Supabase Data API)

During frontend integration, instantiate the Supabase client:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 4.1 Authentication Operations

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'student@university.edu',
  password: 'SecurePassword123!',
  options: {
    data: {
      full_name: 'Alex Morgan',
    },
    emailRedirectTo: `${window.location.origin}/login`,
  },
});
```
- **Inputs**: `email` (string), `password` (min 8 chars), `full_name` (user metadata).
- **Expected Result**: User created in `auth.users`. If email confirmation is enabled, session is null until confirmed.
- **Common Errors**: `User already registered` (400), `Password should be at least 6 characters` (422).

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'student@university.edu',
  password: 'SecurePassword123!',
});
```
- **Inputs**: `email`, `password`.
- **Expected Result**: Active JWT session and user profile returned; session persisted automatically by client.
- **Common Errors**: `Invalid login credentials` (400), `Email not confirmed` (400).

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```
- **Expected Result**: Session destroyed, local tokens cleared, redirects to `/login`.

#### Get Current User / Session
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

### 4.2 Subjects Operations

#### 1. List Subjects
```typescript
const { data: subjects, error } = await supabase
  .from('subjects')
  .select('id, name, color, created_at, updated_at')
  .order('name', { ascending: true });
```
- **Auth**: Required.
- **Expected Result**: Array of subjects owned by authenticated user.

#### 2. Create Subject
```typescript
const { data: newSubject, error } = await supabase
  .from('subjects')
  .insert({
    user_id: user.id,
    name: 'Data Structures & Algorithms',
    color: '#4F46E5',
  })
  .select()
  .single();
```
- **Auth**: Required.
- **Common Errors**:
  - `chk_subjects_name_not_empty` (23514) if name is whitespace.
  - `chk_subjects_color_hex` (23514) if color is not valid `#RRGGBB` or `#RGB`.

#### 3. Update Subject
```typescript
const { data, error } = await supabase
  .from('subjects')
  .update({ name: 'Advanced Algorithms', color: '#10B981' })
  .eq('id', subjectId)
  .select()
  .single();
```

#### 4. Delete Subject
```typescript
const { error } = await supabase
  .from('subjects')
  .delete()
  .eq('id', subjectId);
```
- **Common Errors**:
  - `23503 foreign_key_violation`: Deletion rejected because active tasks reference this subject. Frontend should notify student: *"Cannot delete course with active tasks. Please reassign or delete tasks first."*

---

### 4.3 Tasks Operations

#### 1. List Tasks (with Filters & Sorting)
```typescript
let query = supabase
  .from('tasks')
  .select(`
    id,
    title,
    description,
    due_date,
    priority,
    is_completed,
    created_at,
    subject:subjects (id, name, color)
  `);

if (statusFilter === 'todo') query = query.eq('is_completed', false);
if (statusFilter === 'completed') query = query.eq('is_completed', true);
if (subjectIdFilter) query = query.eq('subject_id', subjectIdFilter);

const { data: tasks, error } = await query.order('due_date', { ascending: true });
```

#### 2. Create Task
```typescript
const { data: newTask, error } = await supabase
  .from('tasks')
  .insert({
    user_id: user.id,
    subject_id: subjectId,
    title: 'Implement Red-Black Tree',
    description: 'Ensure double-red violation recovery',
    due_date: '2026-11-15',
    priority: 'high',
  })
  .select()
  .single();
```
- **Common Errors**:
  - `fk_tasks_subject_user`: Attempted to assign task to a subject owned by another user.
  - `chk_tasks_priority_valid`: Priority must be `low`, `medium`, or `high`.

#### 3. Complete / Reopen Task
```typescript
const { data, error } = await supabase
  .from('tasks')
  .update({ is_completed: true })
  .eq('id', taskId)
  .select()
  .single();
```

#### 4. Delete Task
```typescript
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId);
```

---

### 4.4 Dashboard Metrics Operation

To populate the student dashboard summary:
```typescript
// 1. Fetch real-time metrics
const { data: stats, error: statsError } = await supabase
  .from('student_dashboard_stats')
  .select('*')
  .single();

// 2. Fetch nearest 4 upcoming deadlines
const { data: upcoming, error: upcomingError } = await supabase
  .from('tasks')
  .select('id, title, due_date, priority, subject:subjects(id, name, color)')
  .eq('is_completed', false)
  .gte('due_date', new Date().toISOString().split('T')[0])
  .order('due_date', { ascending: true })
  .limit(4);
```

---

## 5. Environment Configuration

Create a `.env.local` file for local development:

```env
# Required for Supabase Data API & Auth
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Security Warning**: Only the public publishable/anon key should ever be placed in `.env.local`. Never commit `service_role` secret keys.

---

## 6. Frontend Integration Checklist (For Phase 9)

When integrating the frontend in the subsequent phase:
1. Initialize `@supabase/supabase-js` client in `src/lib/supabase.ts`.
2. Wrap authentication state listener in an `AuthProvider` via `supabase.auth.onAuthStateChange`.
3. In `src/pages/LoginPage.tsx`: replace simulated timeout with `supabase.auth.signInWithPassword()`.
4. In `src/pages/SignUpPage.tsx`: replace simulated timeout with `supabase.auth.signUp()`.
5. In `src/context/StudyContext.tsx`: replace `localStorage` mutations with Supabase Data API queries (`select`, `insert`, `update`, `delete`).
6. Handle UI loading and error states using returned PostgREST error messages.

